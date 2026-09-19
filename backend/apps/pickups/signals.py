import uuid

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Pickup, WastePassport


def generate_passport_id():
    suffix = uuid.uuid4().hex[:6].upper()
    return f'PASS-{suffix}'


@receiver(post_save, sender=Pickup)
def create_passport_on_collected(sender, instance, **kwargs):
    if instance.status in ('COLLECTED', 'PROCESSING', 'COMPLETED'):
        WastePassport.objects.get_or_create(
            pickup=instance,
            defaults={
                'passport_id': generate_passport_id(),
                'origin': 'RESIDENTIAL',
                'input_weight_kg': instance.actual_weight_kg or 0.0,
                'processing_status': 'IN_PROGRESS' if instance.status == 'PROCESSING' else 'PENDING',
            },
        )