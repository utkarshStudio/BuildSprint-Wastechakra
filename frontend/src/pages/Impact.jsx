import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function Impact() {
  const [calcWeight, setCalcWeight] = useState(50);
  const [calcMaterial, setCalcMaterial] = useState('plastic');

  const materialFactors = {
    plastic: {
      name: 'Plastics (PET & HDPE)',
      co2ePerKg: 1.8,
      waterLitersPerKg: 24,
      kwhSavedPerKg: 5.2,
      equivalent: 'equivalent to driving 7.5 km less in a petrol car per kg diverted',
    },
    paper: {
      name: 'Paper & Cardboard',
      co2ePerKg: 1.2,
      waterLitersPerKg: 32,
      kwhSavedPerKg: 4.0,
      treesPer100Kg: 1.7,
      equivalent: 'saves mature trees from timber felling and preserves water bodies',
    },
    organic: {
      name: 'Kitchen & Organic Waste',
      co2ePerKg: 2.1, // methane avoidance
      waterLitersPerKg: 8,
      kwhSavedPerKg: 1.5,
      compostYield: 0.35, // 35% compost yield
      equivalent: 'prevents explosive methane buildup at open landfills',
    },
    metals: {
      name: 'Metals & Aluminum Cans',
      co2ePerKg: 8.5,
      waterLitersPerKg: 40,
      kwhSavedPerKg: 14.0,
      equivalent: 'saves 95% of energy compared to raw bauxite and iron ore mining',
    },
  };

  const selectedFactor = materialFactors[calcMaterial];
  const co2eTotal = (calcWeight * selectedFactor.co2ePerKg).toFixed(1);
  const waterTotal = Math.round(calcWeight * selectedFactor.waterLitersPerKg);
  const energyTotal = Math.round(calcWeight * selectedFactor.kwhSavedPerKg);

  const stats = [
    { icon: 'delete_sweep', label: 'Tons Diverted From Dumps', value: '520K', suffix: '+' },
    { icon: 'cloud_off', label: 'CO₂e Emissions Avoided', value: '184K', suffix: ' t' },
    { icon: 'local_fire_department', label: 'Clean RDF Fuel Produced', value: '68K', suffix: ' t' },
    { icon: 'people', label: 'Households Participating', value: '340K', suffix: '+' },
  ];

  const recoveryMix = [
    {
      name: 'Organic Compost (Bio-Fertilizer)',
      pct: 34,
      destination: 'Supplied directly to regional farmers and municipal nurseries to regenerate depleted soils.',
      bar: '#5b9a26',
      icon: 'yard',
    },
    {
      name: 'Refuse-Derived Fuel (RDF)',
      pct: 27,
      destination: 'High-calorific non-recyclable fractions co-processed in cement kilns to substitute fossil coal.',
      bar: '#abf854',
      icon: 'local_fire_department',
    },
    {
      name: 'Clean Polymers (PET, HDPE, PP)',
      pct: 20,
      destination: 'Washed, shredded, and pelletized into recycled flakes for textile fibers and industrial crates.',
      bar: '#2e7d32',
      icon: 'recycling',
    },
    {
      name: 'Ferrous & Non-Ferrous Metals',
      pct: 11,
      destination: 'Smelted in regional mini-mills into structural rebar, automotive castings, and beverage cans.',
      bar: '#0d2a1a',
      icon: 'precision_manufacturing',
    },
    {
      name: 'Inert Residue & Construction Aggregate',
      pct: 8,
      destination: 'Clean crushed mineral fines used for roadway base layers, soil stabilization, and interlocking pavers.',
      bar: '#94a3b8',
      icon: 'domain',
    },
  ];

  const sdgGoals = [
    {
      num: 'SDG 11',
      title: 'Sustainable Cities & Communities',
      icon: 'location_city',
      desc: 'Eliminating illegal street blackspots and preventing open toxic garbage burning in residential wards.',
    },
    {
      num: 'SDG 12',
      title: 'Responsible Consumption & Production',
      icon: 'autorenew',
      desc: 'Ensuring 92%+ of municipal discards return to circular manufacturing pipelines with digital QR passports.',
    },
    {
      num: 'SDG 13',
      title: 'Climate Action & Methane Abatement',
      icon: 'cloud_off',
      desc: 'Diverting organic food waste to aerobic composting before it decays into dangerous greenhouse methane in dumps.',
    },
    {
      num: 'SDG 8',
      title: 'Decent Work & Economic Growth',
      icon: 'badge',
      desc: 'Transitioning informal waste pickers into salaried green logistics professionals with PPE, healthcare, and dignity.',
    },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-20 md:mb-space-4xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Verified Environmental Impact</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-4xl leading-tight">
          Every kilogram tracked, every <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">gram accounted for</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-3xl leading-relaxed">
          At WasteChakra, sustainability is not a vague pledge. We log every batch with digital scale telemetry and photo evidence to deliver verified, audit-proof environmental diversion metrics.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-8">
          <Link to="/app/report" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary-container text-primary font-bold text-sm hover:bg-secondary-fixed-dim transition-all shadow-sm">
            <span>Report Waste in Your Ward</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
          <Link to="/simulation" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-low border border-surface-container-high text-primary font-bold text-sm hover:bg-surface-container-high transition-all">
            <span>Inspect Processing Plant Twin</span>
            <Icon name="precision_manufacturing" className="text-[18px]" />
          </Link>
        </div>
      </header>

      {/* Network Stats */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold">Network-Wide Verified Totals</h2>
          <span className="font-label-sm text-xs px-3 py-1 rounded-full bg-surface-container-high text-forest font-bold hidden sm:inline-block">
            Updated Daily via Facility Digital Scales
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface-container-lowest border border-surface-container-high/70 rounded-[28px] p-6 lg:p-8 hover:border-secondary transition-all">
              <div className="flex items-center gap-2 mb-3 text-forest">
                <Icon name={s.icon} className="text-xl" />
                <span className="font-label-sm text-xs text-on-surface-variant font-medium">{s.label}</span>
              </div>
              <div className="font-stat-counter text-3xl lg:text-4xl text-primary font-extrabold flex items-baseline gap-1">
                {s.value}
                <span className="text-secondary text-2xl font-bold">{s.suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Real-World Impact Calculator */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-6 md:p-10">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-2">
              <span>✳</span>
              <span>Interactive Calculator</span>
            </div>
            <h2 className="font-headline-lg text-xl md:text-3xl text-primary font-bold">
              What Is Your Real-World Impact?
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              Select your waste quantity and material type to see the exact water, electricity, and emissions your diversion saves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 bg-surface p-6 rounded-2xl border border-surface-container-high/60">
              <div>
                <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-wider block mb-2">
                  1. Choose Waste Category:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(materialFactors).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => setCalcMaterial(key)}
                      className={`p-3 rounded-xl text-left font-label-md text-xs font-bold transition-all cursor-pointer border ${
                        calcMaterial === key
                          ? 'bg-primary text-secondary-container border-primary shadow-xs'
                          : 'bg-surface-container-lowest text-on-surface border-surface-container-high hover:border-secondary'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-wider">
                    2. Select Weight:
                  </label>
                  <span className="font-stat-counter text-lg font-bold text-forest">{calcWeight} kg</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full accent-forest cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-1 font-medium">
                  <span>5 kg (1 Household bag)</span>
                  <span>100 kg (Small office)</span>
                  <span>500 kg (Society / Complex)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary-container/20 border border-secondary/30 text-xs text-primary leading-relaxed">
                <span className="font-bold">Did you know? </span>
                {selectedFactor.equivalent}
              </div>
            </div>

            {/* Live Point-Wise Outcomes (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-surface border border-surface-container-high/60 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
                    <Icon name="cloud_off" className="text-[22px]" />
                  </div>
                  <div className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                    Emissions Avoided
                  </div>
                  <div className="font-stat-counter text-3xl font-extrabold text-primary mb-1">
                    {co2eTotal} <span className="text-forest text-base font-bold">kg</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">Equivalent to avoiding methane release from rotting landfill pits.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-surface-container-high/60 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
                    <Icon name="water_drop" className="text-[22px]" />
                  </div>
                  <div className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                    Water Conserved
                  </div>
                  <div className="font-stat-counter text-3xl font-extrabold text-primary mb-1">
                    {waterTotal} <span className="text-forest text-base font-bold">L</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">Clean water saved compared to refining virgin industrial materials.</p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-surface-container-high/60 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary mb-3">
                    <Icon name="bolt" className="text-[22px]" />
                  </div>
                  <div className="font-label-sm text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
                    Energy Preserved
                  </div>
                  <div className="font-stat-counter text-3xl font-extrabold text-primary mb-1">
                    {energyTotal} <span className="text-forest text-base font-bold">kWh</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant">Electricity saved from energy-intensive extraction and smelting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where Recovered Materials Go */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-2">
              <span>✳</span>
              <span>Downstream Destinations</span>
            </div>
            <h2 className="font-headline-lg text-xl md:text-3xl text-primary font-bold">
              Where Does the Recovered Waste Actually Go?
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              92.4% of incoming mixed materials are diverted from dump yards into these 5 high-value resource streams.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {recoveryMix.map((item) => (
              <div key={item.name} className="p-4 md:p-5 rounded-2xl bg-surface border border-surface-container-high/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <Icon name={item.icon} className="text-[18px]" />
                    </div>
                    <span className="font-title-sm text-sm md:text-base text-primary font-bold">{item.name}</span>
                  </div>
                  <span className="font-stat-counter text-base font-extrabold text-forest">{item.pct}% of total input</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container-high overflow-hidden mb-2.5">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.pct}%`, backgroundColor: item.bar }} />
                </div>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-primary">Real Destination: </span>
                  {item.destination}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Alignment */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>Global Alignment</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Contributing to UN Sustainable Development Goals
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            How our grassroots Indian circular operations match global sustainability benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {sdgGoals.map((g) => (
            <div key={g.num} className="bg-surface-container-lowest p-6 rounded-[24px] border border-surface-container-high/70 flex flex-col justify-between hover:border-secondary transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-headline-sm text-sm font-extrabold px-3 py-1 rounded-full bg-secondary-container text-primary">
                    {g.num}
                  </span>
                  <Icon name={g.icon} className="text-forest text-[24px]" />
                </div>
                <h3 className="font-title-sm text-base text-primary font-bold mb-2">{g.title}</h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-forest rounded-[28px] p-space-xl md:p-space-2xl text-on-primary text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-space-md relative z-10">
            <h2 className="font-headline-lg text-headline-lg md:text-[40px] md:leading-[48px] text-surface-bright font-bold tracking-tight">
              Ready to add your household or business numbers to this board?
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
              Schedule your first recyclable pickup today. Track your cumulative kilograms, saved emissions, and earned Eco-Credits live in your dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
              <Link to="/register" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-primary font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-all shadow-lg">
                <span>Create Free Account</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/15 hover:bg-surface-container-high/25 text-surface-bright font-label-md text-label-md font-bold transition-colors">
                <span>Request ESG Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}