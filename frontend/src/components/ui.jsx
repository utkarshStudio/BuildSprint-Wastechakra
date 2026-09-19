import { Icon } from './AppIcons';
export function Spinner({ size = 'md', light = false }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };
  const color = light ? 'border-forest/30 border-t-forest' : 'border-surface-container-highest border-t-primary';
  return <div className={`${sizes[size]} ${color} border-2 rounded-full animate-spin`} role="status" aria-label="Loading" />;
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...props }) {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container border-secondary-container',
    dark: 'bg-primary text-on-primary hover:bg-primary-container',
    outline: 'bg-transparent border border-surface-container-highest text-primary hover:bg-surface-container-low',
    ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low',
    danger: 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-surface-container-lowest border border-surface-container-high rounded-2xl p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, icon, tone = 'primary' }) {
  const tones = {
    primary: 'text-primary',
    accented: 'text-secondary',
    dark: 'text-forest',
  };
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
        {icon && (typeof icon === 'string' ? <Icon name={icon} className="text-secondary text-xl" /> : icon)}
      </div>
      <span className={`font-stat-counter text-3xl font-extrabold tracking-tight leading-none ${tones[tone]}`}>{value}</span>
      {sub && <span className="font-label-sm text-label-sm text-on-surface-variant">{sub}</span>}
    </Card>
  );
}

const STATUS_TONES = {
  REQUESTED: 'bg-surface-container-high text-primary',
  CONFIRMED: 'bg-error-container text-on-error-container',
  ASSIGNED: 'bg-surface-container-high text-primary',
  EN_ROUTE: 'bg-amber-100 text-amber-800',
  ARRIVED: 'bg-amber-100 text-amber-800',
  COLLECTED: 'bg-secondary-container/40 text-primary',
  PROCESSING: 'bg-[#fef3c7] text-amber-800',
  COMPLETED: 'bg-secondary-container text-primary',
  CANCELLED: 'bg-error-container text-on-error-container',
  REPORTED: 'bg-surface-container-high text-primary',
  PICKUP_SCHEDULED: 'bg-amber-100 text-amber-800',
  IN_TRANSIT: 'bg-amber-100 text-amber-800',
  AT_FACILITY: 'bg-[#dbeafe] text-blue-800',
  ACTIVE: 'bg-secondary-container text-primary',
  BUSY: 'bg-amber-100 text-amber-800',
  OFFLINE: 'bg-surface-container-high text-on-surface-variant',
  NORMAL: 'bg-secondary-container/40 text-primary',
  HIGH: 'bg-amber-100 text-amber-800',
  URGENT: 'bg-error-container text-on-error-container',
  PENDING: 'bg-surface-container-high text-on-surface-variant',
  COMPLETED_PROC: 'bg-secondary-container text-primary',
};

export function StatusBadge({ status, pending = false }) {
  const tone = STATUS_TONES[status] || 'bg-surface-container-high text-primary';
  const label = status ? String(status).replace(/_/g, ' ') : 'Unknown';
  if (pending) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tone}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {label}
      </span>
    );
  }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${tone}`}>{label}</span>;
}

export function ProgressBar({ value = 0, color = 'bg-secondary' }) {
  return (
    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Avatar({ name, size = 'md' }) {
  const initials = (name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' };
  return (
    <div className={`${sizes[size]} rounded-full bg-forest text-secondary-fixed flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, icon = 'eco', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <Icon name={icon} className="text-5xl text-surface-container-highest mb-4" />
      <h3 className="font-title-md text-title-md text-primary font-bold mb-1">{title}</h3>
      <p className="font-label-sm text-label-sm text-on-surface-variant max-w-xs mb-4">{message}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-surface-container-high rounded-lg ${className}`} />;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <Icon name="error" className="text-5xl text-error mb-4" />
      <h3 className="font-title-md text-title-md text-primary font-bold mb-1">{title}</h3>
      <p className="font-label-sm text-label-sm text-on-surface-variant max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-surface-container-highest font-bold text-sm hover:bg-surface-container-low">
          <Icon name="refresh" className="text-[18px]" /> Retry
        </button>
      )}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-surface-container-high">
          <h3 className="font-title-md text-title-md text-primary font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-full" aria-label="Close">
            <Icon name="close" className="" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function TimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatWeight(kg) {
  if (kg === null || kg === undefined) return '—';
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${Math.round(kg)} kg`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
