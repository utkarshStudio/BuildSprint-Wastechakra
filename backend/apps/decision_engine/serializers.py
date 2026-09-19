from rest_framework import serializers
from .models import DecisionConfig


class DecisionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = DecisionConfig
        fields = [
            'recyclability_threshold',
            'contamination_threshold',
            'combustibility_threshold',
            'rdf_threshold',
            'moisture_bio_threshold',
            'low_confidence_threshold',
            'decision_mode',
            'updated_at',
        ]
