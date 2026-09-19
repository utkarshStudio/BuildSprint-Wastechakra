import { Icon } from '../components/AppIcons';
export default function InnovationValue() {
  return (
    <div className="grow max-w-360 mx-auto w-full">
      {/* Hero Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none text-forest">
          <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
            <line stroke="currentColor" strokeWidth="0.5" x1="0" x2="100" y1="0" y2="100"></line>
            <line stroke="currentColor" strokeWidth="0.5" x1="100" x2="0" y1="0" y2="100"></line>
          </svg>
        </div>
        <div className="max-w-4xl relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-primary"></div>
            <span className="font-eyebrow-tag text-eyebrow-tag text-primary uppercase">Core Principle 01</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary mb-8">
            OUR INNOVATION IS<br/>
            <span className="text-on-surface-variant">THE ARCHITECTURE.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl border-l-2 border-primary pl-6">
            We do not invent novel waste streams; we architect precise, controlled environments where standard physics and chemistry are executed with uncompromising certainty.
          </p>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="data-card p-8 group hover:border-forest transition-colors duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <Icon name="memory" className="text-primary text-4xl" />
              <span className="font-label-md text-label-md text-on-surface-variant">ID: TECH-01</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">Established Tech</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              Deploying proven industrial methodologies—thermal depolymerization, catalytic reforming—within a rigid, scalable framework.
            </p>
            <div className="h-1 w-full bg-surface-container-highest rounded-full mt-auto overflow-hidden">
              <div className="h-full bg-primary w-3/4 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          <div className="data-card p-8 group hover:border-forest transition-colors duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <Icon name="tune" className="text-secondary text-4xl" />
              <span className="font-label-md text-label-md text-on-surface-variant">ID: ADPT-02</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">Adaptive Control</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              Real-time telemetry and algorithmic adjustments ensure process stability despite volatile input composition.
            </p>
            <div className="h-1 w-full bg-surface-container-highest rounded-full mt-auto overflow-hidden">
              <div className="h-full bg-secondary-container w-2/3 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>

          <div className="data-card p-8 group hover:border-forest transition-colors duration-300 flex flex-col">
            <div className="flex justify-between items-start mb-12">
              <Icon name="fact_check" className="text-forest text-4xl" />
              <span className="font-label-md text-label-md text-on-surface-variant">ID: STD-03</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">Output Standardization</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
              Transforming chaotic municipal solid waste into homogenous, predictable resource streams suitable for global commodities markets.
            </p>
            <div className="h-1 w-full bg-surface-container-highest rounded-full mt-auto overflow-hidden">
              <div className="h-full bg-forest w-4/5 group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Flow Diagram Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-24 border-t border-surface-container-highest mt-12 relative bg-surface-container-low">
        <div className="mb-16">
          <span className="font-eyebrow-tag text-eyebrow-tag text-secondary uppercase mb-4 block">Process Telemetry</span>
          <h2 className="font-headline-lg text-headline-lg text-primary">VALUE FROM EVERY TONNE</h2>
        </div>

        <div className="relative w-full border border-surface-container-high bg-surface-container-lowest rounded-[24px] p-12">
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(theme('colors.forest') 1px, transparent 1px), linear-gradient(90deg, theme('colors.forest') 1px, transparent 1px)", backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">

            <div className="data-card p-6 min-w-[250px] border-l-4 border-l-forest">
              <span className="font-label-md text-label-md text-on-surface-variant block mb-2 font-bold tracking-wider">INPUT_STREAM_01</span>
              <h4 className="font-headline-md text-headline-md text-primary mb-2">Mixed MSW</h4>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">High Variability</span>
              </div>
            </div>

            <div className="flex-grow flex items-center justify-center relative min-h-[200px]">
              <div className="hidden lg:block absolute w-full h-px bg-surface-container-highest top-1/2 -z-10"></div>
              <div className="w-32 h-32 rounded-full border-2 border-forest flex items-center justify-center bg-surface-container-lowest shadow-[0_0_20px_rgba(13,42,26,0.15)] relative">
                <Icon name="sync" className="text-forest text-5xl animate-spin" style={{ animationDuration: '4s' }} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-label-sm text-label-sm whitespace-nowrap bg-surface-container-lowest px-2 rounded-full border border-surface-container-high">
                  PROCESSING_CORE
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 min-w-[300px]">
              <div className="data-card p-4 border-r-4 border-r-forest flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block font-bold tracking-wider">OUT_A</span>
                  <span className="font-headline-md text-headline-md text-primary">Recyclables</span>
                </div>
                <Icon name="recycling" className="text-forest" />
              </div>

              <div className="data-card p-4 border-r-4 border-r-secondary-container flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block font-bold tracking-wider">OUT_B</span>
                  <span className="font-headline-md text-headline-md text-primary">Refuse-Derived Fuel (RDF)</span>
                </div>
                <Icon name="local_fire_department" className="text-secondary" />
              </div>

              <div className="data-card p-4 border-r-4 border-r-primary flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block font-bold tracking-wider">OUT_C</span>
                  <span className="font-headline-md text-headline-md text-primary">Organic Fraction</span>
                </div>
                <Icon name="compost" className="text-primary" />
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-surface-container-highest flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-forest rounded-full"></div>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">High Value Recovery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-secondary-container rounded-full"></div>
              <span className="font-label-sm text-label-sm uppercase font-bold tracking-wider">Energy Potential</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}