from rest_framework import serializers
from .models import WasteReport, Pickup, WastePassport


class WasteReportSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = WasteReport
        fields = '__all__'
        read_only_fields = ['id', 'report_id', 'user', 'status', 'created_at', 'updated_at']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class WasteReportCreateSerializer(serializers.ModelSerializer):
    waste_type = serializers.ChoiceField(
        choices=[
            'MIXED', 'PLASTIC', 'ORGANIC', 'PAPER', 'METAL', 'TEXTILE',
            'E_WASTE', 'CONSTRUCTION', 'BULK', 'HAZARDOUS'
        ],
        required=False,
        default='MIXED'
    )
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, default='')
    description = serializers.CharField(required=False, allow_blank=True, default='')
    urgency = serializers.ChoiceField(choices=['NORMAL', 'HIGH', 'URGENT'], required=False, default='NORMAL')
    estimated_quantity = serializers.ChoiceField(choices=['<5', '5-20', '20-50', '50-100', '100+'], required=False, default='5-20')
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = WasteReport
        fields = [
            'id', 'report_id', 'user', 'image', 'latitude', 'longitude', 'address',
            'waste_type', 'estimated_quantity', 'description', 'urgency', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'report_id', 'user', 'status', 'created_at']

    def to_internal_value(self, data):
        if hasattr(data, 'copy'):
            data = data.copy()
        for field in ['latitude', 'longitude']:
            if field in data and (data[field] == '' or data[field] is None):
                data[field] = None
        return super().to_internal_value(data)


class PickupSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    collector_email = serializers.CharField(source='collector.email', read_only=True, default=None)
    collector_name = serializers.SerializerMethodField()
    offered_collector_email = serializers.CharField(source='offered_collector.email', read_only=True, default=None)
    waste_report_detail = WasteReportSerializer(source='waste_report', read_only=True)
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = Pickup
        fields = '__all__'
        read_only_fields = ['id', 'pickup_id', 'user', 'created_at', 'updated_at',
                           'collected_at', 'completed_at']

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email
        return ""

    def get_collector_name(self, obj):
        if obj.collector:
            return f"{obj.collector.first_name} {obj.collector.last_name}".strip() or obj.collector.email
        return None

    def get_distance_km(self, obj):
        request = self.context.get('request')
        if not request or not request.user:
            return None
        from .utils import calculate_haversine_distance
        # If logged in user is a collector with lat/lng
        if hasattr(request.user, 'collector_profile') and request.user.collector_profile.current_lat and request.user.collector_profile.current_lng:
            c_lat = request.user.collector_profile.current_lat
            c_lng = request.user.collector_profile.current_lng
            p_lat = obj.latitude or (obj.waste_report.latitude if obj.waste_report else None)
            p_lng = obj.longitude or (obj.waste_report.longitude if obj.waste_report else None)
            if p_lat and p_lng:
                return calculate_haversine_distance(c_lat, c_lng, p_lat, p_lng)
        return None


class PickupStatusUpdateSerializer(serializers.ModelSerializer):
    """Admin / collector serializer — allows status + collector assignment + collection proof."""
    class Meta:
        model = Pickup
        fields = ['status', 'collector', 'actual_weight_kg', 'before_image', 'after_image',
                  'collector_notes', 'collected_at', 'completed_at']
        read_only_fields = ['collected_at', 'completed_at']

    def update(self, instance, validated_data):
        from django.utils import timezone
        if validated_data.get('status') in ('COLLECTED', 'PROCESSING', 'COMPLETED'):
            validated_data.setdefault('collected_at', timezone.now())
        if validated_data.get('status') == 'COMPLETED':
            validated_data.setdefault('completed_at', timezone.now())
        return super().update(instance, validated_data)


class PickupCreateSerializer(serializers.ModelSerializer):
    pickup_type = serializers.ChoiceField(choices=['HOME', 'BUSINESS', 'SOCIETY'])
    waste_type = serializers.ChoiceField(
        choices=[
            'MIXED', 'PLASTIC', 'ORGANIC', 'PAPER', 'METAL', 'TEXTILE',
            'E_WASTE', 'CONSTRUCTION', 'BULK', 'HAZARDOUS', 'RECYCLABLES', 'OTHER'
        ],
        default='MIXED',
        required=False
    )
    pickup_date = serializers.DateField()
    time_slot = serializers.CharField()
    address = serializers.CharField()

    class Meta:
        model = Pickup
        fields = [
            'id', 'pickup_id', 'status', 'pickup_type', 'waste_type',
            'estimated_quantity', 'pickup_date', 'time_slot',
            'latitude', 'longitude', 'address', 'instructions', 'waste_report'
        ]
        read_only_fields = ['id', 'pickup_id', 'status']


class WastePassportSerializer(serializers.ModelSerializer):
    recovery_rate = serializers.ReadOnlyField()

    class Meta:
        model = WastePassport
        fields = '__all__'
