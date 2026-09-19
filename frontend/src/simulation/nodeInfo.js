export const NODE_INFO_MAP = {
  // Machine Stages (Conveyor Belt Nodes)
  reception: {
    id: "reception",
    name: "Waste Reception Hopper",
    category: "Stage",
    tag: "STAGE 1",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    
    shortDesc: "शहर का अनसॉर्टेड गीला और सूखा कचरा यहाँ रिसेप्शन हॉपर में खाली किया जाता है। यह पूरे प्रोसेस का एंट्री प्वाइंट है।",
    detailedDesc: "सॉलिड वेस्ट मैनेजमेंट का प्राथमिक चरण जहाँ डंपर ट्रक अनसॉर्टेड कचरों को फीड हॉपर में डालते हैं। यहाँ से वेस्ट को समान गति से प्रोसेसिंग लाइन पर आगे बढ़ाया जाता है।",
    techSpecs: "Hydraulic Tilting Hoppers & Heavy-duty Apron Feeders",
    inputOutput: "Raw Municipal Solid Waste (MSW) ➔ Main Conveyor Stream",
  },
  "ai-scanner": {
    id: "ai-scanner",
    name: "AI Material Scanner",
    category: "Stage",
    tag: "STAGE 2",
    tagColor: "bg-cyan-100 text-cyan-700 border-cyan-300",
    
    shortDesc: "इसमें High-Speed Optics कैमरे और AI Computer Vision मॉडल कचरे को real-time में स्कैन करके Material type और Contamination पहचानते हैं।",
    detailedDesc: "मल्टी-स्पेक्ट्रल विज़न सेंसर्स और AI न्यूरल नेटवर्क बेल्ट से गुजर रहे हर ऑब्जेक्ट का 3D शेप, कलर और डेंसिटी स्कैन करके मटेरियल की शुद्धता जांचते हैं।",
    techSpecs: "Hyperspectral Optics + Edge AI Processing (98.5% Accuracy)",
    inputOutput: "Mixed Waste Stream ➔ AI-Classified Digital Material Map",
  },
  shredder: {
    id: "shredder",
    name: "Pre-Processing / Shredder",
    category: "Stage",
    tag: "STAGE 3",
    tagColor: "bg-blue-100 text-blue-700 border-blue-300",
    
    shortDesc: "यह भारी कचरे, प्लास्टिक बैग्स और बड़े ऑब्जेक्ट्स को एकसमान छोटे आकार (Pre-sizing) में काटता है ताकि आगे की छंटाई आसान हो।",
    detailedDesc: "काउंटर-रोटेटिंग ब्लेड्स बड़े कचरों को तोड़ते और बंद प्लास्टिक थैलों को फाड़ते हैं, जिससे आगे लगने वाले मैग्नेटिक और ऑप्टिकल सेपरेटर्स अधिकतम दक्षता से काम कर सकें।",
    techSpecs: "Dual-Shaft Hydraulic Cutters with Anti-Jammed Auto-Reverse",
    inputOutput: "Bulk Trash & Sealed Bags ➔ Uniform Shredded Stream",
  },
  trommel: {
    id: "trommel",
    name: "Trommel Screen",
    category: "Stage",
    tag: "STAGE 4",
    tagColor: "bg-amber-100 text-amber-700 border-amber-300",
    
    shortDesc: "यह एक घूमती हुई रोटेटिंग बेलनाकार छलनी है जो साइज के आधार पर छोटे आर्गेनिक कचरे (Fine Organic Particles) को छानकर अलग करती है।",
    detailedDesc: "घूर्णन ड्रम स्क्रीन के छिद्रों से जैविक कचरा और मिट्टी नीचे खाद पिट में गिर जाती है, जबकि बड़ा सूखा कचरा बेल्ट पर आगे बढ़ जाता है।",
    techSpecs: "Rotary Mesh Drum (60-80mm mesh size, variable RPM)",
    inputOutput: "Shredded Material ➔ Organic Fines (<80mm) vs Coarse Material",
  },
  magnetic: {
    id: "magnetic",
    name: "Magnetic Separator",
    category: "Stage",
    tag: "STAGE 5",
    tagColor: "bg-red-100 text-red-700 border-red-300",
    
    shortDesc: "शक्तिशाली मैग्नेट (Overband Magnet) कचरे की बेल्ट से लोहा, स्टील और फेरस मेटल्स को खींचकर रीसाइक्लिंग के लिए अलग करता है।",
    detailedDesc: "कन्वेयर बेल्ट के ऊपर लगा हाई-इंटेंसिटी इलेक्ट्रो-मैग्नेट लोहे के डिब्बों, कीलों और स्क्रैप को तुरंत अपनी ओर खींचकर अलग रीसाइक्लिंग बिन में डाल देता है।",
    techSpecs: "High-Intensity Neodymium Permanent Magnetic Cross-Belt",
    inputOutput: "Coarse Stream ➔ 99% Pure Ferrous Scrap Metals",
  },
  "non-ferrous": {
    id: "non-ferrous",
    name: "Non-Ferrous Separator",
    category: "Stage",
    tag: "STAGE 6",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-300",
    
    shortDesc: "एडी-करंट (Eddy Current) फ़ील्ड का उपयोग करके एल्युमिनियम कैन्स, कॉपर और ब्रास धातुओं को उछालकर (Repel) अलग किया जाता है।",
    detailedDesc: "तेजी से घूमता चुंबक नॉन-फेरस धातुओं में भंवर धाराएं (Eddy Currents) पैदा करता है, जिससे प्रतिकर्षण बल के कारण एल्युमिनियम कैन हवा में उछलकर अलग गिरते हैं।",
    techSpecs: "High-Speed Eccentric Eddy Current Rotor (3000 RPM)",
    inputOutput: "Mixed Metals ➔ Recovered Aluminium & Copper Cans",
  },
  "optical-sorter": {
    id: "optical-sorter",
    name: "Optical AI Sorter",
    category: "Stage",
    tag: "STAGE 7",
    tagColor: "bg-teal-100 text-teal-700 border-teal-300",
    
    shortDesc: "NIR (Near-Infrared) लेजर सेंसर्स और हाई-प्रेशर एयर जेट्स की मदद से PET, HDPE प्लास्टिक और पेपर की सटीक छंटाई होती है।",
    detailedDesc: "ऑप्टिकल सेंसर प्लास्टिक के रेज़िन टाइप (PET/HDPE/PP) को पहचानते ही लक्षित एयर-नोजल (Air Jets) से उस प्लास्टिक को हवा के झोंके से अलग बास्केट में फेंक देते हैं।",
    techSpecs: "NIR Spectroscopy Array + High-Speed Pneumatic Ejectors",
    inputOutput: "Plastic & Paper Mix ➔ Sorted Polymer Fractions",
  },
  quality: {
    id: "quality",
    name: "Quality / Contamination Sensor",
    category: "Stage",
    tag: "STAGE 8",
    tagColor: "bg-green-100 text-green-700 border-green-300",
    
    shortDesc: "सेंसर नेटवर्क मॉइश्चर, प्यूरिटी और कंटैमिनेशन लेवल की रियल-टाइम जांच करता है ताकि बेस्ट मार्केट वैल्यू मिले।",
    detailedDesc: "अंतिम छंटाई से पहले गुणवत्ता नियंत्रण प्रणाली सामग्री की आर्द्रता, विषाक्तता और शुद्धता प्रतिशत का डिजिटल प्रमाणपत्र तैयार करती है।",
    techSpecs: "Multi-Sensor Spectrometer & Moisture Capacitance Probe",
    inputOutput: "Sorted Streams ➔ Quality Certified Materials",
  },
  routing: {
    id: "routing",
    name: "WC Intelligent Routing",
    category: "Stage",
    tag: "STAGE 9",
    tagColor: "bg-purple-100 text-purple-700 border-purple-300",
    
    shortDesc: "यह AI डिसीजन इंजन कचरे के गुण (Purity & Moisture) के आधार पर उसे सबसे बेस्ट और प्रॉफिटेबल एंड-पाथवे पर स्वचालित रूप से रूट करता है।",
    detailedDesc: "वेस्टचक्र का सेंट्रल AI इंजन सभी 8 गंतव्यों की वर्तमान क्षमता और बाजार दरों के अनुसार प्रत्येक सामग्री का सर्वोत्तम रीसाइक्लिंग मार्ग तय करता है।",
    techSpecs: "Algorithmic Autonomous Chute & Diverter Gate Array",
    inputOutput: "Inspected Materials ➔ 8 Optimized Destination Channels",
  },

  // Destination Bins / End Pathways
  "plastic-recycling": {
    id: "plastic-recycling",
    name: "Plastic Recycling",
    category: "Destination Pathway",
    tag: "PATHWAY 1",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-300",
    
    shortDesc: "छांटा हुआ शुद्ध प्लास्टिक (PET, HDPE) रीसायकल होकर नए प्लास्टिक प्रोडक्ट्स और पॉलिमर दाने (Pellets) बनाने में यूज़ होता है।",
    detailedDesc: "उच्च गुणवत्ता वाले प्लास्टिक को धोकर, काटकर और पिघलाकर रीसायकल्ड प्लास्टिक पैलेट्स बनाए जाते हैं, जिनका उपयोग नई बोतलों और कंटेनरों में होता है।",
    techSpecs: "Shredding, Washing & Pellet Extrusion Plants",
    inputOutput: "Clean PET/HDPE ➔ Recycled Resin Pellets",
    targetMaterials: ["Plastic Bottles (PET)", "Milk Containers (HDPE)", "Hard Plastics"],
  },
  "paper-recovery": {
    id: "paper-recovery",
    name: "Paper / Fibre Recovery",
    category: "Destination Pathway",
    tag: "PATHWAY 2",
    tagColor: "bg-cyan-100 text-cyan-700 border-cyan-300",
    
    shortDesc: "रिकवर किया गया पेपर और गत्ता (Cardboard) पल्प मिल्स में जाकर नए रीसायकल्ड पेपर और पैकेजिग बॉक्सेज़ बनाता है।",
    detailedDesc: "कागज और कार्डबोर्ड फाइबर को दबाकर बंडलों (Bales) में बांधा जाता है और पेपर मिलों में लुगदी बनाकर दोबारा पैकेजिंग बॉक्स बनाए जाते हैं।",
    techSpecs: "Automated Hydraulic Baling & De-inking Mills",
    inputOutput: "Cardboard & Office Paper ➔ Recycled Packaging Bales",
    targetMaterials: ["Corrugated Cardboard", "Newspapers", "Office Paper"],
  },
  "metal-recovery": {
    id: "metal-recovery",
    name: "Metal Recovery",
    category: "Destination Pathway",
    tag: "PATHWAY 3",
    tagColor: "bg-slate-100 text-slate-600 border-slate-300",
    
    shortDesc: "अलग किया गया लोहा और एल्युमिनियम धातु फाउंड्रीज और रिफाइनरीज में पिघलाकर शुद्ध मेटल बनाने के लिए भेजा जाता है।",
    detailedDesc: "लोहे और एल्युमिनियम स्क्रैप को रीसाइक्लिंग फाउंड्री में पिघलाया जाता है। प्राथमिक धातु की तुलना में इसे रीसायकल करने में 95% कम ऊर्जा लगती है।",
    techSpecs: "Smelting Foundries & Induction Furnaces",
    inputOutput: "Ferrous & Non-Ferrous Scrap ➔ Metal Ingots & Sheets",
    targetMaterials: ["Food Cans (Steel)", "Beverage Cans (Aluminium)", "Metal Scrap"],
  },
  composting: {
    id: "composting",
    name: "Composting",
    category: "Destination Pathway",
    tag: "PATHWAY 4",
    tagColor: "bg-lime-100 text-lime-700 border-lime-300",
    
    shortDesc: "गीला जैविक कचरा (Food & Green Waste) कंपोस्टिंग द्वारा प्राकृतिक खाद (Organic Fertilizer) में बदलता है जो खेतों में काम आता है।",
    detailedDesc: "कार्बनिक कचरे को नियंत्रित ऑक्सीजन और नमी में बैक्टीरिया द्वारा विघटित करके पोषक तत्वों से भरपूर जैविक खाद तैयार की जाती है।",
    techSpecs: "Aerobic Windrow & In-Vessel Bio-Compost Systems",
    inputOutput: "Wet Organic Waste ➔ High-Nutrient Organic Fertilizer",
    targetMaterials: ["Food Scraps", "Vegetable Peels", "Yard Trimmings"],
  },
  "anaerobic-digestion": {
    id: "anaerobic-digestion",
    name: "Anaerobic Digestion / Biogas",
    category: "Destination Pathway",
    tag: "PATHWAY 5",
    tagColor: "bg-emerald-100 text-emerald-700 border-emerald-300",
    
    shortDesc: "ऑर्गेनिक Slurry को सीलबंद डाइजेस्टर में प्रोसेस करके ग्रीन बायोगैस (CBG) और बिजली तैयार की जाती है।",
    detailedDesc: "बिना ऑक्सीजन के एनारोबिक बैक्टीरिया कचरों को पचाकर मीथेन गैस बनाते हैं, जिसे प्यूरिफाई करके कंप्रेस्ड बायोगैस (CBG) और इलेक्ट्रिसिटी उत्पन्न की जाती है।",
    techSpecs: "Continuous Stirred-Tank Anaerobic Bio-Digester",
    inputOutput: "Organic Waste Slurry ➔ Bio-Methane Gas & Bio-Fertilizer",
    targetMaterials: ["High-moisture Kitchen Waste", "Market Waste Slurry"],
  },
  "rdf-fuel": {
    id: "rdf-fuel",
    name: "RDF / Fuel Recovery",
    category: "Destination Pathway",
    tag: "PATHWAY 6",
    tagColor: "bg-red-100 text-red-700 border-red-300",
    
    shortDesc: "नॉन-रीसाइकेबल प्लास्टिक और ड्राई वेस्ट से Refuse Derived Fuel (RDF) बनता है जो सीमेंट फैक्ट्रियों में कोयले का विकल्प है।",
    detailedDesc: "जिन प्लास्टिक या कपड़ों को रीसायकल नहीं किया जा सकता, उनका उच्च कैलोरीफिक मूल्य वाला ईंधन बंडल बनाकर सीमेंट भट्टियों में इस्तेमाल किया जाता है।",
    techSpecs: "High-Density Fuel Baling & Thermal Energy Recovery",
    inputOutput: "Combustible Dry Non-recyclables ➔ High-Calorific RDF Bales",
    targetMaterials: ["Multi-layer Plastics", "Textiles", "Contaminated Packaging"],
  },
  construction: {
    id: "construction",
    name: "Construction Material Recovery",
    category: "Destination Pathway",
    tag: "PATHWAY 7",
    tagColor: "bg-amber-100 text-amber-700 border-amber-300",
    
    shortDesc: "कांच, मलबा और इनर्ट कचरा रोड कंस्ट्रक्शन, इंटरलॉकिंग पेवर ब्लॉक्स और कंस्ट्रक्शन एग्रीगेट्स में यूज़ होता है।",
    detailedDesc: "टूटा हुआ कांच और कंक्रीट मलबा क्रश करके सीमेंट मिक्स, सड़क की नींव (Sub-base) और मजबूत पेवर टाइल्स बनाने के काम आता है।",
    techSpecs: "Jaw Crusher & Aggregate Screening Plants",
    inputOutput: "Glass Shards & Inert Debris ➔ Paving Blocks & Aggregates",
    targetMaterials: ["Glass Bottles/Shards", "Ceramic Waste", "Inert Aggregate"],
  },
  "residual-disposal": {
    id: "residual-disposal",
    name: "Residual Disposal",
    category: "Destination Pathway",
    tag: "PATHWAY 8",
    tagColor: "bg-stone-100 text-stone-600 border-stone-300",
    
    shortDesc: "बचा हुआ नॉन-यूजेबल <0.5% अवशेष ही इको-फ्रेंडली साइंटिफिक लैंडफिल में डिस्पोज़ किया जाता है।",
    detailedDesc: "संपूर्ण ऑटोमेटेड छंटाई के बाद केवल 0.5% से भी कम अनुपयोगी राख या निष्क्रिय कचरा बचता है जिसे पर्यावरण के अनुकूल लैंडफिल सेल में सुरक्षित किया जाता है।",
    techSpecs: "Engineered Scientific Landfill Liner System",
    inputOutput: "Non-processable Inert Residuals ➔ Eco-Landfill Vault",
    targetMaterials: ["Inert Fine Dust", "Non-combustible Residues"],
  },
};

