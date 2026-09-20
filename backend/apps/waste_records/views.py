from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from django.db.models import Count

from apps.detection.models import WasteImage
from apps.detection.ml.virtual_classifier import virtual_classify
from apps.analysis.models import SimulatedReading
from apps.analysis.services import generate_virtual_features, manual_features
from apps.decision_engine.engine import decide_category

from .models import WasteRecord
from .serializers import WasteRecordSerializer
from .filters import WasteRecordFilter


class ProcessWasteImageView(APIView):
    """One-shot combined pipeline for image processing.
    Uploads waste image -> classifies material -> generates software readings -> decides category -> logs record.
    """
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if "image" not in request.FILES:
            return Response({"error": "Image file is required under 'image' key"}, status=status.HTTP_400_BAD_REQUEST)

        image_file = request.FILES["image"]
        source = request.data.get("source", "UPLOAD")

        # 1. Save uploaded waste image
        waste_image = WasteImage.objects.create(image=image_file, source=source)

        from apps.detection.yolo_service.gemini_vision_service import GeminiVisionService
        gemini_key = request.headers.get("X-Gemini-Key") or request.data.get("gemini_key")
        vision_res = GeminiVisionService.analyze_waste_image(waste_image.image.path, custom_api_key=gemini_key)

        if source == "INSPECTION_OVERLAY":
            if not vision_res:
                return Response({"error": "Failed to analyze image with Vision Service"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            if request.user and request.user.is_authenticated:
                try:
                    from apps.accounts.rewards_service import award_points_and_streak
                    reward_info = award_points_and_streak(
                        user=request.user,
                        points=15,
                        activity_type='IMAGE_SCAN',
                        description="Simulation Optical Scan",
                        reference_id=str(waste_image.id),
                    )
                    vision_res["reward_info"] = reward_info
                except Exception:
                    pass
            return Response(vision_res, status=status.HTTP_200_OK)

        # 2. Extract classified material & confidence
        material = vision_res.get("material") or "MIXED"
        confidence = float(vision_res.get("confidence") or 0.88)
        waste_image.detected_material = material
        waste_image.detection_confidence = confidence
        waste_image.raw_model_output = vision_res
        waste_image.save()

        # 3. Generate software virtual feature readings
        features = generate_virtual_features(material, confidence)

        reading = SimulatedReading.objects.create(
            image=waste_image,
            moisture_pct=features["moisture_pct"],
            combustibility_index=features["combustibility_index"],
            recyclability_score=features["recyclability_score"],
            rdf_suitability_score=features["rdf_suitability_score"],
            contamination_pct=features["contamination_pct"],
            is_manual_override=False,
        )

        # 4. Determine final destination category
        category, trace, decision_confidence = decide_category(features, mode="hybrid")

        # 5. Persist complete pipeline record
        record = WasteRecord.objects.create(
            image=waste_image,
            simulated_reading=reading,
            final_category=category,
            decision_confidence=decision_confidence,
            decision_breakdown=trace,
        )

        data = WasteRecordSerializer(record, context={"request": request}).data
        data["material"] = material
        data["confidence"] = confidence
        data["materials"] = vision_res.get("materials", [])
        data["severity"] = vision_res.get("severity", "Medium")
        data["estimated_quantity"] = vision_res.get("estimated_quantity", "5-15 kg")
        data["recommended_action"] = vision_res.get("recommended_action", "Route to dry waste recycling")
        data["objects"] = vision_res.get("objects", [])
        data["total_detected"] = vision_res.get("total_detected", len(vision_res.get("objects", [])))
        data["stream_counts"] = vision_res.get("stream_counts", {})
        data["summary_points"] = vision_res.get("summary_points", [])
        data["model_version"] = vision_res.get("model_version", "HYBRID ENSEMBLE: GEMINI VISION + OPTICAL CLASSIFIER")
        data["architecture_pipeline"] = vision_res.get("architecture_pipeline", {})

        if request.user and request.user.is_authenticated:
            try:
                from apps.accounts.rewards_service import award_points_and_streak
                reward_info = award_points_and_streak(
                    user=request.user,
                    points=15,
                    activity_type='IMAGE_SCAN',
                    description=f"AI Optical Scan: detected {material}",
                    reference_id=str(record.id),
                )
                data["reward_info"] = reward_info
            except Exception:
                pass

        return Response(data, status=status.HTTP_201_CREATED)


class ProcessWasteSimulateView(APIView):
    """One-shot combined pipeline for manual parameter simulation (React Sliders).
    Manual slider values -> validates features -> decides category -> logs record.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        features = manual_features(request.data)

        reading = SimulatedReading.objects.create(
            moisture_pct=features["moisture_pct"],
            combustibility_index=features["combustibility_index"],
            recyclability_score=features["recyclability_score"],
            rdf_suitability_score=features["rdf_suitability_score"],
            contamination_pct=features["contamination_pct"],
            is_manual_override=True,
        )

        category, trace, decision_confidence = decide_category(features, mode="hybrid")

        record = WasteRecord.objects.create(
            simulated_reading=reading,
            final_category=category,
            decision_confidence=decision_confidence,
            decision_breakdown=trace,
        )

        return Response(WasteRecordSerializer(record, context={"request": request}).data, status=status.HTTP_201_CREATED)


class WasteRecordListView(generics.ListAPIView):
    """Paginated and filterable list of historical waste processing records."""
    queryset = WasteRecord.objects.all().select_related("image", "simulated_reading")
    serializer_class = WasteRecordSerializer
    filterset_class = WasteRecordFilter


class WasteRecordDetailView(generics.RetrieveAPIView):
    """Single waste processing record detail view."""
    queryset = WasteRecord.objects.all().select_related("image", "simulated_reading")
    serializer_class = WasteRecordSerializer
    lookup_field = "id"


class StatsSummaryView(APIView):
    """Dashboard analytics: total count, category breakdown, diversion rate."""
    permission_classes = [AllowAny]

    def get(self, request):
        qs = WasteRecord.objects.values("final_category").annotate(count=Count("id"))
        counts = {item["final_category"]: item["count"] for item in qs}

        # Ensure all category keys exist in response
        all_categories = ["RECYCLE", "BIO", "RDF", "REJECT"]
        by_category = {cat: counts.get(cat, 0) for cat in all_categories}

        total = sum(by_category.values())
        diverted = sum(count for cat, count in by_category.items() if cat != "REJECT")
        diversion_rate = round(100.0 * diverted / max(total, 1), 2)

        percentages = {
            cat: round(100.0 * count / max(total, 1), 1)
            for cat, count in by_category.items()
        }

        return Response({
            "total_processed": total,
            "by_category": by_category,
            "by_category_pct": percentages,
            "diversion_rate_pct": diversion_rate,
        })
