import uuid
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    CITIZEN = "CITIZEN", "Citizen"
    BUSINESS = "BUSINESS", "Business"
    SOCIETY_ADMIN = "SOCIETY_ADMIN", "Society Admin"
    COLLECTOR = "COLLECTOR", "Collector"
    FACILITY_MANAGER = "FACILITY_MANAGER", "Facility Manager"
    ADMIN = "ADMIN", "Admin"
    SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=UserRole.choices, default=UserRole.CITIZEN)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.email} ({self.role})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    address = models.TextField(blank=True, default='')
    address_line1 = models.CharField(max_length=255, blank=True, default='')
    address_line2 = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    pincode = models.CharField(max_length=20, blank=True, default='')
    vehicle_number = models.CharField(max_length=50, blank=True, default='')
    vehicle_type = models.CharField(max_length=20, blank=True, default='VAN')
    avatar = models.ImageField(upload_to='avatars/%Y/%m/', null=True, blank=True)
    chakra_points = models.PositiveIntegerField(default=0)
    total_waste_submitted_kg = models.FloatField(default=0.0)
    total_waste_recovered_kg = models.FloatField(default=0.0)
    streak_days = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile: {self.user.email}"


class CollectorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='collector_profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    address_line1 = models.CharField(max_length=255, blank=True, default='')
    address_line2 = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    pincode = models.CharField(max_length=20, blank=True, default='')
    vehicle_number = models.CharField(max_length=20, blank=True, default='')
    vehicle_type = models.CharField(
        max_length=20,
        choices=[
            ('BIKE', 'Bike'),
            ('VAN', 'Van'),
            ('TRUCK', 'Truck'),
            ('AUTO', 'Auto Rickshaw'),
        ],
        default='VAN',
    )
    current_lat = models.FloatField(null=True, blank=True)
    current_lng = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    rating = models.FloatField(default=5.0)
    total_pickups = models.PositiveIntegerField(default=0)
    total_distance_km = models.FloatField(default=0.0)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.user_id:
            profile, _ = UserProfile.objects.get_or_create(user=self.user)
            updated = False
            for field in ['phone', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'vehicle_number', 'vehicle_type']:
                val = getattr(self, field, '')
                if val and getattr(profile, field, '') != val:
                    setattr(profile, field, val)
                    updated = True
            if updated:
                parts = [p for p in [profile.address_line1, profile.address_line2, profile.city, profile.state, profile.pincode] if p]
                if parts:
                    profile.address = ", ".join(parts)
                profile.save()

    def __str__(self):
        return f"Collector: {self.user.email} ({self.vehicle_number})"


class BusinessProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business_profile')
    company_name = models.CharField(max_length=255, blank=True, default='')
    gstin = models.CharField(max_length=50, blank=True, default='', verbose_name="GSTIN Number")
    phone = models.CharField(max_length=20, blank=True, default='', verbose_name="Dispatch Phone")
    address = models.TextField(blank=True, default='', verbose_name="Primary Facility Address")
    address_line1 = models.CharField(max_length=255, blank=True, default='')
    address_line2 = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, blank=True, default='')
    pincode = models.CharField(max_length=20, blank=True, default='')
    industry_type = models.CharField(
        max_length=50,
        choices=[
            ('CORPORATE', 'Corporate Office'),
            ('IT_PARK', 'IT / Tech Park'),
            ('MANUFACTURING', 'Manufacturing / Industrial'),
            ('HOTEL_HOSPITALITY', 'Hotel & Hospitality'),
            ('HOSPITAL', 'Hospital / Healthcare'),
            ('RETAIL_MALL', 'Retail & Mall'),
            ('EDUCATIONAL', 'Educational Institution'),
            ('OTHER', 'Other Enterprise'),
        ],
        default='CORPORATE',
    )
    epr_registered = models.BooleanField(default=True, verbose_name="EPR Registered")
    is_verified = models.BooleanField(default=True, verbose_name="Verified Enterprise")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.user_id:
            profile, _ = UserProfile.objects.get_or_create(user=self.user)
            updated = False
            for field in ['phone', 'address', 'address_line1', 'city', 'state', 'pincode']:
                val = getattr(self, field, '')
                if val and getattr(profile, field, '') != val:
                    setattr(profile, field, val)
                    updated = True
            if updated:
                profile.save()

    def __str__(self):
        return f"Business: {self.company_name or self.user.email}"


