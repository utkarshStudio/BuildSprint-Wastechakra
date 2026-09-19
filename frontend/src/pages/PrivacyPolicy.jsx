import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function PrivacyPolicy() {
  const principles = [
    {
      icon: 'lock',
      title: 'Zero Data Selling',
      description: 'We never monetize, rent, or sell your personal, residential, or commercial waste data to third-party advertisers.',
    },
    {
      icon: 'verified_user',
      title: 'Provenance & Integrity',
      description: 'Every waste manifest and telemetry entry is securely stored with cryptographic hashing to guarantee immutable traceability.',
    },
    {
      icon: 'visibility',
      title: 'Explicit Consent',
      description: 'You retain complete control over geolocational tracking, device telemetry, and photographic documentation uploaded to the platform.',
    },
    {
      icon: 'delete_sweep',
      title: 'Right to Erasure',
      description: 'Request permanent deletion or anonymization of your personal profile data at any time via in-app settings or our DPO office.',
    },
  ];

  const sections = [
    {
      id: 'collection',
      title: '1. Information We Collect',
      items: [
        'Personal Identity Data: Name, email address, phone number, and encrypted credentials when registering as a Citizen, Collector, Business, or Facility Manager.',
        'Geolocational Data: Precise coordinates captured during on-demand pickup requests and real-time transit routing for licensed collector fleets.',
        'Waste Stream Telemetry: Waste classifications (wet, dry, hazardous, e-waste), photographic evidence, estimated/actual weights, and digital scale readouts.',
        'Device & Platform Logs: IP address, browser metadata, operating system, session tokens, and performance diagnostics.',
      ],
    },
    {
      id: 'usage',
      title: '2. How We Utilize Your Data',
      items: [
        'Dispatch & Logistics: Dynamically assigning and routing collection vehicles to optimize fuel efficiency and reduce transport emissions.',
        'Digital Waste Passport Generation: Constructing verifiable chain-of-custody certificates for residential societies and corporate EPR documentation.',
        'Reward & Incentive Distribution: Calculating Chakra Points, community milestones, and environmental impact credits accurately.',
        'Regulatory Compliance: Fulfilling statutory municipal reporting mandates under applicable Municipal Solid Waste (MSW) regulations.',
      ],
    },
    {
      id: 'sharing',
      title: '3. Data Sharing & Third Parties',
      items: [
        'Authorized Processing Facilities (MRFs): Sharing batch weights and material classifications with verified sorting and recycling partners.',
        'Municipal & Regulatory Authorities: Providing aggregated, anonymized diversion statistics to environmental pollution control bodies.',
        'Service Providers: Cloud hosting, SMS/email transactional notification systems, and mapping services bound by strict NDAs and data processing agreements.',
      ],
    },
    {
      id: 'retention',
      title: '4. Retention & Security Controls',
      items: [
        'High-resolution raw GPS telemetry pings are automatically purged after 90 days.',
        'All database storage is protected with AES-256 encryption at rest and TLS 1.3 protocol in transit.',
        'Regulatory waste manifests and statutory compliance ledgers are preserved for 5 years as required by environmental audit standards.',
      ],
    },
    {
      id: 'rights',
      title: '5. Your Rights & Controls',
      items: [
        'Access & Export: Download a machine-readable archive of your pickup history and carbon abatement metrics.',
        'Rectification: Correct any inaccurate contact or facility address details directly from your account profile.',
        'Revocation: Withdraw consent for promotional updates and discretionary analytics anytime without affecting collection services.',
      ],
    },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Legal & Privacy</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-5xl leading-tight">
          Privacy Policy & <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">Data Stewardship</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-2xl">
          At WasteChakra, we treat environmental and personal data with strict accountability. Learn how we safeguard your information across every step of our circular waste ecosystem.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-on-surface-variant font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="today" className="text-[14px]" /> Last Updated: September 2026
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="verified_user" className="text-[14px] text-secondary" /> ISO 27001 & DPDP Aligned
          </span>
        </div>
      </header>

      {/* Core Privacy Principles */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {principles.map((p) => (
            <div key={p.title} className="bg-surface-container-lowest p-space-lg rounded-[28px] border border-surface-container-high/70 hover:border-secondary transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-primary mb-space-md">
                <Icon name={p.icon} className="text-[24px]" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">{p.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Policy Sections */}
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

      {/* Contact DPO Card */}
      <section>
        <div className="bg-surface-container-high/40 rounded-[28px] border border-surface-container-high p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-headline-sm text-xl text-primary font-bold">Have questions about your privacy or data?</h3>
            <p className="font-body-md text-on-surface-variant mt-1 text-sm">
              Our dedicated Data Protection Officer is available to handle access requests, inquiries, or regulatory notices.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:privacy@wastechakra.org"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-surface-bright font-bold text-xs hover:bg-primary-container transition-all shadow-sm"
            >
              <Icon name="mail" className="text-[16px]" />
              Contact Privacy Team
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-container-highest text-primary font-bold text-xs hover:bg-surface-container-lowest transition-all"
            >
              Support Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
