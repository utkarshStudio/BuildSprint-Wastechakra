from rest_framework import serializers
from .models import SimulatedReading


class SimulatedReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimulatedReading
        fields = [
            'id', 'image', 'moisture_pct', 'combustibility_index',
            'recyclability_score', 'rdf_suitability_score',
            'contamination_pct', 'is_manual_override', 'created_at'
        ]
