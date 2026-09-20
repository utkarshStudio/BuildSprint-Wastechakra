from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import generate_virtual_features, manual_features


class GenerateVirtualFeaturesView(APIView):
    def post(self, request):
        material = request.data.get('material', 'MIXED')
        confidence = float(request.data.get('confidence', 0.85))
        contamination = request.data.get('contamination_pct')
        if contamination is not None:
            contamination = float(contamination)

        features = generate_virtual_features(material, confidence, contamination)
        return Response(features, status=status.HTTP_200_OK)


class ManualFeaturesView(APIView):
    def post(self, request):
        features = manual_features(request.data)
        return Response(features, status=status.HTTP_200_OK)
