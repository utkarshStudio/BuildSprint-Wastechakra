import uuid
from django.db import models
from apps.detection.models import WasteImage
from apps.analysis.models import SimulatedReading


class WasteCategory(models.TextChoices):
    RECYCLE = "RECYCLE", "Recyclable"
    BIO = "BIO", "Biodegradable / Compost"
    RDF = "RDF", "Refuse Derived Fuel"
    REJECT = "REJECT", "Non-processable / Needs Manual Review"


class WasteRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ForeignKey(
        WasteImage,
        on_delete=models.CASCADE,
        related_name="records",
        null=True,
        blank=True,
    )
    simulated_reading = models.ForeignKey(
        SimulatedReading,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="records",
    )
    final_category = models.CharField(max_length=20, choices=WasteCategory.choices)
    decision_confidence = models.FloatField(default=0.0)
    decision_breakdown = models.JSONField(default=dict)
    processed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-processed_at"]
        indexes = [models.Index(fields=["final_category", "processed_at"])]

    def __str__(self):
        return f"Record {self.id} -> {self.final_category} ({self.processed_at.strftime('%Y-%m-%d %H:%M')})"
