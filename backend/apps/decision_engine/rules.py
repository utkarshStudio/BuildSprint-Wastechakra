def rule_based_decision(features: dict, config=None) -> tuple[str, dict]:
    """
    Evaluates rule hierarchy and returns (category, trace)
    Category is one of: RECYCLE, BIO, RDF, REJECT
    """
    material = features.get("detected_material", "MIXED")
    moisture = features.get("moisture_pct", 0.0)
    combustibility = features.get("combustibility_index", 0.0)
    recyclability = features.get("recyclability_score", 0.0)
    rdf_score = features.get("rdf_suitability_score", 0.0)
    contamination = features.get("contamination_pct", 0.0)
    confidence = features.get("detection_confidence", 1.0)

    # Use threshold config if provided, otherwise default thresholds
    low_conf_thresh = config.low_confidence_threshold if config else 0.4
    moisture_bio_thresh = config.moisture_bio_threshold if config else 55.0
    recyc_thresh = config.recyclability_threshold if config else 0.65
    contam_thresh = config.contamination_threshold if config else 30.0
    combust_thresh = config.combustibility_threshold if config else 0.55
    rdf_thresh = config.rdf_threshold if config else 0.5

    trace = {"material": material, "rules_fired": []}

    # 0. Low-confidence detection flag
    if confidence < low_conf_thresh:
        trace["rules_fired"].append("low_confidence_detection")
        return "REJECT", trace

    # 1. Hard material-based overrides for clean recyclables
    if material in ("METAL", "GLASS", "E_WASTE"):
        trace["rules_fired"].append(f"material_override_{material}")
        return "RECYCLE", trace

    # 2. High moisture or organic material -> BIO (composting / Anaerobic Digestion)
    if material == "ORGANIC" or moisture > moisture_bio_thresh:
        trace["rules_fired"].append("high_moisture_or_organic")
        return "BIO", trace

    # 3. High recyclability + low contamination -> RECYCLE
    if recyclability >= recyc_thresh and contamination <= contam_thresh:
        trace["rules_fired"].append("high_recyclability_low_contamination")
        return "RECYCLE", trace

    # 4. High combustibility + high RDF suitability + low moisture -> RDF
    if combustibility >= combust_thresh and rdf_score >= rdf_thresh and moisture < 40.0:
        trace["rules_fired"].append("high_combustibility_rdf_fit")
        return "RDF", trace

    # 5. Contaminated combustible materials (plastic, paper, textile) -> RDF
    if material in ("PLASTIC", "PAPER", "TEXTILE") and contamination > contam_thresh:
        trace["rules_fired"].append("contaminated_combustible_to_rdf")
        return "RDF", trace

    # 6. Fallback
    trace["rules_fired"].append("fallback_reject")
    return "REJECT", trace
