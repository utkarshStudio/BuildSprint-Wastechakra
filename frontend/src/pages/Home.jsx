import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';
import { citizenApi } from '../services/citizenApi';

export default function Home() {
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    phone: '',
    service: 'Residential Scrap Pickup',
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.phone) {
      setQuoteError('Please enter your full name and mobile number.');
      return;
    }
    setQuoteSubmitting(true);
    setQuoteError('');
    try {
      await citizenApi.submitQuoteRequest(quoteForm);
      setQuoteSubmitted(true);
    } catch (err) {
      setQuoteError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setQuoteSubmitting(false);
    }
  };

  return (
    <div className="w-full -mt-20">
      {/* 1. HERO WRAPPER */}
      <div className="w-full relative">
        {/* HERO CONTAINER */}
        <div className="w-full bg-[#0a3a2a] relative overflow-hidden flex flex-col justify-center min-h-screen md:min-h-[750px]">

          {/* BACKGROUND IMAGE WITH GRADIENT MASK */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute right-0 top-0 w-full md:w-4/5 lg:w-3/5 h-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 35%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 35%)' }}>
              <img alt="Eco Waste Collection Truck" className="w-full h-full object-cover object-center" src="/images/hero-truck.jpg" />
            </div>
            {/* Mobile gradient to ensure readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent md:hidden" />
          </div>

          {/* LEFT CONTENT */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 mt-10 flex flex-col gap-6">
            {/* Reviews Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#164a35] backdrop-blur-md border border-[#1e5c43] w-fit">
              <span className="font-bold text-sm text-white">4.9</span>
              <div className="flex text-[#F59E0B]">
                <Icon name="star" className="text-[14px]" />
                <Icon name="star" className="text-[14px]" />
                <Icon name="star" className="text-[14px]" />
                <Icon name="star" className="text-[14px]" />
                <Icon name="star" className="text-[14px]" />
              </div>
              <span className="text-white/90 text-sm font-medium">10K+ Verified Pickups</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-[68px] leading-[1.05] text-white font-bold tracking-tight">
              Doorstep scrap pickups,<br />
              <span className="text-secondary-container">AI optical sorting</span><br />
              &amp; instant eco-rewards
            </h1>

            {/* Subheadline */}
            <p className="text-white/80 text-base md:text-lg max-w-2xl mt-2 leading-relaxed">
              WasteChakra turns everyday household and commercial waste into clean, measurable resources. Schedule scrap pickups, report street blackspots, and track your verified zero-landfill impact in real time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 sm:gap-6 mt-4">
              <Link
                className="group inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full bg-secondary-container text-primary font-bold hover:bg-secondary-fixed-dim hover:shadow-[0_8px_24px_-6px_rgba(171,248,84,0.4)] transition-all duration-300"
                to="/app/pickups"
              >
                <span className="text-sm tracking-wide">Schedule Doorstep Pickup</span>
                <span className="w-8 h-8 rounded-full bg-forest text-secondary-container flex items-center justify-center transition-colors duration-300">
                  <Icon name="arrow_forward" className="text-[18px] group-hover:rotate-45 transition-transform duration-300 -rotate-45" />
                </span>
              </Link>

              <Link
                className="group inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full border-2 border-secondary-container/40 text-white font-bold hover:bg-white/10 hover:border-secondary-container transition-all duration-300"
                to="/app/report"
              >
                <span className="text-sm tracking-wide">Report Street Waste</span>
                <span className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center group-hover:bg-secondary-container group-hover:text-primary transition-all duration-300">
                  <Icon name="photo_camera" className="text-[18px]" />
                </span>
              </Link>

              <Link
                className="group inline-flex items-center gap-3 pl-2 pr-2 py-2 text-white/90 hover:text-secondary-container transition-all duration-300"
                to="/simulation"
              >
                <span className="w-11 h-11 rounded-full bg-secondary-container/10 border border-secondary-container/40 flex items-center justify-center group-hover:bg-secondary-container group-hover:text-primary transition-all duration-300">
                  <Icon name="precision_manufacturing" className="text-[20px]" />
                </span>
                <span className="flex flex-col items-start justify-center">
                  <span className="text-[11px] uppercase tracking-wider text-white/70 font-semibold leading-none mb-1">Interactive</span>
                  <span className="text-sm font-bold text-white leading-none">3D Plant Simulation</span>
                </span>
              </Link>
            </div>
          </div>

          {/* SCROLLING MARQUEE TICKER RIBBON */}
          <div className="w-full bg-secondary-container py-3.5 overflow-hidden select-none relative z-10">
            <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite] gap-10 text-primary text-[15px] font-bold tracking-wide items-center">
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Guaranteed Doorstep Pickups</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Certified Digital Scale Weighment</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Instant UPI Payment &amp; Eco-Credits</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> 92% Landfill Diversion Rate</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Encrypted QR Waste Passports</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Guaranteed Doorstep Pickups</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Certified Digital Scale Weighment</span>
              <span className="flex items-center gap-10"><span className="text-xl">✳</span> Instant UPI Payment &amp; Eco-Credits</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS / REAL IMPACT BAR */}
      <section className="w-full py-12 md:py-space-xl bg-surface">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="bg-surface-container-low rounded-[28px] p-6 md:p-space-xl border border-surface-container-high/60 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-space-lg text-center">
            <div className="flex flex-col items-center">
              <span className="font-stat-counter text-3xl md:text-stat-counter text-primary font-extrabold tracking-tight leading-none">520K+</span>
              <span className="font-label-md text-[10px] md:text-label-md text-forest font-bold mt-2 uppercase tracking-wider">Tons Diverted</span>
              <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant mt-1">Saved from open dumps &amp; fires</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-stat-counter text-3xl md:text-stat-counter text-primary font-extrabold tracking-tight leading-none">120+</span>
              <span className="font-label-md text-[10px] md:text-label-md text-forest font-bold mt-2 uppercase tracking-wider">Municipal Zones</span>
              <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant mt-1">Active collection routes daily</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-stat-counter text-3xl md:text-stat-counter text-primary font-extrabold tracking-tight leading-none">350+</span>
              <span className="font-label-md text-[10px] md:text-label-md text-forest font-bold mt-2 uppercase tracking-wider">Societies &amp; Malls</span>
              <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant mt-1">Under zero-waste service contracts</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-stat-counter text-3xl md:text-stat-counter text-primary font-extrabold tracking-tight leading-none">&lt; 2 hrs</span>
              <span className="font-label-md text-[10px] md:text-label-md text-forest font-bold mt-2 uppercase tracking-wider">Response Time</span>
              <p className="font-label-sm text-[11px] md:text-label-sm text-on-surface-variant mt-1">For street waste reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 QUICK ACTIONS */}
      <section className="w-full py-8 md:py-space-md bg-surface">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-space-md">
            {[
              {
                title: 'Schedule Scrap Pickup',
                desc: 'Book a convenient 2-hour doorstep pickup for paper, plastic, and metal.',
                icon: 'calendar_today',
                to: '/app/pickups',
                tone: 'bg-forest',
                cta: 'Book Pickup',
              },
              {
                title: 'Report Street Waste',
                desc: 'Upload a picture of garbage with live GPS; our eco-van cleans it in 24 hours.',
                icon: 'photo_camera',
                to: '/app/report',
                tone: 'bg-[#1b4332]',
                cta: 'Report Waste',
              },
              {
                title: 'Explore Live Plant Twin',
                desc: 'Watch the 9-station conveyor twin sort waste into 4 streams in real-time.',
                icon: 'precision_manufacturing',
                to: '/simulation',
                tone: 'bg-[#002b1b]',
                cta: 'Launch Simulator',
              },
              {
                title: 'Community Rewards',
                desc: 'Join weekend drives, earn Eco-Credits, and help your society lead the city.',
                icon: 'groups',
                to: '/community',
                tone: 'bg-forest',
                cta: 'Join Community',
              },
            ].map((a) => (
              <Link
                key={a.title}
                to={a.to}
                className="group p-6 rounded-[24px] bg-surface-container-lowest border border-surface-container-high/80 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-4 transition-colors">
                    <Icon name={a.icon} className="text-[24px]" />
                  </div>
                  <h3 className="font-title-md text-title-md text-primary font-bold mb-1">{a.title}</h3>
                  <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed mb-4">{a.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 font-label-sm text-xs font-bold text-forest group-hover:text-primary transition-colors">
                  <span>{a.cta}</span>
                  <Icon name="arrow_forward" className="text-[16px] group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT US & GET FREE QUOTE */}
      <section className="w-full py-16 md:py-space-3xl bg-surface" id="about">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Point-Wise Reasons */}
            <div className="flex flex-col gap-6 lg:pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-xs font-bold uppercase w-fit">
                <span>✳</span>
                <span>Why WasteChakra</span>
              </div>

              <h2 className="font-headline-lg text-3xl md:text-5xl text-primary font-extrabold tracking-tight leading-[1.1]">
                Waste management that is clean, transparent, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">rewarding.</span>
              </h2>

              <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed">
                Traditional waste collection throws everything into open dump yards. WasteChakra changes that with a smart digital network connecting homes, electric collection loaders, and decentralized sorting plants.
              </p>

              <ul className="flex flex-col gap-3.5 mt-2">
                <li className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 hover:border-secondary transition-all">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary">
                    <Icon name="scale" className="text-[20px]" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-sm">Certified Digital Scales at Your Door</span>
                    <span className="text-xs text-on-surface-variant mt-0.5">Accurate weighment right before your eyes. Immediate UPI scrap payment or 1.5x Eco-Credits.</span>
                  </div>
                </li>

                <li className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 hover:border-secondary transition-all">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary">
                    <Icon name="qr_code_scanner" className="text-[20px]" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-sm">100% Traceable Digital Waste Passports</span>
                    <span className="text-xs text-on-surface-variant mt-0.5">Every kilogram receives an encrypted QR manifest proving it reached certified recyclers or compost bays.</span>
                  </div>
                </li>

                <li className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 hover:border-secondary transition-all">
                  <span className="w-10 h-10 shrink-0 rounded-xl bg-secondary-container/40 flex items-center justify-center text-primary">
                    <Icon name="volunteer_activism" className="text-[20px]" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-sm">Dignified Careers for Sanitation Heroes</span>
                    <span className="text-xs text-on-surface-variant mt-0.5">Guaranteed fair living wages, medical insurance, protective PPE kits, and electric low-emission vehicles.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Column: Callback Request Card */}
            <div className="bg-surface-container-lowest relative rounded-[32px] p-6 sm:p-8 md:p-10 border border-surface-container-high/60 shadow-xl overflow-hidden" id="quote">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/20 blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none rounded-full"></div>

              <form className="flex flex-col gap-4 md:gap-5 relative z-10" onSubmit={handleQuoteSubmit}>
                <div className="mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-bold text-xs mb-2">
                    <Icon name="verified" className="text-secondary text-[16px]" />
                    <span>Free Consultation &amp; Rate Card</span>
                  </div>
                  <h3 className="font-headline-sm text-2xl md:text-3xl text-primary font-extrabold tracking-tight mb-1">Schedule a Callback</h3>
                  <p className="font-label-sm text-xs text-on-surface-variant leading-relaxed">
                    Tell us your requirement — our ward coordinator responds within <span className="font-bold text-primary">30 minutes</span>.
                  </p>
                </div>

                {quoteSubmitted ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
                      <Icon name="check_circle" className="text-[24px]" />
                    </div>
                    <h4 className="font-bold text-primary text-lg">Callback Requested!</h4>
                    <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      Thank you, <strong className="text-primary">{quoteForm.name}</strong>! Your inquiry for <strong className="text-primary">{quoteForm.service}</strong> has been routed to our regional coordinator. We will reach you at <strong className="text-primary">{quoteForm.phone}</strong> shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setQuoteSubmitted(false)}
                      className="px-4 py-2 rounded-xl bg-secondary-container text-primary font-bold text-xs hover:bg-secondary-fixed-dim transition-colors cursor-pointer"
                    >
                      Book Another Inquiry
                    </button>
                  </div>
                ) : (
                  <>
                    {quoteError && (
                      <div className="bg-red-500/10 text-red-700 text-xs font-bold p-3 rounded-xl border border-red-200">
                        {quoteError}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">Your Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        placeholder="e.g. Anand Verma"
                        className="w-full rounded-xl border border-surface-container-high bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-secondary transition-all"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">Mobile Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-surface-container-high bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-secondary transition-all"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">Service Needed</label>
                      <div className="relative">
                        <select
                          name="service"
                          value={quoteForm.service}
                          onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                          className="appearance-none w-full rounded-xl border border-surface-container-high bg-surface px-4 py-3 text-sm text-on-surface outline-none focus:border-secondary transition-all cursor-pointer"
                        >
                          <option>Residential Scrap Pickup</option>
                          <option>Apartment Society Daily Collection</option>
                          <option>Commercial Office Bulk Waste</option>
                          <option>Certified E-Waste &amp; Batteries</option>
                          <option>Organic Compost Kit &amp; Setup</option>
                          <option>Industrial RDF Fuel Supply</option>
                        </select>
                        <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="mt-2 cursor-pointer inline-flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl bg-secondary-container text-primary font-bold hover:bg-secondary-fixed-dim transition-all shadow-sm"
                    >
                      <span className="text-sm tracking-wide">{quoteSubmitting ? 'Routing to Coordinator...' : 'Request Free Callback'}</span>
                      <Icon name="north_east" className="text-[18px]" />
                    </button>
                    <p className="text-center text-xs text-on-surface-variant mt-1 flex items-center justify-center gap-1.5">
                      <Icon name="verified_user" className="text-[14px] text-forest" />
                      <span>Zero obligation · Transparent scrap rates guaranteed</span>
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES SECTION */}
      <section className="w-full py-16 md:py-space-3xl bg-surface-container-low" id="services">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-space-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>Circular Solutions</span>
            </div>
            <h2 className="font-headline-lg text-3xl md:text-headline-lg text-primary font-bold tracking-tight">
              Responsible Services for Every Need
            </h2>
            <p className="font-body-md text-sm md:text-body-md text-on-surface-variant mt-space-xs">
              From doorstep household scrap to full residential societies and manufacturing audits, our teams handle every tier of circular recycling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-space-lg">
            <div className="p-6 md:p-space-lg rounded-[24px] bg-surface-container-lowest border border-surface-container-high/80 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-space-md transition-colors">
                  <Icon name="delete_sweep" className="text-[26px]" />
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">Doorstep Scrap Collection</h3>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md">
                  Scheduled collection for paper, cardboard, plastics, and metals. Weighed on digital scales with instant cash or Eco-Credits.
                </p>
                <ul className="flex flex-col gap-1.5 text-primary text-xs border-t border-surface-container-high/50 pt-space-sm mb-space-md">
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> Transparent rate card</li>
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> Free doorstep collection</li>
                </ul>
              </div>
              <Link className="inline-flex items-center gap-1 font-label-md text-xs font-bold text-forest hover:text-primary transition-colors" to="/app/pickups">
                <span>Book Scrap Pickup</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>

            <div className="p-6 md:p-space-lg rounded-[24px] bg-surface-container-lowest border border-surface-container-high/80 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-space-md transition-colors">
                  <Icon name="apartment" className="text-[26px]" />
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">Apartment &amp; Society Plans</h3>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md">
                  Complete 3-way segregation system for residential gated communities. Wet waste composting and certified zero-waste compliance.
                </p>
                <ul className="flex flex-col gap-1.5 text-primary text-xs border-t border-surface-container-high/50 pt-space-sm mb-space-md">
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> Daily dedicated EV pickup</li>
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> Municipal tax rebate support</li>
                </ul>
              </div>
              <Link className="inline-flex items-center gap-1 font-label-md text-xs font-bold text-forest hover:text-primary transition-colors" to="/services">
                <span>Explore Society Plans</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>

            <div className="p-6 md:p-space-lg rounded-[24px] bg-surface-container-lowest border border-surface-container-high/80 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-space-md transition-colors">
                  <Icon name="devices_other" className="text-[26px]" />
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">E-Waste &amp; Data Destruction</h3>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md">
                  Certified data destruction and precious metal recovery for computers, batteries, circuit boards, and appliances.
                </p>
                <ul className="flex flex-col gap-1.5 text-primary text-xs border-t border-surface-container-high/50 pt-space-sm mb-space-md">
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> R2v3 certified downstream</li>
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> Green certificate of destruction</li>
                </ul>
              </div>
              <Link className="inline-flex items-center gap-1 font-label-md text-xs font-bold text-forest hover:text-primary transition-colors" to="/services">
                <span>E-Waste Protocol</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>

            <div className="p-6 md:p-space-lg rounded-[24px] bg-surface-container-lowest border border-surface-container-high/80 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary mb-space-md transition-colors">
                  <Icon name="precision_manufacturing" className="text-[26px]" />
                </div>
                <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">Decentralized MRF &amp; RDF</h3>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md">
                  Turnkey Material Recovery Facilities with optical AI classification and high-caloric Refuse-Derived Fuel (RDF) supply for cement plants.
                </p>
                <ul className="flex flex-col gap-1.5 text-primary text-xs border-t border-surface-container-high/50 pt-space-sm mb-space-md">
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> 92%+ diversion rate</li>
                  <li className="flex items-center gap-1.5"><Icon name="check_circle" className="text-secondary text-[16px]" /> Replaces coal in cement kilns</li>
                </ul>
              </div>
              <Link className="inline-flex items-center gap-1 font-label-md text-xs font-bold text-forest hover:text-primary transition-colors" to="/services">
                <span>MRF Solutions</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT OPERATES (3 SIMPLE STEPS) */}
      <section className="w-full py-16 md:py-space-3xl bg-surface" id="how-it-works">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>Simple 3-Step Process</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              From Your Door to Circular Life
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              How WasteChakra handles your recyclables with complete transparency and zero environmental guilt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
            <div className="bg-surface-container-lowest p-space-xl rounded-[28px] border border-surface-container-high/70 shadow-sm relative flex flex-col hover:border-secondary transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-primary font-headline-sm text-headline-sm font-extrabold flex items-center justify-center mb-space-md shadow-sm">
                1
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">Snap Photo &amp; Book Slot</h3>
              <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md leading-relaxed">
                Select your scrap category and pick a 2-hour window. Use the live map to pin your exact location so the collector arrives without confusion.
              </p>
              <div className="mt-auto flex items-center gap-2 text-forest font-label-sm text-xs font-bold">
                <Icon name="touch_app" className="text-[18px] text-secondary" />
                <span>Instant dispatch confirmation</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-[28px] border border-surface-container-high/70 shadow-sm relative flex flex-col hover:border-secondary transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-primary font-headline-sm text-headline-sm font-extrabold flex items-center justify-center mb-space-md shadow-sm">
                2
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">Eco-Loader Arrival &amp; Digital Scale</h3>
              <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md leading-relaxed">
                A uniformed collector arrives in an electric vehicle. Scrap is weighed on a certified digital scale, and immediate payment is sent via UPI or Eco-Credits.
              </p>
              <div className="mt-auto flex items-center gap-2 text-forest font-label-sm text-xs font-bold">
                <Icon name="scale" className="text-[18px] text-secondary" />
                <span>Fair digital weight guarantee</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-xl rounded-[28px] border border-surface-container-high/70 shadow-sm relative flex flex-col hover:border-secondary transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-primary font-headline-sm text-headline-sm font-extrabold flex items-center justify-center mb-space-md shadow-sm">
                3
              </div>
              <h3 className="font-title-md text-title-md text-primary font-bold mb-space-xs">AI Sorting &amp; Waste Passport</h3>
              <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mb-space-md leading-relaxed">
                Items are processed at our decentralized MRF. Recyclables go to mills, compost to farmers, and you receive an encrypted QR Waste Passport.
              </p>
              <div className="mt-auto flex items-center gap-2 text-forest font-label-sm text-xs font-bold">
                <Icon name="qr_code_scanner" className="text-[18px] text-secondary" />
                <span>Verified circular destination</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. IMPACT SPOTLIGHT */}
      <section className="w-full py-16 md:py-space-3xl bg-surface-container-low" id="impact">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-2xl">
            <div>
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
                <span>✳</span>
                <span>Ground Results</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
                Recent Neighborhood Initiatives
              </h2>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md">
              Real community drives cleaning riverbanks, turning kitchen scraps into organic compost, and safely dismantling electronic scrap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="bg-surface-container-lowest rounded-[28px] overflow-hidden border border-surface-container-high/70 shadow-sm flex flex-col hover:border-secondary transition-all">
              <div className="h-48 w-full overflow-hidden relative">
                <img alt="Riverbank cleanup" className="w-full h-full object-cover" src="/images/volunteer-sorting.jpg" />
                <span className="absolute top-4 left-4 bg-secondary-container text-primary font-label-sm text-xs font-extrabold px-3 py-1 rounded-full">
                  Shoreline Cleanup
                </span>
              </div>
              <div className="p-space-lg flex flex-col flex-1">
                <h3 className="font-title-md text-base md:text-lg text-primary font-bold mb-1">Saura Riverbank Plastic Interception</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Volunteers and eco-crews recovered 45.2 metric tons of single-use plastic bottles and floating debris before monsoon flooding.
                </p>
                <div className="mt-auto pt-3 border-t border-surface-container-high/50 flex justify-between items-center text-xs">
                  <span className="text-forest font-bold">45.2 Tons Recovered</span>
                  <span className="text-on-surface-variant">Completed Q4</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[28px] overflow-hidden border border-surface-container-high/70 shadow-sm flex flex-col hover:border-secondary transition-all">
              <div className="h-48 w-full overflow-hidden relative">
                <img alt="Community composting" className="w-full h-full object-cover" src="/images/technician-planting.jpg" />
                <span className="absolute top-4 left-4 bg-secondary-container text-primary font-label-sm text-xs font-extrabold px-3 py-1 rounded-full">
                  Urban Composting
                </span>
              </div>
              <div className="p-space-lg flex flex-col flex-1">
                <h3 className="font-title-md text-base md:text-lg text-primary font-bold mb-1">Residential Organic Nutrient Loop</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Doorstep wet waste collection across 600 residential flats, generating 120 tons of odorless bio-fertilizer for local organic farmers.
                </p>
                <div className="mt-auto pt-3 border-t border-surface-container-high/50 flex justify-between items-center text-xs">
                  <span className="text-forest font-bold">120 Tons Compost</span>
                  <span className="text-on-surface-variant">Active Routine</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[28px] overflow-hidden border border-surface-container-high/70 shadow-sm flex flex-col hover:border-secondary transition-all">
              <div className="h-48 w-full overflow-hidden relative">
                <img alt="E-waste collection" className="w-full h-full object-cover" src="/images/municipal-truck.jpg" />
                <span className="absolute top-4 left-4 bg-secondary-container text-primary font-label-sm text-xs font-extrabold px-3 py-1 rounded-full">
                  E-Waste Recovery
                </span>
              </div>
              <div className="p-space-lg flex flex-col flex-1">
                <h3 className="font-title-md text-base md:text-lg text-primary font-bold mb-1">IT Park Hardware Retirement Drive</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Collected 14 commercial corporate towers of retired computers, dismantling circuit boards and lithium batteries with DoD sanitization.
                </p>
                <div className="mt-auto pt-3 border-t border-surface-container-high/50 flex justify-between items-center text-xs">
                  <span className="text-forest font-bold">99.8% Metal Yield</span>
                  <span className="text-on-surface-variant">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS & TRUST */}
      <section className="w-full py-16 md:py-space-3xl bg-surface">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="text-center max-w-2xl mx-auto mb-space-2xl">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
              <span>✳</span>
              <span>Resident &amp; Partner Voices</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
              Trusted by Homes &amp; Housing Societies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="bg-surface-container-lowest p-6 md:p-space-xl rounded-[24px] border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#F59E0B] mb-space-sm">
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                </div>
                <p className="font-body-md text-sm md:text-base text-primary italic mb-space-md leading-relaxed">
                  "The digital scale weighment is fantastic. No guessing or haggling over scrap weight. The collector was courteous, weighed our old cartons and plastic jugs in 5 minutes, and paid instantly via UPI."
                </p>
              </div>
              <div className="flex items-center gap-space-sm pt-space-sm border-t border-surface-container-high/40">
                <div className="w-10 h-10 rounded-full bg-forest text-secondary-container flex items-center justify-center font-bold">AV</div>
                <div>
                  <h4 className="font-title-md text-sm text-primary font-bold leading-tight">Anand Verma</h4>
                  <p className="font-label-sm text-xs text-on-surface-variant">Greenways Colony, Resident</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 md:p-space-xl rounded-[24px] border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#F59E0B] mb-space-sm">
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                </div>
                <p className="font-body-md text-sm md:text-base text-primary italic mb-space-md leading-relaxed">
                  "Onboarding our 320-apartment society was smooth. They trained our housekeeping staff on 3-way segregation and installed compost tumblers. Our society secured a municipal property tax rebate!"
                </p>
              </div>
              <div className="flex items-center gap-space-sm pt-space-sm border-t border-surface-container-high/40">
                <div className="w-10 h-10 rounded-full bg-forest text-secondary-container flex items-center justify-center font-bold">SL</div>
                <div>
                  <h4 className="font-title-md text-sm text-primary font-bold leading-tight">Dr. Shalini Lal</h4>
                  <p className="font-label-sm text-xs text-on-surface-variant">RWA Secretary, Harmony Heights</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 md:p-space-xl rounded-[24px] border border-surface-container-high/70 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#F59E0B] mb-space-sm">
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                  <Icon name="star" className="text-[18px]" />
                </div>
                <p className="font-body-md text-sm md:text-base text-primary italic mb-space-md leading-relaxed">
                  "The QR Waste Passport is a game-changer for our corporate sustainability filings. We have tamper-proof paperwork proving every ton of packaging and e-waste was responsibly recycled."
                </p>
              </div>
              <div className="flex items-center gap-space-sm pt-space-sm border-t border-surface-container-high/40">
                <div className="w-10 h-10 rounded-full bg-forest text-secondary-container flex items-center justify-center font-bold">DK</div>
                <div>
                  <h4 className="font-title-md text-sm text-primary font-bold leading-tight">Devon Kapoor</h4>
                  <p className="font-label-sm text-xs text-on-surface-variant">Sustainability Lead, Apex Logistics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="w-full py-space-2xl bg-surface">
        <div className="w-full max-w-container-max mx-auto px-gutter">
          <div className="w-full bg-forest rounded-[32px] p-space-xl md:p-space-2xl text-on-primary text-center relative overflow-hidden">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-space-md relative z-10">
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-surface-container-high/15 backdrop-blur-sm text-secondary-fixed font-eyebrow-tag text-eyebrow-tag font-bold uppercase">
                <span>✳</span>
                <span>Start Today</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg md:text-[44px] md:leading-[52px] text-surface-bright font-bold tracking-tight">
                Ready to make waste an asset for your home or business?
              </h2>
              <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
                Book a doorstep pickup, request a society onboarding consultation, or report a dirty spot in 30 seconds.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
                <Link className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-primary font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-all shadow-lg" to="/app/pickups">
                  <span>Schedule Scrap Pickup</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
                <a className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/15 hover:bg-surface-container-high/25 text-surface-bright font-label-md text-label-md font-bold transition-colors" href="tel:1800889924">
                  <Icon name="call" className="text-[18px]" />
                  <span>Call Toll-Free 1800-889-WCHAKRA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}