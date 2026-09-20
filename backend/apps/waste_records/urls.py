from django.urls import path
from apps.detection.views import DetectMaterialView
from apps.analysis.views import GenerateVirtualFeaturesView, ManualFeaturesView
from apps.decision_engine.views import DecisionView, DecisionConfigView
from .views import (
    ProcessWasteImageView,
    ProcessWasteSimulateView,
    WasteRecordListView,
    WasteRecordDetailView,
    StatsSummaryView,
)

urlpatterns = [
    # Individual module endpoints
    path('detection/detect/', DetectMaterialView.as_view(), name='detect-material'),
    path('analysis/generate/', GenerateVirtualFeaturesView.as_view(), name='generate-features'),
    path('analysis/manual/', ManualFeaturesView.as_view(), name='manual-features'),
    path('decision/decide/', DecisionView.as_view(), name='decide-category'),
    path('config/decision-rules/', DecisionConfigView.as_view(), name='decision-rules-config'),

    # Combined pipeline endpoints
    path('pipeline/process/', ProcessWasteImageView.as_view(), name='pipeline-process-image'),
    path('pipeline/simulate/', ProcessWasteSimulateView.as_view(), name='pipeline-process-simulate'),

    # Analytics & Records endpoints
    path('records/', WasteRecordListView.as_view(), name='record-list'),
    path('records/<uuid:id>/', WasteRecordDetailView.as_view(), name='record-detail'),
    path('stats/summary/', StatsSummaryView.as_view(), name='stats-summary'),
]
