import { useState } from 'react';
import { Icon } from '../components/AppIcons';

export default function SystemProcess() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  return (
    <div className="grow w-full max-w-360 mx-auto px-margin-mobile md:px-margin-desktop py-space-3xl">
      {/* Hero Section */}
      <header className="mb-16 max-w-4xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-primary"></span>
          <span className="font-eyebrow-tag text-eyebrow-tag text-primary tracking-widest uppercase">System Architecture</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary mb-6">
          MEET WASTECHAKRA. <span className="text-on-surface-variant">An adaptive architecture for resource recovery.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-primary pl-4">
          A highly calibrated, multi-stage processing environment designed to ingest heterogeneous waste streams and output refined RDF and secondary raw materials. Precision engineering meets sustainable throughput.
        </p>
      </header>

      {/* Central Visualization Area */}
      <section className="relative w-full aspect-square md:aspect-video bg-surface-container-low technical-border blueprint-shadow mb-24 overflow-hidden group rounded-[24px]">
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(to right, theme('colors.surface-container-highest') 1px, transparent 1px), linear-gradient(to bottom, theme('colors.surface-container-highest') 1px, transparent 1px)", backgroundSize: '20px 20px' }}></div>

        <div
          className="absolute inset-4 rounded-2xl overflow-hidden bg-surface-container-lowest border border-surface-container-high flex items-center justify-center cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <img className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700 ease-in-out" src="/images/system.png" alt="System Architecture" />

          <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors flex items-center justify-center pointer-events-none">
            <Icon name="zoom_in" className="text-transparent group-hover:text-forest transition-colors text-6xl drop-shadow-md" />
          </div>
        </div>

        <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-surface-container-lowest/90 backdrop-blur rounded-2xl border border-surface-container-high p-3 md:p-4 z-10 w-36 md:w-48 blueprint-shadow">
          <div className="font-label-sm text-label-sm text-on-surface-variant mb-1 font-bold tracking-wider">SYSTEM STATUS</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
            <span className="font-body-md text-body-md text-primary font-medium">OPTIMAL</span>
          </div>
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-surface-container-highest">
            <div className="font-label-sm text-label-sm text-on-surface-variant mb-1 font-bold tracking-wider">FLOW RATE</div>
            <div className="font-headline-md text-headline-md text-primary leading-tight">NOMINAL</div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-surface-container-lowest/90 backdrop-blur rounded-2xl border border-surface-container-high p-2 md:p-3 z-10 flex gap-3 md:gap-4 blueprint-shadow scale-90 origin-bottom-left md:scale-100 md:origin-center">
          <div>
            <div className="font-label-sm text-label-sm text-on-surface-variant font-bold tracking-wider">EFFICIENCY</div>
            <div className="font-body-md text-body-md text-primary font-medium">OPTIMIZED</div>
          </div>
          <div className="w-px bg-surface-container-highest"></div>
          <div>
            <div className="font-label-sm text-label-sm text-on-surface-variant font-bold tracking-wider">ENERGY</div>
            <div className="font-body-md text-body-md text-primary font-medium">BALANCED</div>
          </div>
        </div>
      </section>

      {/* Process Modules Grid */}
      <section>
        <div className="flex items-end justify-between mb-8 border-b border-surface-container-highest pb-4">
          <h2 className="font-headline-md text-headline-md text-primary">PROCESS MODULES</h2>
          <span className="font-label-md text-label-md text-on-surface-variant hidden md:inline-block">SEQ_01 {'>'} SEQ_08</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {[
            { id: "01", icon: "input", title: "Heterogeneous MSW", desc: "Primary intake of variable, unpredictable municipal solid waste streams.", accent: "primary" },
            { id: "02", icon: "layers", title: "Pre-processing", desc: "Initial screening and bag opening to expose materials for subsequent sorting.", accent: "primary" },
            { id: "03", icon: "recycling", title: "Material Recovery", desc: "Extraction of valuable recyclables such as ferrous and non-ferrous metals using magnetic and eddy current systems.", accent: "secondary" },
            { id: "04", icon: "air", title: "Contaminant Removal", desc: "Ballistic separation and optical sorting to remove inert materials and non-combustibles from the core flow.", accent: "secondary" },
            { id: "05", icon: "local_fire_department", title: "Combustible Recovery", desc: "Aggregating high-calorific fractions (plastics, paper, wood) targeted for energy conversion.", accent: "primary" },
            { id: "06", icon: "water_drop", title: "Moisture Conditioning", desc: "Controlled thermal drying to stabilize moisture content and ensure predictable calorific value.", accent: "primary" },
            { id: "07", icon: "content_cut", title: "Size Reduction & Homogenization", desc: "Fine shredding to achieve uniform particle size distribution for efficient combustion.", accent: "primary" },
            { id: "08", icon: "check_circle", title: "Quality-Controlled RDF", desc: "Final aggregation and pelletization into stable, predictable Refuse-Derived Fuel resources.", accent: "primary" },
          ].map((seq) => (
            <div key={seq.id} className="bg-surface-container-lowest border border-surface-container-high rounded-[20px] p-6 hover:border-forest transition-colors cursor-pointer group relative">
              <div className="absolute top-3 right-3 font-label-sm text-label-sm text-on-surface-variant">SEQ: {seq.id}</div>
              <div className={`w-10 h-10 rounded-full ${seq.accent === 'secondary' ? 'bg-secondary-container/30 text-secondary' : 'bg-forest/10 text-forest'} flex items-center justify-center mb-4 transition-colors`}>
                <Icon name={seq.icon} className="" />
              </div>
              <h3 className="font-title-md text-title-md font-semibold text-primary mb-2">{seq.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3">{seq.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest/90 backdrop-blur-sm p-4 md:p-12 cursor-zoom-out animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-7xl w-full h-full max-h-[90vh] bg-surface-container-lowest border border-surface-container-high rounded-2xl p-2">
            <button
              className="absolute -top-4 -right-4 bg-forest text-on-primary w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-primary-container transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setIsImageModalOpen(false);
              }}
            >
              <Icon name="close" className="" />
            </button>
            <img
              src="/images/system.png"
              alt="System Architecture Full View"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}