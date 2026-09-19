from django.apps import AppConfig


class DetectionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.detection'
    label = 'detection'

    def ready(self):
        from . import signals as detection_signals
        detection_signals.connect_pickup_signals()
