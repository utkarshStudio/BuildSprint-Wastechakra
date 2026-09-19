# WasteChakra — AI-Based Mixed Waste Detection & Routing System
### Complete Backend Specification (Django + Django REST Framework) — **100% Virtual / Software-Only Edition**
> This specification document can be provided to AI coding agents to guide or generate the full backend architecture.
> **Important:** This project is **fully software-simulated** — no physical cameras, sensors, GPIO, MQTT, or actuator hardware are required. Everything runs inside the web application environment (image uploads + virtual simulation engine).

---

## 1. Project Context

The repository contains a **React + Vite + Tailwind CSS** frontend that demonstrates a **Material Recovery Facility (MRF) simulation** (`src/simulation/engine.js`, `WasteChakraSimulation.jsx`). It includes:

- `SimParams` — totalWaste, moisture, contamination, organic/plastic/metal fractions (controlled via interactive UI sliders).
- `routeMaterial()` — routes material to destinations using rules.
- Real-time client-side simulation numbers, now backed by a live Django DRF backend.

**Core Architectural Goal:** Convert this routing logic into a **real Django DRF backend** while keeping it **fully virtual and software-driven**:
1. Users **upload waste images** (via webcam snapshots in the browser or file upload) **or** provide direct simulation parameters (matching manual sliders).
2. A **computer vision model / optical classifier** (or a smart heuristic virtual classifier fallback) predicts material classifications and localization bounding boxes.
3. A **virtual feature-generation engine** (pure software, no physical sensors) derives realistic physical metrics: **Moisture %, Combustibility Index, Recyclability Score, and RDF Suitability Score**.
4. The **Decision Engine** evaluates these parameters to determine the final stream: **Recycle / Bio / RDF / Reject**.
5. Results are persisted in the database and surfaced across dashboards and analytics APIs.

**No physical hardware is involved at any stage** — no microcontroller boards, no physical moisture/gas sensors, no servos/actuators, and no GPIO/MQTT dependencies. Everything executes as pure software within the Django backend.

---

## 2. High-Level Architecture (Fully Virtual)

```
        ┌───────────────────────────────────────────┐
        │   React Frontend                          │
        │   - Image upload widget (drag/drop or      │
        │     browser webcam snapshot → file)        │
        │   - OR "Simulate Waste" form (manual        │
        │     sliders — matching interactive UI)     │
        └───────────────────┬─────────────────────────┘
                            │ POST /api/v1/pipeline/process/
                            ▼
        ┌───────────────────────────────────────────┐
        │              DJANGO + DRF BACKEND          │
        │              (fully software, no hardware)  │
        │                                             │
        │  ┌─────────────┐   ┌─────────────────────┐ │
        │  │  detection/  │   │     analysis/       │ │
        │  │  app         │──▶│     app             │ │
        │  │ (image ->    │   │ (virtual feature     │ │
        │  │  material    │   │  generator:          │ │
        │  │  class, ML   │   │  moisture,           │ │
        │  │  or optical  │   │  combustibility,     │ │
        │  │  classifier) │   │  recyclability,      │ │
        │  └─────────────┘   │  RDF suitability)     │ │
        │                     └──────────┬──────────┘ │
        │                                ▼             │
        │                    ┌──────────────────────┐ │
        │                    │   decision_engine/   │ │
        │                    │   app (rule engine + │ │
        │                    │   weighted scoring)  │ │
        │                    └──────────┬───────────┘ │
        │                                ▼             │
        │                    ┌──────────────────────┐ │
        │                    │   waste_records/     │ │
        │                    │   app (DB storage,   │ │
        │                    │   history, stats)     │ │
        │                    └──────────────────────┘ │
        └───────────────────────────────────────────┘
                                │
                                ▼
                 React dashboard (charts, history,
                 category-wise stats) — fully virtual
```

**No hardware layer is required.** The camera integration refers strictly to standard browser-based file uploads or webcam frame grabs — no Raspberry Pi, ESP32, or physical sensor boards are involved.

---

## 3. Tech Stack (Software-Only)

