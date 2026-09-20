import { useState, useEffect } from 'react';
import { dataProvider } from '../../services/dataProvider';
import { Card, EmptyState, Skeleton, ErrorState, TimeAgo } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNotifications} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Notifications</h1>
        <span className="text-xs font-bold text-on-surface-variant bg-surface-container-high rounded-full px-2.5 py-1">
          {notifications.filter((n) => !n.read).length} unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" message="You're all caught up!" icon="notifications_off" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-surface-container-lowest border border-surface-container-high rounded-2xl p-4 flex gap-3 ${
                !notification.read ? 'border-l-4 border-l-primary' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                !notification.read ? 'bg-secondary-container text-primary' : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <Icon name={notification.icon} className="text-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h2 className={`font-body-md text-body-md ${notification.read ? 'text-on-surface-variant' : 'text-primary font-bold'}`}>
                    {notification.title}
                  </h2>
                  <span className="text-xs text-on-surface-variant shrink-0">{TimeAgo(notification.time)}</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">{notification.message}</p>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary"
                    aria-label={`Mark ${notification.title} as read`}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
