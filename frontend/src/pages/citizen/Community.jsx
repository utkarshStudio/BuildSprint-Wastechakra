import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataProvider } from '../../services/dataProvider';
import { Card, Button, Skeleton, ErrorState, EmptyState, Modal } from '../../components/ui';
import { Icon } from '../../components/AppIcons';
import { useAuth } from '../../context/AuthContext';
import { demo } from '../../services/demoData';

const LOCATION_ITEMS = [
  { label: 'Plastic Dump', distance: '250m', type: 'reported' },
  { label: 'E-Waste Collection', distance: '800m', type: 'assigned' },
  { label: 'Community Cleanup', distance: '1.2km', type: 'completed' },
  { label: 'Recycling Point', distance: '1.8km', type: 'facility' },
];

const TYPE_DOT = {
  reported: 'bg-yellow-400',
  assigned: 'bg-blue-500',
  completed: 'bg-green-500',
  facility: 'bg-purple-500',
};

export default function CitizenCommunity() {
  const { user } = useAuth();
  const [events, setEvents] = useState(demo.events || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joined, setJoined] = useState({});
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [joiningId, setJoiningId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getEvents();
      if (Array.isArray(data)) {
        setEvents(data);
        const initialJoined = {};
        data.forEach((ev) => {
          if (ev.is_joined) initialJoined[String(ev.id)] = true;
        });
        const stored = dataProvider.getJoinedEvents();
        setJoined({ ...initialJoined, ...stored });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleJoin = async (event) => {
    const eventKey = String(event.id);
    if (joined[eventKey] || joiningId) return;

    setJoiningId(eventKey);
    try {
      const res = await dataProvider.joinEvent(event.id, {
        name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.username || ''),
        phone: user?.phone || user?.profile?.phone || '',
      });

      setJoined((prev) => ({ ...prev, [eventKey]: true }));
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

      const pts = res?.reward_info?.points_earned || event.reward_points || 50;
      setToastMessage({
        title: 'Event Joined! 🌿',
        text: `+${pts} Chakra Points added & daily streak updated for attending ${event.title}!`,
      });
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Failed to join community event:', err);
    } finally {
      setJoiningId(null);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'My Events') return !!joined[String(ev.id)];
    return (ev.category || '').toLowerCase() === activeCategory.toLowerCase();
  });

  if (loading && events.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchEvents} />;
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-forest text-surface-bright px-6 py-4 rounded-2xl shadow-2xl border border-secondary flex items-center gap-3 animate-bounce max-w-md">
          <Icon name="stars" className="text-secondary text-2xl shrink-0" />
          <div>
            <div className="font-bold text-sm text-surface-bright">{toastMessage.title}</div>
            <div className="text-xs text-primary-fixed-dim mt-0.5">{toastMessage.text}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Community Hub</h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Participate in neighborhood drives, earn Chakra Points, and track local waste spots.
          </p>
        </div>
        <Link to="/community" target="_blank" className="text-xs font-bold text-forest hover:underline flex items-center gap-1 shrink-0">
          <span>View Public Drives Page</span>
          <Icon name="open_in_new" className="text-[14px]" />
        </Link>
      </div>

      {/* Community Map Banner */}
      <Link to="/app/map" aria-label="Open community map">
        <div className="bg-linear-to-br from-green-100 via-emerald-50 to-green-200 rounded-2xl border border-surface-container-high p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-forest text-secondary-container flex items-center justify-center shrink-0 shadow-sm">
            <Icon name="map" className="text-2xl" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-body-md text-body-md text-primary font-bold">Interactive Waste & Facility Map</p>
              <span className="bg-secondary-container/70 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">Explore active community reports, collection trucks, and drop-off bins around your GPS area.</p>
          </div>
          <Icon name="chevron_right" className="text-on-surface-variant text-xl" />
        </div>
      </Link>

      {/* Waste Around You Quick Glance */}
      <div>
        <h2 className="font-title-md text-title-md text-primary font-bold mb-3">Recent Waste Activity Near You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {LOCATION_ITEMS.map((item) => (
            <Card key={item.label} className="p-3.5 hover:border-secondary transition-colors">
              <Link to="/app/map" className="flex items-center gap-3" aria-label={`View ${item.label} on map`}>
                <span className={`w-3 h-3 rounded-full shrink-0 ${TYPE_DOT[item.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-body-sm text-body-sm text-primary font-bold truncate">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.distance} away</p>
                </div>
                <Icon name="chevron_right" className="text-on-surface-variant text-sm" />
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Drives & Cleanups Section */}
      <div className="mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary font-bold flex items-center gap-2">
              <span>Upcoming Environmental Drives</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary-container text-primary">
                +{50} Pts / Drive
              </span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Join local volunteers. Free safety gloves, bags, and volunteer certificates provided.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-surface-container-high/60 w-fit">
            {['All', 'Cleanup', 'Collection', 'Workshops', 'My Events'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-secondary-container shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat}
                {cat === 'My Events' && Object.keys(joined).length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-secondary text-primary text-[10px]">
                    {Object.values(joined).filter(Boolean).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found"
            message={activeCategory === 'My Events' ? "You haven't joined any events yet. Pick one below to earn +50 Chakra Points!" : "No events currently scheduled under this category."}
            icon="event"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((event) => {
              const eventKey = String(event.id);
              const isJoined = !!joined[eventKey] || !!event.is_joined;
              const isJoining = joiningId === eventKey;

              return (
                <Card key={event.id} className="p-5 flex flex-col justify-between hover:border-secondary transition-all shadow-xs">
                  <div>
                    {/* Top Row: Category and Points Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary">
                        {event.category || 'Drive'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-secondary-container/70 text-primary flex items-center gap-1">
                          <Icon name="stars" className="text-[13px] text-amber-600" />
                          <span>+{event.reward_points || 50} pts</span>
                        </span>
                        <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                          <Icon name="people" className="text-forest text-[15px]" />
                          <span>{event.participants} joined</span>
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-title-md text-base text-primary font-bold leading-snug">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Event Meta Details */}
                    <div className="flex flex-col gap-1.5 py-3 my-3 border-y border-surface-container-high/60 text-xs text-on-surface-variant">
                      <div className="flex items-center gap-2">
                        <Icon name="location_on" className="text-secondary text-[16px] shrink-0" />
                        <span className="truncate font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="schedule" className="text-secondary text-[16px] shrink-0" />
                        <span>{event.date}</span>
                      </div>
                      {(event.target_kg || event.targetKg) ? (
                        <div className="flex items-center gap-2 text-[11px] text-forest font-medium">
                          <Icon name="flag" className="text-[14px] shrink-0" />
                          <span>Target: {event.target_kg || event.targetKg} kg diversion</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant={isJoined ? 'outline' : 'primary'}
                      size="sm"
                      className={`flex-1 font-bold flex items-center justify-center gap-1.5 ${
                        isJoined ? 'border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' : ''
                      }`}
                      disabled={isJoined || isJoining}
                      onClick={() => handleJoin(event)}
                    >
                      <Icon name={isJoined ? 'check_circle' : 'volunteer_activism'} className="text-[16px]" />
                      <span>{isJoined ? 'Joined ✓' : isJoining ? 'Joining...' : 'Join This Event (Free)'}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-on-surface-variant hover:text-primary px-3"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
        >
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-primary">
                {selectedEvent.category}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary-container text-primary">
                +{selectedEvent.reward_points || 50} Chakra Points
              </span>
              <span className="text-xs text-on-surface-variant font-medium">
                {selectedEvent.participants} volunteers attending
              </span>
            </div>

            <p className="text-sm text-primary leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high/60 flex flex-col gap-2 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Icon name="location_on" className="text-secondary text-[16px]" />
                <span className="font-bold text-primary">{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="schedule" className="text-secondary text-[16px]" />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="shield" className="text-emerald-600 text-[16px]" />
                <span>Safety kit provided (Heavy duty gloves, dust mask, collection sacks)</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="coffee" className="text-amber-700 text-[16px]" />
                <span>Complimentary tea & refreshments served post-cleanup</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              {!(joined[String(selectedEvent.id)] || selectedEvent.is_joined) && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const evt = selectedEvent;
                    setSelectedEvent(null);
                    handleJoin(evt);
                  }}
                >
                  Join This Event (Free)
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