// English description overrides (shortDesc / detailedDesc only — all other
// fields like techSpecs, inputOutput, targetMaterials are shared).
const EN_DESC = {
  reception: {
    shortDesc:
      "The city's unsorted wet and dry waste is emptied here into the reception hopper — the entry point of the entire process.",
    detailedDesc:
      "Primary solid waste management step where dumper trucks feed the hopper with unsorted waste. From here, waste moves at a steady rate onto the processing line.",
  },
  "ai-scanner": {
    shortDesc:
      "High-speed optics cameras and AI computer-vision models scan the waste in real time to identify material type and contamination.",
    detailedDesc:
      "Multi-spectral vision sensors and an AI neural network scan the 3D shape, colour and density of every object passing the belt to verify material purity.",
  },
  shredder: {
    shortDesc:
      "Heavy waste, plastic bags and large objects are cut into uniform small pieces (pre-sizing) so downstream sorting becomes easier.",
    detailedDesc:
      "Counter-rotating blades break large items and rip sealed plastic bags open, letting the magnetic and optical separators that follow work at maximum efficiency.",
  },
  trommel: {
    shortDesc:
      "A rotating cylindrical sieve that filters out fine organic particles based on size.",
    detailedDesc:
      "As the drum rotates, organic waste and soil fall through the mesh into the compost pit below, while larger dry waste continues down the belt.",
  },
  magnetic: {
    shortDesc:
      "Powerful overband magnets pull iron, steel and other ferrous metals out of the waste stream for recycling.",
    detailedDesc:
      "A high-intensity electro-magnet above the belt instantly pulls cans, nails and scrap towards it and drops them into a dedicated recycling bin.",
  },
  "non-ferrous": {
    shortDesc:
      "Uses an eddy-current field to repel and separate aluminium cans, copper and brass.",
    detailedDesc:
      "A fast-spinning magnet induces eddy currents in non-ferrous metals, so the repelling force flips aluminium cans into the air and into a separate bin.",
  },
  "optical-sorter": {
    shortDesc:
      "NIR laser sensors and high-pressure air jets precisely sort PET, HDPE plastics and paper.",
    detailedDesc:
      "The optical sensor recognises the resin type (PET/HDPE/PP) and fires targeted air jets that blow the plastic into a separate basket.",
  },
  quality: {
    shortDesc:
      "A sensor network monitors moisture, purity and contamination levels in real time for the best market value.",
    detailedDesc:
      "Before final sorting, the quality-control system digitally certifies the moisture, toxicity and purity percentage of every material.",
  },
  routing: {
    shortDesc:
      "This AI decision engine routes waste to the most profitable end-pathway automatically based on purity and moisture.",
    detailedDesc:
      "WasteChakra's central AI engine decides the best recycling route for every material based on the current capacity and market rates of all 8 destinations.",
  },
  "plastic-recycling": {
    shortDesc:
      "Sorted clean plastic (PET, HDPE) is recycled into new plastic products and polymer pellets.",
    detailedDesc:
      "High-quality plastic is washed, shredded and melted into recycled plastic pellets used in new bottles and containers.",
  },
  "paper-recovery": {
    shortDesc:
      "Recovered paper and cardboard reach pulp mills to make new recycled paper and packaging boxes.",
    detailedDesc:
      "Paper and cardboard fibre is pressed into bales and turned into pulp at paper mills to make new packaging boxes.",
  },
  "metal-recovery": {
    shortDesc:
      "Recovered iron and aluminium are melted at foundries and refineries to produce pure metal.",
    detailedDesc:
      "Iron and aluminium scrap is melted at recycling foundries. Recycling uses 95% less energy than producing primary metal.",
  },
  composting: {
    shortDesc:
      "Wet organic waste (food & green waste) is converted into natural organic fertilizer through composting.",
    detailedDesc:
      "Organic waste is decomposed by bacteria under controlled oxygen and moisture to produce nutrient-rich organic fertilizer for farms.",
  },
  "anaerobic-digestion": {
    shortDesc:
      "Organic slurry is processed in a sealed digester to generate green biogas (CBG) and electricity.",
    detailedDesc:
      "Without oxygen, anaerobic bacteria digest the waste to create methane, which is purified into compressed biogas (CBG) and electricity.",
  },
  "rdf-fuel": {
    shortDesc:
      "Non-recyclable plastic and dry waste become Refuse Derived Fuel (RDF), an alternative to coal in cement plants.",
    detailedDesc:
      "Plastics and textiles that cannot be recycled are baled into high-calorific fuel used in cement kilns.",
  },
  construction: {
    shortDesc:
      "Glass, rubble and inert waste are used in road construction, interlocking paver blocks and construction aggregates.",
    detailedDesc:
      "Broken glass and concrete rubble are crushed for cement mix, road sub-base and strong paver tiles.",
  },
  "residual-disposal": {
    shortDesc:
      "The remaining non-usable <0.5% residue is disposed of only in an eco-friendly scientific landfill.",
    detailedDesc:
      "After full automated sorting, less than 0.5% unusable ash or inert waste is safely placed in an environment-friendly landfill cell.",
  },
};

export const NODE_INFO_MAP_EN = Object.fromEntries(
  Object.keys(NODE_INFO_MAP).map((id) => [
    id,
    { id, ...NODE_INFO_MAP[id], ...(EN_DESC[id] ?? {}) },
  ])
);
