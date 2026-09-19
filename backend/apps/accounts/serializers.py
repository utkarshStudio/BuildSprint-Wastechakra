from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import (
    UserProfile,
    CollectorProfile,
    BusinessProfile,
    RewardCatalogItem,
    RewardRedemption,
    ChakraPointTransaction,
    CommunityEvent,
    CommunityEventRegistration,
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    collector_profile = serializers.SerializerMethodField()
    business_profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'role', 'profile', 'collector_profile', 'business_profile', 'date_joined']
        read_only_fields = ['id', 'role', 'date_joined']

    def get_profile(self, obj):
        try:
            p = obj.profile
            return UserProfileSerializer(p).data
        except UserProfile.DoesNotExist:
            return None

    def get_collector_profile(self, obj):
        try:
            cp = obj.collector_profile
            return CollectorProfileSerializer(cp).data
        except CollectorProfile.DoesNotExist:
            return None

    def get_business_profile(self, obj):
        try:
            bp = obj.business_profile
            return BusinessProfileSerializer(bp).data
        except BusinessProfile.DoesNotExist:
            return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    ALLOWED_ROLES = ['CITIZEN', 'COLLECTOR', 'BUSINESS', 'FACILITY_MANAGER']

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'first_name', 'last_name', 'role']

    def validate_role(self, value):
        if value and value not in self.ALLOWED_ROLES:
            raise serializers.ValidationError(
                f"Invalid role. Allowed: {', '.join(self.ALLOWED_ROLES)}"
            )
        return value or 'CITIZEN'

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        # Auto-create CollectorProfile if role is COLLECTOR
        if user.role == 'COLLECTOR':
            CollectorProfile.objects.create(user=user)
        # Auto-create BusinessProfile if role is BUSINESS
        elif user.role == 'BUSINESS':
            comp_name = f"{user.first_name} {user.last_name}".strip() if (user.first_name or user.last_name) else (user.username or 'Enterprise')
            BusinessProfile.objects.create(user=user, company_name=comp_name)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'phone', 'address', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'vehicle_number', 'vehicle_type',
            'chakra_points', 'total_waste_submitted_kg', 'total_waste_recovered_kg',
            'streak_days', 'last_activity_date',
        ]


class CollectorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectorProfile
        fields = [
            'phone', 'address_line1', 'address_line2', 'city', 'state', 'pincode',
            'vehicle_number', 'vehicle_type', 'current_lat', 'current_lng',
            'is_active', 'rating', 'total_pickups', 'total_distance_km',
        ]


class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = [
            'company_name', 'gstin', 'phone', 'address', 'address_line1', 'address_line2',
            'city', 'state', 'pincode', 'industry_type', 'epr_registered', 'is_verified',
            'created_at', 'updated_at',
        ]


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class RewardCatalogItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardCatalogItem
        fields = [
            'id', 'title', 'description', 'cost', 'category',
            'icon', 'image_url', 'stock', 'partner_name', 'terms', 'is_active',
        ]


class RewardRedemptionSerializer(serializers.ModelSerializer):
    reward = RewardCatalogItemSerializer(read_only=True)
    reward_id = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = RewardRedemption
        fields = [
            'id', 'reward', 'reward_id', 'points_spent', 'voucher_code',
            'status', 'expires_at', 'claimed_at', 'created_at',
        ]
        read_only_fields = ['id', 'points_spent', 'voucher_code', 'status', 'expires_at', 'claimed_at', 'created_at']


class ChakraPointTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChakraPointTransaction
        fields = [
            'id', 'points', 'balance_after', 'transaction_type',
            'activity_type', 'description', 'reference_id', 'created_at',
        ]
        read_only_fields = fields


class CommunityEventSerializer(serializers.ModelSerializer):
    is_joined = serializers.SerializerMethodField()
    targetKg = serializers.IntegerField(source='target_kg', read_only=True)

    class Meta:
        model = CommunityEvent
        fields = [
            'id', 'title', 'category', 'location', 'date',
            'participants', 'target_kg', 'targetKg', 'waste_recovered_kg',
            'description', 'reward_points', 'status', 'is_joined',
            'created_at', 'updated_at',
        ]

    def get_is_joined(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.registrations.filter(user=request.user).exists()
        return False


class CommunityEventRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityEventRegistration
        fields = ['id', 'event', 'user', 'name', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']