class ChakraPointTransaction(models.Model):
    class TransactionType(models.TextChoices):
        EARNED = 'EARNED', 'Points Earned'
        REDEEMED = 'REDEEMED', 'Points Redeemed'

    class ActivityType(models.TextChoices):
        WASTE_REPORT = 'WASTE_REPORT', 'Waste Report with Photo'
        IMAGE_SCAN = 'IMAGE_SCAN', 'AI Optical Waste Scan'
        PICKUP_COMPLETED = 'PICKUP_COMPLETED', 'Completed Waste Pickup'
        COMMUNITY_CLEANUP = 'COMMUNITY_CLEANUP', 'Community Cleanup Event'
        STREAK_BONUS = 'STREAK_BONUS', 'Streak Milestone Bonus'
        REWARD_REDEMPTION = 'REWARD_REDEMPTION', 'Reward Redemption'
        MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT', 'Manual Adjustment'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chakra_transactions')
    points = models.IntegerField(help_text="Signed integer: positive for earned, negative for redeemed")
    balance_after = models.PositiveIntegerField(default=0)
    transaction_type = models.CharField(max_length=20, choices=TransactionType.choices, default=TransactionType.EARNED)
    activity_type = models.CharField(max_length=30, choices=ActivityType.choices, default=ActivityType.WASTE_REPORT)
    description = models.CharField(max_length=255, blank=True, default='')
    reference_id = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email}: {self.points:+d} pts ({self.activity_type})"


class RewardCatalogItem(models.Model):
    class Category(models.TextChoices):
        VOUCHER = 'VOUCHER', 'Eco Voucher'
        MERCHANDISE = 'MERCHANDISE', 'Sustainable Merchandise'
        DONATION = 'DONATION', 'Green Cause & Tree Planting'
        EXPERIENCE = 'EXPERIENCE', 'Workshop & Pass'

    id = models.CharField(max_length=50, primary_key=True, help_text="Unique slug or identifier, e.g. eco-voucher-50")
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    cost = models.PositiveIntegerField(help_text="Chakra points required to redeem")
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.VOUCHER)
    icon = models.CharField(max_length=50, default='card_giftcard', help_text="Lucide/Material icon name")
    image_url = models.URLField(blank=True, default='')
    stock = models.IntegerField(default=100, help_text="-1 for unlimited stock")
    partner_name = models.CharField(max_length=100, blank=True, default='WasteChakra Green Partner')
    terms = models.TextField(blank=True, default='Valid for 90 days from redemption. Non-transferable.')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['cost', 'title']

    def __str__(self):
        return f"{self.title} ({self.cost} pts)"


class RewardRedemption(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active / Usable'
        USED = 'USED', 'Redeemed / Claimed'
        EXPIRED = 'EXPIRED', 'Expired'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reward_redemptions')
    reward = models.ForeignKey(RewardCatalogItem, on_delete=models.PROTECT, related_name='redemptions')
    points_spent = models.PositiveIntegerField()
    voucher_code = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    expires_at = models.DateTimeField(null=True, blank=True)
    claimed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.reward.title} ({self.voucher_code})"


class CommunityEvent(models.Model):
    class Status(models.TextChoices):
        UPCOMING = 'UPCOMING', 'Upcoming'
        OPEN = 'OPEN', 'Open for Registration'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'

    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, default='Cleanup')
    location = models.CharField(max_length=255)
    date = models.CharField(max_length=100)
    participants = models.PositiveIntegerField(default=0)
    target_kg = models.PositiveIntegerField(default=0)
    waste_recovered_kg = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True, default='')
    reward_points = models.PositiveIntegerField(default=50)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.title} ({self.category}) - {self.participants} joined"


class CommunityEventRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(CommunityEvent, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='event_registrations')
    name = models.CharField(max_length=150, blank=True, default='')
    phone = models.CharField(max_length=30, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('event', 'user')

    def __str__(self):
        actor = self.user.email if self.user else (self.name or self.phone)
        return f"{actor} -> {self.event.title}"
