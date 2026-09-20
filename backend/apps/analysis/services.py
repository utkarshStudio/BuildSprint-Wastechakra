import random

MATERIAL_BASELINE = {
    # material: (moisture_baseline, combustibility, recyclability, rdf_suitability)
    "PLASTIC":  (5.0,  0.75, 0.70, 0.65),
    "PAPER":    (15.0, 0.65, 0.60, 0.55),
    "METAL":    (2.0,  0.05, 0.95, 0.05),
    "GLASS":    (2.0,  0.02, 0.90, 0.02),
    "ORGANIC":  (65.0, 0.20, 0.10, 0.15),
    "TEXTILE":  (10.0, 0.60, 0.35, 0.60),
    "E_WASTE":  (3.0,  0.10, 0.85, 0.05),
    "MIXED":    (30.0, 0.40, 0.40, 0.40),
}


def _jitter(value: float, spread: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value + random.uniform(-spread, spread)))


def generate_virtual_features(
    material: str,
    detection_confidence: float,
    contamination_pct: float | None = None,
    add_noise: bool = True,
) -> dict:
    """Pure software simulation of feature readings based on baseline profile
    for the detected material. Injects subtle jitter for realistic simulation."""
    moisture, combustibility, recyclability, rdf = MATERIAL_BASELINE.get(
        material, MATERIAL_BASELINE["MIXED"]
    )
    if contamination_pct is None:
        contamination_pct = random.uniform(10.0, 35.0)

    if add_noise:
        moisture = _jitter(moisture, 6.0, lo=0.0, hi=100.0)
        combustibility = _jitter(combustibility, 0.06, lo=0.0, hi=1.0)
        recyclability = _jitter(recyclability, 0.06, lo=0.0, hi=1.0)
        rdf = _jitter(rdf, 0.06, lo=0.0, hi=1.0)

    # Contamination impact adjustments
    recyclability = max(0.0, recyclability - (contamination_pct / 200.0))
    rdf = min(1.0, rdf + (contamination_pct / 300.0))

    return {
        "detected_material": material,
        "detection_confidence": detection_confidence,
        "moisture_pct": round(moisture, 1),
        "combustibility_index": round(combustibility, 3),
        "recyclability_score": round(recyclability, 3),
        "rdf_suitability_score": round(rdf, 3),
        "contamination_pct": round(contamination_pct, 1),
    }


def manual_features(payload: dict) -> dict:
    """Pass through user manual simulation sliders (e.g. from React UI)."""
    return {
        "detected_material": payload.get("detected_material", "MIXED"),
        "detection_confidence": 1.0,
        "moisture_pct": float(payload.get("moisture_pct", 30.0)),
        "combustibility_index": float(payload.get("combustibility_index", 0.5)),
        "recyclability_score": float(payload.get("recyclability_score", 0.5)),
        "rdf_suitability_score": float(payload.get("rdf_suitability_score", 0.5)),
        "contamination_pct": float(payload.get("contamination_pct", 15.0)),
    }
