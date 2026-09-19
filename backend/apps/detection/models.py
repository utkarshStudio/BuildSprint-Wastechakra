import uuid
from django.db import models
from django.conf import settings


class MaterialType(models.TextChoices):
    PLASTIC = "PLASTIC", "Plastic"
    PAPER = "PAPER", "Paper / Cardboard"
    METAL = "METAL", "Metal"
    GLASS = "GLASS", "Glass"
    ORGANIC = "ORGANIC", "Organic / Food Waste"
    TEXTILE = "TEXTILE", "Textile / Cloth"
    E_WASTE = "E_WASTE", "Electronic Waste"
    MIXED = "MIXED", "Mixed / Unidentified"


class WasteImage(models.Model):
    """User-uploaded waste image (via file input or browser webcam snapshot).
    Fully software-based file upload — no physical edge camera involved."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to="waste_images/%Y/%m/%d/", null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    source = models.CharField(
        max_length=20,
        choices=[
            ("UPLOAD", "File Upload"),
            ("WEBCAM", "Browser Webcam Snapshot"),
            ("SIMULATED", "Manual Simulation, No Image"),
            ("INSPECTION_OVERLAY", "Plant Optical Inspection Scanner"),
        ],
        default="UPLOAD",
    )
    detected_material = models.CharField(
        max_length=20,
        choices=MaterialType.choices,
        default=MaterialType.MIXED,
    )
    detection_confidence = models.FloatField(default=0.0)
    raw_model_output = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.detected_material} ({self.detection_confidence * 100:.1f}%) - {self.id}"


class TrainingSampleSource(models.TextChoices):
    CITIZEN_REPORT = "CITIZEN_REPORT", "Citizen Waste Report"
    COLLECTOR_PROOF = "COLLECTOR_PROOF", "Collector Pickup Proof"
    INSPECTION_SCAN = "INSPECTION_SCAN", "Plant Optical Inspection"
    COMMUNITY_UPLOAD = "COMMUNITY_UPLOAD", "Community Direct Upload"
    ADMIN_IMPORT = "ADMIN_IMPORT", "Admin Dataset Import"


class TrainingSampleStatus(models.TextChoices):
    PENDING_REVIEW = "PENDING_REVIEW", "Pending Review"
    VERIFIED = "VERIFIED", "Verified for Training"
    REJECTED = "REJECTED", "Rejected / Blurry"
    IN_TRAINING_SET = "IN_TRAINING_SET", "Queued in Active Batch"
    TRAINED = "TRAINED", "Model Trained"


class AITrainingSample(models.Model):
    """Crowdsourced training sample captured from user activities."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to="training_dataset/%Y/%m/%d/", null=True, blank=True)
    image_url = models.CharField(max_length=500, blank=True, default="")
    contributor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contributed_samples",
    )
    source = models.CharField(
        max_length=30,
        choices=TrainingSampleSource.choices,
        default=TrainingSampleSource.CITIZEN_REPORT,
    )
    predicted_category = models.CharField(max_length=30, default="MIXED")
    verified_category = models.CharField(max_length=30, blank=True, default="")
    confidence = models.FloatField(default=0.85)
    bounding_boxes = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=30,
        choices=TrainingSampleStatus.choices,
        default=TrainingSampleStatus.PENDING_REVIEW,
    )
    quality_score = models.FloatField(default=0.92)
    eco_credits_awarded = models.IntegerField(default=5)
    source_reference_id = models.CharField(max_length=50, blank=True, default="")
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        category = self.verified_category or self.predicted_category
        return f"Sample {self.id.hex[:8]} - {category} ({self.status})"

    @property
    def effective_category(self):
        return self.verified_category if self.verified_category else self.predicted_category


class ModelVersion(models.Model):
    """Registered AI model checkpoints and metrics."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    version_tag = models.CharField(max_length=50, unique=True)
    architecture = models.CharField(max_length=120, default="YOLOv8-WasteChakra + Optical Spatial Clustering")
    is_active = models.BooleanField(default=False)
    accuracy = models.FloatField(default=92.5)  # e.g. 94.2%
    mAP_50 = models.FloatField(default=0.895)   # e.g. 0.912
    f1_score = models.FloatField(default=0.908)
    total_samples_trained = models.IntegerField(default=0)
    trained_categories = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        status = "[ACTIVE]" if self.is_active else ""
        return f"{self.version_tag} {status} (mAP: {self.mAP_50 * 100:.1f}%)"


class TrainingJobStatus(models.TextChoices):
    QUEUED = "QUEUED", "Queued"
    RUNNING = "RUNNING", "Training in Progress"
    VALIDATING = "VALIDATING", "Validating Checkpoints"
    COMPLETED = "COMPLETED", "Completed & Evaluated"
    FAILED = "FAILED", "Failed"
    CANCELLED = "CANCELLED", "Cancelled"


class AITrainingJob(models.Model):
    """Tracks asynchronous retraining sessions and epoch progress."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    job_id = models.CharField(max_length=50, unique=True)
    model_version = models.ForeignKey(
        ModelVersion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="training_jobs",
    )
    status = models.CharField(
        max_length=20,
        choices=TrainingJobStatus.choices,
        default=TrainingJobStatus.QUEUED,
    )
    total_epochs = models.IntegerField(default=20)
    current_epoch = models.IntegerField(default=0)
    progress_percent = models.FloatField(default=0.0)
    samples_count = models.IntegerField(default=0)
    batch_size = models.IntegerField(default=16)
    learning_rate = models.FloatField(default=0.001)
    current_loss = models.FloatField(default=0.0)
    val_loss = models.FloatField(default=0.0)
    val_mAP = models.FloatField(default=0.0)
    metrics_history = models.JSONField(default=list, blank=True)
    logs = models.JSONField(default=list, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    triggered_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="triggered_training_jobs",
    )

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.job_id} - {self.status} ({self.progress_percent:.0f}%)"
