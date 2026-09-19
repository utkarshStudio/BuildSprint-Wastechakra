import { useState, useEffect, useMemo } from 'react';
import { dataProvider } from '../../services/dataProvider';
import { Card, Button, Modal, StatusBadge, Skeleton, ErrorState, EmptyState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const WASTE_TYPES = ['All types', 'MIXED', 'PLASTIC', 'ORGANIC', 'PAPER', 'METAL', 'E_WASTE', 'RECYCLABLES'];
const STATUSES = ['All statuses', 'REPORTED', 'PICKUP_SCHEDULED', 'COLLECTED', 'IN_TRANSIT', 'AT_FACILITY', 'PROCESSING', 'COMPLETED'];
const PRIORITIES = ['All priorities', 'NORMAL', 'HIGH', 'URGENT'];

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [wasteType, setWasteType] = useState('All types');
  const [status, setStatus] = useState('All statuses');
  const [priority, setPriority] = useState('All priorities');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [viewId, setViewId] = useState(null);
  const [assignId, setAssignId] = useState(null);
  const [rejectId, setRejectId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await dataProvider.getWasteReports();
        setReports(data);
        setError(null);
      } catch (e) {
        setError('Unable to load waste reports.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reports.filter((r) => {
      const matchQ = !q || (r.report_id || '').toLowerCase().includes(q) || (r.address || '').toLowerCase().includes(q) || (r.user_email || '').toLowerCase().includes(q);
      const matchT = wasteType === 'All types' || r.waste_type === wasteType;
      const matchS = status === 'All statuses' || r.status === status;
      const matchP = priority === 'All priorities' || r.urgency === priority;
      const matchDate = (!from || new Date(r.created_at) >= new Date(from)) && (!to || new Date(r.created_at) <= new Date(to + 'T23:59:59'));
      return matchQ && matchT && matchS && matchP && matchDate;
    });
  }, [reports, search, wasteType, status, priority, from, to]);

  const viewReport = reports.find((r) => r.id === viewId);
  const assignReport = reports.find((r) => r.id === assignId);

  const setStatusLocal = (id, newStatus) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Waste Reports</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Citizen and business reports awaiting triage and pickup.</p>
        </div>
        <Button variant="primary"><Icon name="add" className="text-[18px]" /> New Report</Button>
      </div>

      {error ? (
        <ErrorState title="Could not load reports" message={error} onRetry={() => window.location.reload()} />
      ) : loading ? (
        <div className="grid gap-4"><Skeleton className="h-24" /><Skeleton className="h-80" /></div>
      ) : (
        <>
          <Card className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
            <Input value={search} onChange={setSearch} placeholder="Search ID, address, user…" className="xl:col-span-2" label="Search" />
            <Select value={wasteType} onChange={setWasteType} options={WASTE_TYPES} label="Waste type" />
            <Select value={status} onChange={setStatus} options={STATUSES} label="Status" />
            <Select value={priority} onChange={setPriority} options={PRIORITIES} label="Priority" />
            <DateInput from={from} to={to} onFrom={setFrom} onTo={setTo} />
          </Card>

          {filtered.length === 0 ? (
            <Card><EmptyState title="No reports match" message="Adjust the filters or search to see more reports." /></Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                      <th className="px-5 py-3 font-bold">Photo</th>
                      <th className="px-4 py-3 font-bold">Report ID</th>
                      <th className="px-4 py-3 font-bold">User</th>
                      <th className="px-4 py-3 font-bold">Waste Type</th>
                      <th className="px-4 py-3 font-bold">Location</th>
                      <th className="px-4 py-3 font-bold">Priority</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold">Created</th>
                      <th className="px-5 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                        <td className="px-5 py-3">
                          <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-low text-on-surface-variant">
                            <Icon name="photo" className="text-[22px]" />
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{r.report_id}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{r.user_email || '—'}</td>
                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{String(r.waste_type || '').replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-on-surface-variant max-w-[160px] truncate">{r.address || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={r.urgency} /></td>
                        <td className="px-4 py-3"><StatusBadge status={r.status} pending={r.status === 'IN_TRANSIT'} /></td>
                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-1">
                            <IconBtn label="View" icon="visibility" onClick={() => setViewId(r.id)} />
                            <IconBtn label="Assign" icon="person_add" onClick={() => setAssignId(r.id)} />
                            <IconBtn label="Priority" icon="flag" onClick={() => {}} />
                            <IconBtn label="Reject" icon="block" onClick={() => setRejectId(r.id)} />
                            <IconBtn label="Resolve" icon="check_circle" onClick={() => setStatusLocal(r.id, 'COMPLETED')} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {viewId && viewReport && (
        <Modal open onClose={() => setViewId(null)} title={viewReport.report_id}>
          <div className="flex flex-col gap-3">
            {Object.entries({
              'Waste Type': viewReport.waste_type, 'Address': viewReport.address,
              'Quantity': viewReport.estimated_quantity, 'User': viewReport.user_email,
              'Description': viewReport.description, 'Created': new Date(viewReport.created_at).toLocaleString(),
            }).map(([k, v]) => (
              <div key={k} className="flex items-start justify-between py-2 border-b border-surface-container-high last:border-0">
                <span className="text-sm text-on-surface-variant">{k}</span>
                <span className="text-sm font-bold text-primary text-right max-w-[60%]">{v || '—'}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1"><StatusBadge status={viewReport.urgency} /><StatusBadge status={viewReport.status} /></div>
          </div>
        </Modal>
      )}

      {assignId && assignReport && (
        <Modal open onClose={() => setAssignId(null)} title={`Assign — ${assignReport.report_id}`}>
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Collector</span>
            <select className="px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Select collector">
              <option>Ravi Kumar</option><option>Suresh</option><option>Anita</option>
            </select>
          </label>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => { setStatusLocal(assignId, 'PICKUP_SCHEDULED'); setAssignId(null); }}>Assign & schedule</Button>
            <Button variant="outline" onClick={() => setAssignId(null)}>Cancel</Button>
          </div>
        </Modal>
      )}

      {rejectId && (
        <Modal open onClose={() => setRejectId(null)} title="Reject Report">
          <p className="text-sm text-on-surface-variant mb-4">Rejecting will remove this report from the active queue. This is a demo action.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => { setReports((prev) => prev.filter((r) => r.id !== rejectId)); setRejectId(null); }}>Reject report</Button>
            <Button variant="outline" onClick={() => setRejectId(null)}>Back</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, label, className = '' }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" />
    </label>
  );
}

function Select({ value, onChange, options, label }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm">
        {options.map((o) => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
      </select>
    </label>
  );
}

function DateInput({ from, to, onFrom, onTo }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Date range</span>
      <div className="flex gap-2">
        <input type="date" value={from} onChange={(e) => onFrom(e.target.value)} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="From date" />
        <input type="date" value={to} onChange={(e) => onTo(e.target.value)} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="To date" />
      </div>
    </div>
  );
}

function IconBtn({ label, icon, onClick }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors">
      <Icon name={icon} className="text-[18px]" />
    </button>
  );
}
