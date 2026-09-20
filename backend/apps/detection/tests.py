import io
from PIL import Image
from django.test import TransactionTestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status

from apps.accounts.models import User
from apps.pickups.models import WasteReport, Pickup
from apps.detection.models import (
    AITrainingSample,
    ModelVersion,
    AITrainingJob,
    TrainingSampleStatus,
    TrainingSampleSource,
    TrainingJobStatus,
    WasteImage,
)
from apps.detection.training_engine import RetrainingWorker, ingest_training_sample


def create_dummy_image():
    """Generates an in-memory 100x100 RGB JPEG image for upload tests."""
    file = io.BytesIO()
    image = Image.new('RGB', (100, 100), color=(73, 109, 137))
    image.save(file, 'jpeg')
    file.seek(0)
    return SimpleUploadedFile("test_waste.jpg", file.read(), content_type="image/jpeg")


class AITrainingPipelineTestCase(TransactionTestCase):
    def setUp(self):
        self.client = APIClient()
        self.citizen = User.objects.create_user(
            username="test_citizen",
            email="citizen@test.com",
            password="testpassword123",
            role="CITIZEN",
        )
        self.collector = User.objects.create_user(
            username="test_collector",
            email="collector@test.com",
            password="testpassword123",
            role="COLLECTOR",
        )
        self.admin_user = User.objects.create_user(
            username="test_admin",
            email="admin@test.com",
            password="testpassword123",
            role="SUPER_ADMIN",
        )

        # Baseline model version
        self.baseline_model = ModelVersion.objects.create(
            version_tag="v2.4.0-test",
            architecture="YOLOv8-Test",
            is_active=True,
            accuracy=92.5,
            mAP_50=0.910,
            f1_score=0.915,
            total_samples_trained=100,
            trained_categories=["PLASTIC", "PAPER", "ORGANIC"],
        )

        # Sample data
        self.sample1 = AITrainingSample.objects.create(
            image_url="https://example.com/test1.jpg",
            contributor=self.citizen,
            source=TrainingSampleSource.CITIZEN_REPORT,
            predicted_category="PLASTIC",
            confidence=0.94,
            status=TrainingSampleStatus.PENDING_REVIEW,
            source_reference_id="WR-TEST-01",
        )
        self.sample2 = AITrainingSample.objects.create(
            image_url="https://example.com/test2.jpg",
            contributor=self.collector,
            source=TrainingSampleSource.COLLECTOR_PROOF,
            predicted_category="ORGANIC",
            verified_category="ORGANIC",
            confidence=0.91,
            status=TrainingSampleStatus.VERIFIED,
            source_reference_id="PK-TEST-02",
        )

    # -------------------------------------------------------------
    # 1. Signal-Driven Auto-Ingestion Tests
    # -------------------------------------------------------------
    def test_waste_report_image_auto_ingestion(self):
        """Verify that when a citizen uploads a waste report image, it is auto-captured into AITrainingSample."""
        test_img = create_dummy_image()
        report = WasteReport.objects.create(
            report_id="WC-TEST-AUTO-01",
            user=self.citizen,
            image=test_img,
            waste_type="PLASTIC",
            description="Discarded plastic bottles in park",
        )

        sample = AITrainingSample.objects.filter(source_reference_id=report.report_id).first()
        self.assertIsNotNone(sample)
        self.assertEqual(sample.contributor, self.citizen)
        self.assertEqual(sample.source, TrainingSampleSource.CITIZEN_REPORT)
        self.assertEqual(sample.predicted_category, "PLASTIC")
        self.assertEqual(sample.status, TrainingSampleStatus.PENDING_REVIEW)
        self.assertGreaterEqual(sample.confidence, 0.8)

    def test_pickup_image_auto_ingestion(self):
        """Verify that collector verification images are automatically ingested."""
        before_img = create_dummy_image()
        pickup = Pickup.objects.create(
            pickup_id="PK-TEST-AUTO-02",
            user=self.citizen,
            collector=self.collector,
            waste_type="METAL",
            before_image=before_img,
        )

        sample_before = AITrainingSample.objects.filter(source_reference_id="PK-TEST-AUTO-02-BEFORE").first()
        self.assertIsNotNone(sample_before)
        self.assertEqual(sample_before.source, TrainingSampleSource.COLLECTOR_PROOF)
        self.assertEqual(sample_before.predicted_category, "METAL")
        self.assertEqual(sample_before.contributor, self.collector)

    def test_waste_image_inspection_auto_ingestion(self):
        """Verify that camera/inspection uploads are captured with bounding boxes."""
        scan_img = create_dummy_image()
        waste_img = WasteImage.objects.create(
            image=scan_img,
            source="INSPECTION_OVERLAY",
            detected_material="PAPER",
            detection_confidence=0.95,
            raw_model_output={"detections": [{"label": "paper_carton", "box_2d": [0.1, 0.1, 0.9, 0.9], "confidence": 0.95}]},
        )

        ref_id = f"WIMG-{str(waste_img.id)[:8]}"
        sample = AITrainingSample.objects.filter(source_reference_id=ref_id).first()
        self.assertIsNotNone(sample)
        self.assertEqual(sample.source, TrainingSampleSource.INSPECTION_SCAN)
        self.assertEqual(sample.predicted_category, "PAPER")
        self.assertEqual(len(sample.bounding_boxes), 1)
        self.assertEqual(sample.bounding_boxes[0]["label"], "paper_carton")

    # -------------------------------------------------------------
    # 2. AI Training Dashboard & API Endpoints Tests
    # -------------------------------------------------------------
    def test_training_dashboard_summary(self):
        """Test GET /api/v1/detection/training/dashboard/ returns complete metrics."""
        response = self.client.get("/api/v1/detection/training/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data

        self.assertIn("metrics", data)
        self.assertIn("category_distribution", data)
        self.assertIn("source_distribution", data)
        self.assertIn("active_model", data)

        self.assertGreaterEqual(data["metrics"]["total_samples"], 2)
        self.assertEqual(data["active_model"]["version_tag"], "v2.4.0-test")

    def test_training_samples_list_and_filters(self):
        """Test GET /api/v1/detection/training/samples/ with filtering."""
        response = self.client.get("/api/v1/detection/training/samples/?status=PENDING_REVIEW")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data["results"]
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], str(self.sample1.id))

        response_cat = self.client.get("/api/v1/detection/training/samples/?category=ORGANIC")
        self.assertEqual(response_cat.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_cat.data["results"]), 1)
        self.assertEqual(response_cat.data["results"][0]["id"], str(self.sample2.id))

    def test_training_sample_update_approve_and_relabel(self):
        """Test PATCH /api/v1/detection/training/samples/<id>/ approving and relabeling."""
        # 1. Approve sample1
        res_approve = self.client.patch(
            f"/api/v1/detection/training/samples/{self.sample1.id}/",
            {"action": "APPROVE"},
            format="json",
        )
        self.assertEqual(res_approve.status_code, status.HTTP_200_OK)
        self.sample1.refresh_from_db()
        self.assertEqual(self.sample1.status, TrainingSampleStatus.VERIFIED)
        self.assertEqual(self.sample1.verified_category, "PLASTIC")

        # 2. Relabel sample2 to E_WASTE
        res_relabel = self.client.patch(
            f"/api/v1/detection/training/samples/{self.sample2.id}/",
            {"action": "RELABEL", "category": "E_WASTE"},
            format="json",
        )
        self.assertEqual(res_relabel.status_code, status.HTTP_200_OK)
        self.sample2.refresh_from_db()
        self.assertEqual(self.sample2.verified_category, "E_WASTE")
        self.assertEqual(self.sample2.status, TrainingSampleStatus.VERIFIED)

    def test_batch_approve_all_pending_samples(self):
        """Test POST /api/v1/detection/training/samples/batch/ verifying all pending samples."""
        self.assertEqual(self.sample1.status, TrainingSampleStatus.PENDING_REVIEW)

        res = self.client.post(
            "/api/v1/detection/training/samples/batch/",
            {"action": "APPROVE_ALL_PENDING"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("Successfully verified", res.data["message"])

        self.sample1.refresh_from_db()
        self.assertEqual(self.sample1.status, TrainingSampleStatus.VERIFIED)

    def test_training_sample_direct_upload(self):
        """Test POST /api/v1/detection/training/samples/upload/ handles direct image contribution."""
        upload_img = create_dummy_image()
        self.client.force_authenticate(user=self.citizen)

        res = self.client.post(
            "/api/v1/detection/training/samples/upload/",
            {"image": upload_img, "category": "PAPER", "notes": "Test paper upload"},
            format="multipart",
        )
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["predicted_category"], "PAPER")
        self.assertEqual(res.data["contributor_name"], self.citizen.username)

    def test_model_version_activation(self):
        """Test POST /api/v1/detection/training/models/<id>/activate/ switches production model."""
        new_model = ModelVersion.objects.create(
            version_tag="v2.5.0-new",
            architecture="YOLOv8-Large",
            is_active=False,
            accuracy=94.5,
            mAP_50=0.932,
        )

        res = self.client.post(f"/api/v1/detection/training/models/{new_model.id}/activate/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        new_model.refresh_from_db()
        self.baseline_model.refresh_from_db()

        self.assertTrue(new_model.is_active)
        self.assertFalse(self.baseline_model.is_active)

    # -------------------------------------------------------------
    # 3. Training Engine Worker Execution Test
    # -------------------------------------------------------------
    def test_retraining_worker_execution(self):
        """Test RetrainingWorker background process execution and model generation."""
        job = AITrainingJob.objects.create(
            job_id="TRN-TEST-SYNC",
            status=TrainingJobStatus.QUEUED,
            total_epochs=2,
            batch_size=8,
            learning_rate=0.001,
            triggered_by=self.admin_user,
        )

        worker = RetrainingWorker(job_id=job.job_id, total_epochs=2)
        worker.execute_training()

        job.refresh_from_db()
        self.assertEqual(job.status, TrainingJobStatus.COMPLETED)
        self.assertEqual(job.current_epoch, 2)
        self.assertEqual(job.progress_percent, 100.0)
        self.assertIsNotNone(job.model_version)
        self.assertTrue(job.model_version.is_active)
        self.assertGreater(len(job.logs), 5)
        self.assertGreater(len(job.metrics_history), 0)

        # Check that verified samples were marked as TRAINED
        self.sample2.refresh_from_db()
        self.assertEqual(self.sample2.status, TrainingSampleStatus.TRAINED)

    # -------------------------------------------------------------
    # 4. Optical Classifier & Vision Pipeline Tests
    # -------------------------------------------------------------
    def test_optical_classifier_detection(self):
        """Test that optical classifier returns material, composition, and objects."""
        from apps.detection.ml.optical_classifier import analyze_image_optical
        
        # Test synthetic image
        img_file = create_dummy_image()
        result = analyze_image_optical(img_file)

        self.assertIn("material", result)
        self.assertIn("confidence", result)
        self.assertIn("materials", result)
        self.assertIn("severity", result)
        self.assertIn("recommended_action", result)
        self.assertIn("objects", result)
        self.assertGreater(len(result["materials"]), 0)
        self.assertEqual(sum(m["percentage"] for m in result["materials"]), 100)

    def test_process_waste_image_pipeline_response(self):
        """Test that /api/v1/pipeline/process/ returns full vision metrics."""
        img_file = create_dummy_image()
        response = self.client.post(
            "/api/v1/pipeline/process/",
            {"image": img_file, "source": "UPLOAD"},
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertIn("material", data)
        self.assertIn("confidence", data)
        self.assertIn("materials", data)
        self.assertIn("severity", data)
        self.assertIn("estimated_quantity", data)
        self.assertIn("recommended_action", data)
        self.assertIn("objects", data)
        self.assertGreater(len(data["materials"]), 0)
