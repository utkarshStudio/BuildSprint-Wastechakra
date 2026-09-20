"""Routing rules for waste material stream classification and circular economy summaries."""

STREAM_RECYCLABLE = "RECYCLABLE"
STREAM_RDF = "RDF"
STREAM_ORGANIC = "ORGANIC"
STREAM_LANDFILL = "LANDFILL"

RECYCLABLE_KEYWORDS = [
    "bottle", "can", "tin", "metal", "aluminium", "aluminum", "steel", "iron",
    "cardboard", "box", "carton", "paper", "newspaper", "magazine", "glass",
    "jar", "rigid plastic", "pet", "hdpe", "pp", "container", "tub"
]

RDF_KEYWORDS = [
    "wrapper", "film", "foil", "chip", "crisp", "pouch", "sachet", "packet",
    "multi-layer", "laminate", "polythene", "plastic bag", "flexible plastic",
    "biscuit pack", "snack bag", "candy wrapper", "tetra pak"
]

ORGANIC_KEYWORDS = [
    "food", "fruit", "peel", "vegetable", "leftover", "leaf", "plant", "organic",
    "kitchen waste", "compost", "coffee ground", "tea bag", "bread", "scrap"
]

LANDFILL_KEYWORDS = [
    "inert", "debris", "stone", "brick", "ceramic", "porcelain", "dust", "dirt",
    "sanitary", "hazardous", "composite", "contaminated", "styrofoam", "sponge",
    "diaper", "mask", "medical", "rubber", "shoe", "textile"
]


def determine_stream(label: str, confidence: float = 0.85) -> tuple[str, str]:
    """Determines circular destination stream and rationale based on item label."""
    label_lower = (label or "").lower()

    # 1. Check Organic
    for kw in ORGANIC_KEYWORDS:
        if kw in label_lower:
            return STREAM_ORGANIC, f"Biodegradable organic matter suitable for anaerobic digestion or municipal composting."

    # 2. Check Recyclable
    for kw in RECYCLABLE_KEYWORDS:
        if kw in label_lower:
            return STREAM_RECYCLABLE, f"High-value recyclable material suitable for mechanical reprocessing and material recovery."

    # 3. Check RDF Fuel
    for kw in RDF_KEYWORDS:
        if kw in label_lower:
            return STREAM_RDF, f"High-calorific multi-layer packaging routed to Refuse-Derived Fuel for industrial thermal substitution."

    # 4. Check Landfill
    for kw in LANDFILL_KEYWORDS:
        if kw in label_lower:
            return STREAM_LANDFILL, f"Non-recoverable composite or contaminated residue routed to sanitary landfill disposal."

    # Default based on generic terms
    if "plastic" in label_lower:
        return STREAM_RECYCLABLE, "Polymer material routed to mechanical recycling line."
    if "metal" in label_lower or "scrap" in label_lower:
        return STREAM_RECYCLABLE, "Non-ferrous or ferrous metal with infinite recyclability."

    return STREAM_LANDFILL, "Unclassified mixed composite routed to landfill to protect processing line."


def generate_summary_points(formatted_objects: list) -> list[str]:
    """Generates insightful circular economy takeaways based on actual detected objects."""
    total = len(formatted_objects)
    if total == 0:
        return [
            "No distinct waste items detected in the current buffer frame.",
            "Conveyor optical scanner standing by for incoming feed.",
            "Purity index maintained at 100%."
        ]

    counts = {
        STREAM_RECYCLABLE: 0,
        STREAM_RDF: 0,
        STREAM_ORGANIC: 0,
        STREAM_LANDFILL: 0,
    }

    for obj in formatted_objects:
        s = obj.get("stream", STREAM_LANDFILL)
        counts[s] = counts.get(s, 0) + 1

    diversion_count = counts[STREAM_RECYCLABLE] + counts[STREAM_RDF] + counts[STREAM_ORGANIC]
    diversion_rate = round((diversion_count / total) * 100, 1)

    points = []
    
    if counts[STREAM_RECYCLABLE] > 0:
        points.append(
            f"Recovered {counts[STREAM_RECYCLABLE]} recyclable item(s) (metals/rigid polymers) for closed-loop remanufacturing."
        )

    if counts[STREAM_RDF] > 0:
        points.append(
            f"Diverted {counts[STREAM_RDF]} high-calorific packaging unit(s) into RDF fuel stream for waste-to-energy substitution."
        )

    if counts[STREAM_ORGANIC] > 0:
        points.append(
            f"Captured {counts[STREAM_ORGANIC]} compostable organic scrap(s) to generate municipal bio-fertilizer."
        )

    if counts[STREAM_LANDFILL] > 0:
        points.append(
            f"Isolated {counts[STREAM_LANDFILL]} non-recoverable inert item(s) away from sorting line to prevent downstream contamination."
        )

    points.append(
        f"Overall Circular Economy Diversion Rate: {diversion_rate}% diverted away from dumping grounds."
    )

    return points[:4]
