from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics, parsers
from django.db.models import Count, Q

from .models import (
    AITrainingSample,
    TrainingSampleStatus,
    TrainingSampleSource,
    ModelVersion,
    AITrainingJob,
    TrainingJobStatus,
)
from .training_serializers import (
    AITrainingSampleSerializer,
    ModelVersionSerializer,
    AITrainingJobSerializer,
)
from .training_engine import trigger_training_job, ingest_training_sample


class TrainingDashboardSummaryView(APIView):
    """Aggregate statistics and health of the Vision AI Training Pipeline."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_samples = AITrainingSample.objects.count()
        verified_samples = AITrainingSample.objects.filter(status=TrainingSampleStatus.VERIFIED).count()
        pending_samples = AITrainingSample.objects.filter(status=TrainingSampleStatus.PENDING_REVIEW).count()
        trained_samples = AITrainingSample.objects.filter(status=TrainingSampleStatus.TRAINED).count()
        in_batch_samples = AITrainingSample.objects.filter(status=TrainingSampleStatus.IN_TRAINING_SET).count()

        # Category Breakdown
        categories = ["PLASTIC", "ORGANIC", "PAPER", "METAL", "TEXTILE", "E_WASTE", "RDF_COMBUSTIBLE", "MIXED"]
        cat_counts = {}
        for cat in categories:
            cat_counts[cat] = AITrainingSample.objects.filter(
                Q(verified_category=cat) | (Q(verified_category="") & Q(predicted_category=cat))
            ).count()

        # Source Breakdown
        source_counts = {
            "CITIZEN_REPORT": AITrainingSample.objects.filter(source=TrainingSampleSource.CITIZEN_REPORT).count(),
            "COLLECTOR_PROOF": AITrainingSample.objects.filter(source=TrainingSampleSource.COLLECTOR_PROOF).count(),
            "INSPECTION_SCAN": AITrainingSample.objects.filter(source=TrainingSampleSource.INSPECTION_SCAN).count(),
            "COMMUNITY_UPLOAD": AITrainingSample.objects.filter(source=TrainingSampleSource.COMMUNITY_UPLOAD).count(),
        }

        # Active Model
        active_model = ModelVersion.objects.filter(is_active=True).first()
        if not active_model:
            active_model = ModelVersion.objects.first()

        # Latest or running training job
        running_job = AITrainingJob.objects.filter(status__in=[TrainingJobStatus.RUNNING, TrainingJobStatus.VALIDATING, TrainingJobStatus.QUEUED]).first()
        latest_job = running_job or AITrainingJob.objects.first()

        return Response({
            "metrics": {
                "total_samples": total_samples,
                "verified_samples": verified_samples,
                "pending_samples": pending_samples,
                "trained_samples": trained_samples,
                "in_batch_samples": in_batch_samples,
                "ready_for_training": verified_samples + pending_samples,
            },
            "category_distribution": cat_counts,
            "source_distribution": source_counts,
            "active_model": ModelVersionSerializer(active_model).data if active_model else None,
            "latest_job": AITrainingJobSerializer(latest_job).data if latest_job else None,
            "is_training_active": bool(running_job),
        })


class TrainingSampleListView(generics.ListAPIView):
    """List crowdsourced training samples with filters."""
    permission_classes = [permissions.AllowAny]
    serializer_class = AITrainingSampleSerializer

    def get_queryset(self):
        qs = AITrainingSample.objects.all()
        status_filter = self.request.query_params.get("status")
        category_filter = self.request.query_params.get("category")
        source_filter = self.request.query_params.get("source")

        if status_filter:
            qs = qs.filter(status=status_filter)
        if category_filter:
            qs = qs.filter(
                Q(verified_category=category_filter) | (Q(verified_category="") & Q(predicted_category=category_filter))
            )
        if source_filter:
            qs = qs.filter(source=source_filter)
        return qs[:100]  # Cap at recent 100 for fast UI load


class TrainingSampleUpdateView(generics.UpdateAPIView):
    """Admin endpoint to approve, relabel, or reject an AI training sample."""
    permission_classes = [permissions.AllowAny]
    queryset = AITrainingSample.objects.all()
    serializer_class = AITrainingSampleSerializer
    lookup_field = "id"

    def patch(self, request, *args, **kwargs):
        sample = self.get_object()
        action = request.data.get("action")  # 'APPROVE', 'REJECT', 'RELABEL'

        if action == "APPROVE":
            sample.status = TrainingSampleStatus.VERIFIED
            if not sample.verified_category:
                sample.verified_category = sample.predicted_category
        elif action == "REJECT":
            sample.status = TrainingSampleStatus.REJECTED
        elif action == "RELABEL":
            new_cat = request.data.get("category")
            if new_cat:
                sample.verified_category = new_cat.upper()
                sample.status = TrainingSampleStatus.VERIFIED

        if "notes" in request.data:
            sample.notes = request.data["notes"]

        sample.save()
        return Response(AITrainingSampleSerializer(sample, context={"request": request}).data)


class TrainingSampleBatchActionView(APIView):
    """Admin endpoint to batch approve or verify all pending samples."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        action = request.data.get("action", "APPROVE_ALL_PENDING")
        if action == "APPROVE_ALL_PENDING":
            pending = AITrainingSample.objects.filter(status=TrainingSampleStatus.PENDING_REVIEW)
            count = pending.count()
            for s in pending:
                s.status = TrainingSampleStatus.VERIFIED
                if not s.verified_category:
                    s.verified_category = s.predicted_category
                s.save(update_fields=["status", "verified_category"])
            return Response({"message": f"Successfully verified {count} pending samples.", "count": count})
        return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)


