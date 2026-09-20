from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import WasteImage
from .serializers import WasteImageSerializer
from .ml.virtual_classifier import virtual_classify


class DetectMaterialView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'image' not in request.FILES:
            return Response({'error': 'Image file is required'}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES['image']
        source = request.data.get('source', 'UPLOAD')

        waste_image = WasteImage.objects.create(image=image_file, source=source)
        material, confidence, raw_probs = virtual_classify(waste_image.image.path)

        waste_image.detected_material = material
        waste_image.detection_confidence = confidence
        waste_image.raw_model_output = raw_probs
        waste_image.save()

        serializer = WasteImageSerializer(waste_image, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
