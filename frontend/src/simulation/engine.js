import { STAGE_IDS, STAGE_LABELS } from "./types";

export function computeComposition(p) {
  if (p.materialMass) {
    const mm = p.materialMass;
    return {
      organic: mm.organic || 0,
      plastic: mm.plastic || 0,
      paper: mm.paper || 0,
      ferrous: mm.ferrous || 0,
      aluminium: mm.aluminium || 0,
      glass: mm.glass || 0,
      residual: mm.residual || 0,
    };
  }
  const total = p.totalWaste;
  const organic = (p.organicFraction / 100) * total;
  const plastic = (p.plasticFraction / 100) * total;
  const metal = (p.metalFraction / 100) * total;
  const ferrous = metal * 0.6;
  const aluminium = metal * 0.4;
  const remaining = total - organic - plastic - ferrous - aluminium;
  const paper = remaining * 0.4;
  const glass = remaining * 0.2;
  const residual = remaining * 0.4;
  return { organic, plastic, paper, ferrous, aluminium, glass, residual };
}

export function efficiencyFor(stage, p) {
  let base = 0.92;
  switch (stage) {
    case "magnetic":
      base = 0.94;
      break;
    case "non-ferrous":
      base = 0.88;
      break;
    case "optical-sorter":
      base = 0.9 - p.contamination / 1000;
      break;
    case "trommel":
      base = 0.85;
      break;
    case "quality":
      base = 0.87 - p.contamination / 800;
      break;
    case "ai-scanner":
      base = 0.95 - p.contamination / 600;
      break;
    default:
      base = 0.92;
  }
  if (p.moisture > 50) base -= 0.03;
  return Math.max(0.6, Math.min(0.98, base));
}

export function mapBackendToDestination(finalCategory, material, moisture = 30) {
  const cat = (finalCategory || "").toUpperCase();
  const mat = (material || "").toUpperCase();

  if (cat === "RECYCLE") {
    if (mat === "PLASTIC") return "plastic-recycling";
    if (mat === "PAPER") return "paper-recovery";
    if (mat === "METAL") return "metal-recovery";
    if (mat === "GLASS") return "construction";
    return "plastic-recycling";
  }
  if (cat === "BIO") {
    return moisture > 55 ? "anaerobic-digestion" : "composting";
  }
  if (cat === "RDF") {
    return "rdf-fuel";
  }
  if (cat === "REJECT") {
    return "residual-disposal";
  }

  // Fallback by material
  if (mat === "PLASTIC") return "plastic-recycling";
  if (mat === "PAPER") return "paper-recovery";
  if (mat === "METAL") return "metal-recovery";
  if (mat === "GLASS") return "construction";
  if (mat === "ORGANIC") return moisture > 55 ? "anaerobic-digestion" : "composting";
  return "residual-disposal";
}

export function routeMaterial(mat, purity, contamination, moisture, overrideDestination = null) {
  if (overrideDestination) {
    return overrideDestination;
  }
  switch (mat) {
    case "ferrous":
    case "aluminium":
      return "metal-recovery";
    case "glass":
      return "construction";
    case "organic":
      if (moisture > 55) return "anaerobic-digestion";
      if (contamination > 40) return "anaerobic-digestion";
      return "composting";
    case "plastic":
      if (purity > 75) return "plastic-recycling";
      if (contamination > 45) return "rdf-fuel";
      return "plastic-recycling";
    case "paper":
      if (contamination > 50) return "rdf-fuel";
      return "paper-recovery";
    case "residual":
      if (contamination < 30 && moisture < 40) return "rdf-fuel";
      return "residual-disposal";
    default:
      return "residual-disposal";
  }
}

export function computePurity(mat, p) {
  let base = 85;
  base -= p.contamination * 0.3;
  if (p.moisture > 50) base -= 5;
  if (mat === "plastic" || mat === "paper") base -= p.contamination * 0.1;
  return Math.max(30, Math.min(98, base));
}

