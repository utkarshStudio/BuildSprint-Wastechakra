import { Card, ProgressBar, StatCard } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const outputs = [
  { label: 'Plastic', kg: 1.42, pct: 24 },
  { label: 'Paper', kg: 0.96, pct: 16 },
  { label: 'Metal', kg: 0.52, pct: 9 },
  { label: 'Organic', kg: 2.61, pct: 44 },
  { label: 'RDF', kg: 1.32, pct: 22 },
  { label: 'Inert', kg: 0.28, pct: 5 },
  { label: 'Residual', kg: 0.21, pct: 4 },
];

export default function FacilityOutputs() {
  const input = 6.35;
  const totalOutput = outputs.reduce((a, b) => a + b.kg, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Recovered Outputs</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">Material output streams from current batch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Batch Input" value="6.35 t" icon="vertical_align_bottom" sub="BP-2026-118" />
        <StatCard label="Total Recovered" value="7.32 t" icon="recycling" tone="accented" sub={`${((totalOutput / input) * 100).toFixed(0)}% of input`} />
        <StatCard label="Recovery Rate" value="87%" icon="verified" tone="accented" sub="Above target" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-title-md text-title-md text-primary font-bold mb-1">Output Composition</h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Material breakdown by stream</p>
          <div className="flex flex-col gap-3">
            {outputs.map((o) => (
              <div key={o.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-sm text-label-sm text-primary font-semibold">{o.label}</span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant">{o.kg} t · {o.pct}%</span>
                </div>
                <ProgressBar value={o.pct * 2} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-title-md text-title-md text-primary font-bold mb-4">Composition Stack</h2>
          <div className="flex h-8 rounded-full overflow-hidden border border-surface-container-high mb-6">
            {outputs.map((o, i) => (
              <div key={o.label} className={`h-full ${['bg-forest', 'bg-[#3d6a00]', 'bg-[#90db39]', 'bg-[#abf854]', 'bg-[#e2ebe1]', 'bg-[#c8ebd1]', 'bg-[#dce5db]'][i]}`} style={{ width: `${o.pct}%` }} title={`${o.label}: ${o.pct}%`} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {outputs.map((o, i) => (
              <div key={o.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${['bg-forest', 'bg-[#3d6a00]', 'bg-[#90db39]', 'bg-[#abf854]', 'bg-[#e2ebe1]', 'bg-[#c8ebd1]', 'bg-[#dce5db]'][i]}`} />
                <span className="font-label-sm text-label-sm text-primary">{o.label} · {o.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="border border-secondary-container/60 bg-secondary-container/10">
        <div className="flex items-start gap-3">
          <Icon name="balance" className="text-secondary mt-0.5" />
          <div>
            <h3 className="font-title-md text-title-md text-primary font-bold text-sm">Mass Balance Check</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Input {input} t ≈ Recovered + RDF + Organic + Inert + Residual = {totalOutput.toFixed(2)} t
              (+ documented processing loss/moisture ~{((1 - totalOutput / input) * 100).toFixed(1)}%). Mass is conserved within tolerance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}