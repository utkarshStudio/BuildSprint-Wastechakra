import { useState } from 'react';
import { Card, Button, Modal, StatusBadge, EmptyState } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const DEFAULT_RULES = [
  { key: 'report', label: 'Valid waste report', points: 10 },
  { key: 'pickup', label: 'Successful pickup', points: 20 },
  { key: 'recyclable', label: 'Recyclable submission', points: 15 },
  { key: 'plastic', label: 'Plastic recovery', points: 10 },
  { key: 'cleanup', label: 'Community cleanup', points: 50 },
  { key: 'streak', label: 'Monthly streak', points: 100 },
];

const INITIAL_CATALOG = [
  { id: 'r1', title: '₹50 Eco Voucher', cost: 500, stock: 24, status: 'ACTIVE' },
  { id: 'r2', title: 'Reusable Bottle', cost: 800, stock: 12, status: 'ACTIVE' },
  { id: 'r3', title: 'Eco Kit', cost: 1200, stock: 8, status: 'ACTIVE' },
  { id: 'r4', title: 'Community Badge', cost: 2000, stock: 0, status: 'INACTIVE' },
];

const TRANSACTIONS = [
  { id: 't1', user: 'Aarav Sharma', action: 'Valid waste report', points: '+10', date: 'Today 08:12' },
  { id: 't2', user: 'Priya Nair', action: 'Successful pickup', points: '+20', date: 'Today 09:40' },
  { id: 't3', user: 'Meera Iyer', action: 'Community cleanup', points: '+50', date: 'Yesterday' },
  { id: 't4', user: 'Rahul Verma', action: 'Redeemed Eco Kit', points: '-1200', date: 'Yesterday' },
];

export default function AdminRewards() {
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', cost: 100, stock: 10 });
  const [editId, setEditId] = useState(null);

  const setRule = (key, val) => setRules((prev) => prev.map((r) => (r.key === key ? { ...r, points: Math.max(0, Number(val)) } : r)));

  const saveItem = () => {
    if (!form.title) return;
    if (editId) {
      setCatalog((prev) => prev.map((c) => (c.id === editId ? { ...c, ...form } : c)));
      setEditId(null);
    } else {
      setCatalog((prev) => [...prev, { ...form, id: 'r' + Date.now(), status: 'ACTIVE' }]);
    }
    setForm({ title: '', cost: 100, stock: 10 });
    setShowAdd(false);
  };

  const toggleItem = (id) => setCatalog((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : c)));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-md text-headline-md text-primary font-bold">Rewards & Chakra Points</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Configure point rules and the rewards catalog.</p>
        </div>
        <Button variant="primary" onClick={() => { setEditId(null); setForm({ title: '', cost: 100, stock: 10 }); setShowAdd(true); }}><Icon name="add" className="text-[18px]" /> Add Reward</Button>
      </div>

      <Card>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">Point rule editor</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                <th className="px-4 py-3 font-bold">Action</th>
                <th className="px-4 py-3 font-bold w-40">Points</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.key} className="border-b border-surface-container-high last:border-0">
                  <td className="px-4 py-3 font-semibold text-primary">{r.label}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input type="number" value={r.points} onChange={(e) => setRule(r.key, e.target.value)} className="w-24 px-3 py-1.5 rounded-lg border border-surface-container-high bg-surface text-sm font-bold" aria-label={`Points for ${r.label}`} />
                      <span className="text-xs text-on-surface-variant">pts</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high">
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Rewards catalog</h2>
          <span className="text-sm text-on-surface-variant">{catalog.filter((c) => c.status === 'ACTIVE').length} active</span>
        </div>
        {catalog.length === 0 ? (
          <EmptyState title="No rewards" message="Add your first reward to the catalog." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant border-b border-surface-container-high bg-surface-container-low/60">
                  <th className="px-5 py-3 font-bold">Title</th>
                  <th className="px-4 py-3 font-bold">Cost (pts)</th>
                  <th className="px-4 py-3 font-bold">Stock</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((c) => (
                  <tr key={c.id} className="border-b border-surface-container-high last:border-0 hover:bg-surface-container-low/50">
                    <td className="px-5 py-3 font-bold text-primary">{c.title}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.cost}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.stock}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => { setEditId(c.id); setForm({ title: c.title, cost: c.cost, stock: c.stock }); setShowAdd(true); }} aria-label="Edit" className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"><Icon name="edit" className="text-[18px]" /></button>
                        <button onClick={() => toggleItem(c.id)} aria-label="Toggle status" className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high"><Icon name="toggle_on" className="text-[18px]" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-4">Recent point transactions</h2>
        <ul className="divide-y divide-surface-container-high">
          {TRANSACTIONS.map((t) => (
            <li key={t.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-semibold text-primary">{t.user}</p>
                <p className="text-xs text-on-surface-variant">{t.action} · {t.date}</p>
              </div>
              <span className={`font-bold ${t.points.startsWith('-') ? 'text-error' : 'text-secondary'}`}>{t.points}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={editId ? 'Edit Reward' : 'Add Reward'}>
        <div className="flex flex-col gap-4">
          <Field label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" placeholder="Reward name" /></Field>
          <Field label="Cost (points)"><input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" /></Field>
          <Field label="Stock"><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="px-3 py-2 rounded-lg border border-surface-container-high bg-surface text-sm" /></Field>
          <div className="flex gap-3 mt-2">
            <Button variant="primary" onClick={saveItem}>{editId ? 'Save changes' : 'Add reward'}</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
