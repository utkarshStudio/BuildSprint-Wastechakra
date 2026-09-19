from django.db import models


class DecisionConfig(models.Model):
    """Singleton-style configuration for tunable decision thresholds."""
    recyclability_threshold = models.FloatField(default=0.65)
    contamination_threshold = models.FloatField(default=30.0)
    combustibility_threshold = models.FloatField(default=0.55)
    rdf_threshold = models.FloatField(default=0.5)
    moisture_bio_threshold = models.FloatField(default=55.0)
    low_confidence_threshold = models.FloatField(default=0.4)
    decision_mode = models.CharField(
        max_length=10,
        choices=[("rule", "Rule-based"), ("weighted", "Weighted"), ("hybrid", "Hybrid")],
        default="hybrid",
    )
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Keep as singleton (only 1 config row in DB)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_config(cls):
        config, _ = cls.objects.get_or_create(pk=1)
        return config

    def __str__(self):
        return f"DecisionConfig (Mode: {self.decision_mode})"
