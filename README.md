# WasteChakra — AI-Based Mixed Waste Detection & Routing System
### Complete Backend Specification (Django + Django REST Framework) — **100% Virtual / Software-Only Edition**
> Is document ko Antigravity (ya kisi bhi AI coding agent) ko de kar pura backend project generate karwaya ja sakta hai.
> **Important:** Ye project **poori tarah software-simulated** hai — koi physical camera, sensor, GPIO, MQTT, ya actuator hardware ki zaroorat nahi hai. Sab kuch web app ke andar hi (image upload + virtual simulation engine) chalega.

---

## 1. Project ka Context (existing repo se)

Uploaded repo (`wastechakra-v2`) abhi ek **React + TypeScript + Vite** frontend hai jo ek **Material Recovery Facility (MRF) simulation** dikhata hai (`src/simulation/engine.ts`, `WasteChakraSimulation.tsx`). Isme:

- `SimParams` — totalWaste, moisture, contamination, organic/plastic/metal fraction (UI sliders se aate hain)
- `routeMaterial()` — hardcoded rules se material ko destination me route karta hai
- Ye sab **client-side JavaScript me simulated numbers** hain, koi backend nahi hai.

**Naya goal:** Isi routing-logic ko ek **real Django DRF backend** me convert karna — lekin **fully virtual/software** rehte hue**:
1. User waste ki **image upload** kare (webcam se browser me photo le sakte ho, ya koi bhi image file), **ya** direct simulation parameters (jaisa purane sliders me tha) de
2. Ek **software ML/CV model** (ya, agar model nahi training karna, ek **smart virtual-classification module**) us image se material type predict kare
3. **Virtual feature-generation engine** (koi physical sensor nahi) material-type + upload-metadata se realistic **Moisture %, Combustibility Index, Recyclability Score, RDF Suitability Score** generate kare
4. **Decision Engine** in values ko combine karke final category decide kare: **Recycle / Bio / RDF**
5. Result database me store ho, aur dashboard/API se analytics ke roop me dikhe

**Koi bhi step me physical hardware involve nahi hai** — na camera module, na moisture/gas sensor, na servo/actuator, na GPIO/MQTT. Sab kuch Django backend ke andar pure software logic se hota hai.

---

## 2. High-Level Architecture (Fully Virtual)

```
        ┌───────────────────────────────────────────┐
        │   React Frontend (existing wastechakra-v2) │
        │   - Image upload widget (drag/drop or      │
        │     browser webcam snapshot → file)        │
        │   - OR "Simulate Waste" form (manual        │
        │     sliders — matches your current UI)      │
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
                 category-wise stats) — sab virtual/software
```

**No hardware layer at all.** Camera ka matlab yaha sirf "user browser se image upload/webcam-snapshot bhejta hai" hai — koi Raspberry Pi, ESP32, ya physical sensor board involved nahi.

---

## 3. Tech Stack (software-only)

| Layer | Technology |
|---|---|
| Backend framework | Django 5.x + Django REST Framework |
| Auth | **Not required** — project fully open, no login/permission system |
| Database | PostgreSQL (prod) / SQLite (dev) |
| Image storage | Django `ImageField` + local media folder (S3 optional, still pure software) |
| ML inference | PyTorch / TensorFlow(-Lite) image-classification model — runs on server CPU/GPU, **not** on any edge/physical device |
| Fallback (no-ML mode) | Rule-based **virtual classifier** using simple image stats (avg color, brightness) or manual category selection — useful if you don't want to train a real ML model at all |
| Async/background | Celery + Redis (optional, for queueing image-processing jobs) |
| Realtime updates | Django Channels (WebSocket) — dashboard live-refresh ke liye (still just software, browser ↔ server) |
| API docs | `drf-spectacular` (OpenAPI/Swagger) |

**Hataya gaya (removed) is version me:**
- `actuator` app, GPIO code, MQTT client, Raspberry Pi capture script, servo/bin-routing hardware — ye sab is spec me nahi hai kyunki project fully virtual rakhna hai.
- `accounts` app, JWT/Token auth, login/permission system — **poora project bina authentication ke** hai, sab API endpoints open/public rahenge (`AllowAny` permission).
- `settings.py` ko base/dev/prod me split nahi kiya gaya — ek hi simple `settings.py` file rakhi gayi hai.

