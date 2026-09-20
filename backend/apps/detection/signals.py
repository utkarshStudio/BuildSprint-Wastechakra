from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import WasteImage, TrainingSampleSource, AITrainingSample
from .training_engine import ingest_training_sample


@receiver(post_save, sender=WasteImage)
def ingest_waste_image_sample(sender, instance, created, **kwargs):
    """Automatically logs plant optical inspections / waste uploads to the training pool."""
    if not instance.image:
        return

    ref_id = f"WIMG-{str(instance.id)[:8]}"
    if AITrainingSample.objects.filter(source_reference_id=ref_id).exists():
        return

    # Extract detected material and bounding boxes if stored in raw_model_output
    boxes = []
    if isinstance(instance.raw_model_output, dict):
        detections = instance.raw_model_output.get("detections") or []
        for det in detections:
            if isinstance(det, dict) and "box_2d" in det:
                boxes.append({
                    "label": det.get("label", instance.detected_material),
                    "box_2d": det.get("box_2d", [0.2, 0.2, 0.8, 0.8]),
                    "confidence": det.get("confidence", instance.detection_confidence),
                })

    ingest_training_sample(
        image=instance.image,
        source=TrainingSampleSource.INSPECTION_SCAN,
        category=instance.detected_material,
        confidence=instance.detection_confidence or 0.88,
        bounding_boxes=boxes if boxes else None,
        source_reference_id=ref_id,
        notes=f"Captured via {instance.source}",
    )


def connect_pickup_signals():
    """Connect signals from apps.pickups models dynamically to avoid circular imports."""
    try:
        from apps.pickups.models import WasteReport, Pickup

        @receiver(post_save, sender=WasteReport)
        def ingest_waste_report_sample(sender, instance, created, **kwargs):
            if not instance.image:
                return
            ref_id = instance.report_id or f"WR-{str(instance.id)[:8]}"
            if AITrainingSample.objects.filter(source_reference_id=ref_id).exists():
                return

            ingest_training_sample(
                image=instance.image,
                contributor=instance.user,
                source=TrainingSampleSource.CITIZEN_REPORT,
                category=instance.waste_type,
                confidence=0.86,
                source_reference_id=ref_id,
                notes=f"Citizen report: {instance.description or instance.address}",
            )

        @receiver(post_save, sender=Pickup)
        def ingest_pickup_proof_sample(sender, instance, created, **kwargs):
            ref_base = instance.pickup_id or f"PK-{str(instance.id)[:8]}"
            
            if instance.before_image:
                ref_before = f"{ref_base}-BEFORE"
                if not AITrainingSample.objects.filter(source_reference_id=ref_before).exists():
                    ingest_training_sample(
                        image=instance.before_image,
                        contributor=instance.collector or instance.user,
                        source=TrainingSampleSource.COLLECTOR_PROOF,
                        category=instance.waste_type,
                        confidence=0.89,
                        source_reference_id=ref_before,
                        notes=f"Collector proof before pickup {instance.pickup_id}",
                    )

            if instance.after_image:
                ref_after = f"{ref_base}-AFTER"
                if not AITrainingSample.objects.filter(source_reference_id=ref_after).exists():
                    ingest_training_sample(
                        image=instance.after_image,
                        contributor=instance.collector or instance.user,
                        source=TrainingSampleSource.COLLECTOR_PROOF,
                        category=instance.waste_type,
                        confidence=0.91,
                        source_reference_id=ref_after,
                        notes=f"Collector proof after pickup {instance.pickup_id}",
                    )

    except (ImportError, RuntimeError):
        pass
