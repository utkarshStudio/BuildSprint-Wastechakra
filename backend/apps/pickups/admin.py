from django.contrib import admin
from .models import WasteReport, Pickup, WastePassport


@admin.register(WasteReport)
class WasteReportAdmin(admin.ModelAdmin):
    list_display = ['report_id', 'waste_type', 'urgency', 'status', 'created_at']
    list_filter = ['waste_type', 'urgency', 'status']
    search_fields = ['report_id', 'user__email']
    ordering = ['-created_at']


@admin.register(Pickup)
class PickupAdmin(admin.ModelAdmin):
    list_display = ['pickup_id', 'waste_type', 'status', 'user', 'collector', 'pickup_date', 'created_at']
    list_filter = ['waste_type', 'status', 'pickup_type']
    search_fields = ['pickup_id', 'user__email', 'collector__email']
    ordering = ['-created_at']


@admin.register(WastePassport)
class WastePassportAdmin(admin.ModelAdmin):
    list_display = ['passport_id', 'origin', 'input_weight_kg', 'processing_status', 'created_at']
    list_filter = ['origin', 'processing_status']
