from django.contrib import admin
from .models import SimulatedReading


@admin.register(SimulatedReading)
class SimulatedReadingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "image",
        "moisture_pct",
        "combustibility_index",
        "recyclability_score",
        "rdf_suitability_score",
        "contamination_pct",
        "is_manual_override",
        "created_at",
    )
    list_filter = ("is_manual_override", "created_at")
    search_fields = ("id",)
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