---

## 4. Django Project & App Structure

```
wastechakra_backend/
├── manage.py
├── requirements.txt
├── .env.example
├── wastechakra_backend/
│   ├── settings.py         # single plain settings file (no base/dev/prod split)
│   ├── urls.py
│   ├── asgi.py               # Channels ke liye (optional realtime)
│   └── wsgi.py
│
├── apps/
│   ├── detection/                 # uploaded image -> material detection (pure software)
│   │   ├── models.py               # WasteImage
│   │   ├── ml/
│   │   │   ├── model_loader.py     # loads ML model once (singleton), OR
│   │   │   ├── inference.py         # run_inference(image) -> material probs
│   │   │   ├── virtual_classifier.py # no-ML fallback: heuristic/random-but-realistic classifier
│   │   │   └── preprocessing.py
│   │   ├── serializers.py
│   │   ├── views.py                 # POST /api/detect/
│   │   └── urls.py
│   │
│   ├── analysis/                  # virtual feature-generation engine
│   │   ├── models.py                # SimulatedReading
│   │   ├── services.py              # generate_moisture(), generate_combustibility(),
│   │   │                             # generate_recyclability(), generate_rdf_suitability()
│   │   ├── serializers.py
│   │   ├── views.py                  # POST /api/analysis/
│   │   └── urls.py
│   │
│   ├── decision_engine/           # core business logic: category decision
│   │   ├── engine.py                # decide_category(features) -> Recycle/Bio/RDF
│   │   ├── rules.py                  # threshold + weighted-scoring rules (config driven)
│   │   ├── models.py                  # DecisionConfig (tunable thresholds, DB-backed)
│   │   ├── serializers.py
│   │   ├── views.py                    # POST /api/decision/ (or called internally)
│   │   └── urls.py
│   │
│   └── waste_records/             # persistence + history + dashboard stats
│       ├── models.py                # WasteRecord (full pipeline result)
│       ├── serializers.py
│       ├── views.py                  # GET /api/records/, /api/stats/
│       ├── pipeline_urls.py           # combined one-shot endpoint
│       ├── filters.py
│       └── urls.py
│
├── ml_models/                     # trained model files (.h5/.pt) — optional, gitignored
├── media/                          # uploaded waste images
└── tests/
```

Note: `actuator/` aur `accounts/` apps **not** part of this structure hain — sab kuch `waste_records` tak khatam ho jaata hai. Result sirf database me store hota hai aur dashboard me dikhta hai, kisi hardware ko command nahi bhejta, aur koi login/permission layer bhi nahi hai — saare endpoints seedhe accessible hain.

### 4.1 Single `settings.py` (no base/dev/prod split)

Puri config ek hi file me rahegi — chhoti/medium project ke liye ye kaafi simple aur maintain karne me easy hai.

```python
# wastechakra_backend/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",          # Django internally needs this even without app-level auth use
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "django_filters",

    "apps.detection",
    "apps.analysis",
    "apps.decision_engine",
    "apps.waste_records",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "wastechakra_backend.urls"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

WSGI_APPLICATION = "wastechakra_backend.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
    # Prod me PostgreSQL chahiye to yaha directly values daal do
    # (ya DATABASE_URL env var parse kar lo dj-database-url se) — alag prod.py file
    # banane ki zaroorat nahi.
}

# --- REST FRAMEWORK: authentication/permissions poori tarah open ---
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",   # no login required, anyone can call APIs
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [],         # no auth backend enabled
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")

STATIC_URL = "static/"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
```

> Note: `django.contrib.auth` Django framework internally require karta hai (admin panel, sessions ke liye), lekin isse **kisi bhi API endpoint pe login/permission enforce nahi kiya jaa raha** — `AllowAny` + empty `DEFAULT_AUTHENTICATION_CLASSES` isko fully open rakhte hain. Django admin (`/admin/`) ke liye ek superuser bana sakte ho agar chaho (`createsuperuser`), lekin ye optional hai, sirf apna data dekhne ke liye.

---

## 5. Core Data Model

