import os
import io
import json
import base64
import logging
import urllib.request
import urllib.error
from PIL import Image, ImageFilter, ImageStat
try:
    from ..ml.optical_classifier import analyze_image_optical
except ImportError:
    from apps.detection.ml.optical_classifier import analyze_image_optical
from .routing_rules import (
    determine_stream,
    generate_summary_points,
    STREAM_RECYCLABLE,
    STREAM_RDF,
    STREAM_ORGANIC,
    STREAM_LANDFILL,
)

logger = logging.getLogger(__name__)

# Default official Google Gemini endpoints
MODELS = [
    "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-flash-latest",
]


class GeminiVisionService:
    """Multimodal Vision AI Service for real waste classification, material localization,
    and circular economy stream routing.
    Supports both Google Gemini Multimodal Vision and Real Local Optical Spatial Segmentation.
    """

    @classmethod
    def analyze_waste_image(cls, image_path: str, custom_api_key: str = None) -> dict:
        """Analyzes an image and returns real localized items, coordinates, streams, and takeaways."""
        api_key = custom_api_key or os.environ.get("GEMINI_API_KEY", "").strip()

        # 1. If valid-looking Gemini API key is present, attempt real Gemini Vision API
        if api_key and len(api_key) > 20 and not api_key.startswith("your_"):
            gemini_result = cls._call_gemini_vision(image_path, api_key)
            if gemini_result:
                return gemini_result

        # 2. Fallback to Real Local Optical Spatial Segmentation on the actual image pixels
        logger.info(f"Running Real Local Optical Vision Engine on {image_path}")
        return cls._analyze_local_optical(image_path)

    @classmethod
    def classify_and_detect(cls, image_path_or_file, custom_api_key: str = None) -> dict:
        """Unified entrypoint for classification, material breakdown, and bounding boxes."""
        if isinstance(image_path_or_file, str):
            return cls.analyze_waste_image(image_path_or_file, custom_api_key=custom_api_key)
        # In-memory file or file-like object
        return analyze_image_optical(image_path_or_file)

    @classmethod
    def _call_gemini_vision(cls, image_path: str, api_key: str) -> dict | None:
        """Calls Google Gemini Vision REST API to detect objects and normalized bounding boxes."""
        try:
            with Image.open(image_path) as img:
                img_rgb = img.convert("RGB")
                orig_width, orig_height = img_rgb.size

                max_dim = 1024
                if max(orig_width, orig_height) > max_dim:
                    img_rgb.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

                buffer = io.BytesIO()
                img_rgb.save(buffer, format="JPEG", quality=85)
                b64_image = base64.b64encode(buffer.getvalue()).decode("utf-8")

            prompt = """You are an advanced industrial waste-sorting optical AI inspector for WasteChakra.
Analyze all visible waste/garbage objects in this image.
Detect every distinct individual waste item visible in the scene (for sparse scenes this may be 2-4 items, for typical mixed waste 6-10 items, and for dense heaps or conveyor belts 10-18+ items). Accurately reflect the true clutter, quantity, and individual items in this specific image — do NOT limit or clamp the object count to a fixed number.

For each distinct waste item found, return a JSON object with:
1. "label": Specific concise waste item name (e.g., "PET Bottle", "Aluminium Can", "Plastic Bag", "Food Waste", "Cardboard Box", "Bottle Cap", "Glass Bottle", "Styrofoam Cup", "Lays Chips Wrapper", "Tetra Pak", "Textile scrap").
2. "confidence": Confidence score between 0.70 and 0.99 based on optical clarity.
3. "stream": Exactly one of these 4 destination streams:
   - "RECYCLABLE": Metals (tin, aluminium), rigid clean plastics (PET, HDPE, PP bottles/tubs), clean cardboard/paper, glass.
   - "RDF": High-calorific multi-layer plastics, laminate pouches, chip/biscuit wrappers, dry flexible packaging suitable for Refuse-Derived Fuel.
   - "ORGANIC": Food scraps, fruit/vegetable peels, bio-waste, compostable cellulose matter.
   - "LANDFILL": Contaminated inert items, composite debris, ceramic, hazardous residue, non-recoverable matter.
4. "rationale": 1 concise sentence explaining the physical material and why it is routed to that stream.
5. "box_2d": Bounding box coordinates formatted as [ymin, xmin, ymax, xmax] with integer values normalized from 0 to 1000 (0=top/left, 1000=bottom/right).

Return strictly valid JSON with this exact structure:
{
  "objects": [
    {
      "label": "PET Plastic Bottle",
      "confidence": 0.94,
      "stream": "RECYCLABLE",
      "rationale": "Clear polymer suitable for mechanical flake re-granulation.",
      "box_2d": [120, 200, 480, 520]
    }
  ],
  "summary_points": [
    "Identified high-value recyclable polymers.",
    "Diverted packaging to RDF stream."
  ]
}
"""

            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": b64_image}}
                    ]
                }],
                "generationConfig": {
                    "response_mime_type": "application/json",
                    "temperature": 0.1,
                }
            }
            json_payload = json.dumps(payload).encode("utf-8")

            for model_name in MODELS:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
                req = urllib.request.Request(
                    url,
                    data=json_payload,
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )
                try:
                    with urllib.request.urlopen(req, timeout=16) as response:
                        if response.getcode() == 200:
                            raw_body = response.read().decode("utf-8")
                            res_data = json.loads(raw_body)
                            candidates = res_data.get("candidates", [])
                            if candidates:
                                text_content = ""
                                for part in candidates[0].get("content", {}).get("parts", []):
                                    if "text" in part:
                                        text_content += part["text"]

                                text_content = text_content.strip()
                                if text_content.startswith("```"):
                                    lines = text_content.splitlines()
                                    if lines[0].startswith("```"):
                                        lines = lines[1:]
                                    if lines and lines[-1].startswith("```"):
                                        lines = lines[:-1]
                                    text_content = "\n".join(lines).strip()

                                response_json = json.loads(text_content)
                                raw_objects = response_json.get("objects", [])
                                if raw_objects:
                                    return cls._format_detected_objects(
                                        raw_objects,
                                        response_json.get("summary_points", []),
                                        f"GOOGLE {model_name.upper()} VISION AI"
                                    )
                except Exception as e:
                    logger.warning(f"Gemini {model_name} attempt failed: {e}")
                    continue

            return None
        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            return None

    @classmethod
    def _analyze_local_optical(cls, image_path: str) -> dict:
        """Performs real spatial grid segmentation, edge detection, and color/texture analysis
        on the actual uploaded image pixels to identify and bound distinct objects.
        """
        try:
            return analyze_image_optical(image_path)
        except Exception as e:
            logger.error(f"Local optical vision analysis failed: {e}", exc_info=True)
            return analyze_image_optical(image_path)

    @classmethod
    def _format_detected_objects(cls, raw_objects: list, custom_summary: list, model_version: str) -> dict:
        """Formats and sanitizes detected objects for frontend consumption."""
        formatted = []
        for idx, item in enumerate(raw_objects):
            # Check if box is in Gemini [ymin, xmin, ymax, xmax] format
            box_2d = item.get("box_2d")
            if box_2d and len(box_2d) == 4:
                ymin = round(box_2d[0] / 10.0, 2)
                xmin = round(box_2d[1] / 10.0, 2)
                ymax = round(box_2d[2] / 10.0, 2)
                xmax = round(box_2d[3] / 10.0, 2)
                ymin = max(0.0, min(95.0, ymin))
                xmin = max(0.0, min(95.0, xmin))
                ymax = max(ymin + 5.0, min(100.0, ymax))
                xmax = max(xmin + 5.0, min(100.0, xmax))
                box = {
                    "xmin": xmin,
                    "ymin": ymin,
                    "width": round(xmax - xmin, 2),
                    "height": round(ymax - ymin, 2),
                }
            else:
                box = item.get("box", {"xmin": 25.0, "ymin": 25.0, "width": 30.0, "height": 30.0})

            conf = float(item.get("confidence", 0.88))
            stream = (item.get("stream") or "").upper()
            if stream not in [STREAM_RECYCLABLE, STREAM_RDF, STREAM_ORGANIC, STREAM_LANDFILL]:
                stream, default_rat = determine_stream(item.get("label", "Waste"), conf)
                rationale = item.get("rationale") or default_rat
            else:
                rationale = item.get("rationale", f"Classified into {stream} stream.")

            formatted.append({
                "id": item.get("id") or f"item-{idx + 1}",
                "label": item.get("label", "Waste Item"),
                "confidence": round(conf, 4),
                "confidence_pct": round(conf * 100, 1),
                "stream": stream,
                "rationale": rationale,
                "box": box,
            })

        stream_counts = {
            STREAM_RECYCLABLE: 0,
            STREAM_RDF: 0,
            STREAM_ORGANIC: 0,
            STREAM_LANDFILL: 0,
        }
        category_counts = {}
        for obj in formatted:
            s = obj["stream"]
            stream_counts[s] = stream_counts.get(s, 0) + 1
            # Infer material category from label/stream
            lbl = obj.get("label", "").lower()
            if "plastic" in lbl or "bottle" in lbl or "polymer" in lbl:
                cat = "Plastic"
            elif "food" in lbl or "organic" in lbl or "peel" in lbl or s == STREAM_ORGANIC:
                cat = "Organic"
            elif "paper" in lbl or "cardboard" in lbl or "box" in lbl:
                cat = "Paper"
            elif "can" in lbl or "metal" in lbl or "aluminium" in lbl:
                cat = "Metal"
            elif "textile" in lbl or "fabric" in lbl or "cloth" in lbl:
                cat = "Textile"
            elif "glass" in lbl:
                cat = "Glass"
            elif "circuit" in lbl or "electronic" in lbl or "wire" in lbl:
                cat = "E-Waste"
            elif s == STREAM_RDF:
                cat = "Plastic"
            else:
                cat = "Other / Mixed"
            category_counts[cat] = category_counts.get(cat, 0) + 1

        total_objs = len(formatted) or 1
        materials = [
            {"type": cat, "percentage": round((cnt / total_objs) * 100)}
            for cat, cnt in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
        ]
        if materials:
            diff = 100 - sum(m["percentage"] for m in materials)
            materials[0]["percentage"] += diff

        dominant_cat = materials[0]["type"] if materials else "Plastic"
        mat_code = dominant_cat.upper().replace(" / MIXED", "").replace("-", "_").replace(" ", "_")
        if "OTHER" in mat_code or "MIXED" in mat_code:
            mat_code = "MIXED"

        summary_points = custom_summary if custom_summary else generate_summary_points(formatted)

        return {
            "material": mat_code,
            "confidence": formatted[0]["confidence"] if formatted else 0.90,
            "materials": materials,
            "severity": "High" if mat_code in ["ORGANIC", "E_WASTE"] else "Medium",
            "estimated_quantity": f"{max(5, len(formatted) * 4)}-{max(10, len(formatted) * 4 + 8)} kg",
            "recommended_action": "Route to optical sorting & circular processing line.",
            "objects": formatted,
            "total_detected": len(formatted),
            "stream_counts": stream_counts,
            "summary_points": summary_points,
            "model_version": model_version,
        }