| Layer | Technology |
|---|---|
| Backend framework | Django 6.x + Django REST Framework |
| Auth | JWT Authentication (SimpleJWT) + open public routes (`AllowAny`) |
| Database | PostgreSQL (production) / SQLite (development) |
| Image storage | Django `ImageField` + local media filesystem (Cloudinary-ready) |
| ML inference | Google Gemini Multimodal Vision API + local Optical Classifier fallback |
| Fallback classifier | Rule-based **optical & spatial segmentation engine** analyzing real image color, specular highlights, and edge density |
| Async/background | Background threads & asynchronous workers for model training simulations |
| Realtime updates | REST APIs + dynamic polling / WebSocket hooks |
| API documentation | `drf-spectacular` (OpenAPI 3.0 / Swagger UI) |

---

## 4. Django Project & App Structure

```
backend/
├── manage.py
├── requirements.txt
├── .env.example
├── config/
│   ├── settings.py         # unified settings file
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   ├── detection/                 # uploaded image -> material detection & AI training
│   │   ├── models.py               # WasteImage, AITrainingSample, ModelVersion
│   │   ├── ml/
│   │   │   ├── optical_classifier.py # HSV specular reflection & spatial segmentation
│   │   │   └── virtual_classifier.py
│   │   ├── yolo_service/
│   │   │   ├── gemini_vision_service.py # Gemini 2.5/Flash & optical routing
│   │   │   └── routing_rules.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── analysis/                  # virtual feature-generation engine
│   │   ├── models.py                # SimulatedReading
│   │   ├── services.py              # generate_moisture(), generate_combustibility(), etc.
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── decision_engine/           # core business logic: category decision
│   │   ├── engine.py                # decide_category(features) -> Recycle/Bio/RDF/Reject
│   │   ├── rules.py                  # threshold + weighted-scoring rules
│   │   ├── models.py                  # DecisionConfig (tunable thresholds, DB-backed)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   └── waste_records/             # persistence + history + dashboard stats
│       ├── models.py                # WasteRecord (pipeline result)
│       ├── serializers.py
│       ├── views.py                  # GET /api/v1/records/, /api/v1/stats/summary/
│       ├── filters.py
│       └── urls.py
│
├── media/                         # uploaded waste images
└── tests/
```

---

## 5. Core Data Model

### 5.1 Enums & Core Models (`apps/waste_records/models.py`)

```python
import uuid
from django.db import models


class WasteCategory(models.TextChoices):
    RECYCLE = "RECYCLE", "Recyclable"
    BIO = "BIO", "Biodegradable / Compost"
    RDF = "RDF", "Refuse Derived Fuel"
    REJECT = "REJECT", "Non-processable / Needs Manual Review"


class MaterialType(models.TextChoices):
    PLASTIC = "PLASTIC", "Plastic"
    PAPER = "PAPER", "Paper / Cardboard"
    METAL = "METAL", "Metal"
    GLASS = "GLASS", "Glass"
    ORGANIC = "ORGANIC", "Organic / Food Waste"
    TEXTILE = "TEXTILE", "Textile / Cloth"
    E_WASTE = "E_WASTE", "Electronic Waste"
    MIXED = "MIXED", "Mixed / Unidentified"


class WasteImage(models.Model):
    """User-uploaded image (via browser file-input or webcam snapshot).
    Purely a web upload — no physical camera hardware or drivers involved."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to="waste_images/%Y/%m/%d/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    source = models.CharField(
        max_length=20,
        choices=[("UPLOAD", "File Upload"), ("WEBCAM", "Browser Webcam Snapshot"),
                  ("SIMULATED", "Manual Simulation, No Image")],
        default="UPLOAD",
    )
    detected_material = models.CharField(
        max_length=20, choices=MaterialType.choices, default=MaterialType.MIXED
    )
    detection_confidence = models.FloatField(default=0.0)   # 0.0 - 1.0
    raw_model_output = models.JSONField(default=dict, blank=True)  # class-probabilities


class SimulatedReading(models.Model):
    """Virtually generated feature values — software-derived, not from physical sensors.
    Generated by apps/analysis/services.py based on material type
    (+ realistic variance, or manual override by user)."""
    image = models.OneToOneField(
        WasteImage, on_delete=models.CASCADE, related_name="simulated_reading", null=True, blank=True
    )
    moisture_pct = models.FloatField()          # 0 - 100 (virtual)
    combustibility_index = models.FloatField()  # 0 - 1 (virtual, calorific-value proxy)
    recyclability_score = models.FloatField()   # 0 - 1 (virtual)
    rdf_suitability_score = models.FloatField() # 0 - 1 (virtual)
    contamination_pct = models.FloatField(default=0.0)  # virtual
    is_manual_override = models.BooleanField(default=False)  # user manually provided values
    created_at = models.DateTimeField(auto_now_add=True)


class WasteRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ForeignKey(WasteImage, on_delete=models.CASCADE, related_name="records", null=True, blank=True)
    simulated_reading = models.ForeignKey(
        SimulatedReading, on_delete=models.SET_NULL, null=True, related_name="records"
    )
    final_category = models.CharField(max_length=20, choices=WasteCategory.choices)
    decision_confidence = models.FloatField(default=0.0)
    decision_breakdown = models.JSONField(default=dict)   # score-per-category, rule trace
    processed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-processed_at"]
        indexes = [models.Index(fields=["final_category", "processed_at"])]
```

