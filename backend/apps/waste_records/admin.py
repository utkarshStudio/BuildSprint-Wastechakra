from django.contrib import admin
from .models import WasteRecord


@admin.register(WasteRecord)
class WasteRecordAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "final_category",
        "decision_confidence",
        "processed_at",
    )
    list_filter = ("final_category", "processed_at")
    search_fields = ("id", "final_category")
    readonly_fields = ("id", "processed_at", "decision_breakdown")
    ordering = ("-processed_at",)