export function valuePerKg(mat, dest) {
  const table = {
    "plastic-recycling": 48,
    "paper-recovery": 12,
    "metal-recovery": 55,
    composting: 5,
    "anaerobic-digestion": 8,
    "rdf-fuel": 6,
    construction: 3,
    "residual-disposal": 0,
  };
  if (mat === "ferrous") return 35;
  if (mat === "aluminium") return 120;
  if (mat === "glass") return 4;
  return table[dest] || 10;
}

export function generateAILines(p) {
  const comp = computeComposition(p);
  const mats = [
    "organic",
    "plastic",
    "paper",
    "ferrous",
    "aluminium",
    "glass",
    "residual",
  ];
  const labels = {
    organic: "Organic Waste",
    plastic: "PET Plastic",
    paper: "Paper / Fibre",
    ferrous: "Ferrous Metal",
    aluminium: "Aluminium",
    glass: "Glass Cullet",
    residual: "Residual Waste",
  };
  return mats
    .filter((m) => comp[m] > p.totalWaste * 0.01)
    .map((m) => {
      const purity = computePurity(m, p);
      const cont = Math.round(100 - purity);
      const isPrimaryInjected = p.primaryMaterial && (
        (m === "plastic" && p.primaryMaterial === "PLASTIC") ||
        (m === "organic" && p.primaryMaterial === "ORGANIC") ||
        (m === "paper" && p.primaryMaterial === "PAPER") ||
        ((m === "ferrous" || m === "aluminium") && p.primaryMaterial === "METAL") ||
        (m === "glass" && p.primaryMaterial === "GLASS")
      );
      const dest = isPrimaryInjected && p.targetDestination
        ? p.targetDestination
        : routeMaterial(m, purity, cont, p.moisture);
      const conf = Math.round(88 + Math.random() * 10);
      const recov = purity > 70 ? "HIGH" : purity > 45 ? "MEDIUM" : "LOW";
      return {
        material: labels[m],
        confidence: conf,
        purity: Math.round(purity),
        contamination: cont,
        recoverability: recov,
        valuePerKg: valuePerKg(m, dest),
        destination: dest,
      };
    });
}


export function computeStageStats(p) {
  const comp = computeComposition(p);
  let mass = p.totalWaste;
  const stages = [];
  for (const id of STAGE_IDS) {
    const eff = efficiencyFor(id, p);
    let recovered = 0;
    if (id === "magnetic") recovered = comp.ferrous * eff;
    else if (id === "non-ferrous") recovered = comp.aluminium * eff;
    else if (id === "optical-sorter") recovered = (comp.plastic + comp.paper) * eff;
    else if (id === "trommel") recovered = comp.organic * 0.1; // fines removed
    else if (id === "quality") recovered = comp.glass * eff;
    mass -= recovered * 0.05; // small losses
    stages.push({
      id,
      name: STAGE_LABELS[id],
      input: Math.round(mass),
      recovered: Math.round(recovered),
      efficiency: Math.round(eff * 100),
      status: "idle",
    });
  }
  return stages;
}

export function computeFinalResult(p) {
  const comp = computeComposition(p);
  const routes = {
    organic: 0,
    plastic: 0,
    paper: 0,
    ferrous: 0,
    aluminium: 0,
    glass: 0,
    residual: 0,
  };
  let recovered = 0;
  let recoveredValue = 0;
  Object.keys(comp).forEach((m) => {
    const purity = computePurity(m, p);
    const cont = 100 - purity;
    const dest = routeMaterial(m, purity, cont, p.moisture);
    const eff = dest === "residual-disposal" ? 0 : 0.85;
    const mass = comp[m] * eff;
    routes[m] = mass;
    if (dest !== "residual-disposal") {
      recovered += mass;
      recoveredValue += mass * valuePerKg(m, dest);
    }
  });
  const residual = p.totalWaste - recovered;
  const diversion = (recovered / p.totalWaste) * 100;
  return {
    input: p.totalWaste,
    recovered: Math.round(recovered),
    residual: Math.round(residual),
    diversion: Math.round(diversion),
    recoveredValue: Math.round(recoveredValue),
  };
}