---

## 6. Decision Engine — Core Logic

`apps/decision_engine/rules.py`

### 6.1 Feature Inputs (Software-Generated)
```
moisture_pct            : 0 - 100
combustibility_index    : 0.0 - 1.0
recyclability_score     : 0.0 - 1.0
rdf_suitability_score   : 0.0 - 1.0
contamination_pct       : 0 - 100
detected_material       : enum (PLASTIC, PAPER, METAL, GLASS, ORGANIC, TEXTILE, E_WASTE, MIXED)
detection_confidence    : 0.0 - 1.0
```

### 6.2 Rule-Based Decision Tree

```python
def rule_based_decision(features: dict) -> tuple[str, dict]:
    """
    Returns (category, trace) where category in {RECYCLE, BIO, RDF, REJECT}
    trace = explanation dictionary for auditability and dashboard inspection.
    """
    material = features["detected_material"]
    moisture = features["moisture_pct"]
    combustibility = features["combustibility_index"]
    recyclability = features["recyclability_score"]
    rdf_score = features["rdf_suitability_score"]
    contamination = features["contamination_pct"]
    confidence = features["detection_confidence"]

    trace = {"material": material, "rules_fired": []}

    # 0. Low-confidence detection -> flag for manual review
    if confidence < 0.4:
        trace["rules_fired"].append("low_confidence_detection")
        return "REJECT", trace

    # 1. Hard material-based overrides
    if material in ("METAL", "GLASS", "E_WASTE"):
        trace["rules_fired"].append(f"material_override_{material}")
        return "RECYCLE", trace

    # 2. High moisture / organic -> Bio (composting/biogas)
    if material == "ORGANIC" or moisture > 55:
        trace["rules_fired"].append("high_moisture_or_organic")
        return "BIO", trace

    # 3. High recyclability + low contamination -> Recycle
    if recyclability >= 0.65 and contamination <= 30:
        trace["rules_fired"].append("high_recyclability_low_contamination")
        return "RECYCLE", trace

    # 4. High combustibility + high RDF suitability + low moisture -> RDF
    if combustibility >= 0.55 and rdf_score >= 0.5 and moisture < 40:
        trace["rules_fired"].append("high_combustibility_rdf_fit")
        return "RDF", trace

    # 5. Contaminated plastics/paper that cannot be recycled cleanly -> RDF
    if material in ("PLASTIC", "PAPER", "TEXTILE") and contamination > 30:
        trace["rules_fired"].append("contaminated_combustible_to_rdf")
        return "RDF", trace

    # 6. Fallback
    trace["rules_fired"].append("fallback_reject")
    return "REJECT", trace
```

### 6.3 Weighted Scoring Model (Tunable Mode)

