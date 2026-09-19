import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
from apps.detection.models import (
    AITrainingSample,
    ModelVersion,
    AITrainingJob,
    TrainingSampleStatus,
    TrainingSampleSource,
    TrainingJobStatus,
)

def seed_training_data():
    citizen = User.objects.filter(role="CITIZEN").first()
    collector = User.objects.filter(role="COLLECTOR").first()
    admin_user = User.objects.filter(role__in=["ADMIN", "SUPER_ADMIN"]).first()

    # 1. Seed Model Versions
    ModelVersion.objects.all().delete()

    v1 = ModelVersion.objects.create(
        version_tag="v2.3.0-baseline-coco",
        architecture="YOLOv8-Small Baseline",
        is_active=False,
        accuracy=88.4,
        mAP_50=0.864,
        f1_score=0.872,
        total_samples_trained=120,
        trained_categories=["PLASTIC", "PAPER", "METAL", "ORGANIC"],
        notes="Pretrained COCO baseline fine-tuned on initial synthetic MRF dataset.",
    )

    v2 = ModelVersion.objects.create(
        version_tag="v2.4.0-edge-yolo-wastechakra",
        architecture="YOLOv8-WasteChakra + Multi-Head Spatial Clustering",
        is_active=True,
        accuracy=93.6,
        mAP_50=0.918,
        f1_score=0.924,
        total_samples_trained=264,
        trained_categories=["PLASTIC", "ORGANIC", "PAPER", "METAL", "TEXTILE", "E_WASTE", "RDF_COMBUSTIBLE"],
        notes="Active production model with active-learning feedback from Bangalore residential sector.",
    )

    print(f"Created model versions: {v1.version_tag}, {v2.version_tag} [ACTIVE]")

    # 2. Seed Crowdsourced Samples
    AITrainingSample.objects.all().delete()

    SAMPLE_DATA = [
        {
            "image_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80",
            "source": TrainingSampleSource.CITIZEN_REPORT,
            "category": "PLASTIC",
            "confidence": 0.94,
            "quality_score": 0.95,
            "status": TrainingSampleStatus.VERIFIED,
            "source_ref": "WR-2026-P01",
            "user": citizen,
            "boxes": [
                {"label": "plastic_bottle", "box_2d": [0.22, 0.28, 0.78, 0.72], "confidence": 0.96},
                {"label": "polyethylene_cap", "box_2d": [0.18, 0.42, 0.28, 0.58], "confidence": 0.91},
            ],
            "notes": "Citizen report of discarded PET water bottles in Eco District park.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&q=80",
            "source": TrainingSampleSource.COLLECTOR_PROOF,
            "category": "PAPER",
            "confidence": 0.91,
            "quality_score": 0.92,
            "status": TrainingSampleStatus.VERIFIED,
            "source_ref": "WC-2026-000283-BEFORE",
            "user": collector,
            "boxes": [
                {"label": "cardboard_box", "box_2d": [0.15, 0.18, 0.85, 0.82], "confidence": 0.94},
            ],
            "notes": "Corrugated carton stack picked up from Tech Park society.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
            "source": TrainingSampleSource.CITIZEN_REPORT,
            "category": "ORGANIC",
            "confidence": 0.89,
            "quality_score": 0.89,
            "status": TrainingSampleStatus.PENDING_REVIEW,
            "source_ref": "WR-2026-O02",
            "user": citizen,
            "boxes": [
                {"label": "food_waste_compostable", "box_2d": [0.24, 0.22, 0.76, 0.80], "confidence": 0.89},
            ],
            "notes": "Vegetable peels and compostable green waste awaiting morning pickup.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80",
            "source": TrainingSampleSource.INSPECTION_SCAN,
            "category": "METAL",
            "confidence": 0.96,
            "quality_score": 0.97,
            "status": TrainingSampleStatus.TRAINED,
            "source_ref": "WIMG-STATION-3",
            "user": None,
            "boxes": [
                {"label": "aluminum_can", "box_2d": [0.30, 0.32, 0.70, 0.68], "confidence": 0.98},
            ],
            "notes": "Optical conveyor eddy-current stream inspection of sorted beverage cans.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=800&q=80",
            "source": TrainingSampleSource.CITIZEN_REPORT,
            "category": "E_WASTE",
            "confidence": 0.93,
            "quality_score": 0.94,
            "status": TrainingSampleStatus.VERIFIED,
            "source_ref": "WR-2026-E04",
            "user": citizen,
            "boxes": [
                {"label": "printed_circuit_board", "box_2d": [0.18, 0.15, 0.82, 0.85], "confidence": 0.95},
            ],
            "notes": "Motherboard & battery unit from residential e-waste drive.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80",
            "source": TrainingSampleSource.COLLECTOR_PROOF,
            "category": "PLASTIC",
            "confidence": 0.88,
            "quality_score": 0.87,
            "status": TrainingSampleStatus.PENDING_REVIEW,
            "source_ref": "WC-2026-000284-AFTER",
            "user": collector,
            "boxes": [
                {"label": "plastic_packaging", "box_2d": [0.25, 0.20, 0.80, 0.75], "confidence": 0.88},
            ],
            "notes": "Multi-layer plastic wrappers bagged by residential collector.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=800&q=80",
            "source": TrainingSampleSource.COMMUNITY_UPLOAD,
            "category": "TEXTILE",
            "confidence": 0.86,
            "quality_score": 0.91,
            "status": TrainingSampleStatus.PENDING_REVIEW,
            "source_ref": "COMM-TX-08",
            "user": citizen,
            "boxes": [
                {"label": "cotton_denim_waste", "box_2d": [0.18, 0.22, 0.84, 0.80], "confidence": 0.87},
            ],
            "notes": "Old garments and discarded fabric swatches from clothing drive.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&q=80",
            "source": TrainingSampleSource.INSPECTION_SCAN,
            "category": "RDF_COMBUSTIBLE",
            "confidence": 0.92,
            "quality_score": 0.93,
            "status": TrainingSampleStatus.TRAINED,
            "source_ref": "WIMG-STATION-8",
            "user": None,
            "boxes": [
                {"label": "combustible_residue", "box_2d": [0.20, 0.20, 0.80, 0.80], "confidence": 0.92},
            ],
            "notes": "Shredded dry high-calorific rejects channeled to cement kiln RDF line.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1591193686104-fddba4d0e4d8?w=800&q=80",
            "source": TrainingSampleSource.CITIZEN_REPORT,
            "category": "METAL",
            "confidence": 0.95,
            "quality_score": 0.94,
            "status": TrainingSampleStatus.PENDING_REVIEW,
            "source_ref": "WR-2026-M09",
            "user": citizen,
            "boxes": [
                {"label": "crushed_metal_cans", "box_2d": [0.22, 0.25, 0.78, 0.75], "confidence": 0.95},
            ],
            "notes": "Crushed tin and soda cans collected at community sports complex.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&q=80",
            "source": TrainingSampleSource.COLLECTOR_PROOF,
            "category": "PAPER",
            "confidence": 0.89,
            "quality_score": 0.90,
            "status": TrainingSampleStatus.VERIFIED,
            "source_ref": "WC-2026-000289-BEFORE",
            "user": collector,
            "boxes": [
                {"label": "newspaper_bundle", "box_2d": [0.15, 0.15, 0.85, 0.85], "confidence": 0.91},
            ],
            "notes": "Tied stacks of old newspapers and magazines from apartment block.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
            "source": TrainingSampleSource.CITIZEN_REPORT,
            "category": "ORGANIC",
            "confidence": 0.92,
            "quality_score": 0.93,
            "status": TrainingSampleStatus.VERIFIED,
            "source_ref": "WR-2026-O11",
            "user": citizen,
            "boxes": [
                {"label": "garden_organic_prunings", "box_2d": [0.20, 0.20, 0.80, 0.80], "confidence": 0.93},
            ],
            "notes": "Compostable garden prunings and dry leaves bagged for green pickup.",
        },
        {
            "image_url": "https://images.unsplash.com/photo-1526951521990-620dc14c214b?w=800&q=80",
            "source": TrainingSampleSource.COMMUNITY_UPLOAD,
            "category": "PLASTIC",
            "confidence": 0.91,
            "quality_score": 0.93,
            "status": TrainingSampleStatus.VERIFIED,
            "source_ref": "COMM-PL-12",
            "user": citizen,
            "boxes": [
                {"label": "hdpe_plastic_containers", "box_2d": [0.18, 0.22, 0.82, 0.78], "confidence": 0.92},
            ],
            "notes": "Clean detergent bottles and milk jugs contributed to community recycling drive.",
        },

    ]

    for data in SAMPLE_DATA:
        AITrainingSample.objects.create(
            image_url=data["image_url"],
            source=data["source"],
            predicted_category=data["category"],
            verified_category=data["category"] if data["status"] != TrainingSampleStatus.PENDING_REVIEW else "",
            confidence=data["confidence"],
            quality_score=data["quality_score"],
            status=data["status"],
            source_reference_id=data["source_ref"],
            contributor=data["user"],
            bounding_boxes=data["boxes"],
            notes=data["notes"],
            eco_credits_awarded=5 if data["user"] else 0,
        )

    print(f"Created {len(SAMPLE_DATA)} sample crowdsourced training records.")

    # 3. Seed Initial Training Job
    AITrainingJob.objects.all().delete()
    AITrainingJob.objects.create(
        job_id="TRN-2026-INIT",
        model_version=v2,
        status=TrainingJobStatus.COMPLETED,
        total_epochs=15,
        current_epoch=15,
        progress_percent=100.0,
        samples_count=len(SAMPLE_DATA),
        batch_size=16,
        learning_rate=0.001,
        current_loss=0.1420,
        val_loss=0.1680,
        val_mAP=0.918,
        metrics_history=[
            {"epoch": 1, "train_loss": 0.782, "val_loss": 0.810, "mAP_50": 0.824, "precision": 0.840, "recall": 0.812},
            {"epoch": 4, "train_loss": 0.521, "val_loss": 0.564, "mAP_50": 0.862, "precision": 0.879, "recall": 0.845},
            {"epoch": 8, "train_loss": 0.312, "val_loss": 0.358, "mAP_50": 0.889, "precision": 0.902, "recall": 0.871},
            {"epoch": 12, "train_loss": 0.201, "val_loss": 0.234, "mAP_50": 0.905, "precision": 0.923, "recall": 0.892},
            {"epoch": 15, "train_loss": 0.142, "val_loss": 0.168, "mAP_50": 0.918, "precision": 0.936, "recall": 0.908},
        ],
        logs=[
            "[10:14:02] [INIT] Initializing YOLOv8-WasteChakra training engine...",
            "[10:14:03] [DATASET] Loaded crowdsourced community training samples.",
            "[10:14:05] [EPOCH 01/15] loss: 0.7820 | val_loss: 0.8100 | mAP@50: 82.4% | P: 0.840 R: 0.812",
            "[10:14:09] [EPOCH 04/15] loss: 0.5210 | val_loss: 0.5640 | mAP@50: 86.2% | P: 0.879 R: 0.845",
            "[10:14:14] [EPOCH 08/15] loss: 0.3120 | val_loss: 0.3580 | mAP@50: 88.9% | P: 0.902 R: 0.871",
            "[10:14:20] [EPOCH 12/15] loss: 0.2010 | val_loss: 0.2340 | mAP@50: 90.5% | P: 0.923 R: 0.892",
            "[10:14:24] [EPOCH 15/15] loss: 0.1420 | val_loss: 0.1680 | mAP@50: 91.8% | P: 0.936 R: 0.908",
            "[10:14:26] [SUCCESS] Model weights exported -> v2.4.0-edge-yolo-wastechakra.pt (mAP: 91.8%)",
            "[10:14:26] [DEPLOY] Model is now active in production detection pipeline!",
        ],
        triggered_by=admin_user,
    )
    print("Created initial completed training job record.")

if __name__ == '__main__':
    seed_training_data()
