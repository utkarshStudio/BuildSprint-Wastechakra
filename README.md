# WasteChakra — AI-Based Mixed Waste Detection & Routing System
### Complete Backend Specification (Django + Django REST Framework) — **100% Virtual / Software-Only Edition**
> This specification document can be provided to Antigravity (or any AI coding assistant) to build, run, or extend the entire backend project.
> **Important:** This project is **fully software-simulated** — no physical cameras, sensors, GPIO pins, MQTT brokers, or mechanical actuators are required. The entire workflow runs within the web application (image upload / webcam capture + virtual simulation engine).

---

## 1. Project Context

The frontend application (`wastechakra-web`) is a modern **React + Vite** single-page application that provides a comprehensive **Material Recovery Facility (MRF) simulation** and operations platform (`src/simulation/engine.js`, `WasteChakraSimulation.jsx`). It includes:

- `SimParams` — totalWaste, moisture, contamination, and material fractions (controlled via UI sliders).
- `routeMaterial()` — rules routing materials to their respective processing destinations.
- Original simulation numbers were computed entirely client-side without persistent backend storage.

**Goal:** Transform this routing logic into a robust **Django REST Framework (DRF) backend** while maintaining a **100% virtual / software-only** architecture:
1. Users **upload an image** of waste (captured via browser webcam snapshot or selected from local storage), **or** provide direct simulation parameters (matching the UI sliders).
2. A **computer vision / ML model** (or a **smart virtual classification fallback**) detects the material class from the image.
3. A **Virtual Feature Generation Engine** generates realistic parameters based on the material type and upload metadata: **Moisture %, Combustibility Index, Recyclability Score, and RDF Suitability Score**.
4. The **Decision Engine** evaluates these parameters to determine the final routing category: **Recycle / Bio / RDF / Reject**.
5. Results are persisted to the database and exposed via REST APIs for dashboards and analytics.

**Zero physical hardware dependencies:** No Raspberry Pi, no microcontrollers, no external sensor modules, no servos, no GPIO pins, and no MQTT broker. All processing takes place within the Django backend and React frontend.

---

## 2. High-Level Architecture (Fully Virtual)

```
        ┌───────────────────────────────────────────┐
        │              React Frontend               │
        │   - Image upload widget (drag/drop or      │
        │     browser webcam snapshot → file)        │
        │   - OR "Simulate Waste" form (manual        │
        │     sliders matching the simulation UI)    │
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
        │  │  or virtual  │   │  combustibility,     │ │
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
                 category-wise statistics)
```

**No hardware layer:** Camera input refers exclusively to browser-side image upload or HTML5 webcam capture — no physical camera modules or embedded drivers are involved.

---

## 3. Tech Stack (Software-Only)

| Layer | Technology |
|---|---|
| Backend Framework | Django 5.x / 6.x + Django REST Framework |
| Authentication | Open API endpoints (`AllowAny` permission for core classification and routing) |
| Database | SQLite (development) / PostgreSQL (production) via `dj-database-url` |
| Image Storage | Django `ImageField` + local media storage (or Cloudinary for cloud deployments) |
| ML Inference | PyTorch / TensorFlow / Gemini Vision API running server-side |
| Fallback Classifier | Rule-based **virtual classifier** utilizing image statistics (average color, brightness) |
| Async / Background | Celery + Redis (optional, for asynchronous queue processing) |
| Realtime Updates | Django Channels (WebSocket) for live dashboard streaming |
| API Documentation | `drf-spectacular` (OpenAPI / Swagger) |

**Excluded from this software edition:**
- `actuator` app, GPIO libraries, MQTT client, Raspberry Pi scripts, and physical servo/bin hardware.
- Mandatory JWT / login barriers on core evaluation endpoints (`AllowAny` permission enabled for seamless access).
- Multi-tier configuration split: streamlined into a single clean `settings.py`.

---

## 4. Project & App Structure

