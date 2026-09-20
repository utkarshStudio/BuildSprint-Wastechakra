import uuid
from datetime import datetime
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Sum
from .models import WasteReport, Pickup, WastePassport
from .serializers import (
    WasteReportSerializer, WasteReportCreateSerializer,
    PickupSerializer, PickupCreateSerializer, PickupStatusUpdateSerializer,
    WastePassportSerializer,
)


def generate_report_id():
    return f"WC-{datetime.now().strftime('%Y')}-{str(uuid.uuid4())[:6].upper()}"


def generate_pickup_id():
    return f"WC-{datetime.now().strftime('%Y')}-{str(uuid.uuid4())[:6].upper()}"


def generate_passport_id():
    return f"WP-{datetime.now().strftime('%Y')}-{str(uuid.uuid4())[:6].upper()}"


from .utils import find_nearest_collector


class WasteReportCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WasteReportCreateSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save(
            user=self.request.user,
            report_id=generate_report_id(),
        )
        # Auto-create Pickup and offer to nearest active collector
        lat = report.latitude
        lng = report.longitude
        nearest_collector, dist = find_nearest_collector(lat, lng) if (lat and lng) else (None, None)

        status_val = 'OFFERED' if nearest_collector else 'REQUESTED'
        pickup = Pickup.objects.create(
            pickup_id=generate_pickup_id(),
            waste_report=report,
            user=self.request.user,
            offered_collector=nearest_collector,
            latitude=lat,
            longitude=lng,
            address=report.address or '',
            waste_type=report.waste_type or 'MIXED',
            status=status_val,
        )
        report.status = 'PICKUP_SCHEDULED'
        report.save()

        # Award points & maintain daily streak
        reward_info = None
        try:
            from apps.accounts.rewards_service import award_points_and_streak
            reward_info = award_points_and_streak(
                user=self.request.user,
                points=50,
                activity_type='WASTE_REPORT',
                description=f"Reported {report.waste_type} waste ({report.report_id})",
                reference_id=str(report.id),
            )
        except Exception as e:
            pass

        data = WasteReportSerializer(report, context={'request': request}).data
        data['reward_info'] = reward_info
        data['pickup_id'] = pickup.pickup_id
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


class WasteReportListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WasteReportSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ('ADMIN', 'SUPER_ADMIN'):
            return WasteReport.objects.all()
        return WasteReport.objects.filter(user=user)


class WasteReportDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WasteReportSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.role in ('ADMIN', 'SUPER_ADMIN'):
            return WasteReport.objects.all()
        return WasteReport.objects.filter(user=user)


class PickupCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PickupCreateSerializer

    def perform_create(self, serializer):
        pickup = serializer.save(
            user=self.request.user,
            pickup_id=generate_pickup_id(),
        )
        if pickup.waste_report:
            pickup.waste_report.status = 'PICKUP_SCHEDULED'
            pickup.waste_report.save()

        # Find nearest collector if lat/lng available
        lat = pickup.latitude or (pickup.waste_report.latitude if pickup.waste_report else None)
        lng = pickup.longitude or (pickup.waste_report.longitude if pickup.waste_report else None)
        if lat and lng and not pickup.collector:
            nearest_collector, _ = find_nearest_collector(lat, lng)
            if nearest_collector:
                pickup.offered_collector = nearest_collector
                pickup.status = 'OFFERED'
                pickup.save()


class PickupListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PickupSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ('COLLECTOR',):
            from django.db.models import Q
            # Return assigned pickups, offered pickups, or unassigned open pool pickups
            return Pickup.objects.filter(
                Q(collector=user) |
                Q(offered_collector=user) |
                Q(collector__isnull=True, offered_collector__isnull=True)
            ).distinct()
        if user.role in ('ADMIN', 'SUPER_ADMIN', 'FACILITY_MANAGER'):
            return Pickup.objects.all()
        return Pickup.objects.filter(user=user)


class PickupAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            pickup = Pickup.objects.get(id=id)
        except Pickup.DoesNotExist:
            return Response({'error': 'Pickup not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role != 'COLLECTOR' and request.user.role not in ('ADMIN', 'SUPER_ADMIN'):
            return Response({'error': 'Only collectors can accept pickups'}, status=status.HTTP_403_FORBIDDEN)

        pickup.collector = request.user
        pickup.offered_collector = None
        pickup.status = 'ASSIGNED'
        pickup.save()
        return Response(PickupSerializer(pickup, context={'request': request}).data)


class PickupRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            pickup = Pickup.objects.get(id=id)
        except Pickup.DoesNotExist:
            return Response({'error': 'Pickup not found'}, status=status.HTTP_404_NOT_FOUND)

        pickup.rejected_collectors.add(request.user)
        excluded_ids = list(pickup.rejected_collectors.values_list('id', flat=True))

        lat = pickup.latitude or (pickup.waste_report.latitude if pickup.waste_report else None)
        lng = pickup.longitude or (pickup.waste_report.longitude if pickup.waste_report else None)

        next_collector, _ = find_nearest_collector(lat, lng, exclude_user_ids=excluded_ids) if (lat and lng) else (None, None)

        if next_collector:
            pickup.offered_collector = next_collector
            pickup.status = 'OFFERED'
        else:
            pickup.offered_collector = None
            pickup.status = 'REQUESTED'

        pickup.save()
        return Response(PickupSerializer(pickup, context={'request': request}).data)


class PickupClaimView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            pickup = Pickup.objects.get(id=id)
        except Pickup.DoesNotExist:
            return Response({'error': 'Pickup not found'}, status=status.HTTP_404_NOT_FOUND)

        if pickup.collector is not None:
            return Response({'error': 'Pickup is already assigned'}, status=status.HTTP_400_BAD_REQUEST)

        pickup.collector = request.user
        pickup.offered_collector = None
        pickup.status = 'ASSIGNED'
        pickup.save()
        return Response(PickupSerializer(pickup, context={'request': request}).data)


class PickupQuoteRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data or {}
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        service = data.get('service', 'Residential Pickup').strip()

        if not name or not phone:
            return Response({'error': 'Name and phone number are required.'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        user = request.user if (request.user and request.user.is_authenticated) else User.objects.filter(role='ADMIN').first()
        if not user:
            user = User.objects.first()

        service_map = {
            'Residential Pickup': ('HOME', 'MIXED'),
            'Commercial Collection': ('BUSINESS', 'BULK'),
            'Bulky Junk Cleanout': ('HOME', 'BULK'),
            'E-Waste & Hazardous': ('HOME', 'E_WASTE'),
            'Zero-Landfill Audit': ('BUSINESS', 'RECYCLABLES'),
        }
        pickup_type, waste_type = service_map.get(service, ('HOME', 'MIXED'))

        nearest_collector, _ = find_nearest_collector(None, None)

        pickup = Pickup.objects.create(
            pickup_id=generate_pickup_id(),
            user=user,
            collector=None,
            offered_collector=nearest_collector,
            pickup_type=pickup_type,
            waste_type=waste_type,
            estimated_quantity='Quote Lead',
            address=f"Quote Lead from {name} - Contact: {phone}",
            instructions=f"Free Quote Lead. Service: {service}. Customer: {name}, Phone: {phone}",
            status='OFFERED' if nearest_collector else 'REQUESTED',
        )

        return Response({
            'message': 'Quote request submitted successfully',
            'pickup': PickupSerializer(pickup, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)


class PickupDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'PUT'):
            return PickupStatusUpdateSerializer
        return PickupSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role in ('ADMIN', 'SUPER_ADMIN', 'COLLECTOR'):
            return Pickup.objects.all()
        return Pickup.objects.filter(user=user)

    def update(self, request, *args, **kwargs):
        pickup = self.get_object()
        user = request.user
        is_admin = user.role in ('ADMIN', 'SUPER_ADMIN', 'FACILITY_MANAGER')
        is_owner = pickup.user_id == user.id
        is_collector = pickup.collector_id == user.id

        if user.role == 'COLLECTOR' and not is_collector:
            return Response({'error': 'You are not assigned to this pickup'}, status=status.HTTP_403_FORBIDDEN)

        if not (is_admin or is_owner or is_collector):
            return Response({'error': 'You do not have permission to update this pickup'}, status=status.HTTP_403_FORBIDDEN)

        # Status state machine validation
        VALID_TRANSITIONS = {
            'REQUESTED': ['CONFIRMED', 'ASSIGNED', 'CANCELLED'],
            'CONFIRMED': ['ASSIGNED', 'CANCELLED'],
            'ASSIGNED': ['EN_ROUTE', 'CANCELLED'],
            'EN_ROUTE': ['ARRIVED'],
            'ARRIVED': ['COLLECTED'],
            'COLLECTED': ['PROCESSING'],
            'PROCESSING': ['COMPLETED'],
        }
        new_status = request.data.get('status')
        if new_status and new_status != pickup.status:
            allowed = VALID_TRANSITIONS.get(pickup.status, [])
            if new_status not in allowed:
                return Response(
                    {'error': f"Invalid status transition: {pickup.status} → {new_status}. Allowed: {allowed or 'none'}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if new_status == 'COMPLETED' and pickup.user:
                try:
                    from apps.accounts.rewards_service import award_points_and_streak
                    weight = float(request.data.get('actual_weight_kg') or pickup.actual_weight_kg or 5.0)
                    calc_points = max(50, int(weight * 10))
                    award_points_and_streak(
                        user=pickup.user,
                        points=calc_points,
                        activity_type='PICKUP_COMPLETED',
                        description=f"Completed pickup {pickup.pickup_id} ({weight:.1f}kg recycled)",
                        reference_id=str(pickup.id),
                    )
                except Exception:
                    pass
        return super().update(request, *args, **kwargs)


class WastePassportView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WastePassportSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.role in ('ADMIN', 'SUPER_ADMIN', 'FACILITY_MANAGER'):
            return WastePassport.objects.all()
        return WastePassport.objects.filter(pickup__user=user)


class UserImpactView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        pickups = Pickup.objects.filter(user=user, status='COMPLETED')
        stats = pickups.aggregate(
            total_pickups=Count('id'),
            total_weight=Sum('actual_weight_kg'),
        )
        try:
            profile = user.profile
            chakra_points = profile.chakra_points
            streak = profile.streak_days
        except Exception:
            chakra_points = 0
            streak = 0

        return Response({
            'total_pickups': stats['total_pickups'] or 0,
            'total_weight_kg': stats['total_weight'] or 0,
            'chakra_points': chakra_points,
            'streak_days': streak,
            'waste_submitted_kg': user.profile.total_waste_submitted_kg if hasattr(user, 'profile') else 0,
            'waste_recovered_kg': user.profile.total_waste_recovered_kg if hasattr(user, 'profile') else 0,
        })