### 5.1 Enums & core models (apps/waste_records/models.py)

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
    Purely a web upload — no physical camera hardware/driver involved."""
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
    detection_confidence = models.FloatField(default=0.0)   # 0-1
    raw_model_output = models.JSONField(default=dict, blank=True)  # class-probabilities


class SimulatedReading(models.Model):
    """Virtually generated feature values — NOT from a physical sensor.
    Generated by apps/analysis/services.py based on material type
    (+ optional randomness/noise for realism, or manual override by user)."""
    image = models.OneToOneField(
        WasteImage, on_delete=models.CASCADE, related_name="simulated_reading", null=True, blank=True
    )
    moisture_pct = models.FloatField()          # 0-100 (virtual)
    combustibility_index = models.FloatField()  # 0-1 (virtual, calorific-value proxy)
    recyclability_score = models.FloatField()   # 0-1 (virtual)
    rdf_suitability_score = models.FloatField() # 0-1 (virtual)
    contamination_pct = models.FloatField(default=0.0)  # virtual
    is_manual_override = models.BooleanField(default=False)  # user set values by hand
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

Notice: **`routed_to_bin` aur actuator field hata diya gaya hai** — final category database me store hoti hai aur dashboard pe dikhti hai, koi physical bin ko command nahi jaata.

---

## 6. Decision Engine — Core Logic (yahi aapka "dimag" hai, no hardware needed)

`apps/decision_engine/rules.py`

### 6.1 Feature inputs (sab virtual/software-generated)
```
moisture_pct            : 0-100
combustibility_index    : 0-1
recyclability_score     : 0-1
rdf_suitability_score   : 0-1
contamination_pct       : 0-100
detected_material       : enum (PLASTIC, PAPER, METAL, GLASS, ORGANIC, TEXTILE, E_WASTE, MIXED)
detection_confidence    : 0-1
```

### 6.2 Rule-based decision tree (interpretable — recommended starting version)

```python
def rule_based_decision(features: dict) -> tuple[str, dict]:
    """
    Returns (category, trace) where category in {RECYCLE, BIO, RDF, REJECT}
    trace = explanation dict for auditing/dashboard
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

    # 2. High moisture / organic -> Bio (composting/AD)
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

    # 5. Contaminated plastics/paper that can't recycle but burn -> RDF
    if material in ("PLASTIC", "PAPER", "TEXTILE") and contamination > 30:
        trace["rules_fired"].append("contaminated_combustible_to_rdf")
        return "RDF", trace

    # 6. fallback
    trace["rules_fired"].append("fallback_reject")
    return "REJECT", trace
```

### 6.3 Weighted scoring model (Production v2, more tunable)

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
    else:  # hybrid
        cat, trace = rule_based_decision(features)
        if cat == "REJECT":
            cat2, trace2 = weighted_decision(features)
            if cat2 != "REJECT":
                cat, trace = cat2, {**trace, "weighted_fallback": trace2}
        conf = trace.get("scores", {}).get(cat, 0.75) if "scores" in trace else 0.75

    return cat, trace, conf
```

> **Tuning tip:** thresholds ko `DecisionConfig` DB model me rakho (below), taaki Django admin se live tune ho sake bina code-deploy ke.

```python
# apps/decision_engine/models.py
class DecisionConfig(models.Model):
    """Singleton-style config row, editable from admin panel."""
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

## 7. Virtual Feature-Generation Engine (replaces "sensors" — pure software)

Ye module hi wo jagah hai jaha aapke purane `SimParams` sliders ka concept backend me shift ho jaata hai. **Koi physical sensor read nahi hota** — sab material-type + randomness se realistic simulate hota hai.

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
    """Pure software simulation of what a sensor 'would' read, based on
    known baseline profile for the detected material. add_noise=True
    injects small random variation so every batch doesn't look identical
    (mirrors your original SimParams-slider randomness, but automatic)."""
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

    # contamination reduces recyclability, slightly increases RDF suitability
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
    """When a user manually enters values in a 'Simulate Waste' form
    (like your original SimParams sliders), just pass them through
    with validation — no image / ML needed at all."""
    return {
        "detected_material": payload.get("detected_material", "MIXED"),
        "detection_confidence": 1.0,   # user-provided = fully "confident"
        "moisture_pct": float(payload["moisture_pct"]),
        "combustibility_index": float(payload["combustibility_index"]),
        "recyclability_score": float(payload["recyclability_score"]),
        "rdf_suitability_score": float(payload["rdf_suitability_score"]),
        "contamination_pct": float(payload.get("contamination_pct", 0)),
    }
```

