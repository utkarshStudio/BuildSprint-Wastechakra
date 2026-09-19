import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';
import { dataProvider } from '../services/dataProvider';
import { useAuth } from '../context/AuthContext';

export default function Community() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState({});
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [rewardFeedback, setRewardFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const programs = [
    {
      title: 'Spot & Report Blackspots',
      reward: '+25 Eco-Credits / Report',
      icon: 'photo_camera',
      points: [
        'Notice an overflowing open dump or roadside garbage heap in your ward?',
        'Snap a quick photo with GPS enabled in the app; our eco-van responds within 24 hours.',
        'Earn 25 verified Eco-Credits once the cleanup photo is approved.',
      ],
      link: '/app/report',
      linkText: 'Report a Blackspot',
    },
    {
      title: 'Weekend Volunteer Cleanups',
      reward: '+50 Eco-Credits & Cert',
      icon: 'groups',
      points: [
        'Join weekend neighborhood drives to clean local riverbanks, lakes, and public parks.',
        'WasteChakra supplies all heavy-duty gloves, collection sacks, masks, and refreshments.',
        'Meet eco-conscious neighbors and receive a verified volunteer certificate.',
      ],
      link: '#events-section',
      linkText: 'View Upcoming Drives',
    },
    {
      title: 'Apartment Zero-Waste Challenge',
      reward: 'Tax Rebates & Green Shield',
      icon: 'apartment',
      points: [
        'Enroll your residential society in the monthly 100% Segregation League.',
        'Societies achieving >85% dry and wet segregation earn official municipal recognition.',
        'Helps your Resident Welfare Association (RWA) unlock municipal property tax rebates.',
      ],
      link: '/contact',
      linkText: 'Enroll Your Society',
    },
    {
      title: 'Eco-Rewards Marketplace',
      reward: '1 Credit = ₹1.00 Value',
      icon: 'card_giftcard',
      points: [
        'Redeem your accumulated Eco-Credits for 5kg bags of rich organic farm compost.',
        'Get grocery store discount coupons and eco-friendly home cleaning products.',
        'Convert credits directly into electricity bill or municipal water tax offsets.',
      ],
      link: '/app/rewards',
      linkText: 'Explore Rewards Catalog',
    },
  ];

  const initialEvents = [
    {
      id: 1,
      title: 'Purnia Riverbank Shoreline Cleanup',
      category: 'Cleanup',
      location: 'Saura River Ghat, Purnia',
      date: 'Next Saturday · 7:00 AM - 10:00 AM',
      participants: 64,
      targetKg: 450,
      description: 'Clearing plastic packaging and debris along the ghat. Safety gloves, bags, and tea provided.',
    },
    {
      id: 2,
      title: 'Mega E-Waste & Battery Drop-off Drive',
      category: 'Collection',
      location: 'City Center Market, Main Square',
      date: 'This Sunday · 9:00 AM - 4:00 PM',
      participants: 112,
      targetKg: 800,
      description: 'Bring old chargers, dead laptops, televisions, and batteries. Instant scrap payout & e-waste cert.',
    },
    {
      id: 3,
      title: 'Zero-Odor Home Composting Workshop',
      category: 'Workshops',
      location: 'Botanical Garden Community Hall',
      date: 'Sep 20, 2026 · 11:00 AM - 1:00 PM',
      participants: 48,
      targetKg: 120,
      description: 'Hands-on training on converting kitchen food scraps into black-gold soil fertilizer in balconies.',
    },
    {
      id: 4,
      title: 'Ward 14 Residential Plastic-Free Drive',
      category: 'Cleanup',
      location: 'Green Valley Colony Park',
      date: 'Sep 27, 2026 · 8:00 AM - 11:00 AM',
      participants: 75,
      targetKg: 350,
      description: 'Community door-to-door awareness walk and single-use plastic collection with school students.',
    },
    {
      id: 5,
      title: 'Old Clothes & Textile Upcycling Drive',
      category: 'Collection',
      location: 'Civic Center Auditorium',
      date: 'Oct 04, 2026 · 10:00 AM - 5:00 PM',
      participants: 89,
      targetKg: 620,
      description: 'Donate unwearable worn-out clothes for industrial shredding into acoustic insulation & mattress felt.',
    },
    {
      id: 6,
      title: 'School Green Champions Segregation Fair',
      category: 'Workshops',
      location: 'DAV Public School Campus',
      date: 'Oct 11, 2026 · 9:30 AM - 1:30 PM',
      participants: 140,
      targetKg: 200,
      description: 'Fun interactive games teaching children how to sort wet, dry, and domestic hazardous waste.',
    },
  ];

  const [events, setEvents] = useState(initialEvents);

  useEffect(() => {
    let mounted = true;
    const fetchDynamicEvents = async () => {
      setLoading(true);
      try {
        const data = await dataProvider.getEvents();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setEvents(data);
          // Sync any backend is_joined status
          const backendJoined = {};
          data.forEach((evt) => {
            if (evt.is_joined) backendJoined[String(evt.id)] = true;
          });
          setJoinedEvents((prev) => ({ ...backendJoined, ...dataProvider.getJoinedEvents(), ...prev }));
        }
      } catch (err) {
        console.warn('Could not load dynamic community events:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchDynamicEvents();

    // Prefill name & phone if citizen is logged in
    if (user) {
      const name = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user.username || '');
      const phone = user.phone || user.profile?.phone || '';
      if (name) setUserName(name);
      if (phone) setUserPhone(phone);
    }
    return () => { mounted = false; };
  }, [user]);

  const filteredEvents = activeFilter === 'All'
    ? events
    : events.filter((e) => (e.category || '').toLowerCase() === activeFilter.toLowerCase());

  const leaderboard = [
    { rank: 1, name: 'Green Valley RWA', type: 'Residential Society', kg: '14,250 kg', credits: '18,500', badge: 'Diamond Champion' },
    { rank: 2, name: 'Rajesh Kumar & Family', type: 'Citizen Pioneer', kg: '840 kg', credits: '1,260', badge: 'Zero-Waste Hero' },
    { rank: 3, name: 'Harmony Heights Complex', type: 'Residential Society', kg: '9,820 kg', credits: '12,400', badge: 'Gold Star' },
    { rank: 4, name: 'Dr. Sunita Sen', type: 'Citizen Pioneer', kg: '620 kg', credits: '930', badge: 'Eco Veteran' },
    { rank: 5, name: 'Purnia Tech Park Campus', type: 'Commercial Park', kg: '7,400 kg', credits: '9,800', badge: 'Green Workplace' },
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedEvent || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await dataProvider.joinEvent(selectedEvent.id, {
        name: userName,
        phone: userPhone,
      });

      const eventKey = String(selectedEvent.id);
      setJoinedEvents((prev) => ({ ...prev, [eventKey]: true }));
      setEvents((prev) =>
        prev.map((item) =>
          String(item.id) === eventKey
            ? {
                ...item,
                participants: res.participants || (item.participants + 1),
                is_joined: true,
              }
            : item
        )
      );

      const earned = res?.reward_info?.points_awarded || res?.reward_info?.total_points_added || res?.reward_info?.points_earned;
      if (earned) {
        setRewardFeedback(`+${earned} Chakra Points & Streak Updated! 🔥`);
      } else {
        setRewardFeedback('+50 Chakra Points & Volunteer Badge Reserved!');
      }

      setSelectedEvent(null);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err) {
      console.error('Failed to join event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl">
      {/* Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest text-surface-bright px-6 py-4 rounded-2xl shadow-xl border border-secondary flex items-center gap-3 animate-bounce">
          <Icon name="check_circle" className="text-secondary text-[24px]" />
          <div>
            <div className="font-bold text-sm">Successfully Registered!</div>
            <div className="text-xs text-primary-fixed-dim">
              {rewardFeedback || 'You will receive an SMS reminder before the drive begins.'}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-16 md:mb-space-3xl">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
          <span>✳</span>
          <span>Community Power</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary font-bold tracking-tight max-w-4xl leading-tight">
          Clean streets begin with <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest to-secondary">connected neighborhoods</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-md max-w-3xl leading-relaxed">
          WasteChakra turns environmental responsibility into an engaging community sport. Report dirty spots, volunteer in weekend drives, earn valuable Eco-Credits, and help your society lead the city cleanliness rankings.
        </p>
      </header>

      {/* 4 Community Pillars */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-space-xs">
            <span>✳</span>
            <span>How to Participate</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
            4 Ways to Get Involved
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Simple, practical actions that keep our neighborhoods spotless while rewarding you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {programs.map((prog) => (
            <div key={prog.title} className="bg-surface-container-lowest p-6 rounded-[28px] border border-surface-container-high/70 hover:border-secondary hover:shadow-lg transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 group-hover:bg-secondary-container flex items-center justify-center text-primary transition-colors">
                    <Icon name={prog.icon} className="text-[26px]" />
                  </div>
                </div>
                <div className="font-label-sm text-[11px] text-forest font-bold uppercase tracking-wider mb-1">
                  {prog.reward}
                </div>
                <h3 className="font-title-md text-lg text-primary font-bold mb-3">{prog.title}</h3>
                <ul className="flex flex-col gap-2 text-xs text-on-surface-variant mb-6">
                  {prog.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Icon name="check_circle" className="text-secondary text-[14px] shrink-0 mt-0.5" />
                      <span className="leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={prog.link}
                className="inline-flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-secondary-container text-primary font-label-md text-xs font-bold transition-colors border border-surface-container-high/70"
              >
                <span>{prog.linkText}</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section id="events-section" className="mb-24 md:mb-space-4xl scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-2">
              <span>✳</span>
              <span>Ground Action</span>
            </div>
            <h2 className="font-headline-lg text-xl md:text-3xl text-primary font-bold">
              Upcoming Community Drives & Workshops
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant mt-1">
              Join hands with neighboring residents. Gloves, safety equipment, and collection sacks are provided free.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container-high/70 w-fit">
            {['All', 'Cleanup', 'Collection', 'Workshops'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-primary text-secondary-container shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {filteredEvents.map((evt) => {
            const isJoined = !!joinedEvents[String(evt.id)] || !!evt.is_joined;
            return (
              <div key={evt.id} className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 hover:border-secondary transition-all flex flex-col p-6 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-label-sm text-[11px] px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-bold">
                      {evt.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-md bg-secondary-container/60 text-primary font-bold">
                        +{evt.reward_points || 50} pts
                      </span>
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                        <Icon name="people" className="text-secondary text-[16px]" />
                        <span className="font-bold text-primary">{evt.participants} joined</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-title-md text-base md:text-lg text-primary font-bold mb-2">{evt.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{evt.description}</p>
                  
                  <div className="flex flex-col gap-2 py-3 border-y border-surface-container-high/60 text-xs text-on-surface-variant mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="location_on" className="text-secondary text-[16px]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="schedule" className="text-secondary text-[16px]" />
                      <span>{evt.date}</span>
                    </div>
                    {(evt.target_kg || evt.targetKg) ? (
                      <div className="flex items-center gap-2 text-[11px] text-primary/70">
                        <Icon name="flag" className="text-forest text-[14px]" />
                        <span>Target: {evt.target_kg || evt.targetKg} kg diversion</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  onClick={() => !isJoined && setSelectedEvent(evt)}
                  disabled={isJoined}
                  className={`w-full py-3 rounded-xl font-label-md text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isJoined
                      ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                      : 'bg-secondary-container text-primary hover:bg-secondary-fixed-dim active:scale-[0.99]'
                  }`}
                >
                  <Icon name={isJoined ? 'check_circle' : 'volunteer_activism'} className="text-[18px]" />
                  <span>{isJoined ? 'Joined ✓' : 'Join This Event (Free)'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="mb-24 md:mb-space-4xl">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/70 p-6 md:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-secondary-container/40 text-primary font-eyebrow-tag text-eyebrow-tag font-bold uppercase mb-2">
                <span>✳</span>
                <span>Hall of Fame</span>
              </div>
              <h2 className="font-headline-lg text-xl md:text-3xl text-primary font-bold">
                Monthly Ward Eco-Champions
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Honoring the top citizens, apartment complexes, and companies diverting the most waste this month.
              </p>
            </div>
            <Link to="/app/report" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-primary font-bold text-xs hover:bg-secondary-container transition-colors shrink-0">
              <Icon name="emoji_events" className="text-[18px]" />
              <span>How to Climb Rankings</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-surface-container-high/70 text-on-surface-variant font-label-sm uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Participant</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Waste Diverted</th>
                  <th className="py-3 px-4">Eco-Credits</th>
                  <th className="py-3 px-4">Honor Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/40 font-medium text-primary">
                {leaderboard.map((row) => (
                  <tr key={row.rank} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center ${
                        row.rank === 1 ? 'bg-amber-400/20 text-amber-800' :
                        row.rank === 2 ? 'bg-slate-300/40 text-slate-800' :
                        row.rank === 3 ? 'bg-amber-700/20 text-amber-900' :
                        'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">{row.name}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{row.type}</td>
                    <td className="py-3.5 px-4 font-bold text-forest">{row.kg}</td>
                    <td className="py-3.5 px-4 font-bold text-secondary">{row.credits} pts</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-secondary-container/40 text-primary text-[11px] font-bold">
                        {row.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high/80 p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-secondary-container transition-colors cursor-pointer"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-2">
              <Icon name="volunteer_activism" className="text-[18px]" />
              <span>Confirm Participation</span>
            </div>
            <h3 className="font-headline-sm text-xl text-primary font-bold mb-2">
              {selectedEvent.title}
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              Enter your name and mobile number so the field coordinator can share the exact meeting point and allocate gloves.
            </p>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Sharma"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Mobile Number (For WhatsApp Updates)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-container-high bg-surface text-sm outline-none focus:border-secondary"
                />
              </div>
              <div className="p-3 rounded-xl bg-surface-container-high/50 text-xs text-on-surface-variant">
                ✓ 100% Free to attend &nbsp;•&nbsp; Safety equipment provided on-site &nbsp;•&nbsp; +50 Eco-Credits awarded
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 py-3 rounded-xl bg-surface-container-low font-bold text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-secondary-container font-bold text-xs text-primary hover:bg-secondary-fixed-dim transition-colors cursor-pointer shadow-sm"
                >
                  Confirm My Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <section className="mb-16 md:mb-space-3xl">
        <div className="bg-forest rounded-[28px] p-space-xl md:p-space-2xl text-on-primary text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-space-md relative z-10">
            <h2 className="font-headline-lg text-headline-lg md:text-[40px] md:leading-[48px] text-surface-bright font-bold tracking-tight">
              Spotted an unmanaged garbage dump in your street?
            </h2>
            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-xl">
              Do not let it sit and rot. Take a photo now — our community collection van cleans priority spots within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
              <Link to="/app/report" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-primary font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim transition-all shadow-lg">
                <span>Report Waste Blackspot Now</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/15 hover:bg-surface-container-high/25 text-surface-bright font-label-md text-label-md font-bold transition-colors">
                <span>Organize a Drive in Your Area</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
