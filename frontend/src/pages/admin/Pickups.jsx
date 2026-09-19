import { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { dataProvider } from '../../services/dataProvider';
import { Card, Button, Modal, StatusBadge, Skeleton, ErrorState, EmptyState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const COLLECTORS = ['Ravi Kumar', 'Suresh', 'Anita'];

const NEXT_STATES = {
  REQUESTED: ['CONFIRMED', 'ASSIGNED'],
  CONFIRMED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['EN_ROUTE', 'CANCELLED'],
  EN_ROUTE: ['ARRIVED', 'CANCELLED'],
  ARRIVED: ['COLLECTED'],
  COLLECTED: ['PROCESSING'],
  PROCESSING: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export default function AdminPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [viewId, setViewId] = useState(null);
  const [assignId, setAssignId] = useState(null);
  const [assignCollector, setAssignCollector] = useState(COLLECTORS[0]);
  const [reschedId, setReschedId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [changeId, setChangeId] = useState(null);
  const [changeStatus, setChangeStatus] = useState('');
  const [msg, setMsg] = useState('');

  const PAGE_SIZE = 8;

  useEffect(() => {
    async function load() {
      try {
        const data = await dataProvider.getPickups();
        setPickups(data);
        setError(null);
      } catch (e) {
        setError('Unable to load pickups.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return pickups.filter((p) => {
      const q = search.toLowerCase();
      const matchQ = !q || (p.pickup_id || '').toLowerCase().includes(q) || (p.address || '').toLowerCase().includes(q) || (p.user_email || '').toLowerCase().includes(q);
      const matchS = !statusFilter || p.status === statusFilter;
      return matchQ && matchS;
    });
  }, [pickups, search, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const changeStatusLocal = async (id, newStatus) => {
    let next = newStatus;
    try {
      await api.updatePickup(id, { status: newStatus });
      setMsg(`Status updated to ${newStatus}`);
    } catch {
      setMsg('Offline — updated locally (demo fallback)');
    }
    setPickups((prev) => prev.map((p) => (p.id === id ? { ...p, status: next } : p)));
  };

  const assign = async (p) => {
    let next = p.status === 'CONFIRMED' ? p.status : p.status === 'REQUESTED' ? 'CONFIRMED' : 'ASSIGNED';
    try {
      await api.updatePickup(p.id, { status: next, collector_email: assignCollector.toLowerCase().replace(' ', '.') + '@wastechakra.com' });
      setMsg(`Assigned ${assignCollector}`);
    } catch {
      setMsg('Assigned locally (demo fallback)');
    }
    setPickups((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
    setAssignId(null);
  };

  const viewPickup = pickups.find((p) => p.id === viewId);
  const changePickup = pickups.find((p) => p.id === changeId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Pickup Management</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Assign collectors, reschedule and advance pickup status.</p>
        </div>
        {msg && <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/40 text-primary text-xs font-bold">✓ {msg}</span>}
      </div>

      {error ? (
        <ErrorState title="Could not load pickups" message={error} onRetry={() => window.location.reload()} />
      ) : loading ? (
        <div className="grid gap-4"><Skeleton className="h-72" /><Skeleton className="h-16" /></div>
      ) : (
        <>
          <Card className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search pickup, address, user…"
                className="px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface text-sm w-full md:w-72"
                aria-label="Search pickups"
              />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface text-sm"
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                {['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'EN_ROUTE', 'ARRIVED', 'COLLECTED', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <span className="text-sm text-on-surface-variant">{filtered.length} pickups</span>
          </Card>

          {pageRows.length === 0 ? (
            <Card><EmptyState title="No pickups found" message="Try a different search or status filter." /></Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                      <SortTh label="Pickup ID" />
                      <SortTh label="User" />
                      <SortTh label="Waste Type" />
                      <SortTh label="Status" />
                      <SortTh label="Collector" />
                      <SortTh label="Date" />
                      <SortTh label="Weight" />
                      <th className="px-4 py-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((p) => (
                      <tr key={p.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                        <td className="px-5 py-3 font-bold text-primary whitespace-nowrap">{p.pickup_id || p.id}</td>
                        <td className="px-4 py-3 text-on-surface-variant">{p.user_email || '—'}</td>
                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{String(p.waste_type || '').replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3"><SelectStatus state={changeId === p.id ? changeStatus : p.status} onChange={(v) => { setChangeId(p.id); setChangeStatus(v); }} /></td>
                        <td className="px-4 py-3 text-on-surface-variant">{p.collector_email ? p.collector_email.split('@')[0] : '—'}</td>
                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{p.pickup_date || '—'}</td>
                        <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{p.actual_weight_kg ? `${p.actual_weight_kg} kg` : '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1.5">
                            <IconBtn label="View" icon="visibility" onClick={() => setViewId(p.id)} />
                            <IconBtn label="Assign" icon="person_add" onClick={() => { setAssignId(p.id); setAssignCollector(COLLECTORS[0]); }} />
                            <IconBtn label="Reschedule" icon="event" onClick={() => { setReschedId(p.id); setNewDate(p.pickup_date || ''); }} />
                            <IconBtn label="Cancel" icon="block" onClick={() => setCancelId(p.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-t border-surface-container-high">
                <button onClick={() => setPage((pg) => Math.max(0, pg - 1))} disabled={safePage === 0} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-surface-container-high text-sm font-bold disabled:opacity-40">← Prev</button>
                <span className="text-sm text-on-surface-variant">Page {safePage + 1} of {pageCount}</span>
                <button onClick={() => setPage((pg) => Math.min(pageCount - 1, pg + 1))} disabled={safePage >= pageCount - 1} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-surface-container-high text-sm font-bold disabled:opacity-40">Next →</button>
              </div>
            </Card>
          )}

          <TransitionHelp />
        </>
      )}

      {changeId && changePickup && (
        <Modal open onClose={() => setChangeId(null)} title={`Change status — ${changePickup.pickup_id || changePickup.id}`}>
          <p className="text-sm text-on-surface-variant mb-4">Current status: <StatusBadge status={changePickup.status} /></p>
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">New status</span>
            <select value={changeStatus} onChange={(e) => setChangeStatus(e.target.value)} className="px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="New status">
              {(NEXT_STATES[changePickup.status] || []).map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </label>
          <div className="flex gap-3">
            <Button variant="primary" disabled={!changeStatus} onClick={() => { changeStatusLocal(changeId, changeStatus); setChangeId(null); }}>Update status</Button>
            <Button variant="outline" onClick={() => setChangeId(null)}>Cancel</Button>
          </div>
        </Modal>
      )}

      {assignId && (
        <Modal open onClose={() => setAssignId(null)} title="Assign Collector">
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Collector</span>
            <select value={assignCollector} onChange={(e) => setAssignCollector(e.target.value)} className="px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="Select collector">
              {COLLECTORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => assign(pickups.find((p) => p.id === assignId))}>Assign & confirm</Button>
            <Button variant="outline" onClick={() => setAssignId(null)}>Cancel</Button>
          </div>
        </Modal>
      )}

      {reschedId && (
        <Modal open onClose={() => setReschedId(null)} title="Reschedule Pickup">
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">New pickup date</span>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="px-4 py-2.5 rounded-lg border border-surface-container-high bg-surface text-sm" aria-label="New date" />
          </label>
          <div className="flex gap-3">
            <Button variant="primary" disabled={!newDate} onClick={() => { setPickups((prev) => prev.map((p) => (p.id === reschedId ? { ...p, pickup_date: newDate } : p))); setReschedId(null); }}>Reschedule</Button>
            <Button variant="outline" onClick={() => setReschedId(null)}>Cancel</Button>
          </div>
        </Modal>
      )}

      {cancelId && (
        <Modal open onClose={() => setCancelId(null)} title="Cancel Pickup">
          <p className="text-sm text-on-surface-variant mb-4">Are you sure you want to cancel this pickup? This action sets status to CANCELLED.</p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => { changeStatusLocal(cancelId, 'CANCELLED'); setCancelId(null); }}>Confirm cancel</Button>
            <Button variant="outline" onClick={() => setCancelId(null)}>Back</Button>
          </div>
        </Modal>
      )}

      {viewId && viewPickup && (
        <Modal open onClose={() => setViewId(null)} title={viewPickup.pickup_id || viewPickup.id}>
          <div className="flex flex-col gap-3">
            {Object.entries({
              'Waste Type': viewPickup.waste_type, 'Pickup Type': viewPickup.pickup_type,
              'Address': viewPickup.address, 'Pickup Date': viewPickup.pickup_date,
              'User': viewPickup.user_email, 'Collector': viewPickup.collector_email || 'Not assigned',
              'Weight': viewPickup.actual_weight_kg ? `${viewPickup.actual_weight_kg} kg` : '—',
            }).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-surface-container-high last:border-0">
                <span className="text-sm text-on-surface-variant">{k}</span>
                <span className="text-sm font-bold text-primary text-right">{v || '—'}</span>
              </div>
            ))}
            <div className="pt-2"><StatusBadge status={viewPickup.status} /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SortTh({ label }) {
  return (
    <th className="px-4 py-3 font-bold first:px-5">
      <button className="inline-flex items-center gap-1 uppercase" aria-label={`Sort by ${label}`}>
        {label}<Icon name="unfold_more" className="text-[14px]" />
      </button>
    </th>
  );
}

function SelectStatus({ state, onChange }) {
  const next = NEXT_STATES[state] || [];
  return (
    <div className="inline-flex items-center gap-2">
      <StatusBadge status={state} />
      {next.length > 0 && (
        <select value="" onChange={(e) => e.target.value && onChange(e.target.value)} className="rounded-lg border border-surface-container-high bg-surface text-xs px-1.5 py-1" aria-label={`Advance from ${state}`}>
          <option value="">Advance…</option>
          {next.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      )}
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

function TransitionHelp() {
  return (
    <Card>
      <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-3">Allowed status transitions</h2>
      <div className="flex flex-wrap gap-2">
        {Object.entries(NEXT_STATES).filter(([, v]) => v.length).map(([from, list]) => (
          <span key={from} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-xs font-bold text-primary">
            <span className="whitespace-nowrap">{from.replace(/_/g, ' ')}</span>
            <Icon name="arrow_forward" className="text-[16px] text-on-surface-variant" />
            {list.map((s) => (
              <span key={s} className="whitespace-nowrap text-on-surface-variant">{s.replace(/_/g, ' ')}</span>
            ))}
          </span>
        ))}
      </div>
    </Card>
  );
}