```python
CATEGORY_WEIGHTS = {
    "RECYCLE": {"recyclability_score": 0.6, "combustibility_index": -0.1,
                "moisture_pct": -0.1, "contamination_pct": -0.2},
    "BIO":     {"moisture_pct": 0.5, "combustibility_index": -0.2,
                "recyclability_score": -0.1, "organic_flag": 0.4},
    "RDF":     {"combustibility_index": 0.5, "rdf_suitability_score": 0.4,
                "moisture_pct": -0.3, "recyclability_score": -0.2},
}

def normalize(features: dict) -> dict:
    f = dict(features)
    f["moisture_pct"] = f["moisture_pct"] / 100
    f["contamination_pct"] = f["contamination_pct"] / 100
    f["organic_flag"] = 1.0 if f["detected_material"] == "ORGANIC" else 0.0
    return f

def weighted_decision(features: dict) -> tuple[str, dict]:
    f = normalize(features)
    scores = {}
    for category, weights in CATEGORY_WEIGHTS.items():
        score = sum(weights.get(k, 0) * f.get(k, 0) for k in weights)
        scores[category] = round(max(score, 0), 4)

    if f["detected_material"] in ("METAL", "GLASS", "E_WASTE"):
        return "RECYCLE", {"scores": scores, "override": f["detected_material"]}

    best_category = max(scores, key=scores.get)
    if scores[best_category] < 0.25:
        return "REJECT", {"scores": scores, "reason": "low_score_all_categories"}
    return best_category, {"scores": scores}


def decide_category(features: dict, mode: str = "hybrid") -> tuple[str, dict, float]:
    """mode: 'rule' | 'weighted' | 'hybrid' (default)"""
    from .rules import rule_based_decision

    if mode == "rule":
        cat, trace = rule_based_decision(features)
        conf = 0.8
    elif mode == "weighted":
        cat, trace = weighted_decision(features)
        conf = max(trace.get("scores", {}).values(), default=0.5)
    else:  # hybrid
        cat, trace = rule_based_decision(features)
        if cat == "REJECT":
            cat2, trace2 = weighted_decision(features)
            if cat2 != "REJECT":
                cat, trace = cat2, {**trace, "weighted_fallback": trace2}
        conf = trace.get("scores", {}).get(cat, 0.75) if "scores" in trace else 0.75

    return cat, trace, conf
```

---

## 7. Virtual Feature-Generation Engine

This module models sensor outputs in pure software based on material physics profiles and contextual parameters.

`apps/analysis/services.py`

```python
import random

MATERIAL_BASELINE = {
    # material: (moisture_baseline, combustibility, recyclability, rdf_suitability)
    "PLASTIC":  (5,  0.75, 0.70, 0.65),
    "PAPER":    (15, 0.65, 0.60, 0.55),
    "METAL":    (2,  0.05, 0.95, 0.05),
    "GLASS":    (2,  0.02, 0.90, 0.02),
    "ORGANIC":  (65, 0.20, 0.10, 0.15),
    "TEXTILE":  (10, 0.60, 0.35, 0.60),
    "E_WASTE":  (3,  0.10, 0.85, 0.05),
    "MIXED":    (30, 0.40, 0.40, 0.40),
}

def generate_virtual_features(
    material: str,
    detection_confidence: float,
    contamination_pct: float | None = None,
    add_noise: bool = True,
) -> dict:
    """Simulates physical characteristics based on established baseline profiles.
    add_noise introduces realistic variation so sequential batches reflect natural diversity."""
    moisture, combustibility, recyclability, rdf = MATERIAL_BASELINE.get(
        material, MATERIAL_BASELINE["MIXED"]
    )
    if contamination_pct is None:
        contamination_pct = random.uniform(10, 40)

    if add_noise:
        moisture = _jitter(moisture, 8)
        combustibility = _jitter(combustibility, 0.08, lo=0, hi=1)
        recyclability = _jitter(recyclability, 0.08, lo=0, hi=1)
        rdf = _jitter(rdf, 0.08, lo=0, hi=1)

    # Contamination slightly penalizes clean mechanical recycling and routes towards RDF
    recyclability = max(0, recyclability - contamination_pct / 200)
    rdf = min(1, rdf + contamination_pct / 300)

    return {
        "detected_material": material,
        "detection_confidence": detection_confidence,
        "moisture_pct": round(moisture, 1),
        "combustibility_index": round(combustibility, 3),
        "recyclability_score": round(recyclability, 3),
        "rdf_suitability_score": round(rdf, 3),
        "contamination_pct": round(contamination_pct, 1),
    }


def _jitter(value: float, spread: float, lo: float = 0, hi: float = 100) -> float:
    return max(lo, min(hi, value + random.uniform(-spread, spread)))


def manual_features(payload: dict) -> dict:
    """Directly accepts manual parameters from the simulation interface."""
    return {
        "detected_material": payload.get("detected_material", "MIXED"),
        "detection_confidence": 1.0,
        "moisture_pct": float(payload["moisture_pct"]),
        "combustibility_index": float(payload["combustibility_index"]),
        "recyclability_score": float(payload["recyclability_score"]),
        "rdf_suitability_score": float(payload["rdf_suitability_score"]),
        "contamination_pct": float(payload.get("contamination_pct", 0)),
    }
```