class TrainingSampleDirectUploadView(APIView):
    """Direct upload endpoint for testing or admin manual sample contribution."""
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        if "image" not in request.FILES:
            return Response({"error": "Image file is required"}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES["image"]
        category = request.data.get("category", "PLASTIC")
        source = request.data.get("source", TrainingSampleSource.COMMUNITY_UPLOAD)
        user = request.user if request.user.is_authenticated else None

        sample = ingest_training_sample(
            image=image_file,
            contributor=user,
            source=source,
            category=category,
            confidence=0.92,
            notes=request.data.get("notes", "Direct manual upload via Training Studio"),
        )

        return Response(
            AITrainingSampleSerializer(sample, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class TriggerTrainingJobView(APIView):
    """Trigger background retraining of the Vision AI model."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Check if a training job is already actively running
        active_job = AITrainingJob.objects.filter(
            status__in=[TrainingJobStatus.RUNNING, TrainingJobStatus.VALIDATING]
        ).first()

        if active_job:
            return Response(
                {"error": "A training session is already in progress.", "job": AITrainingJobSerializer(active_job).data},
                status=status.HTTP_409_CONFLICT,
            )

        epochs = int(request.data.get("epochs", 20))
        batch_size = int(request.data.get("batch_size", 16))
        learning_rate = float(request.data.get("learning_rate", 0.001))

        # Clamp epochs to reasonable boundary for live interactive demo
        epochs = max(5, min(epochs, 50))

        user = request.user if request.user.is_authenticated else None
        job = trigger_training_job(
            triggered_by=user,
            total_epochs=epochs,
            batch_size=batch_size,
            learning_rate=learning_rate,
        )

        return Response(AITrainingJobSerializer(job).data, status=status.HTTP_201_CREATED)


class TrainingJobStatusView(APIView):
    """Retrieve progress and real-time logs for a specific job or latest job."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, job_id=None):
        if job_id:
            job = AITrainingJob.objects.filter(job_id=job_id).first()
        else:
            # Get latest or active job
            job = AITrainingJob.objects.filter(
                status__in=[TrainingJobStatus.RUNNING, TrainingJobStatus.VALIDATING, TrainingJobStatus.QUEUED]
            ).first() or AITrainingJob.objects.first()

        if not job:
            return Response({"message": "No training runs recorded yet."}, status=status.HTTP_404_NOT_FOUND)

        return Response(AITrainingJobSerializer(job).data)


class ModelVersionListView(generics.ListAPIView):
    """List all registered vision model versions."""
    permission_classes = [permissions.AllowAny]
    queryset = ModelVersion.objects.all()
    serializer_class = ModelVersionSerializer


class ActivateModelVersionView(APIView):
    """Set a specific model version as active in production."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, id):
        try:
            model = ModelVersion.objects.get(id=id)
        except ModelVersion.DoesNotExist:
            return Response({"error": "Model version not found"}, status=status.HTTP_404_NOT_FOUND)

        ModelVersion.objects.exclude(id=model.id).update(is_active=False)
        model.is_active = True
        model.save()

        return Response(ModelVersionSerializer(model).data)
