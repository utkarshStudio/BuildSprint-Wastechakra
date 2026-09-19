import { Link } from 'react-router-dom';
import { Card, ProgressBar } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function FacilitySimulation() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-md text-headline-md text-primary font-bold">Facility Digital Twin</h1>
        <p className="font-label-sm text-label-sm text-on-surface-variant">Simulation & live facility status layer</p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-container/30 blur-[80px] translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Icon name="view_in_ar" className="text-[16px] text-secondary" />
              Interactive 3D MSW Simulation
            </span>
            <h2 className="font-headline-md text-headline-md text-primary font-bold mb-2">
              Explore the full processing line
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Waste reception → AI material scanner → shredding → trommel → magnetic & non-ferrous separation → optical AI sorting → quality control → routing → material outputs. Adjust composition, run scenarios, and see mass-balanced recovery in real time.
            </p>
            <Link
              to="/simulation"
              className="mt-6 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-secondary-container text-primary font-bold hover:bg-[#bbfb64] transition-all shadow-md"
            >
              <Icon name="play_arrow" className="text-[20px]" />
              Launch Simulation
            </Link>
          </div>
          <div className="shrink-0 w-56 grid grid-cols-4 gap-1 opacity-80">
            {['🏭', '🔍', '⚙️', '🌀', '🧲', '🔎', '✅', '📦'].map((e, i) => (
              <div key={i} className="aspect-square rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-center text-2xl">{e}</div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-title-md text-title-md text-primary font-bold">Live Facility Parameters</h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
            <Icon name="science" className="text-[14px]" /> DEMO / SIMULATION DATA
          </span>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-5">
          These parameters reflect the simulated twin. The architecture is ready to accept live industrial telemetry (input rate, composition, machine state, temperature, moisture, output flow) when facility sensors are connected.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Input Rate', value: '2.3 t/h', pct: 46 },
            { label: 'Current Composition', value: 'Mixed MSW', pct: 52 },
            { label: 'Machine State', value: 'Running', pct: 68 },
            { label: 'Temperature', value: '34°C', pct: 40 },
            { label: 'Moisture', value: '42%', pct: 42 },
            { label: 'Output Flow', value: '76% recovery', pct: 76 },
          ].map((p) => (
            <div key={p.label} className="p-4 rounded-2xl bg-surface border border-surface-container-high">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{p.label}</span>
                <span className="font-mono-data text-mono-data text-primary font-bold">{p.value}</span>
              </div>
              <ProgressBar value={p.pct} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}