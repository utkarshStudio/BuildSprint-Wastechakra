from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            request,
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
        )
        if user is None:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        data = request.data or {}

        for field in ['first_name', 'last_name', 'username']:
            if field in data and data[field] is not None:
                setattr(user, field, str(data[field]))
        user.save()

        profile, _ = UserProfile.objects.get_or_create(user=user)
        for field in ['phone', 'address', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'vehicle_number', 'vehicle_type']:
            if field in data and data[field] is not None:
                setattr(profile, field, str(data[field]))

        if 'address' in data and data['address']:
            profile.address = str(data['address'])
        else:
            parts = [p for p in [profile.address_line1, profile.address_line2, profile.city, profile.state, profile.pincode] if p]
            if parts:
                profile.address = ", ".join(parts)
        profile.save()

        if user.role == 'COLLECTOR' or hasattr(user, 'collector_profile'):
            cp, _ = CollectorProfile.objects.get_or_create(user=user)
            for field in ['phone', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'vehicle_number', 'vehicle_type']:
                if field in data and data[field] is not None:
                    setattr(cp, field, str(data[field]))
            if 'is_active' in data and data['is_active'] is not None:
                cp.is_active = bool(data['is_active'])

            for loc_field in ['current_lat', 'current_lng']:
                if loc_field in data:
                    val = data[loc_field]
                    if val is None or val == '':
                        setattr(cp, loc_field, None)
                    else:
                        try:
                            setattr(cp, loc_field, float(val))
                        except (ValueError, TypeError):
                            setattr(cp, loc_field, None)

            cp.save()

        if user.role == 'BUSINESS' or hasattr(user, 'business_profile'):
            bp, _ = BusinessProfile.objects.get_or_create(user=user)
            if 'company_name' in data and data['company_name'] is not None:
                bp.company_name = str(data['company_name'])
                cparts = bp.company_name.strip().split(' ', 1)
                user.first_name = cparts[0]
                user.last_name = cparts[1] if len(cparts) > 1 else ''
                user.save(update_fields=['first_name', 'last_name'])
            for field in ['gstin', 'phone', 'address', 'address_line1', 'address_line2', 'city', 'state', 'pincode', 'industry_type']:
                if field in data and data[field] is not None:
                    setattr(bp, field, str(data[field]))
            if 'epr_registered' in data and data['epr_registered'] is not None:
                bp.epr_registered = bool(data['epr_registered'])
            if 'is_verified' in data and data['is_verified'] is not None:
                bp.is_verified = bool(data['is_verified'])
            bp.save()

        return Response(UserSerializer(user).data)


class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=400)
        try:
            refresh = RefreshToken(refresh_token)
            return Response({'access': str(refresh.access_token)})
        except Exception:
            return Response({'error': 'Invalid refresh token'}, status=401)


# Import here to avoid circular imports
from .models import UserProfile, CollectorProfile, BusinessProfile
