import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function HowItWorks() {
  const [selectedRole, setSelectedRole] = useState('citizen');

  const roleJourneys = {
    citizen: {
      role: 'Citizen & Resident',
      badge: 'At Home',
      tagline: 'How you schedule scrap pickups, report street waste, and earn rewards',
      steps: [
        {
          num: '01',
          title: 'Snap a Photo & Check AI Sorting',
          detail: 'Take a quick photo of your recyclables or street garbage. Our AI vision instantly identifies the materials (plastic, organic, paper, metal) and suggests the right bin.',
          icon: 'photo_camera',
        },
        {
          num: '02',
          title: 'Pick a Date & Confirm Location',
          detail: 'Choose a convenient 2-hour collection slot. Tap "Use My Live Location" to pin your exact doorstep on the Leaflet map so the collector finds you without endless phone calls.',
          icon: 'location_on',
        },
        {
          num: '03',
          title: 'Collector Arrives with Digital Scale',
          detail: 'A uniformed eco-collector arrives in an electric loader. Every item is weighed on a certified scale, and a before/after verification photo is recorded.',
          icon: 'scale',
        },
        {
          num: '04',
          title: 'Instant Cash or Eco-Credits Earned',
          detail: 'Receive immediate UPI payment or 1.5x equivalent in Eco-Credits directly in your wallet, redeemable for organic compost bags, grocery vouchers, or utility bill perks.',
          icon: 'payments',
        },
        {
          num: '05',
          title: 'Track Your Digital Waste Passport',
          detail: 'Open your dashboard to view the QR Waste Passport proving your waste reached an authorized recycler or compost unit instead of an open landfill.',
          icon: 'qr_code_scanner',
        },
      ],
    },
    collector: {
      role: 'Sanitation Collector',
      badge: 'On the Road',
      tagline: 'How our green fleet accepts tasks, optimizes routes, and secures dignified pay',
      steps: [
        {
          num: '01',
          title: 'Receive Nearby Pickup Alerts',
          detail: 'Get instant notifications on your Collector Panel for scheduled household scrap pickups and verified community blackspots within your assigned zone.',
          icon: 'notifications_active',
        },
        {
          num: '02',
          title: 'Turn-by-Turn Smart EV Navigation',
          detail: 'Our route engine batches nearby pickups, cutting travel distance by 40% and saving battery power on your electric loader.',
          icon: 'route',
        },
        {
          num: '03',
          title: 'Digital Weighment & Quality Check',
          detail: 'Weigh scrap batches, log category weights in the mobile app, and take customer verification photos in 30 seconds.',
          icon: 'check_circle',
        },
        {
          num: '04',
          title: 'Offload at Neighborhood Micro-MRF',
          detail: 'Deliver sorted loads to the nearest WasteChakra processing hub. Automated barcode gates verify the batch weight automatically upon arrival.',
          icon: 'local_shipping',
        },
        {
          num: '05',
          title: 'Guaranteed Daily Pay & Performance Bonus',
          detail: 'Earnings, fuel allowance, and collection incentives are deposited directly into your bank account with full health coverage and insurance.',
          icon: 'account_balance_wallet',
        },
      ],
    },
    facility: {
      role: 'Facility & Business Partner',
      badge: 'At the Plant',
      tagline: 'How decentralized sorting plants process and return resources to industry',
      steps: [
        {
          num: '01',
          title: 'Incoming Manifest & QR Registration',
          detail: 'Every incoming truckload is logged into the digital ledger with origin district, tare weight, and initial moisture estimation.',
          icon: 'inventory_2',
        },
        {
          num: '02',
          title: 'Mechanical Pre-Screening & Trommel',
          detail: 'Bag breakers open compacted sacks while rotary trommel screens separate fine organic matter from bulk recyclable packaging.',
          icon: 'filter_alt',
        },
        {
          num: '03',
          title: 'Magnetic & Optical Robotic Sorting',
          detail: 'High-speed magnets extract steel/iron, eddy currents repel aluminum, and optical vision cameras classify polymer types (PET, HDPE, PP).',
          icon: 'precision_manufacturing',
        },
        {
          num: '04',
          title: 'Refuse-Derived Fuel (RDF) Pelleting',
          detail: 'Combustible non-recyclables are shredded and dried into high-caloric fuel pellets (>3,500 kcal/kg) for cement kilns to replace coal.',
          icon: 'local_fire_department',
        },
        {
          num: '05',
          title: 'Certified Zero-Landfill Dispatch',
          detail: 'Recovered materials are baled and dispatched to certified re-processors. Audit-ready ESG compliance certificates are automatically issued.',
          icon: 'verified',
        },
      ],
    },
  };

  const loopStages = [
    {
      num: '1',
      title: 'Report & Segregate',
      icon: 'flag',
      desc: 'Citizens snap photos and segregate dry scrap from kitchen waste.',
    },
    {
      num: '2',
      title: 'Recover & Transport',
      icon: 'local_shipping',
      desc: 'EV loaders collect verified batches with digital scale manifests.',
    },
    {
      num: '3',
      title: 'Process & Value-Add',
      icon: 'precision_manufacturing',
      desc: 'Decentralized MRF separates compost, pure recyclables, and RDF fuel.',
    },
    {
      num: '4',
      title: 'Reward & Remunerate',
      icon: 'emoji_events',
      desc: 'Citizens get Eco-Credits; collectors receive guaranteed fair wages.',
    },
    {
      num: '5',
      title: 'Remanufacture & Repeat',
      icon: 'autorenew',
      desc: 'Raw materials re-enter factories, completely preventing landfilling.',
    },
  ];

  const mrfStages = [
    { num: 1, icon: 'inventory_2', title: 'Reception Bay', desc: 'Incoming waste is weighed on bridge scales and assigned a traceable QR lot ID.' },
    { num: 2, icon: 'hardware', title: 'Mechanical Bag Opener', desc: 'Twin low-speed shafts split bags open without breaking bottles or containers.' },
    { num: 3, icon: 'filter_alt', title: 'Trommel Drum Sieve', desc: 'Rotary mesh drum separates fine organic dirt (<80mm) from dry packaging.' },
    { num: 4, icon: 'toys', title: 'Magnetic Cross-Belt', desc: 'Powerful overhead electromagnet extracts ferrous iron, tins, and wire nails.' },
    { num: 5, icon: 'bolt', title: 'Eddy Current Separator', desc: 'Repels non-ferrous aluminum cans, soda foils, and copper into separate hoppers.' },
    { num: 6, icon: 'visibility', title: 'Optical AI Sorter', desc: 'High-speed cameras identify PET, HDPE, and cardboard; air jets sort them into bins.' },
    { num: 7, icon: 'verified', title: 'Manual Purity Audit', desc: 'Trained staff inspect lines to ensure recovered bales reach 99.5% purity standards.' },
    { num: 8, icon: 'yard', title: 'Aerobic Compost Channel', desc: 'Wet kitchen waste is aerated and turned into dark, odorless bio-fertilizer in 21 days.' },
    { num: 9, icon: 'local_fire_department', title: 'RDF Fuel Pelleting', desc: 'Non-recyclable plastics are shredded and conditioned into clean fuel for cement kilns.' },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>How It Works</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-4xl leading-tight">
          From doorstep waste to <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">circular resources</span> in plain steps
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-3xl leading-relaxed">
          No complex jargon or hidden steps. See exactly how our system works depending on whether you are a resident scheduling a pickup, an eco-collector on the road, or an industrial facility processing materials.
        </p>
      </header>

      {/* Role Selection Tabs */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-surface-container-low border border-surface-container-high/70 w-fit">
          <button
            onClick={() => setSelectedRole('citizen')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs md:text-sm font-bold transition-all cursor-pointer ${
              selectedRole === 'citizen'
                ? 'bg-primary text-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60'
            }`}
          >
            <Icon name="home" className="text-[18px]" />
            <span>I am a Citizen / Household</span>
          </button>
          <button
            onClick={() => setSelectedRole('collector')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs md:text-sm font-bold transition-all cursor-pointer ${
              selectedRole === 'collector'
                ? 'bg-primary text-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60'
            }`}
          >
            <Icon name="local_shipping" className="text-[18px]" />
            <span>I am an Eco-Collector</span>
          </button>
          <button
            onClick={() => setSelectedRole('facility')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs md:text-sm font-bold transition-all cursor-pointer ${
              selectedRole === 'facility'
                ? 'bg-primary text-secondary-container shadow-sm'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60'
            }`}
          >
            <Icon name="precision_manufacturing" className="text-[18px]" />
            <span>I am a Facility / Recycler</span>
          </button>
        </div>
      </section>

      {/* Role Journey Flow (5 Steps) */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest p-6 md:p-10 rounded-[28px] border border-surface-container-high/70 shadow-sm">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-surface-container-high/60 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-xs font-bold mb-2">
                <Icon name="verified" className="text-secondary text-[16px]" />
                <span>{roleJourneys[selectedRole].badge} Journey</span>
              </div>
              <h2 className="font-headline-md text-xl md:text-2xl text-primary font-bold">
                {roleJourneys[selectedRole].role} Workflow
              </h2>
              <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
                {roleJourneys[selectedRole].tagline}
              </p>
            </div>
            {selectedRole === 'citizen' && (
              <Link to="/app/pickups" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary-container text-primary font-bold text-xs md:text-sm hover:bg-secondary-fixed-dim transition-all shrink-0">
                <span>Book a Pickup Now</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roleJourneys[selectedRole].steps.map((step, idx) => (
              <div key={step.num} className="p-5 rounded-2xl bg-surface border border-surface-container-high/70 flex flex-col justify-between hover:border-secondary transition-all group">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-headline-sm text-lg font-extrabold text-forest">{step.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary transition-colors">
                      <Icon name={step.icon} className="text-[20px]" />
                    </div>
                  </div>
                  <h3 className="font-title-md text-sm md:text-base text-primary font-bold mb-2 leading-snug">{step.title}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 5-Stage Circular Loop */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>The Closed Loop</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              Report → Recover → Process → Reward → Repeat
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              A self-sustaining cycle where materials never go to waste, and every responsible action is acknowledged.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {loopStages.map((stage) => (
              <div key={stage.num} className="p-5 rounded-2xl bg-surface border border-surface-container-high/60 text-center flex flex-col items-center group hover:border-secondary transition-all">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-3 transition-colors">
                  <Icon name={stage.icon} className="text-[24px]" />
                </div>
                <div className="font-label-sm text-[11px] text-secondary font-bold uppercase tracking-wider mb-1">
                  Stage 0{stage.num}
                </div>
                <h4 className="font-title-sm text-sm md:text-base text-primary font-bold mb-1.5">{stage.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9-Stage MRF Sorting Technology (Explained in Everyday Terms) */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="text-center max-w-3xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>Plant Technology</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            Inside the AI Material Recovery Facility (MRF)
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Here is how mixed city waste is separated into clean, sellable resources in 9 automated mechanical and optical stages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {mrfStages.map((stg) => (
            <div key={stg.num} className="bg-surface-container-lowest p-5 md:p-6 rounded-[24px] border border-surface-container-high/70 hover:border-secondary hover:shadow-md transition-all flex flex-col group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-secondary-container text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {stg.num}
                </div>
                <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary group-hover:bg-secondary-container/40 transition-colors shrink-0">
                  <Icon name={stg.icon} className="text-[20px]" />
                </div>
                <h3 className="font-title-sm text-sm md:text-base text-primary font-bold leading-tight">{stg.title}</h3>
              </div>
              <p className="font-body-sm text-xs md:text-sm text-on-surface-variant leading-relaxed pl-11">
                {stg.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Simulator Callout Banner */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-forest rounded-[28px] p-8 md:p-space-2xl text-on-primary relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/15 backdrop-blur-sm text-secondary-fixed font-eyebrow-tag text-xs font-bold uppercase w-fit">
                <Icon name="smart_toy" className="text-[16px]" />
                <span>Try It Right in Your Browser</span>
              </div>
              <h2 className="font-headline-lg text-2xl md:text-4xl text-surface-bright font-bold tracking-tight">
                Want to see our AI optical sorter and conveyor in action?
              </h2>
              <p className="font-body-md text-sm md:text-base text-primary-fixed-dim max-w-2xl leading-relaxed">
                Launch our 3-stage interactive Digital Twin. You can upload any street or household waste photo (or use a 1-click sample) to watch the AI scanner, conveyor station, and 4-way routing matrix live.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end justify-center">
              <Link to="/simulation" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary-container text-primary font-bold text-sm hover:bg-secondary-fixed-dim transition-all shadow-lg w-full sm:w-auto text-center">
                <Icon name="play_arrow" className="text-[20px]" />
                <span>Launch Interactive Simulation</span>
              </Link>
              <Link to="/app/report" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-surface-container-high/15 hover:bg-surface-container-high/25 text-surface-bright font-bold text-sm transition-colors w-full sm:w-auto text-center">
                <span>Report Waste in Your Area</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
