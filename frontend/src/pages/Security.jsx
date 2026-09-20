import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function Security() {
  const securityPillars = [
    {
      icon: 'lock',
      title: 'End-to-End Encryption',
      desc: 'All sensitive customer records, pickup addresses, and credentials are encrypted using AES-256 at rest and TLS 1.3 in transit.',
    },
    {
      icon: 'verified_user',
      title: 'Role-Based Access Control',
      desc: 'Granular role segmentation enforces strict least-privilege access across Citizens, Collectors, Businesses, and Facility Admins.',
    },
    {
      icon: 'fact_check',
      title: 'Immutable Waste Passports',
      desc: 'Cryptographically signed digital manifests verify the chain-of-custody for every pickup with tamper-evident audit trails.',
    },
    {
      icon: 'cloud_done',
      title: 'Resilient Infrastructure',
      desc: 'Hosted in high-availability multi-zone cloud facilities with 99.98% uptime SLA, automated failovers, and hourly encrypted backups.',
    },
  ];

  const securityLayers = [
    {
      layer: 'Application Security',
      badge: 'App & API Protection',
      description: 'Robust controls protecting our web clients, mobile endpoints, and backend Django REST APIs from common vulnerabilities.',
      points: [
        'JWT token authentication with automatic expiration and rotation',
        'Strict OWASP Top 10 defenses against SQLi, XSS, and CSRF attacks',
        'Intelligent rate-limiting to prevent brute force and DDoS abuse',
        'Automated CI/CD dependency vulnerability scanning with Dependabot',
      ],
    },
    {
      layer: 'Data & Cryptography',
      badge: 'Confidentiality & Integrity',
      description: 'Protection of enterprise manifests, spatial telemetry, and resident personal identifying information (PII).',
      points: [
        'FIPS 140-2 validated encryption keys managed via dedicated KMS',
        'Zero plain-text password storage (PBKDF2 SHA-256 hashing)',
        'Differential privacy and automated geo-obfuscation on aggregated maps',
        'Regular disaster recovery and data restoration drills',
      ],
    },
    {
      layer: 'Fleet & Field Operations',
      badge: 'Physical-to-Digital Bridge',
      description: 'Securing the physical handoff between generators, collection drivers, and decentralized sorting plants.',
      points: [
        'Geo-fenced collector verification preventing falsified collection attempts',
        'Tamper-evident QR barcode tracking for bulk commercial waste bags',
        'Driver identity verification and live location telemetry during active shifts',
        'Dual-confirmation digital signatures on weighbridge handovers',
      ],
    },
    {
      layer: 'Compliance & Auditing',
      badge: 'Continuous Verification',
      description: 'Third-party assessments and ongoing compliance monitoring aligned with global standards.',
      points: [
        'Annual third-party penetration testing and architecture reviews',
        'Immutable operational audit logs retained for forensic investigation',
        'GDPR and India Digital Personal Data Protection (DPDP) aligned controls',
        'Dedicated Security Operations Center (SOC) monitoring suspicious activity',
      ],
    },
  ];

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Trust & Infrastructure</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-5xl leading-tight">
          Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">Data Defense</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-2xl">
          We protect municipal infrastructure, commercial supply chain records, and resident data with modern, defense-in-depth cybersecurity engineering.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-on-surface-variant font-medium">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="lock" className="text-[14px] text-secondary" /> TLS 1.3 / AES-256
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="verified_user" className="text-[14px] text-secondary" /> SOC 2 Aligned
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold">
            <Icon name="speed" className="text-[14px] text-secondary" /> 99.98% Uptime SLA
          </span>
        </div>
      </header>

      {/* Security Pillars Grid */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {securityPillars.map((sp) => (
            <div key={sp.title} className="bg-surface-container-lowest p-space-lg rounded-[28px] border border-surface-container-high/70 hover:border-secondary transition-all flex flex-col">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-primary mb-space-md">
                <Icon name={sp.icon} className="text-[24px]" />
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">{sp.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{sp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Layered Defense */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>Defense in Depth</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
            Four Layers of System Protection
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Comprehensive security architecture securing the entire path from physical collection to cloud ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {securityLayers.map((layer) => (
            <div key={layer.layer} className="bg-surface-container-lowest p-8 rounded-[28px] border border-surface-container-high/70 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/50 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
                  {layer.badge}
                </div>
                <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">{layer.layer}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  {layer.description}
                </p>
              </div>
              <ul className="flex flex-col gap-2.5 pt-4 border-t border-surface-container-high/60">
                {layer.points.map((pt, i) => (
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

      {/* Vulnerability Disclosure & Incident Response */}
      <section>
        <div className="bg-surface-container-high/40 rounded-[28px] border border-surface-container-high p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-headline-sm text-xl text-primary font-bold">Responsible Vulnerability Disclosure</h3>
            <p className="font-body-md text-on-surface-variant mt-1 text-sm max-w-xl">
              Found a security bug or potential vulnerability? We welcome responsible disclosure from security researchers and pledge swift review and bug bounty rewards.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:security@wastechakra.org"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-surface-bright font-bold text-xs hover:bg-primary-container transition-all shadow-sm"
            >
              <Icon name="verified_user" className="text-[16px]" />
              Report Vulnerability
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-surface-container-highest text-primary font-bold text-xs hover:bg-surface-container-lowest transition-all"
            >
              Security Advisory
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
