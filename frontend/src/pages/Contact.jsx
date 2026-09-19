import React, { useState } from 'react';
import { Icon } from '../components/AppIcons';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const contactInfo = [
    {
      icon: 'call',
      label: 'Toll-Free Helpline',
      value: '1800-889-WCHAKRA',
      detail: 'Toll-free 24/7 waste dispatch line',
    },
    {
      icon: 'chat',
      label: 'WhatsApp Quick Help',
      value: '+91 6454 295 800',
      detail: 'Send photos of waste for instant dispatch',
    },
    {
      icon: 'mail',
      label: 'Support & Partnerships',
      value: 'support@wastechakra.org',
      detail: 'Guaranteed response within 2 hours',
    },
    {
      icon: 'location_on',
      label: 'Regional Innovation Hub',
      value: 'Purnia, Bihar - 854301',
      detail: 'Central Material Recovery Facility #01',
    },
  ];

  const faqs = [
    {
      question: 'How do I schedule a doorstep scrap pickup from my home?',
      bullets: [
        'Open the WasteChakra app or website and click "Schedule Pickup".',
        'Choose your scrap categories (paper, plastic bottles, metals, e-waste).',
        'Select a convenient 2-hour morning or evening slot and pin your live location.',
        'Our uniformed eco-collector arrives with a certified digital scale and pays you on the spot via cash, UPI, or 1.5x in Eco-Credits.',
      ],
    },
    {
      question: 'Can our apartment society / gated community install WasteChakra?',
      bullets: [
        'Yes. We service residential complexes ranging from 10 to over 1,000 apartments.',
        'We provide daily morning segregated collection (Wet, Dry, Domestic Hazardous).',
        'We can install an odor-free on-site organic compost tumbler for wet kitchen waste.',
        'Your RWA receives an official "Zero-Waste Society Certificate" to claim municipal property tax discounts.',
      ],
    },
    {
      question: 'What is a "Digital Waste Passport"?',
      bullets: [
        'Every collection batch receives a unique encrypted QR code tracking manifest.',
        'It logs the exact weight, material composition, collection timestamp, and processing facility ID.',
        'You can scan the QR code to verify your waste was recycled into new products or compost, never dumped in open landfills.',
      ],
    },
    {
      question: 'How do I report illegal street dumping or roadside blackspots?',
      bullets: [
        'Use the "Report Waste" button in the app to take a live photo of the dirty spot.',
        'Your phone GPS automatically tags the exact ward coordinates.',
        'Our community collection van dispatches to clean the site within 24 hours.',
        'You receive a "Cleaned" verification photo notification + 25 Eco-Credits.',
      ],
    },
    {
      question: 'What happens to non-recyclable plastic and food scraps?',
      bullets: [
        'Food scraps and wet waste are routed to aerobic composting pits, turning into chemical-free bio-fertilizer for local farmers within 21 days.',
        'Non-recyclable high-calorific plastics are shredded into Refuse-Derived Fuel (RDF) and sent to cement kilns to replace coal.',
        'Only inert mineral fines (<8%) are used for road base, achieving 92%+ total landfill diversion.',
      ],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = `WC-${Math.floor(10000 + Math.random() * 90000)}`;
      setTicketId(generatedId);
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 650);
  };

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Contact & Support</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-4xl leading-tight">
          We are here to make zero-waste <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">simple and accessible</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-3xl leading-relaxed">
          Need a doorstep scrap pickup, want to enroll your residential apartment complex, or looking for an industrial RDF fuel supply? Reach out below — our coordinators respond within 2 business hours.
        </p>
      </header>

      {/* 4 Contact Cards */}
      <section className="mb-20 md:mb-space-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {contactInfo.map((info) => (
            <div key={info.label} className="bg-surface-container-lowest p-6 rounded-[28px] border border-surface-container-high/70 hover:border-secondary hover:shadow-lg transition-all flex flex-col group">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-4 transition-colors">
                <Icon name={info.icon} className="text-[24px]" />
              </div>
              <span className="font-label-sm text-[11px] text-on-surface-variant uppercase font-bold tracking-wider mb-1">{info.label}</span>
              <span className="font-title-md text-base md:text-lg text-primary font-bold mb-1 break-words">{info.value}</span>
              <span className="font-label-sm text-xs text-forest font-medium">{info.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Form & FAQs */}
      <section className="mb-20 md:mb-space-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-6 md:p-10">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-2">
              <span>✳</span>
              <span>Send An Inquiry</span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-primary font-bold mb-2">
              How Can Our Team Help You?
            </h2>
            <p className="font-body-md text-xs md:text-sm text-on-surface-variant mb-6 leading-relaxed">
              Fill out the details below. For urgent blackspot clearance or doorstep scrap inquiries, you can also call our toll-free line anytime.
            </p>

            {formSubmitted ? (
              <div className="p-6 md:p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center flex flex-col items-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md">
                  <Icon name="check_circle" className="text-[32px]" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                  Ticket Generated #{ticketId}
                </span>
                <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">
                  Thank You, {formData.name || 'Friend'}!
                </h3>
                <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
                  Your message regarding <span className="font-bold text-primary">"{formData.subject}"</span> has been assigned to our regional dispatch coordinator. We will reply via email or WhatsApp within 2 hours.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-secondary-container text-primary font-bold text-xs hover:bg-secondary-fixed-dim transition-colors cursor-pointer"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wider">Inquiry Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary transition-all cursor-pointer"
                    >
                      <option>Household Doorstep Scrap Pickup</option>
                      <option>Apartment Society / RWA Onboarding</option>
                      <option>Commercial Office & Retail Waste</option>
                      <option>Certified E-Waste Destruction</option>
                      <option>Community Cleanup Event / Volunteer</option>
                      <option>Refuse-Derived Fuel (RDF) Supply</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wider">Your Message / Requirements</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your estimated waste volume, society address, or specific questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full py-3.5 rounded-xl bg-secondary-container text-primary font-bold text-sm hover:bg-secondary-fixed-dim transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Sending Your Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right FAQs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="mb-2">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-2">
                <span>✳</span>
                <span>Clear Answers</span>
              </div>
              <h2 className="font-headline-lg text-xl md:text-2xl text-primary font-bold">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Point-wise answers to everything you need to know.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/70 overflow-hidden transition-all">
                  <button
                    className="w-full flex items-center justify-between gap-3 p-4 text-left cursor-pointer hover:bg-surface-container-low/40"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-title-sm text-xs md:text-sm text-primary font-bold leading-snug">{faq.question}</span>
                    <Icon name="expand_more" className={`text-[18px] text-on-surface-variant shrink-0 transition-transform ${openFaq === i ? 'rotate-180 text-secondary' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4 pt-1 border-t border-surface-container-high/40">
                      <ul className="flex flex-col gap-2 text-xs text-on-surface-variant">
                        {faq.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon name="check_circle" className="text-secondary text-[14px] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Banner */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-forest rounded-[28px] p-8 md:p-space-2xl text-on-primary text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/15 backdrop-blur-sm text-secondary-fixed font-eyebrow-tag text-xs font-bold uppercase">
              <Icon name="phone_in_talk" className="text-[16px]" />
              <span>Instant Ground Dispatch</span>
            </div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-surface-bright font-bold tracking-tight">
              Need immediate assistance or spot an emergency hazard?
            </h2>
            <p className="font-body-md text-sm text-primary-fixed-dim">
              Our 24/7 municipal dispatch team coordinates with local ward collection vehicles round the clock.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a href="tel:1800889924" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary-container text-primary font-bold text-sm hover:bg-secondary-fixed-dim transition-all shadow-md">
                <Icon name="call" className="text-[18px]" />
                <span>Call Toll-Free 1800-889-WCHAKRA</span>
              </a>
              <a href="https://wa.me/916454295800" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high/20 hover:bg-surface-container-high/30 text-surface-bright font-bold text-sm transition-colors">
                <Icon name="chat" className="text-[18px]" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
