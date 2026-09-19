from django.urls import path
from .views import DetectMaterialView
from .training_views import (
    TrainingDashboardSummaryView,
    TrainingSampleListView,
    TrainingSampleUpdateView,
    TrainingSampleBatchActionView,
    TrainingSampleDirectUploadView,
    TriggerTrainingJobView,
    TrainingJobStatusView,
    ModelVersionListView,
    ActivateModelVersionView,
)

app_name = 'detection'

urlpatterns = [
    # Legacy detect endpoint
    path('detect/', DetectMaterialView.as_view(), name='detect-material'),

    # AI Training & Crowdsourced Dataset Endpoints
    path('training/dashboard/', TrainingDashboardSummaryView.as_view(), name='training-dashboard'),
    path('training/samples/', TrainingSampleListView.as_view(), name='training-samples-list'),
    path('training/samples/batch/', TrainingSampleBatchActionView.as_view(), name='training-samples-batch'),
    path('training/samples/<uuid:id>/', TrainingSampleUpdateView.as_view(), name='training-sample-update'),
    path('training/samples/upload/', TrainingSampleDirectUploadView.as_view(), name='training-sample-upload'),
    path('training/trigger/', TriggerTrainingJobView.as_view(), name='training-trigger'),
    path('training/jobs/<str:job_id>/status/', TrainingJobStatusView.as_view(), name='training-job-status'),
    path('training/jobs/latest/', TrainingJobStatusView.as_view(), name='training-job-latest'),
    path('training/models/', ModelVersionListView.as_view(), name='model-versions-list'),
    path('training/models/<uuid:id>/activate/', ActivateModelVersionView.as_view(), name='model-version-activate'),
]