```
WasteChakra/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── build.sh
│   ├── config/
│   │   ├── settings.py         # Unified settings configuration
│   │   ├── urls.py
│   │   ├── asgi.py             # ASGI entrypoint (optional Channels support)
│   │   └── wsgi.py
│   │
│   ├── apps/
│   │   ├── detection/          # Image upload -> material classification
│   │   │   ├── models.py       # WasteImage
│   │   │   ├── ml/             # Model loaders, inference, and virtual classifier
│   │   │   ├── serializers.py
│   │   │   ├── views.py        # POST /api/v1/detection/
│   │   │   └── urls.py
│   │   │
│   │   ├── analysis/           # Virtual feature-generation engine
│   │   │   ├── models.py       # SimulatedReading
│   │   │   ├── services.py     # Synthetic moisture, combustibility, recyclability, RDF scores
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   ├── decision_engine/    # Core business logic: routing category decision
│   │   │   ├── engine.py       # decide_category(features) -> Recycle / Bio / RDF / Reject
│   │   │   ├── rules.py        # Threshold and weighted-scoring rules
│   │   │   ├── models.py       # DecisionConfig (tunable thresholds in DB)
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   │
│   │   ├── waste_records/      # Persistence, history, and dashboard analytics
│   │   │   ├── models.py       # WasteRecord (full pipeline result)
│   │   │   ├── serializers.py
│   │   │   ├── views.py        # GET /api/v1/records/, /api/v1/stats/summary/
│   │   │   ├── filters.py
│   │   │   └── urls.py
│   │   │
│   │   ├── accounts/           # User and collector profile management
│   │   └── pickups/            # Citizen waste pickup request scheduling
│   │
│   ├── media/                  # Uploaded waste images
│   └── staticfiles/
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── panels/             # Admin, Citizen, Collector, Facility dashboards
│   │   ├── services/           # Axios API connectors
│   │   ├── simulation/         # Interactive simulation engine & 3D visualization
│   │   └── waste_inspection_overlay/ # Interactive live pipeline inspection modal
│   └── public/
│
├── .gitignore
├── .npmrc
├── AGENTS.md
└── README.md
```

> **Note:** The pipeline concludes at `waste_records`. Final categories are stored in the database and visualized in real time on the React dashboard without sending physical commands to hardware actuators.

---

### 4.1 Single `settings.py` Configuration

The configuration is consolidated in `backend/config/settings.py` for clarity and maintainability:

```python
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "django_filters",

    "apps.accounts",
    "apps.detection",
    "apps.analysis",
    "apps.decision_engine",
    "apps.waste_records",
    "apps.pickups",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL", f'sqlite:///{BASE_DIR / "dev.sqlite3"}'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

CORS_ALLOW_ALL_ORIGINS = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
```

---

## 5. Core Data Models

### 5.1 Enums & Entity Schemas (`apps/waste_records/models.py`)

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
    """User-uploaded image (via browser file input or webcam snapshot).
    Purely a web upload — no physical camera hardware or embedded drivers."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ImageField(upload_to="waste_images/%Y/%m/%d/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    source = models.CharField(
        max_length=20,
        choices=[
            ("UPLOAD", "File Upload"),
            ("WEBCAM", "Browser Webcam Snapshot"),
            ("SIMULATED", "Manual Simulation, No Image"),
        ],
        default="UPLOAD",
    )
    detected_material = models.CharField(
        max_length=20, choices=MaterialType.choices, default=MaterialType.MIXED
    )
    detection_confidence = models.FloatField(default=0.0)   # 0.0 - 1.0
    raw_model_output = models.JSONField(default=dict, blank=True)  # Class probabilities


class SimulatedReading(models.Model):
    """Virtually generated feature values — calculated without physical sensors.
    Generated by apps/analysis/services.py based on material baseline profiles
    with controlled random variation or user overrides."""
    image = models.OneToOneField(
        WasteImage, on_delete=models.CASCADE, related_name="simulated_reading", null=True, blank=True
    )
    moisture_pct = models.FloatField()          # 0 - 100 (virtual)
    combustibility_index = models.FloatField()  # 0.0 - 1.0 (calorific value proxy)
    recyclability_score = models.FloatField()   # 0.0 - 1.0 (virtual)
    rdf_suitability_score = models.FloatField() # 0.0 - 1.0 (virtual)
    contamination_pct = models.FloatField(default=0.0)
    is_manual_override = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class WasteRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.ForeignKey(
        WasteImage, on_delete=models.CASCADE, related_name="records", null=True, blank=True
    )
    simulated_reading = models.ForeignKey(
        SimulatedReading, on_delete=models.SET_NULL, null=True, related_name="records"
    )
    final_category = models.CharField(max_length=20, choices=WasteCategory.choices)
    decision_confidence = models.FloatField(default=0.0)
    decision_breakdown = models.JSONField(default=dict)   # Score breakdown and rule trace
    processed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-processed_at"]
        indexes = [models.Index(fields=["final_category", "processed_at"])]
```

---

## 6. Decision Engine — Core Logic

`apps/decision_engine/rules.py`

### 6.1 Feature Inputs (Virtual / Software-Generated)
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
    Returns (category, trace) where category is in {RECYCLE, BIO, RDF, REJECT}
    trace = audit dictionary explaining which rules triggered.
    """
    material = features["detected_material"]
    moisture = features["moisture_pct"]
    combustibility = features["combustibility_index"]
    recyclability = features["recyclability_score"]
    rdf_score = features["rdf_suitability_score"]
    contamination = features["contamination_pct"]
    confidence = features["detection_confidence"]

    trace = {"material": material, "rules_fired": []}

    # 0. Low confidence detection -> Flag for manual review
    if confidence < 0.4:
        trace["rules_fired"].append("low_confidence_detection")
        return "REJECT", trace

    # 1. Non-combustible high-value material overrides
    if material in ("METAL", "GLASS", "E_WASTE"):
        trace["rules_fired"].append(f"material_override_{material}")
        return "RECYCLE", trace

    # 2. High moisture or organic waste -> Bio (composting / biomethanation)
    if material == "ORGANIC" or moisture > 55:
        trace["rules_fired"].append("high_moisture_or_organic")
        return "BIO", trace

    # 3. High recyclability with low contamination -> Recycle
    if recyclability >= 0.65 and contamination <= 30:
        trace["rules_fired"].append("high_recyclability_low_contamination")
        return "RECYCLE", trace

    # 4. High calorific value + RDF suitability + low moisture -> RDF
    if combustibility >= 0.55 and rdf_score >= 0.5 and moisture < 40:
        trace["rules_fired"].append("high_combustibility_rdf_fit")
        return "RDF", trace

    # 5. Contaminated combustibles unsuitable for clean recycling -> RDF
    if material in ("PLASTIC", "PAPER", "TEXTILE") and contamination > 30:
        trace["rules_fired"].append("contaminated_combustible_to_rdf")
        return "RDF", trace

    # 6. Fallback rejection
    trace["rules_fired"].append("fallback_reject")
    return "REJECT", trace
