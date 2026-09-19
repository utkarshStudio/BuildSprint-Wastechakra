from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        "status": "online",
        "service": "WasteChakra Core API v1",
        "endpoints": {
            "swagger_docs": request.build_absolute_uri('/api/docs/'),
            "stats_summary": request.build_absolute_uri('/api/v1/stats/summary/'),
            "auth_login": request.build_absolute_uri('/api/v1/auth/login/'),
            "rewards": request.build_absolute_uri('/api/v1/rewards/'),
            "community_events": request.build_absolute_uri('/api/v1/community/events/'),
            "pickups": request.build_absolute_uri('/api/v1/pickups/'),
            "waste_reports": request.build_absolute_uri('/api/v1/waste-reports/'),
            "pipeline_process": request.build_absolute_uri('/api/v1/pipeline/process/'),
            "ai_training": request.build_absolute_uri('/api/v1/detection/training/dashboard/'),
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui-alias'),
    path('api/v1/', api_root, name='api-root'),
    path('api/v1/', include('apps.waste_records.urls')),
    path('api/v1/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.pickups.urls')),
    path('api/v1/detection/', include('apps.detection.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