Do modes support kiye hain:
- **Auto mode**: image upload karo → ML/virtual-classifier material detect karta hai → `generate_virtual_features()` values banata hai
- **Manual/Simulate mode**: koi image nahi, user seedha sliders se moisture/combustibility/etc. values de (bilkul aapke current React app jaisa) → `manual_features()` use hota hai

Dono modes fully software hain, dono same `decision_engine` se guzarte hain.

---

## 8. Image Classification — Two Options (dono software-only)

### Option A — Real ML model (better accuracy, thoda training effort)

`apps/detection/ml/inference.py`

```python
class MaterialDetector:
    """Runs on the Django server's CPU/GPU. No edge device, no camera driver —
    just a normal image-classification model file loaded in Python."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        import tensorflow as tf
        self.model = tf.keras.models.load_model("ml_models/waste_classifier.h5")
        self.labels = ["PLASTIC", "PAPER", "METAL", "GLASS", "ORGANIC", "TEXTILE", "E_WASTE"]

    def predict(self, image_path: str) -> tuple[str, float, dict]:
        from .preprocessing import preprocess_image
        import numpy as np
        img = preprocess_image(image_path, target_size=(224, 224))
        probs = self.model.predict(np.expand_dims(img, axis=0))[0]
        best_idx = int(probs.argmax())
        material = self.labels[best_idx]
        confidence = float(probs[best_idx])
        all_probs = {label: float(p) for label, p in zip(self.labels, probs)}
        return material, confidence, all_probs
```

Training suggestion: **TrashNet** ya **TACO** dataset, transfer learning on MobileNetV2/EfficientNet, train on your own laptop/Colab (free GPU), export `.h5`/`.pt`, drop into `ml_models/` — server pe hi predict hota hai, koi hardware deployment nahi.

### Option B — No-ML "Virtual Classifier" fallback (agar model train nahi karna, fully rule/heuristic based)

`apps/detection/ml/virtual_classifier.py`

```python
from PIL import Image
import random

def virtual_classify(image_path: str) -> tuple[str, float, dict]:
    """A software-only 'classifier' that doesn't need a trained ML model.
    Uses simple image statistics (avg color/brightness) as a rough proxy,
    combined with randomness, purely to demo the end-to-end pipeline.
    Swap this out for MaterialDetector once you're ready to add real ML."""
    img = Image.open(image_path).convert("RGB").resize((50, 50))
    pixels = list(img.getdata())
    avg_r = sum(p[0] for p in pixels) / len(pixels)
    avg_g = sum(p[1] for p in pixels) / len(pixels)
    avg_b = sum(p[2] for p in pixels) / len(pixels)

    # crude heuristic: brightness/hue -> rough material guess
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

**Recommendation:** Shuru me Option B (virtual classifier) se poora pipeline end-to-end bana lo aur test karo — ye zero training effort me kaam karta hai. Baad me sirf `detection/views.py` me ek line change karke Option A (real ML) plug kar sakte ho, baaki pura system waisa hi rahega.

---

## 9. API Endpoints (DRF) — sab HTTP/JSON, no hardware protocol

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/detection/detect/` | Image upload karo → material class + confidence return (ML ya virtual classifier) |
| `POST` | `/api/v1/analysis/generate/` | Given material → 4 virtual features return |
| `POST` | `/api/v1/analysis/manual/` | Given manual slider values (no image) → validated features return |
| `POST` | `/api/v1/decision/decide/` | Given features → final category (Recycle/Bio/RDF/Reject) |
| `POST` | `/api/v1/pipeline/process/` | **One-shot combined endpoint (image mode)**: image upload → detect → generate features → decide → save |
| `POST` | `/api/v1/pipeline/simulate/` | **One-shot combined endpoint (manual mode)**: manual slider values → decide → save (no image needed) |
| `GET` | `/api/v1/records/` | Paginated waste record history (filters: category, date range) |
| `GET` | `/api/v1/records/{id}/` | Single record detail with image + full decision trace |
| `GET` | `/api/v1/stats/summary/` | Dashboard stats: category-wise counts, %, trend over time |
| `GET` | `/api/v1/config/decision-rules/` | Current threshold/weight config (for tuning UI) |
| `PATCH` | `/api/v1/config/decision-rules/` | Update thresholds without redeploy |

