from django.apps import AppConfig

class PickupsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.pickups'
    verbose_name = 'Pickups'

    def ready(self):
        import apps.pickups.signals  # noqa: F401