```

### 6.3 Weighted Scoring & Hybrid Engine

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
    """mode: 'rule' | 'weighted' | 'hybrid' (recommended default)"""
    from .rules import rule_based_decision

    if mode == "rule":
        cat, trace = rule_based_decision(features)
        conf = 0.8
    elif mode == "weighted":
        cat, trace = weighted_decision(features)
        conf = max(trace.get("scores", {}).values(), default=0.5)
    else:  # Hybrid: attempt rule-based first; fall back to weighted if rejected
        cat, trace = rule_based_decision(features)
        if cat == "REJECT":
            cat2, trace2 = weighted_decision(features)
            if cat2 != "REJECT":
                cat, trace = cat2, {**trace, "weighted_fallback": trace2}
        conf = trace.get("scores", {}).get(cat, 0.75) if "scores" in trace else 0.75

    return cat, trace, conf
```

### 6.4 Tunable Configuration Model (`apps/decision_engine/models.py`)

```python
class DecisionConfig(models.Model):
    """Singleton configuration row editable from the admin panel."""
    recyclability_threshold = models.FloatField(default=0.65)
    contamination_threshold = models.FloatField(default=30.0)
    combustibility_threshold = models.FloatField(default=0.55)
    rdf_threshold = models.FloatField(default=0.5)
    moisture_bio_threshold = models.FloatField(default=55.0)
    low_confidence_threshold = models.FloatField(default=0.4)
    decision_mode = models.CharField(
        max_length=10,
        choices=[("rule", "Rule-based"), ("weighted", "Weighted"), ("hybrid", "Hybrid")],
        default="hybrid",
    )
```

---

## 7. Virtual Feature-Generation Engine (Pure Software)

This service replaces physical IoT sensors with physics-grounded synthetic baseline profiles:

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
    """Pure software simulation of physical parameters based on baseline
    profiles for the detected material. Controlled jitter provides realistic
    variability across batches."""
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

    # Contamination degrades recyclability and adjusts RDF suitability
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
    """Passes user-supplied values from the 'Simulate Waste' form
    through validation directly without requiring an image or ML model."""
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
- **Auto Mode:** Image upload -> ML / Virtual Classifier detects material -> `generate_virtual_features()` generates parameters.
- **Manual / Simulation Mode:** Direct slider inputs from UI -> `manual_features()` formats inputs for the decision engine.

Both modes share the identical `decision_engine` pipeline and database schema.

---

## 8. Image Classification Options

### Option A — Machine Learning Vision Pipeline (High Accuracy)
`apps/detection/ml/inference.py` / `apps/detection/yolo_service/`

