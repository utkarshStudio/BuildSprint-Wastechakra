import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function About() {
  const ecosystemPillars = [
    {
      role: 'Citizens & Homes',
      icon: 'home',
      badge: 'At the Source',
      points: [
        'Report open waste blackspots in 30 seconds with photos and live GPS location',
        'Schedule door-to-door dry scrap and e-waste pickups at preferred time slots',
        'Earn instant Eco-Credits for every kilogram of segregated waste handed over',
      ],
    },
    {
      role: 'Sanitation Collectors',
      icon: 'local_shipping',
      badge: 'Ground Fleet',
      points: [
        'Guaranteed minimum living wages, medical insurance, and proper protective PPE kits',
        'Route-optimized electric vehicles (EV loaders) reducing transport carbon by 65%',
        'Digital scales with instant weighment verification and customer receipt generation',
      ],
    },
    {
      role: 'Smart MRF Facilities',
      icon: 'precision_manufacturing',
      badge: 'Processing Nodes',
      points: [
        'Decentralized mini-plants situated close to communities to eliminate long transport',
        'Multi-stage sorting with mechanical trommels, magnetic belts, and optical AI vision',
        'High-calorific non-recyclables converted into certified Refuse-Derived Fuel (RDF)',
      ],
    },
    {
      role: 'Circular Recyclers',
      icon: 'recycling',
      badge: 'Resource Offtake',
      points: [
        'Direct supply to authorized plastic pelletizers, paper mills, and metal foundries',
        '100% chain-of-custody documentation with digital QR Waste Passports',
        'Organic compost supplied directly to local urban farmers and municipal green belts',
      ],
    },
  ];

  const values = [
    {
      icon: 'visibility',
      title: 'Full Transparency',
      subtitle: 'Zero Hidden Dumps',
      description: 'Every collection is logged with geo-tagged before/after photos and digital weight manifests so you know exactly where your waste ends up.',
    },
    {
      icon: 'qr_code_scanner',
      title: 'Digital Traceability',
      subtitle: 'Verified QR Passports',
      description: 'Each pickup batch generates an encrypted Waste Passport tracking materials from your doorstep through the sorting plant to the end recycler.',
    },
    {
      icon: 'groups',
      title: 'Community Empowerment',
      subtitle: 'Cleaner Neighborhoods',
      description: 'Rewarding citizens and housing societies who segregate at the source, transforming daily cleanliness into a shared community victory.',
    },
    {
      icon: 'psychology',
      title: 'AI & Optical Innovation',
      subtitle: 'Continuous Accuracy',
      description: 'Computer vision classifiers detect PET, HDPE, cardboard, and organics in real time, continuously boosting recovery yields to over 92%.',
    },
  ];

  const pipeline = [
    {
      stage: '01',
      title: 'Incoming Waste Reception & Weigh-In',
      tag: 'Logistics',
      description: 'Collection EV trucks arrive at the decentralized hub. Incoming batches are scanned, logged with digital weight sensors, and assigned a QR lot manifest.',
    },
    {
      stage: '02',
      title: 'Mechanical Bag Opening & Pre-Screening',
      tag: 'Preparation',
      description: 'Slow-speed dual shafts safely rip open garbage sacks without shattering glass bottles or crushing plastic containers.',
    },
    {
      stage: '03',
      title: 'Trommel Drum Sieve (Particle Sizing)',
      tag: 'Classification',
      description: 'A large rotating perforated cylinder separates fine organic soil (<80mm) from mid-sized packaging and oversized bulk items.',
    },
    {
      stage: '04',
      title: 'Overhead Electromagnets (Ferrous Metals)',
      tag: 'Extraction',
      description: 'High-intensity cross-belt magnets automatically hoist out iron cans, steel wires, bottle caps, and nails with 99% capture efficiency.',
    },
    {
      stage: '05',
      title: 'Eddy-Current Separator (Non-Ferrous Metals)',
      tag: 'Extraction',
      description: 'Rapidly alternating magnetic rotors induce eddy currents that launch aluminum cans, foil lids, and copper parts off the conveyor into a dedicated bin.',
    },
    {
      stage: '06',
      title: 'Optical AI & Computer Vision Classification',
      tag: 'AI Intelligence',
      description: 'High-speed line-scan cameras and neural vision models categorize plastics into PET bottles, HDPE jugs, PP containers, and flexible multilayer films in milliseconds.',
    },
    {
      stage: '07',
      title: 'Manual Quality Assurance & Purity Check',
      tag: 'Quality Control',
      description: 'Trained technical operators conduct inline audits to remove stray contaminants, ensuring each material bale meets 99.5% commercial recycling purity.',
    },
    {
      stage: '08',
      title: 'Organic Food Waste Composting',
      tag: 'Composting',
      description: 'Wet kitchen scraps and greens are channeled to aerobic compost pits with microbial inoculants, producing dark, nutrient-rich soil manure within 21 days.',
    },
    {
      stage: '09',
      title: 'RDF Conditioning (Refuse-Derived Fuel)',
      tag: 'Clean Energy',
      description: 'Non-recyclable high-calorific plastics, textiles, and clean dry biomass are shredded, moisture-balanced, and densified into fuel pellets with >3,500 kcal/kg.',
    },
    {
      stage: '10',
      title: 'Clean Resource Distribution & Zero-Landfill Offtake',
      tag: 'Circular Economy',
      description: 'Recyclables go to factories, compost goes to farmers, and RDF goes to cement kilns to replace coal. Zero waste is dumped or burned.',
    },
  ];

  const problemVsSolution = [
    {
      problem: 'Open Dumps & Landfill Fires',
      problemDesc: 'Mixed trash dumped in outskirts generates toxic methane, catches fire, and pollutes city air for months.',
      solution: 'Source Segregation & Recovery',
      solutionDesc: 'Over 92% of waste is sorted into recyclables, compost, and clean fuel at decentralized neighborhood hubs.',
    },
    {
      problem: 'Contaminated Groundwater',
      problemDesc: 'Rainwater leaches toxic chemicals and microplastics from unmanaged dumps straight into underground aquifers.',
      solution: 'Dry & Sealed Processing',
      solutionDesc: 'Zero contact with the soil. Wet organics are aerobically composted while dry resources remain clean and dry.',
    },
    {
      problem: 'Informal Worker Exploitation',
      problemDesc: 'Waste pickers handle sharp, hazardous garbage barehanded without safety gear, medical care, or stable income.',
      solution: 'Dignified Green Careers',
      solutionDesc: 'Collectors receive safety PPE, verified digital payouts, insurance, and professional recognition as eco-heroes.',
    },
  ];

  const stats = [
    { value: '520K+', label: 'Tons Diverted', sub: 'Saved from open dumping & burning' },
    { value: '92.4%', label: 'Recovery Rate', sub: 'Materials turned into compost, recyclables & RDF' },
    { value: '120+', label: 'Municipal Zones', sub: 'Active collection & sorting routes' },
    { value: '< 2 hrs', label: 'Average Response', sub: 'For verified street waste reports' },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-20 md:mb-space-4xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>About WasteChakra</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-5xl leading-tight">
          Turning everyday waste into <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">valuable, verifiable resources</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-3xl leading-relaxed">
          WasteChakra is a circular waste-management platform that connects citizens, sanitation collectors, and modern processing facilities. By combining smart digital dispatch, AI optical inspection, and decentralized sorting, we keep waste out of landfills and return it to productive use.
        </p>
      </header>

      {/* 4 Pillars of the Ecosystem */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>How Our Ecosystem Connects</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            The 4 Key Players Making It Happen
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            A united, transparent loop where everyone is empowered and rewarded for doing the right thing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {ecosystemPillars.map((pillar) => (
            <div key={pillar.role} className="bg-surface-container-lowest p-space-lg rounded-[28px] border border-surface-container-high/70 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-space-md">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary transition-colors">
                    <Icon name={pillar.icon} className="text-[26px]" />
                  </div>
                  <span className="font-label-sm text-[11px] px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-bold">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-space-sm">{pillar.role}</h3>
                <ul className="flex flex-col gap-2.5 text-on-surface-variant font-body-sm text-sm">
                  {pillar.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon name="check_circle" className="text-secondary text-[16px] shrink-0 mt-0.5" />
                      <span className="leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem vs Solution (Point-Wise) */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>Why We Built WasteChakra</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              Solving Real Problems With Practical Systems
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Traditional garbage collection just moves rubbish from streets to massive open dump yards. Here is how we change the equation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {problemVsSolution.map((item, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-surface-container-high/80 overflow-hidden bg-surface">
                <div className="p-space-md bg-red-500/10 border-b border-red-500/20">
                  <div className="flex items-center gap-2 text-red-700 font-bold font-label-md text-sm mb-1">
                    <Icon name="block" className="text-[18px]" />
                    <span>The Old Problem</span>
                  </div>
                  <h4 className="font-title-md text-primary font-bold">{item.problem}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.problemDesc}</p>
                </div>
                <div className="p-space-md bg-emerald-500/10 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-forest font-bold font-label-md text-sm mb-1">
                      <Icon name="check_circle" className="text-[18px] text-secondary" />
                      <span>The WasteChakra Fix</span>
                    </div>
                    <h4 className="font-title-md text-primary font-bold">{item.solution}</h4>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.solutionDesc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>What Guides Us</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Our 4 Operating Principles
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Clear commitments we uphold in every pickup, every weighment, and every facility audit.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {values.map((value) => (
            <div key={value.title} className="bg-surface-container-lowest p-space-lg rounded-[28px] border border-surface-container-high/70 hover:border-secondary hover:shadow-lg transition-all flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-space-md transition-colors">
                <Icon name={value.icon} className="text-[26px]" />
              </div>
              <span className="font-label-sm text-[11px] text-secondary font-bold uppercase tracking-wider mb-1">{value.subtitle}</span>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">{value.title}</h3>
              <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10-Stage Pipeline - Fully explained point-by-point */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="text-center max-w-3xl mx-auto mb-space-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>Processing Architecture</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              10-Stage Circular Facility Pipeline
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Take a walk through our decentralized Material Recovery Facility (MRF). Each stage is engineered to extract maximum value from mixed waste without secondary pollution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {pipeline.map((item) => (
              <div key={item.stage} className="p-5 rounded-2xl bg-surface border border-surface-container-high/60 hover:border-secondary transition-all flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary-container text-primary font-headline-sm text-base font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                  {item.stage}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-title-sm text-base text-primary font-bold truncate">{item.title}</h3>
                    <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-bold shrink-0 uppercase">
                      {item.tag}
                    </span>
                  </div>
                  <p className="font-body-sm text-xs md:text-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-surface-container-high/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary font-label-md text-sm font-bold">
              <Icon name="verified" className="text-secondary text-[20px]" />
              <span>Result: 0% open burning, 0% untreated landfill, 100% material accounting.</span>
            </div>
            <Link to="/simulation" className="inline-flex items-center gap-1.5 font-label-md text-sm font-bold text-primary hover:text-forest underline underline-offset-4">
              <span>View this pipeline in 3D Plant Simulation</span>
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>Verified Track Record</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Our Measurable Ground Impact
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest p-space-xl rounded-[28px] border border-surface-container-high/70 hover:border-secondary hover:shadow-lg transition-all text-center flex flex-col items-center">
              <span className="font-stat-counter text-3xl md:text-stat-counter text-primary font-extrabold tracking-tight leading-none">{stat.value}</span>
              <span className="font-label-md text-[11px] md:text-label-md text-forest font-bold mt-space-xs uppercase tracking-wider">{stat.label}</span>
              <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-forest rounded-[28px] p-space-xl md:p-space-2xl text-on-primary text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-space-md relative z-10">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/15 backdrop-blur-sm text-secondary-fixed font-eyebrow-tag text-eyebrow-tag font-bold uppercase">
              <span>✳</span>
              <span>Join The Circular Loop</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg md:text-[44px] md:leading-[52px] text-surface-bright font-bold tracking-tight">
              Ready to make waste your neighborhood's greatest asset?
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
              Whether you are an individual household, apartment society, local shop, or industrial park — we make responsible recovery easy and rewarding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
              <Link to="/contact" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-primary font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-all shadow-lg">
                <span>Talk to Our Team</span>
                <Icon name="north_east" className="text-[18px]" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/15 hover:bg-surface-container-high/25 text-surface-bright font-label-md text-label-md font-bold transition-colors">
                <span>Explore All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
