from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import DecisionConfig
from .serializers import DecisionConfigSerializer
from .engine import decide_category


class DecisionView(APIView):
    def post(self, request):
        features = request.data.get('features', request.data)
        mode = request.data.get('mode')
        category, trace, confidence = decide_category(features, mode=mode)
        return Response({
            'final_category': category,
            'decision_confidence': confidence,
            'decision_breakdown': trace
        }, status=status.HTTP_200_OK)


class DecisionConfigView(APIView):
    def get(self, request):
        config = DecisionConfig.get_config()
        serializer = DecisionConfigSerializer(config)
        return Response(serializer.data)

    def patch(self, request):
        config = DecisionConfig.get_config()
        serializer = DecisionConfigSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
