import { Card, ProgressBar, StatCard } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

const stages = [
  'Reception', 'Pre-processing', 'Trommel Screen', 'Magnetic Separator', 'Non-Ferrous Separator',
  'Optical AI Sorter', 'Quality / Contamination', 'Conditioning', 'Routing', 'Recovery',
];

const activeStageIndex = 5;

export default function FacilityProcessing() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Processing Dashboard</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">Adaptive MSW Resource Recovery & RDF Conditioning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Input" value="18.4 t" icon="vertical_align_bottom" sub="Today" />
        <StatCard label="Material Recovery" value="76%" icon="recycling" tone="accented" sub="Live rate" />
        <StatCard label="RDF Conditioning" value="6.2 t" icon="local_fire_department" tone="accented" sub="Produced today" />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-title-md text-title-md text-primary font-bold">Processing Progress</h2>
          <span className="font-mono-data text-mono-data text-primary font-bold">68%</span>
        </div>
        <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div className="h-full bg-secondary rounded-full transition-all" style={{ width: '68%' }} />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-title-md text-title-md text-primary font-bold mb-4">Processing Stages</h2>
          <div className="flex flex-col gap-2.5">
            {stages.map((stage, i) => {
              const isDone = i < activeStageIndex;
              const isActive = i === activeStageIndex;
              return (
                <div key={stage} className={`flex items-center gap-3 p-3 rounded-xl border ${isActive ? 'border-secondary bg-secondary-container/20' : isDone ? 'border-surface-container-high bg-surface-container-low' : 'border-surface-container-high opacity-60'}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isDone ? 'bg-secondary-container text-primary' : isActive ? 'bg-secondary text-white animate-pulse' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    {isDone ? <Icon name="check" className="text-[14px]" /> : i + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-primary text-sm">{stage}</span>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      {isActive ? 'Processing now...' : isDone ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  {isActive && <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="font-title-md text-title-md text-primary font-bold mb-1">Material Recovery</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Separated and recovered from current batch</p>
            {[
              { label: 'Plastic', pct: 82, kg: '1.42 t' },
              { label: 'Paper', pct: 74, kg: '0.96 t' },
              { label: 'Metal (ferrous)', pct: 88, kg: '0.34 t' },
              { label: 'Metal (non-ferrous)', pct: 81, kg: '0.18 t' },
              { label: 'Organic', pct: 69, kg: '2.61 t' },
            ].map((m) => (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-sm text-label-sm text-primary font-semibold">{m.label}</span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant">{m.kg}</span>
                </div>
                <ProgressBar value={m.pct} />
              </div>
            ))}
          </Card>

          <Card>
            <h2 className="font-title-md text-title-md text-primary font-bold mb-1">RDF Conditioning</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">Quality parameters for combustible fraction</p>
            {[
              { label: 'Moisture reduction', pct: 78 },
              { label: 'Contaminant removal', pct: 84 },
              { label: 'Calorific target', pct: 71 },
              { label: 'Particle size', pct: 90 },
              { label: 'Homogeneity', pct: 64 },
            ].map((m) => (
              <div key={m.label} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-label-sm text-label-sm text-primary font-semibold">{m.label}</span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant">{m.pct}%</span>
                </div>
                <ProgressBar value={m.pct} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}