### 9.1 Combined pipeline — image mode

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from apps.detection.ml.virtual_classifier import virtual_classify
from apps.analysis.services import generate_virtual_features
from apps.decision_engine.engine import decide_category
from apps.detection.models import WasteImage
from apps.analysis.models import SimulatedReading
from .models import WasteRecord
from .serializers import WasteRecordSerializer


class ProcessWasteImageView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request):
        image_file = request.FILES["image"]
        source = request.data.get("source", "UPLOAD")  # UPLOAD or WEBCAM

        # 1. Save uploaded image
        waste_image = WasteImage.objects.create(image=image_file, source=source)

        # 2. Classify (swap virtual_classify -> MaterialDetector().predict for real ML)
        material, confidence, all_probs = virtual_classify(waste_image.image.path)
        waste_image.detected_material = material
        waste_image.detection_confidence = confidence
        waste_image.raw_model_output = all_probs
        waste_image.save()

        # 3. Generate virtual features (software simulation, no sensors)
        features = generate_virtual_features(material, confidence)

        reading = SimulatedReading.objects.create(
            image=waste_image,
            moisture_pct=features["moisture_pct"],
            combustibility_index=features["combustibility_index"],
            recyclability_score=features["recyclability_score"],
            rdf_suitability_score=features["rdf_suitability_score"],
            contamination_pct=features["contamination_pct"],
        )

        # 4. Decide
        category, trace, decision_confidence = decide_category(features, mode="hybrid")

        # 5. Save record
        record = WasteRecord.objects.create(
            image=waste_image,
            simulated_reading=reading,
            final_category=category,
            decision_confidence=decision_confidence,
            decision_breakdown=trace,
        )

        return Response(WasteRecordSerializer(record, context={"request": request}).data, status=201)
```

### 9.2 Combined pipeline — manual/simulate mode (no image at all)

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

Ye second endpoint bilkul aapke **current React frontend ke sliders** ke saath directly kaam karega — koi image ya camera involve nahi.

### 9.3 Serializer

```python
from rest_framework import serializers
from .models import WasteRecord

class WasteRecordSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    material = serializers.SerializerMethodField()
    moisture_pct = serializers.FloatField(source="simulated_reading.moisture_pct")
    combustibility_index = serializers.FloatField(source="simulated_reading.combustibility_index")
    recyclability_score = serializers.FloatField(source="simulated_reading.recyclability_score")
    rdf_suitability_score = serializers.FloatField(source="simulated_reading.rdf_suitability_score")

    class Meta:
        model = WasteRecord
        fields = [
            "id", "image_url", "material", "moisture_pct", "combustibility_index",
            "recyclability_score", "rdf_suitability_score", "final_category",
            "decision_confidence", "decision_breakdown", "processed_at",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.image.url) if request else obj.image.image.url

    def get_material(self, obj):
        return obj.image.detected_material if obj.image else obj.simulated_reading.image and "MIXED"
```

### 9.4 Sample response

```json
{
  "id": "8f3e9c2a-...",
  "image_url": "http://host/media/waste_images/2026/09/06/img1.jpg",
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
  "processed_at": "2026-09-06T10:12:00Z"
}
```

---

## 10. Dashboard / Stats Endpoint

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

Existing React frontend (`WasteChakraSimulation.tsx`) ke fake in-browser charts ko is real `/api/v1/stats/summary/` aur `/api/v1/records/` data se replace kiya ja sakta hai — `engine.ts` ka simulation logic ab backend `decision_engine` app me chala gaya hai, frontend sirf API call karega aur result dikhayega.

---

## 11. Optional: Realtime via Django Channels (still pure software)

Agar dashboard ko live-refresh chahiye jab bhi koi naya record process ho (bina page reload):

```python
class WasteRecordConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("waste_records", self.channel_name)
        await self.accept()

    async def waste_record_created(self, event):
        await self.send_json(event["data"])
