import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function EnvironmentalCompliance() {
  const certifications = [
    {
      code: 'ISO 14001',
      title: 'Environmental Management',
      desc: 'Certified systematic approach to measuring and improving resource efficiency across sorting hubs.',
      icon: 'verified_user',
    },
    {
      code: 'CPCB / SPCB',
      title: 'Pollution Control Board',
      desc: 'Full statutory compliance with Central and State Pollution Control Board solid waste handling directives.',
      icon: 'policy',
      iconFallback: 'balance',
    },
    {
      code: 'PWM 2024',
      title: 'Plastic Waste Rules',
      desc: 'Extended Producer Responsibility (EPR) certification with digital batch traceability for corporate brands.',
      icon: 'recycling',
    },
    {
      code: 'GHG Protocol',
      title: 'Carbon Abatement',
      desc: 'Third-party validated carbon emission reduction methodologies for methane diversion from municipal dumpsites.',
      icon: 'eco',
    },
  ];

  const compliancePillars = [
    {
      title: 'Extended Producer Responsibility (EPR)',
      tag: 'Statutory Obligation',
      description: 'We enable FMCG and packaging brands to fulfill 100% of their statutory EPR obligations through end-to-end digital tracking. Every kilogram collected is validated with GPS breadcrumbs, weighbridge receipts, and verified processor certificates.',
      points: [
        'CPCB portal automated ledger integration',
        'Physical and chemical recycling verification',
        'Quarterly audit-ready ESG filing manifests',
      ],
    },
    {
      title: 'Zero-Landfill Processing Standard',
      tag: 'Operational Mandate',
      description: 'Our proprietary MRF workflow sorts municipal waste into 10 distinct streams. Non-recyclable high-calorific combustibles are converted into Refuse Derived Fuel (RDF) conforming to industrial co-processing standards, leaving zero residue for unlined landfills.',
      points: [
        '96% material recovery extraction yield',
        'Moisture-conditioned RDF for green cement kilns',
        'Zero unauthorized dumping policy strictly enforced',
      ],
    },
    {
      title: 'Hazardous & E-Waste Segregation',
      tag: 'Safety Protocol',
      description: 'Toxics, heavy metals, and electronics are isolated at the first point of collection. Handled exclusively by authorized handlers with hazardous waste manifests (Form 10) complying with E-Waste Management Rules.',
      points: [
        'Closed-loop logistics for lithium batteries & PCBs',
        'Sealed containment containers during transport',
        'Certified downstream dismantling partners',
      ],
    },
    {
      title: 'Scope 3 Carbon Accounting',
      tag: 'Sustainability Metrics',
      description: 'We deliver real-time carbon offsets calculation using emission factors vetted by climate scientists. Housing societies and enterprises receive quantifiable CO2e reduction statements with verifiable methodology.',
      points: [
        '2.4 kg CO2e diverted per kg of recycled plastic',
        'Methane avoidance modeling for diverted wet waste',
        'Exportable GHG Protocol Scope 3 audit spreadsheets',
      ],
    },
  ];

  const auditWorkflow = [
    { step: '01', title: 'Source Manifest', desc: 'Pickup weight logged via calibrated handheld scales with timestamp and geo-stamp.' },
    { step: '02', title: 'Hub Verification', desc: 'Gross tare weighbridge verification upon arrival at regional material recovery facility.' },
    { step: '03', title: 'Fraction Sort', desc: 'Material segregated into PET, HDPE, cardboard, organics, and RDF combustible fractions.' },
    { step: '04', title: 'Certificate Issued', desc: 'Digital Waste Passport finalized with immutable SHA-256 certificate for audit filing.' },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Eco Standards & Audits</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-5xl leading-tight">
          Environmental Compliance & <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">Zero-Landfill Mandates</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-2xl">
          WasteChakra operates in strict alignment with national and international environmental directives, delivering uncompromised regulatory assurance for municipalities, housing communities, and enterprise partners.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-on-surface-variant font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="verified_user" className="text-[14px] text-secondary" /> ISO 14001:2015 Certified
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="eco" className="text-[14px] text-secondary" /> Zero Waste to Landfill (ZWTL)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="fact_check" className="text-[14px] text-secondary" /> CPCB Compliant EPR
          </span>
        </div>
      </header>

      {/* Accreditations Grid */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {certifications.map((c) => (
            <div key={c.code} className="bg-surface-container-lowest p-space-lg rounded-[28px] border border-surface-container-high/70 hover:border-secondary transition-all flex flex-col">
              <div className="flex items-center justify-between mb-space-md">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-primary">
                  <Icon name={c.icon === 'policy' ? c.iconFallback : c.icon} className="text-[24px]" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-primary">
                  {c.code}
                </span>
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">{c.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Pillars */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>Regulatory Pillars</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            How We Ensure Complete Compliance
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Every step of our circular logistics and MRF operations is engineered for full statutory auditability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {compliancePillars.map((pillar) => (
            <div key={pillar.title} className="bg-surface-container-lowest p-8 rounded-[28px] border border-surface-container-high/70 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/50 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
                  {pillar.tag}
                </div>
                <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">{pillar.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <ul className="flex flex-col gap-2.5 pt-4 border-t border-surface-container-high/60">
                {pillar.points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Icon name="check_circle" className="text-secondary text-[16px] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Audit Trail Workflow */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-8 md:p-space-2xl">
          <div className="mb-8">
            <h2 className="font-headline-md text-2xl text-primary font-bold">
              Digital Chain-of-Custody Assurance
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Four-stage cryptographic audit sequence guaranteeing zero waste leakage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {auditWorkflow.map((st) => (
              <div key={st.step} className="p-5 rounded-2xl bg-surface-container-high/30 border border-surface-container-high/60 flex flex-col">
                <span className="text-2xl font-black text-secondary mb-2">{st.step}</span>
                <h4 className="font-bold text-primary text-base mb-1">{st.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download & Inquiry CTA */}
      <section>
        <div className="bg-surface-container-high/40 rounded-[28px] border border-surface-container-high p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-headline-sm text-xl text-primary font-bold">Need official compliance or audit certificates?</h3>
            <p className="font-body-md text-on-surface-variant mt-1 text-sm">
              Request formal EPR credits, annual diversion certificates, or customized ESG compliance packages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:compliance@wastechakra.org"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-surface-bright font-bold text-xs hover:bg-primary-container transition-all shadow-sm"
            >
              <Icon name="description" className="text-[16px]" />
              Request Compliance Pack
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-container-highest text-primary font-bold text-xs hover:bg-surface-container-lowest transition-all"
            >
              Contact EHS Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
