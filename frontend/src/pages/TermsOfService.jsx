import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function TermsOfService() {
  const commitments = [
    {
      icon: 'verified_user',
      title: 'Reliable Scheduling',
      description: 'Guaranteed collection windows backed by algorithmic fleet dispatch and real-time transit telemetry.',
    },
    {
      icon: 'balance',
      title: 'Fair Weighment',
      description: 'Standardized calibration protocols on all handheld and facility scales for dispute-free weight logging.',
    },
    {
      icon: 'recycling',
      title: '100% Circular Chain',
      description: 'Zero unauthorized dumping or diversion to unregulated open burning; strictly certified recovery pathways.',
    },
    {
      icon: 'military_tech',
      title: 'Verified Rewards',
      description: 'Transparent Chakra Point earning schedules redeemable for eco-friendly goods, utility credits, and tree planting.',
    },
  ];

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      items: [
        'By registering, accessing, or scheduling services through WasteChakra (the "Platform"), you enter into a legally binding agreement with WasteChakra Circular Sustainability Inc.',
        'These Terms govern all accounts — including Citizens, Commercial Generators, Registered Waste Pickers/Collectors, and Facility Operators.',
        'If you do not accept these terms in full, you must refrain from scheduling pickups or engaging downstream facilities through the platform.',
      ],
    },
    {
      id: 'waste-handling',
      title: '2. Waste Segregation & Prohibited Items',
      items: [
        'Mandatory Segregation: Users agree to pre-sort municipal solid waste into designated dry, wet, and sanitary categories prior to collector arrival.',
        'Strictly Prohibited Substances: Industrial biohazards, medical sharps/pathological waste without special authorization, explosive ordnance, and unlabelled chemical drums.',
        'Contamination Thresholds: Collectors reserve the right to flag heavily contaminated recyclables or request re-sorting before issuing pickup verification manifests.',
      ],
    },
    {
      id: 'sla',
      title: '3. Service Level Agreements & Cancellations',
      items: [
        'On-Demand Pickups: Bookings confirmed with a specified collection window can be modified or cancelled without penalty up to 2 hours prior to the scheduled slot.',
        'No-Show Policy: If a collector arrives and the premises are inaccessible after 10 minutes of attempted contact, a nominal redispatch fee may be assessed.',
        'Weather & Emergency Delays: Fleet dispatch operations may be paused during severe weather or civic emergencies with immediate in-app notifications.',
      ],
    },
    {
      id: 'passports',
      title: '4. Digital Waste Passports & Legal Provenance',
      items: [
        'Each completed pickup generates a tamper-evident digital Waste Passport logging collection timestamp, GPS coordinates, gross/net weights, and downstream facility ID.',
        'Passports constitute proof of responsible disposal for statutory audits, municipal housing society compliance, and corporate Extended Producer Responsibility (EPR) reporting.',
        'Falsification of weight or fraudulent claiming of waste streams will result in immediate termination of platform privileges and notification of municipal authorities.',
      ],
    },
    {
      id: 'chakra-points',
      title: '5. Chakra Points & Rewards Program',
      items: [
        'Chakra Points are earned based on verified dry waste and recyclable volume handed over to authorized collectors.',
        'Points possess no cash redemption value outside the platform ecosystem and cannot be transferred between unverified third-party accounts.',
        'WasteChakra reserves the right to adjust reward redemption catalog items and point conversion tiers with 30 days prior notice.',
      ],
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      items: [
        'WasteChakra provides matching and digital tracking technology connecting generators with licensed logistics partners. We maintain general commercial liability insurance covering verified fleet operations.',
        'Neither party shall be liable for indirect, incidental, or consequential damages arising from unforeseen logistic interruptions or downstream processing plant outages.',
      ],
    },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Terms & Conditions</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-5xl leading-tight">
          Terms of Service & <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">Platform Rules</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-2xl">
          Clear, equitable, and transparent terms governing on-demand pickups, digital waste passports, rewards distribution, and processing accountability.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-on-surface-variant font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="today" className="text-[14px]" /> Effective: September 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="badge" className="text-[14px] text-secondary" /> Version 3.2
          </span>
        </div>
      </header>

      {/* Commitments Grid */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {commitments.map((c) => (
            <div key={c.title} className="bg-surface-container-lowest p-space-lg rounded-[28px] border border-surface-container-high/70 hover:border-secondary transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-primary mb-space-md">
                <Icon name={c.icon} className="text-[24px]" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">{c.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sections Content */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="flex flex-col gap-12">
            {sections.map((sec) => (
              <div key={sec.id} className="border-b border-surface-container-high/60 pb-8 last:border-b-0 last:pb-0">
                <h2 className="font-headline-sm text-xl md:text-2xl text-primary font-bold mb-4">
                  {sec.title}
                </h2>
                <ul className="flex flex-col gap-3">
                  {sec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Icon name="check_circle" className="text-secondary text-[18px] mt-1 shrink-0" />
                      <span className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resolution & Help Banner */}
      <section>
        <div className="bg-surface-container-high/40 rounded-[28px] border border-surface-container-high p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-headline-sm text-xl text-primary font-bold">Questions about these Terms?</h3>
            <p className="font-body-md text-on-surface-variant mt-1 text-sm">
              Our compliance and legal counsel teams are available for contract clarification and bulk enterprise SLAs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:legal@wastechakra.org"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-surface-bright font-bold text-xs hover:bg-primary-container transition-all shadow-sm"
            >
              <Icon name="mail" className="text-[16px]" />
              Contact Legal Office
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-container-highest text-primary font-bold text-xs hover:bg-surface-container-lowest transition-all"
            >
              Customer Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