```

Signal se broadcast: `post_save` on `WasteRecord` → `channel_layer.group_send(...)`. Ye purely browser ↔ server WebSocket hai, koi hardware nahi.

---

## 12. requirements.txt (starter, no hardware libraries)

```
Django>=5.0,<5.1
djangorestframework>=3.15
drf-spectacular
django-cors-headers
django-filter
Pillow
psycopg2-binary
python-dotenv
celery          # optional
redis           # optional
channels        # optional, for realtime dashboard
channels-redis  # optional
tensorflow      # only if using real ML (Option A); skip for virtual-classifier-only setup
numpy
```

Notice: `RPi.GPIO`, `paho-mqtt`, `tflite-runtime` (edge-specific) hata diye gaye hain — ye sab hardware-oriented packages the.

---

## 13. .env.example

```
DEBUG=True
SECRET_KEY=change-me
DATABASE_URL=postgres://user:pass@localhost:5432/wastechakra
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
ML_MODEL_PATH=ml_models/waste_classifier.h5
USE_REAL_ML=False   # False = virtual_classifier.py used, True = real MaterialDetector
```

---

## 14. Development Roadmap (Antigravity ko is order me build karwao)

1. **Phase 0 — Scaffold**: Django project + apps (`detection`, `analysis`, `decision_engine`, `waste_records`) create karo, ek single `settings.py` (no split), CORS, DRF config (`DEFAULT_PERMISSION_CLASSES: AllowAny`, since no auth).
2. **Phase 1 — Models & Admin**: `WasteImage`, `SimulatedReading`, `WasteRecord`, `DecisionConfig` models banao, migrations run karo, Django admin me register karo (image thumbnail preview ke saath).
3. **Phase 2 — Decision Engine (independent of ML/image, banao pehle isse)**: `rules.py` + `engine.py` likho, unit tests likho with mock feature dicts.
4. **Phase 3 — Virtual Analysis Engine**: `generate_virtual_features()` aur `manual_features()` likho — dummy material input se features generate karo.
5. **Phase 4 — Detection app, virtual classifier se shuru karo**: `virtual_classifier.py` (Option B, no ML training needed) plug karo taaki poora pipeline turant end-to-end test ho sake.
6. **Phase 5 — Combined pipeline endpoints**: `POST /api/v1/pipeline/process/` (image mode) aur `POST /api/v1/pipeline/simulate/` (manual mode).
7. **Phase 6 — Records & Stats API**: history, filtering, pagination, `/stats/summary/`.
8. **Phase 7 — Frontend integration**: existing React app (`wastechakra-v2`) ke `engine.ts` client-side simulation ko real API calls se replace karo — sliders wala UI `pipeline/simulate/` ko call kare, image-upload wala UI `pipeline/process/` ko.
9. **Phase 8 — Optional real ML**: agar chaho to `TrashNet`/`TACO` dataset pe model train karke Option A (`MaterialDetector`) `USE_REAL_ML=True` flag se enable karo — baaki pura system same rahega.
10. **Phase 9 — Realtime (optional)**: Channels + WebSocket for live dashboard.

---

## 15. Testing Strategy

- **Unit tests**: `decision_engine` rules — sabse important, business-critical logic. Har rule ke liye ek test case (edge cases: moisture=100, contamination=0, low confidence, etc.)
- **Integration tests**: dono pipeline endpoints (`process/` aur `simulate/`) — `APITestCase` se full flow verify karo (dummy image / dummy JSON payload se).
- Koi hardware-in-the-loop testing ki zaroorat nahi — sab kuch mock data se test ho sakta hai.

---

## 16. Categories Note

**Recycle, Bio, RDF** — `WasteCategory` enum me `RECYCLE`, `BIO`, `RDF` rakhe hain, plus ek `REJECT` category jab confidence bahut low ho ya koi threshold match na kare (safety fallback — dashboard me "needs manual review" ke roop me dikhega, koi physical action nahi).

---

### Next Steps
Ye poora spec Antigravity ko de kar bolo: *"Is markdown spec ke according complete Django DRF project scaffold karo, Phase 0 se Phase 7 tak (fully virtual/software version, koi hardware code mat likhna, koi authentication mat lagana, ek hi settings.py file rakhna), har phase ke baad migrations aur basic tests bhi likho."* Agent step-by-step pura codebase generate kar dega — pure web application, deployable on any normal server, no physical components required, no login system required.
