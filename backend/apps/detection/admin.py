from django.contrib import admin
from .models import WasteImage


@admin.register(WasteImage)
class WasteImageAdmin(admin.ModelAdmin):
    list_display = ("id", "source", "detected_material", "detection_confidence", "uploaded_at")
    list_filter = ("source", "detected_material", "uploaded_at")
    search_fields = ("id", "detected_material")
    readonly_fields = ("id", "uploaded_at", "raw_model_output")
    ordering = ("-uploaded_at",)
