from rest_framework import serializers
from .models import WasteRecord


class WasteRecordSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    material = serializers.SerializerMethodField()
    moisture_pct = serializers.SerializerMethodField()
    combustibility_index = serializers.SerializerMethodField()
    recyclability_score = serializers.SerializerMethodField()
    rdf_suitability_score = serializers.SerializerMethodField()
    contamination_pct = serializers.SerializerMethodField()

    class Meta:
        model = WasteRecord
        fields = [
            "id",
            "image_url",
            "material",
            "moisture_pct",
            "combustibility_index",
            "recyclability_score",
            "rdf_suitability_score",
            "contamination_pct",
            "final_category",
            "decision_confidence",
            "decision_breakdown",
            "processed_at",
        ]

    def get_image_url(self, obj):
        if not obj.image or not obj.image.image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.image.url) if request else obj.image.image.url

    def get_material(self, obj):
        if obj.image:
            return obj.image.detected_material
        if obj.simulated_reading and obj.decision_breakdown:
            return obj.decision_breakdown.get("material", "MIXED")
        return "MIXED"

    def get_moisture_pct(self, obj):
        return obj.simulated_reading.moisture_pct if obj.simulated_reading else 0.0

    def get_combustibility_index(self, obj):
        return obj.simulated_reading.combustibility_index if obj.simulated_reading else 0.0

    def get_recyclability_score(self, obj):
        return obj.simulated_reading.recyclability_score if obj.simulated_reading else 0.0

    def get_rdf_suitability_score(self, obj):
        return obj.simulated_reading.rdf_suitability_score if obj.simulated_reading else 0.0

    def get_contamination_pct(self, obj):
        return obj.simulated_reading.contamination_pct if obj.simulated_reading else 0.0