Two operational modes are supported:
- **Auto Mode**: Image upload → Optical/Gemini Vision classification → `generate_virtual_features()`.
- **Manual Simulation Mode**: Direct input sliders for moisture, combustibility, etc. → `manual_features()`.

Both pipelines execute through the same `decision_engine` rules.

---

## 8. Image Classification Options

### Option A — Multimodal Vision API (Google Gemini)
Enables semantic object detection, localized bounding boxes (`box_2d`), confidence metrics, and circular economy disposal reasoning directly via the Google Gemini API.

### Option B — Local Optical Classifier Fallback
Runs a spatial and physical optical classifier using Python (Pillow + HSV analysis). Measures specular highlight reflectivity (identifying plastic polymers and metallic cans), color temperature, and surface edge texture directly on image pixels without external network dependencies.

---

## 9. API Endpoints (DRF)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/` | Service status overview and directory of active API endpoints |
| `GET` | `/api/schema/swagger-ui/` | Interactive OpenAPI / Swagger UI documentation |
| `POST` | `/api/v1/detection/detect/` | Upload image → returns material class and confidence |
| `POST` | `/api/v1/analysis/generate/` | Generates 4 simulated features for a given material |
| `POST` | `/api/v1/analysis/manual/` | Validates manually supplied simulation parameters |
| `POST` | `/api/v1/decision/decide/` | Evaluates features → returns final stream recommendation |
| `POST` | `/api/v1/pipeline/process/` | **Full image pipeline**: upload → classification → features → decision → persistence |
| `POST` | `/api/v1/pipeline/simulate/` | **Simulation pipeline**: manual parameters → decision → persistence |
| `GET` | `/api/v1/records/` | Paginated waste records with date and category filters |
| `GET` | `/api/v1/records/{id}/` | Detailed waste record with image URL and decision breakdown |
| `GET` | `/api/v1/stats/summary/` | Aggregated metrics: total processed, diversion rates, category distribution |
| `GET` | `/api/v1/rewards/` | Rewards catalog with user points ledger and streak count |
| `POST` | `/api/v1/rewards/redeem/` | Redeem Chakra points for eco-vouchers |
| `GET` | `/api/v1/community/events/` | Community cleanup drives and volunteer initiatives |
| `POST` | `/api/v1/community/events/{id}/join/` | Register for community drives and earn bonus Chakra points |

---

## 10. Dashboard & Analytics Endpoints

```python
class StatsSummaryView(APIView):
    def get(self, request):
        from django.db.models import Count
        qs = WasteRecord.objects.values("final_category").annotate(count=Count("id"))
        total = sum(item["count"] for item in qs)
        return Response({
            "total_processed": total,
            "by_category": {item["final_category"]: item["count"] for item in qs},
            "diversion_rate_pct": round(
                100 * sum(i["count"] for i in qs if i["final_category"] != "REJECT") / max(total, 1), 2
            ),
        })
```

---

## 11. Environment Configuration (`.env.example`)

```env
DEBUG=True
SECRET_KEY=django-insecure-wzvz_q#yb)&9wt(pfjx0!=meirp@@204x$i3nadidcgnt-363i
DATABASE_URL=sqlite:///dev.sqlite3
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

---

## 12. Testing Strategy

- **Unit Tests**: Verifies rule combinations and edge cases across the decision engine (moisture boundaries, high contamination thresholds, low confidence fallbacks).
- **Integration Tests**: Tests the complete image processing and manual simulation pipelines end-to-end.
- **Hardware Independence**: Fully testable through automated unit suites with synthetic payloads and sample images.
