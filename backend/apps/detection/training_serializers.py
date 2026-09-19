from rest_framework import serializers
from .models import AITrainingSample, ModelVersion, AITrainingJob


class AITrainingSampleSerializer(serializers.ModelSerializer):
    contributor_name = serializers.SerializerMethodField()
    contributor_role = serializers.SerializerMethodField()
    image_url_display = serializers.SerializerMethodField()
    effective_category = serializers.CharField(read_only=True)

    class Meta:
        model = AITrainingSample
        fields = [
            "id",
            "image",
            "image_url",
            "image_url_display",
            "contributor",
            "contributor_name",
            "contributor_role",
            "source",
            "predicted_category",
            "verified_category",
            "effective_category",
            "confidence",
            "bounding_boxes",
            "status",
            "quality_score",
            "eco_credits_awarded",
            "source_reference_id",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "eco_credits_awarded"]

    def get_contributor_name(self, obj):
        if obj.contributor:
            first = obj.contributor.first_name
            last = obj.contributor.last_name
            if first or last:
                return f"{first} {last}".strip()
            return obj.contributor.username or obj.contributor.email
        return "Community Contributor"

    def get_contributor_role(self, obj):
        if obj.contributor:
            return getattr(obj.contributor, "role", "CITIZEN")
        return "CITIZEN"

    def get_image_url_display(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or "/sample_waste.jpg"


class ModelVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelVersion
        fields = [
            "id",
            "version_tag",
            "architecture",
            "is_active",
            "accuracy",
            "mAP_50",
            "f1_score",
            "total_samples_trained",
            "trained_categories",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class AITrainingJobSerializer(serializers.ModelSerializer):
    model_version_tag = serializers.SerializerMethodField()
    triggered_by_name = serializers.SerializerMethodField()

    class Meta:
        model = AITrainingJob
        fields = [
            "id",
            "job_id",
            "model_version",
            "model_version_tag",
            "status",
            "total_epochs",
            "current_epoch",
            "progress_percent",
            "samples_count",
            "batch_size",
            "learning_rate",
            "current_loss",
            "val_loss",
            "val_mAP",
            "metrics_history",
            "logs",
            "started_at",
            "completed_at",
            "triggered_by",
            "triggered_by_name",
        ]
        read_only_fields = ["id", "job_id", "started_at", "completed_at"]

    def get_model_version_tag(self, obj):
        return obj.model_version.version_tag if obj.model_version else None

    def get_triggered_by_name(self, obj):
        if obj.triggered_by:
            return obj.triggered_by.username or obj.triggered_by.email
        return "System Pipeline"
