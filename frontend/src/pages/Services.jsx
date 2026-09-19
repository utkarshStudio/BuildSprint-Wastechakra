import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Services', icon: 'grid_view' },
    { id: 'household', label: 'Households & Citizens', icon: 'home' },
    { id: 'society', label: 'Societies & Apartments', icon: 'location_city' },
    { id: 'business', label: 'Offices & Commercial', icon: 'corporate_fare' },
    { id: 'industrial', label: 'Municipalities & Plants', icon: 'precision_manufacturing' },
  ];

  const services = [
    {
      id: 'household-pickup',
      category: 'household',
      target: 'Citizens & Homes',
      icon: 'delete_sweep',
      title: 'Doorstep Recyclable Scrap Collection',
      tagline: 'Get fair scrap value and instant Eco-Credits from your home',
      description: 'Scheduled doorstep collection for paper, cardboard, PET bottles, milk pouches, tin cans, and old utensils. Our collector weighs items on a certified digital scale right before your eyes.',
      points: [
        'Free door-to-door pickup with flexible 2-hour morning & evening slots',
        'Direct cash / UPI scrap payment or 1.5x equivalent in Eco-Credits',
        'Digital collection receipt with itemized kilogram breakdown',
      ],
      ctaText: 'Schedule Doorstep Pickup',
      ctaLink: '/app/pickups',
      ctaIcon: 'calendar_today',
    },
    {
      id: 'household-compost',
      category: 'household',
      target: 'Citizens & Homes',
      icon: 'yard',
      title: 'Home Kitchen Composting Kit & Mentorship',
      tagline: 'Turn smelly food waste into rich garden black-gold',
      description: 'A compact, odor-free dual-chamber composter kit designed for balconies and kitchens. Includes aerobic starter microbes and simple WhatsApp troubleshooting support.',
      points: [
        'Zero foul odor and zero fruit flies with natural coconut-coir microbial mix',
        'Consumes 1-2 kg of daily fruit, veggie, and tea waste effortlessly',
        'Produces rich organic plant fertilizer every 25 to 30 days',
      ],
      ctaText: 'Get a Home Compost Kit',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
    {
      id: 'society-daily',
      category: 'society',
      target: 'Apartment Societies',
      icon: 'apartment',
      title: 'Total Gated Community Waste Management',
      tagline: 'Complete 3-way segregation system for residential complexes',
      description: 'End-to-end service for apartment associations (10 to 1,000+ flats). We handle daily segregated collection of Wet, Dry, and Domestic Hazardous waste right from society gates.',
      points: [
        'Dedicated EV pickup fleet arriving daily at guaranteed morning schedules',
        'Free segregation training workshops & posters for residents and housekeeping staff',
        'Monthly "Zero-Waste Society Certificate" helping claim municipal property tax rebates',
      ],
      ctaText: 'Onboard Your Society',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
    {
      id: 'society-composter',
      category: 'society',
      target: 'Apartment Societies',
      icon: 'grass',
      title: 'On-Site Organic Waste Converters (OWC)',
      tagline: 'Process 100% of wet waste within your society campus',
      description: 'Installation and maintenance of mechanical organic waste tumblers and aerated compost bays for bulk food scrap generators, eliminating all wet waste transport costs.',
      points: [
        'Processes 100 kg to 1,000 kg of wet waste daily with minimal electricity usage',
        'All harvested compost returned to society landscaping and garden maintenance',
        'Complete preventive maintenance and technical operator supply included',
      ],
      ctaText: 'Request On-Site Audit',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
    {
      id: 'business-dumpster',
      category: 'business',
      target: 'Retail, Cafes & Offices',
      icon: 'corporate_fare',
      title: 'Commercial Bulk & Roll-Off Collection',
      tagline: 'Reliable scheduled collections tailored for business hours',
      description: 'Customized waste handling for restaurants, IT parks, retail chains, and hotels. Flexible night or early-morning collection to keep your customer-facing premises spotless.',
      points: [
        'Odor-sealed lockable wheelie bins (120L, 240L, and 1,100L options)',
        'Monthly Landfill Diversion analytics with verified carbon reduction certificates',
        'Single monthly consolidated invoice with GST compliance',
      ],
      ctaText: 'Request Business Quote',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
    {
      id: 'business-ewaste',
      category: 'business',
      target: 'Corporates & Institutions',
      icon: 'devices_other',
      title: 'Certified E-Waste & Data Destruction',
      tagline: 'R2v3 compliant disposal with tamper-proof destruction certificates',
      description: 'Secure, legally compliant disposal of retired laptops, monitors, circuit boards, batteries, and cables. Includes DoD-level hard drive degaussing and certified crushing.',
      points: [
        'Serial-number level tracking for every decommissioned IT asset',
        'Official Green Certificate of Destruction accepted by statutory auditors',
        'Maximum precious-metal and copper recovery through certified refiners',
      ],
      ctaText: 'Book E-Waste Dispatch',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
    {
      id: 'industrial-mrf',
      category: 'industrial',
      target: 'Municipalities & Smart Cities',
      icon: 'precision_manufacturing',
      title: 'Decentralized Micro-MRF Plant Operations',
      tagline: 'Turnkey sorting plants processing 10 to 100 metric tons per day',
      description: 'Design, installation, and operation of automated Material Recovery Facilities. Combines conveyor lines, trommel drums, magnetic separators, and AI optical inspection.',
      points: [
        'Achieves 92%+ diversion from open dump yards within 90 days of commissioning',
        'Built with modular local hardware for easy maintenance and low capital expenditure',
        'Integrated live dashboard showing throughput, material yield, and sales revenue',
      ],
      ctaText: 'Explore MRF Solutions',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
    {
      id: 'industrial-rdf',
      category: 'industrial',
      target: 'Cement & Power Kilns',
      icon: 'local_fire_department',
      title: 'Refuse-Derived Fuel (RDF) Supply',
      tagline: 'High-calorific alternative fuel replacing fossil coal in industrial kilns',
      description: 'High-grade homogenized combustible waste fractions processed to strict moisture (<15%), ash (<10%), and calorific specifications (>3,500 kcal/kg) for cement manufacturers.',
      points: [
        'Replaces polluting fossil coal with consistent, tested alternative fuel batches',
        'Laboratory test certificate accompanying every outgoing transport trailer',
        'Long-term guaranteed volume contracts with transparent caloric pricing',
      ],
      ctaText: 'Inquire RDF Offtake',
      ctaLink: '/contact',
      ctaIcon: 'north_east',
    },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const acceptedItems = [
    { title: 'Dry Recyclables', items: 'Cardboard boxes, newspapers, magazines, office paper, tetra packs' },
    { title: 'Plastics (All Resin Codes)', items: 'PET water bottles, shampoo jugs, milk pouches, shopping bags, food containers' },
    { title: 'Metals & Scrap', items: 'Aluminum soda cans, tin cans, scrap steel, copper wiring, brass fittings' },
    { title: 'Glassware', items: 'Clear & amber beer bottles, jam jars, glass containers (clean, unbroken)' },
    { title: 'Electronic Scrap', items: 'Phones, chargers, batteries, laptops, keyboards, wires, small appliances' },
    { title: 'Organic Kitchen Scraps', items: 'Vegetable peels, fruit rinds, tea bags, leftover rice/roti, eggshells' },
  ];

  const forbiddenItems = [
    { title: 'Biomedical & Clinical', items: 'Used needles, syringes, surgical bandages, infectious hospital items' },
    { title: 'Industrial Chemical Sludge', items: 'Corrosive acids, solvents, explosive liquids, heavy industrial sludge' },
    { title: 'Ammunition & Explosives', items: 'Flares, firecrackers, active ammunition, pressurized hazardous gas canisters' },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Our Solutions</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-4xl leading-tight">
          Clear, responsible waste services <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">tailored for everyone</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-3xl leading-relaxed">
          Whether you want scrap picked up from your home, an odor-free composting system for your apartment, or a zero-waste audit for your company — select your category below to see how we help.
        </p>
      </header>

      {/* Category Filter Bar */}
      <section className="mb-12">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-2xl bg-surface-container-low border border-surface-container-high/70 w-fit">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs md:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-secondary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high/60'
              }`}
            >
              <Icon name={cat.icon} className="text-[18px]" />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-surface-container-lowest p-6 md:p-8 rounded-[28px] border border-surface-container-high/70 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary transition-colors">
                    <Icon name={service.icon} className="text-[26px]" />
                  </div>
                  <span className="font-label-sm text-[11px] px-3 py-1 rounded-full bg-surface-container-high text-primary font-bold">
                    {service.target}
                  </span>
                </div>

                <h3 className="font-title-lg text-xl md:text-2xl text-primary font-bold mb-1">{service.title}</h3>
                <p className="font-label-md text-xs md:text-sm text-forest font-bold mb-3">{service.tagline}</p>
                <p className="font-body-md text-sm text-on-surface-variant mb-5 leading-relaxed">
                  {service.description}
                </p>

                <div className="border-t border-surface-container-high/60 pt-4 mb-6">
                  <div className="font-label-sm text-[11px] text-primary font-bold uppercase tracking-wider mb-2.5">
                    What You Receive:
                  </div>
                  <ul className="flex flex-col gap-2">
                    {service.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-on-surface-variant">
                        <Icon name="check_circle" className="text-secondary text-[16px] shrink-0 mt-0.5" />
                        <span className="leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={service.ctaLink}
                  className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-xl bg-surface-container-low group-hover:bg-secondary-container text-primary font-label-md text-sm font-bold border border-surface-container-high/80 group-hover:border-secondary transition-all"
                >
                  <span>{service.ctaText}</span>
                  <Icon name={service.ctaIcon} className="text-[18px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Point-Wise What We Accept vs What We Don't */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>Material Acceptance Guide</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              What Can Be Recovered
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              A quick point-wise checklist for your home, apartment, or company collection bins.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Accepted items (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-forest font-bold font-title-sm text-base">
                <Icon name="check_circle" className="text-secondary text-[22px]" />
                <span>Standard Accepted Materials (Clean & Segregated)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {acceptedItems.map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-surface border border-surface-container-high/60">
                    <h4 className="font-label-md text-sm text-primary font-bold mb-1">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{item.items}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Forbidden items (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-red-700 font-bold font-title-sm text-base">
                <Icon name="block" className="text-red-500 text-[22px]" />
                <span>Excluded from Regular Pickups</span>
              </div>
              <div className="flex flex-col gap-3.5">
                {forbiddenItems.map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <h4 className="font-label-md text-sm text-red-800 font-bold mb-1">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{item.items}</p>
                  </div>
                ))}
                <div className="p-3.5 rounded-xl bg-surface-container-high/40 text-xs text-on-surface-variant">
                  *Need certified clinical or hazardous disposal? Contact our specialized compliance wing for dedicated chain-of-custody handling.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-forest rounded-[28px] p-space-xl md:p-space-2xl text-on-primary text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-space-md relative z-10">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/15 backdrop-blur-sm text-secondary-fixed font-eyebrow-tag text-eyebrow-tag font-bold uppercase">
              <span>✳</span>
              <span>Need a Tailored Plan?</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg md:text-[44px] md:leading-[52px] text-surface-bright font-bold tracking-tight">
              Let us design a zero-waste program that works for your schedule.
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
              From a single household scrap bag to a 500-apartment society or industrial plant, our coordinators get you set up in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
              <Link to="/contact" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-primary font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-all shadow-lg">
                <span>Talk to a Coordinator</span>
                <Icon name="north_east" className="text-[18px]" />
              </Link>
              <Link to="/how-it-works" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/15 hover:bg-surface-container-high/25 text-surface-bright font-label-md text-label-md font-bold transition-colors">
                <span>See How It Works</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
