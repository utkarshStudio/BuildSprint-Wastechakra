from rest_framework import serializers
from .models import WasteImage


class WasteImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteImage
        fields = ['id', 'image', 'uploaded_at', 'source', 'detected_material', 'detection_confidence', 'raw_model_output']
        read_only_fields = ['id', 'uploaded_at', 'detected_material', 'detection_confidence', 'raw_model_output']
