from .rules import rule_based_decision
from .models import DecisionConfig

CATEGORY_WEIGHTS = {
    "RECYCLE": {
        "recyclability_score": 0.6,
        "combustibility_index": -0.1,
        "moisture_pct": -0.1,
        "contamination_pct": -0.2,
    },
    "BIO": {
        "moisture_pct": 0.5,
        "combustibility_index": -0.2,
        "recyclability_score": -0.1,
        "organic_flag": 0.4,
    },
    "RDF": {
        "combustibility_index": 0.5,
        "rdf_suitability_score": 0.4,
        "moisture_pct": -0.3,
        "recyclability_score": -0.2,
    },
}


def normalize(features: dict) -> dict:
    f = dict(features)
    f["moisture_pct"] = f.get("moisture_pct", 0.0) / 100.0
    f["contamination_pct"] = f.get("contamination_pct", 0.0) / 100.0
    f["organic_flag"] = 1.0 if f.get("detected_material") == "ORGANIC" else 0.0
    return f


def weighted_decision(features: dict) -> tuple[str, dict]:
    f = normalize(features)
    scores = {}
    for category, weights in CATEGORY_WEIGHTS.items():
        score = sum(weights.get(k, 0.0) * f.get(k, 0.0) for k in weights)
        scores[category] = round(max(score, 0.0), 4)

    if f.get("detected_material") in ("METAL", "GLASS", "E_WASTE"):
        return "RECYCLE", {"scores": scores, "override": f.get("detected_material")}

    best_category = max(scores, key=scores.get)
    if scores[best_category] < 0.20:
        return "REJECT", {"scores": scores, "reason": "low_score_all_categories"}
    return best_category, {"scores": scores}


def decide_category(features: dict, mode: str | None = None) -> tuple[str, dict, float]:
    """
    Main decision engine entry point.
    Returns (final_category, trace_dict, confidence_score)
    """
    try:
        config = DecisionConfig.get_config()
        if mode is None:
            mode = config.decision_mode
    except Exception:
        config = None
        if mode is None:
            mode = "hybrid"

    if mode == "rule":
        cat, trace = rule_based_decision(features, config=config)
        conf = 0.85
    elif mode == "weighted":
        cat, trace = weighted_decision(features)
        conf = max(trace.get("scores", {}).values(), default=0.5)
    else:  # hybrid (default)
        cat, trace = rule_based_decision(features, config=config)
        if cat == "REJECT":
            cat2, trace2 = weighted_decision(features)
            if cat2 != "REJECT":
                cat = cat2
                trace = {**trace, "weighted_fallback": trace2}
        conf = trace.get("scores", {}).get(cat, 0.80) if "scores" in trace else 0.80

    return cat, trace, float(conf)
