from django.contrib import admin
from .models import DecisionConfig


@admin.register(DecisionConfig)
class DecisionConfigAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "decision_mode",
        "recyclability_threshold",
        "contamination_threshold",
        "combustibility_threshold",
        "rdf_threshold",
        "moisture_bio_threshold",
        "low_confidence_threshold",
        "updated_at",
    )
    readonly_fields = ("updated_at",)

    def has_add_permission(self, request):
        # Prevent creating multiple config rows (keep as singleton)
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