Runs server-side image classification (via Gemini Vision API, YOLO, or local PyTorch/TensorFlow models). Images are processed in server memory or on local disk with zero edge device deployment requirements.

### Option B — Virtual Classifier Fallback (Zero Training Setup)
`apps/detection/ml/virtual_classifier.py`

```python
from PIL import Image
import random

def virtual_classify(image_path: str) -> tuple[str, float, dict]:
    """Lightweight software classifier using RGB statistical distributions
    and heuristic thresholds. Provides instant end-to-end testing without
    requiring pre-trained weights."""
    img = Image.open(image_path).convert("RGB").resize((50, 50))
    pixels = list(img.getdata())
    avg_r = sum(p[0] for p in pixels) / len(pixels)
    avg_g = sum(p[1] for p in pixels) / len(pixels)
    avg_b = sum(p[2] for p in pixels) / len(pixels)

    materials = ["PLASTIC", "PAPER", "METAL", "GLASS", "ORGANIC", "TEXTILE"]
    if avg_g > avg_r and avg_g > avg_b:
        material = "ORGANIC"
    elif avg_r > 200 and avg_g > 200 and avg_b > 200:
        material = "PAPER"
    elif avg_r < 80 and avg_g < 80 and avg_b < 80:
        material = "METAL"
    else:
        material = random.choice(materials)

    confidence = round(random.uniform(0.6, 0.95), 2)
    all_probs = {m: round(random.uniform(0.05, 0.3), 2) for m in materials}
    all_probs[material] = confidence
    return material, confidence, all_probs
```

---

## 9. API Endpoints (DRF)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/detection/detect/` | Upload image → returns material class and confidence |
| `POST` | `/api/v1/analysis/generate/` | Given a material class → returns 4 generated virtual parameters |
| `POST` | `/api/v1/analysis/manual/` | Given manual slider inputs → returns validated parameters |
| `POST` | `/api/v1/decision/decide/` | Given parameters → returns routing category (`RECYCLE`/`BIO`/`RDF`/`REJECT`) |
| `POST` | `/api/v1/pipeline/process/` | **One-shot combined pipeline (image mode)**: Upload → Detect → Synthesize → Decide → Persist |
| `POST` | `/api/v1/pipeline/simulate/` | **One-shot combined pipeline (manual mode)**: Sliders → Synthesize → Decide → Persist |
| `GET` | `/api/v1/records/` | Paginated waste records history (filterable by category, date) |
| `GET` | `/api/v1/records/{id}/` | Single record detail with image URL and decision breakdown |
| `GET` | `/api/v1/stats/summary/` | Aggregated dashboard metrics: category distribution, diversion rate |
| `GET` | `/api/v1/config/decision-rules/` | Current decision thresholds and weights |
| `PATCH`| `/api/v1/config/decision-rules/` | Live update of decision thresholds without application redeployment |

### 9.1 Combined Pipeline — Image Mode

```python
class ProcessWasteImageView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        image_file = request.FILES["image"]
        source = request.data.get("source", "UPLOAD")

        # 1. Persist uploaded image
        waste_image = WasteImage.objects.create(image=image_file, source=source)

        # 2. Classify material
        material, confidence, all_probs = virtual_classify(waste_image.image.path)
        waste_image.detected_material = material
        waste_image.detection_confidence = confidence
        waste_image.raw_model_output = all_probs
        waste_image.save()

        # 3. Generate virtual parameters
        features = generate_virtual_features(material, confidence)
        reading = SimulatedReading.objects.create(
            image=waste_image,
            moisture_pct=features["moisture_pct"],
            combustibility_index=features["combustibility_index"],
            recyclability_score=features["recyclability_score"],
            rdf_suitability_score=features["rdf_suitability_score"],
            contamination_pct=features["contamination_pct"],
        )

        # 4. Evaluate routing decision
        category, trace, decision_confidence = decide_category(features, mode="hybrid")

        # 5. Persist final record
        record = WasteRecord.objects.create(
            image=waste_image,
            simulated_reading=reading,
            final_category=category,
            decision_confidence=decision_confidence,
            decision_breakdown=trace,
        )

        return Response(WasteRecordSerializer(record, context={"request": request}).data, status=201)
```

### 9.2 Combined Pipeline — Manual Simulation Mode

```python
class ProcessWasteSimulateView(APIView):
    def post(self, request):
        from apps.analysis.services import manual_features

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
        return Response(WasteRecordSerializer(record, context={"request": request}).data, status=201)
```

### 9.3 Sample JSON Response

