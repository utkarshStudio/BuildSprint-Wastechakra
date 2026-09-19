import { Card } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const qualityMetrics = [
  { label: 'Moisture', value: '8.4%', pct: 90, note: 'Below 10% target' },
  { label: 'Contamination', value: '4.2%', pct: 85, note: 'Low impurity level' },
  { label: 'Calorific Value', value: '14.2 MJ/kg', pct: 72, note: 'Within RDF range' },
  { label: 'Particle Size', value: '<80 mm', pct: 94, note: 'Consistent PDS' },
  { label: 'Homogeneity', value: 'Good', pct: 82, note: 'Stable blend' },
];

export default function FacilityQuality() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">RDF Quality Panel</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">Quality-controlled combustible fraction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 relative overflow-hidden flex flex-col items-center justify-center py-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-container/30 blur-[60px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2ebe1" strokeWidth="12" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#abf854" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52 * 0.82} ${2 * Math.PI * 52}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-stat-counter text-stat-counter text-lg text-primary font-extrabold">82%</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Quality Score</span>
              </div>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-primary text-sm font-bold">
              <Icon name="verified" className="text-[16px]" />
              RDF Grade B
            </span>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-title-md text-title-md text-primary font-bold mb-5">Quality Parameters</h2>
          <div className="flex flex-col gap-4">
            {qualityMetrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-primary font-semibold">{m.label}</span>
                  <span className="font-mono-data text-mono-data text-primary font-bold">{m.value}</span>
                </div>
                <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{m.note}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}