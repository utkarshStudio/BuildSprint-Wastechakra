import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataProvider, labels } from '../../services/dataProvider';
import { Card, StatusBadge, Skeleton, ErrorState, EmptyState, formatWeight, formatDate } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const FILTERS = ['All', 'Reported', 'Pickup Scheduled', 'Collected', 'Processing', 'Completed'];

const FILTER_MAP = {
  'All': null,
  'Reported': 'REPORTED',
  'Pickup Scheduled': 'PICKUP_SCHEDULED',
  'Collected': 'COLLECTED',
  'Processing': 'PROCESSING',
  'Completed': 'COMPLETED',
};

export default function MyWaste() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dataProvider.getWasteReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const activeFilter = FILTER_MAP[filter];
  const filtered = activeFilter ? reports.filter((r) => r.status === activeFilter) : reports;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchReports} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline-md text-headline-md text-primary font-bold">My Waste</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              filter === f ? 'bg-secondary-container text-primary' : 'bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No waste found"
          message="Submit a waste report to track it here."
          icon="delete_sweep"
          action={
            <Link to="/app/report" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container text-primary font-bold text-sm">
              Report Waste
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((report) => (
            <Link key={report.id} to={`/app/waste/${report.id}`}>
              <Card className="hover:border-primary/50 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden">
                    {report.image ? (
                      <img src={report.image} alt="Report waste" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="delete" className="text-2xl text-on-surface-variant" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-body-md text-on-surface-variant font-bold">{report.report_id || report.id}</span>
                      <StatusBadge status={report.status} pending={report.status === 'REPORTED' || report.status === 'PICKUP_SCHEDULED'} />
                    </div>
                    <p className="text-sm text-on-surface-variant mt-1">{labels.wasteTypes[report.waste_type] || report.waste_type} · {report.estimated_quantity || '—'} kg</p>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">{report.address || 'No address'}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{formatDate(report.created_at)}</p>
                  </div>
                  <Icon name="chevron_right" className="text-on-surface-variant" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
