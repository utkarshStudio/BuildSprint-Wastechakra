from django.urls import path
from .views import (
    WasteReportCreateView, WasteReportListView, WasteReportDetailView,
    PickupCreateView, PickupListView, PickupDetailView,
    PickupAcceptView, PickupRejectView, PickupClaimView, PickupQuoteRequestView,
    WastePassportView, UserImpactView,
)

urlpatterns = [
    path('waste-reports/', WasteReportListView.as_view(), name='waste-report-list'),
    path('waste-reports/create/', WasteReportCreateView.as_view(), name='waste-report-create'),
    path('waste-reports/<uuid:id>/', WasteReportDetailView.as_view(), name='waste-report-detail'),
    path('pickups/', PickupListView.as_view(), name='pickup-list'),
    path('pickups/create/', PickupCreateView.as_view(), name='pickup-create'),
    path('pickups/quote-request/', PickupQuoteRequestView.as_view(), name='pickup-quote-request'),
    path('pickups/<uuid:id>/', PickupDetailView.as_view(), name='pickup-detail'),
    path('pickups/<uuid:id>/accept/', PickupAcceptView.as_view(), name='pickup-accept'),
    path('pickups/<uuid:id>/reject/', PickupRejectView.as_view(), name='pickup-reject'),
    path('pickups/<uuid:id>/claim/', PickupClaimView.as_view(), name='pickup-claim'),
    path('passports/<uuid:id>/', WastePassportView.as_view(), name='waste-passport'),
    path('user/impact/', UserImpactView.as_view(), name='user-impact'),
]
