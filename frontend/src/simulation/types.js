export const MATERIAL_COLORS = {
  organic: "#65a30d",
  plastic: "#eab308",
  paper: "#0891b2",
  ferrous: "#64748b",
  aluminium: "#94a3b8",
  glass: "#0ea5e9",
  residual: "#78716c",
};

export const DESTINATION_LABELS = {
  "plastic-recycling": "Plastic Recycling",
  "paper-recovery": "Paper / Fibre Recovery",
  "metal-recovery": "Metal Recovery",
  composting: "Composting",
  "anaerobic-digestion": "Anaerobic Digestion / Biogas",
  "rdf-fuel": "RDF / Fuel Recovery",
  construction: "Construction Material Recovery",
  "residual-disposal": "Residual Disposal",
};

export const DESTINATION_COLORS = {
  "plastic-recycling": "#eab308",
  "paper-recovery": "#0891b2",
  "metal-recovery": "#94a3b8",
  composting: "#65a30d",
  "anaerobic-digestion": "#16a34a",
  "rdf-fuel": "#dc2626",
  construction: "#a16207",
  "residual-disposal": "#78716c",
};

export const STAGE_IDS = [
  "reception",
  "ai-scanner",
  "shredder",
  "trommel",
  "magnetic",
  "non-ferrous",
  "optical-sorter",
  "quality",
  "routing",
];

export const STAGE_LABELS = {
  reception: "Waste Reception",
  "ai-scanner": "AI Material Scanner",
  shredder: "Pre-Processing / Shredder",
  trommel: "Trommel Screen",
  magnetic: "Magnetic Separator",
  "non-ferrous": "Non-Ferrous Separator",
  "optical-sorter": "Optical AI Sorter",
  quality: "Quality / Contamination Analysis",
  routing: "WC Intelligent Routing",
};

export const SCENARIOS = {
  "Normal Waste": {
    totalWaste: 1000,
    moisture: 25,
    contamination: 15,
    organicFraction: 45,
    plasticFraction: 14,
    metalFraction: 8,
  },
  "Monsoon / High Moisture": {
    totalWaste: 1000,
    moisture: 70,
    contamination: 20,
    organicFraction: 50,
    plasticFraction: 12,
    metalFraction: 6,
  },
  "High Contamination": {
    totalWaste: 1000,
    moisture: 30,
    contamination: 55,
    organicFraction: 35,
    plasticFraction: 16,
    metalFraction: 7,
  },
};