```json
{
  "id": "8f3e9c2a-a921-4d32-b6f7-3e4b78912345",
  "image_url": "http://localhost:8000/media/waste_images/2026/09/20/sample.jpg",
  "material": "PLASTIC",
  "moisture_pct": 5.4,
  "combustibility_index": 0.71,
  "recyclability_score": 0.66,
  "rdf_suitability_score": 0.62,
  "final_category": "RECYCLE",
  "decision_confidence": 0.8,
  "decision_breakdown": {
    "material": "PLASTIC",
    "rules_fired": ["high_recyclability_low_contamination"]
  },
  "processed_at": "2026-09-20T14:10:00Z"
}
```

---

## 10. Dashboard & Analytics Summary

`apps/waste_records/views.py`

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

## 11. Optional Realtime Streaming (Django Channels)

To deliver instant live dashboard updates whenever a new waste record is evaluated:

```python
class WasteRecordConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("waste_records", self.channel_name)
        await self.accept()

    async def waste_record_created(self, event):
        await self.send_json(event["data"])
```

Connected via a Django `post_save` signal on `WasteRecord` to push updates over standard WebSocket connections directly to the React dashboard.

---

## 12. Requirements (`backend/requirements.txt`)

```
Django>=5.0
djangorestframework>=3.15
drf-spectacular
django-cors-headers
django-filter
Pillow
psycopg2-binary
python-dotenv
whitenoise
dj-database-url
google-generativeai  # For multimodal AI Vision
torch                # Optional: For local deep learning classification
```

---

## 13. Environment Configuration (`backend/.env`)

```ini
DEBUG=True
SECRET_KEY=django-insecure-key-here
ALLOWED_HOSTS=*
DATABASE_URL=sqlite:///c:/Users/utkar/OneDrive/Desktop/WasteChakra/backend/dev.sqlite3
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 14. Development Roadmap

1. **Phase 0 — Scaffold**: Configure Django project and apps (`detection`, `analysis`, `decision_engine`, `waste_records`, `accounts`, `pickups`), single unified `settings.py`, CORS, and DRF permissions.
2. **Phase 1 — Models & Migrations**: Define `WasteImage`, `SimulatedReading`, `WasteRecord`, and `DecisionConfig` schemas and apply database migrations.
3. **Phase 2 — Decision Engine**: Implement `rules.py`, `engine.py`, and comprehensive unit tests with feature dictionary payloads.
4. **Phase 3 — Virtual Analysis Engine**: Implement `generate_virtual_features()` and `manual_features()` with baseline material profiles.
5. **Phase 4 — Detection Service**: Deploy `virtual_classifier.py` and Gemini Vision integration for zero-hardware automated image classification.
6. **Phase 5 — Pipeline Endpoints**: Expose `/api/v1/pipeline/process/` (image mode) and `/api/v1/pipeline/simulate/` (manual mode).
7. **Phase 6 — Analytics & Records**: Implement paginated history, category filtering, and `/api/v1/stats/summary/`.
8. **Phase 7 — Frontend Integration**: Connect the React dashboard and the interactive 4-stage inspection overlay to the live backend endpoints.
9. **Phase 8 — Production Deployment**: Configure WhiteNoise static asset serving, environment variables, and deployment on cloud hosting platforms (e.g. Render, Vercel).

---

## 15. Testing Strategy

- **Unit Tests**: Test `decision_engine` rules covering all operational boundaries (e.g., moisture = 100%, contamination = 0%, low confidence scores).
- **Integration Tests**: Verify both pipeline endpoints (`process/` and `simulate/`) using `APITestCase` with mock image payloads and simulation inputs.
- **Pure Software Execution**: All test cases run without hardware fixtures or physical test benches.

---

## 16. Classification Categories

- **`RECYCLE`**: Clean recyclables (plastics, paper, metals, glass, e-waste) with low contamination suitable for mechanical or chemical recycling.
- **`BIO`**: High-moisture organic and food waste directed to composting or biomethanation/anaerobic digestion.
- **`RDF` (Refuse Derived Fuel)**: High-combustibility materials (contaminated plastics, multi-layer packaging, dry textiles) directed to industrial co-processing and energy recovery.
- **`REJECT`**: Low-confidence detections or unprocessable hazardous mixtures flagged for manual quality review.

---

### Quick Start Guide

#### 1. Start the Backend Server
```bash
cd backend
python manage.py runserver 127.0.0.1:8000
```
- API Root: `http://127.0.0.1:8000/api/v1/`
- Stats Summary: `http://127.0.0.1:8000/api/v1/stats/summary/`

#### 2. Start the Frontend Server
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`
