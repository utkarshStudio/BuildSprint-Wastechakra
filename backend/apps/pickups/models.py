import uuid
from django.db import models
from django.conf import settings


class WasteReportStatus(models.TextChoices):
    REPORTED = "REPORTED", "Reported"
    PICKUP_SCHEDULED = "PICKUP_SCHEDULED", "Pickup Scheduled"
    COLLECTED = "COLLECTED", "Collected"
    IN_TRANSIT = "IN_TRANSIT", "In Transit"
    AT_FACILITY = "AT_FACILITY", "At Facility"
    PROCESSING = "PROCESSING", "Processing"
    COMPLETED = "COMPLETED", "Completed"


class WasteReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report_id = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='waste_reports')
    image = models.ImageField(upload_to='waste_reports/%Y/%m/%d/', null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    address = models.TextField(blank=True, default='')
    waste_type = models.CharField(max_length=30, choices=[
        ('MIXED', 'Mixed Waste'),
        ('PLASTIC', 'Plastic'),
        ('ORGANIC', 'Organic'),
        ('PAPER', 'Paper'),
        ('METAL', 'Metal'),
        ('TEXTILE', 'Textile'),
        ('E_WASTE', 'E-Waste'),
        ('CONSTRUCTION', 'Construction Waste'),
        ('BULK', 'Bulk Waste'),
        ('HAZARDOUS', 'Hazardous Waste'),
    ], default='MIXED')
    estimated_quantity = models.CharField(max_length=20, choices=[
        ('<5', '<5 kg'),
        ('5-20', '5-20 kg'),
        ('20-50', '20-50 kg'),
        ('50-100', '50-100 kg'),
        ('100+', '100+ kg'),
    ], default='5-20')
    description = models.TextField(blank=True, default='')
    urgency = models.CharField(max_length=10, choices=[
        ('NORMAL', 'Normal'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ], default='NORMAL')
    status = models.CharField(max_length=20, choices=WasteReportStatus.choices, default=WasteReportStatus.REPORTED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.report_id} - {self.waste_type} ({self.status})"


class PickupStatus(models.TextChoices):
    REQUESTED = "REQUESTED", "Requested"
    OFFERED = "OFFERED", "Offered to Collector"
    CONFIRMED = "CONFIRMED", "Confirmed"
    ASSIGNED = "ASSIGNED", "Assigned"
    EN_ROUTE = "EN_ROUTE", "En Route"
    ARRIVED = "ARRIVED", "Arrived"
    COLLECTED = "COLLECTED", "Collected"
    PROCESSING = "PROCESSING", "Processing"
    COMPLETED = "COMPLETED", "Completed"
    CANCELLED = "CANCELLED", "Cancelled"


class Pickup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pickup_id = models.CharField(max_length=20, unique=True)
    waste_report = models.ForeignKey(WasteReport, on_delete=models.SET_NULL, null=True, blank=True, related_name='pickups')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pickups')
    collector = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='collector_pickups')
    offered_collector = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='offered_pickups')
    rejected_collectors = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='rejected_pickups')
    pickup_type = models.CharField(max_length=20, choices=[
        ('HOME', 'Home'),
        ('BUSINESS', 'Business'),
        ('SOCIETY', 'Society'),
    ], default='HOME')
    waste_type = models.CharField(max_length=30, choices=[
        ('MIXED', 'Mixed Waste'),
        ('PLASTIC', 'Plastic'),
        ('ORGANIC', 'Organic'),
        ('PAPER', 'Paper'),
        ('METAL', 'Metal'),
        ('TEXTILE', 'Textile'),
        ('E_WASTE', 'E-Waste'),
        ('CONSTRUCTION', 'Construction Waste'),
        ('BULK', 'Bulk Waste'),
        ('HAZARDOUS', 'Hazardous Waste'),
        ('RECYCLABLES', 'Recyclables'),
        ('OTHER', 'Other'),
    ], default='MIXED')
    estimated_quantity = models.CharField(max_length=20, blank=True, default='')
    pickup_date = models.DateField(null=True, blank=True)
    time_slot = models.CharField(max_length=30, blank=True, default='')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    address = models.TextField(blank=True, default='')
    instructions = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=PickupStatus.choices, default=PickupStatus.REQUESTED)
    actual_weight_kg = models.FloatField(null=True, blank=True)
    before_image = models.ImageField(upload_to='pickup_proof/before/%Y/%m/%d/', null=True, blank=True)
    after_image = models.ImageField(upload_to='pickup_proof/after/%Y/%m/%d/', null=True, blank=True)
    collector_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    collected_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.pickup_id} - {self.waste_type} ({self.status})"


class WastePassport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    passport_id = models.CharField(max_length=20, unique=True)
    pickup = models.OneToOneField(Pickup, on_delete=models.CASCADE, related_name='passport')
    origin = models.CharField(max_length=20, choices=[
        ('RESIDENTIAL', 'Residential'),
        ('COMMERCIAL', 'Commercial'),
        ('SOCIETY', 'Society'),
    ], default='RESIDENTIAL')
    input_weight_kg = models.FloatField(default=0.0)
    plastic_recovered_kg = models.FloatField(default=0.0)
    paper_recovered_kg = models.FloatField(default=0.0)
    organic_recovered_kg = models.FloatField(default=0.0)
    metal_recovered_kg = models.FloatField(default=0.0)
    rdf_produced_kg = models.FloatField(default=0.0)
    inert_kg = models.FloatField(default=0.0)
    residual_kg = models.FloatField(default=0.0)
    processing_status = models.CharField(max_length=20, choices=[
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ], default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Passport {self.passport_id}"

    @property
    def recovery_rate(self):
        if self.input_weight_kg == 0:
            return 0
        recovered = (self.plastic_recovered_kg + self.paper_recovered_kg +
                     self.organic_recovered_kg + self.metal_recovered_kg + self.rdf_produced_kg)
        return round((recovered / self.input_weight_kg) * 100, 1)
