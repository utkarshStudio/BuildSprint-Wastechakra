import { Icon } from '../components/AppIcons';
export default function AdaptiveIntelligence() {
  return (
    <div className="grow w-full max-w-360 mx-auto px-margin-mobile md:px-margin-desktop py-space-3xl flex flex-col gap-16">
      <header className="w-full max-w-4xl pt-16">
        <div className="inline-flex items-center gap-2 px-space-sm py-space-xxs rounded-full border border-surface-container-high bg-surface-container-low mb-6">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Architecture Status: Active</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary mb-6">
          NOT A FIXED LINE. <br className="hidden md:block"/>
          <span className="text-secondary">AN ADAPTIVE SYSTEM.</span>
        </h1>
        <p className="font-label-md text-label-md text-on-surface-variant max-w-2xl uppercase tracking-wider leading-relaxed">
          Adaptive Processing Architecture executing real-time material characterization. Modulating separation parameters autonomously for absolute certainty in output purity.
        </p>
      </header>

      {/* Process Flow UI */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-surface-container-highest -z-10 translate-y-[-50%]"></div>

          <div className="bg-surface-container-lowest border border-surface-container-high rounded-[20px] p-6 flex flex-col items-start gap-4">
            <div className="w-10 h-10 border border-forest text-forest flex items-center justify-center bg-surface-container-low rounded-full">
              <Icon name="sensors" className="" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">PHASE 01 // SENSE</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Multispectral input scanning.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-high rounded-[20px] p-6 flex flex-col items-start gap-4">
            <div className="w-10 h-10 border border-forest text-forest flex items-center justify-center bg-surface-container-low rounded-full">
              <Icon name="analytics" className="" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">PHASE 02 // ASSESS</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Composition analysis algorithms.</p>
            </div>
          </div>

          <div className="border border-surface-container-high rounded-[20px] p-6 flex flex-col justify-between min-h-50 relative group hover:border-forest transition-colors">
            <div className="w-10 h-10 bg-secondary-container text-primary flex items-center justify-center rounded-full">
              <Icon name="tune" className="" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">PHASE 03 // ADJUST</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Real-time parameter modulation.</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-high rounded-[20px] p-6 flex flex-col items-start gap-4">
            <div className="w-10 h-10 bg-surface-container-high text-on-surface-variant flex items-center justify-center bg-surface-container-low rounded-full">
              <Icon name="call_split" className="" />
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">PHASE 04 // SEPARATE</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">Precision physical divergence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Telemetry Data Grid */}
      <section className="w-full">
        <h2 className="font-label-md text-label-md text-on-surface-variant mb-6 flex items-center gap-2 font-bold uppercase tracking-wider">
          <Icon name="troubleshoot" className="text-[16px]" />
          LIVE TELEMETRY // SYSTEM CALIBRATION
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Moisture Content Card */}
          <article className="bg-surface-container-lowest border border-surface-container-high rounded-[24px] p-gutter relative min-h-[200px] flex flex-col justify-between group hover:border-forest transition-colors duration-300">
            <div className="absolute top-4 right-4 font-label-sm text-label-sm text-on-surface-variant tracking-widest border border-surface-container-high px-2 py-0.5 rounded-full">
              ID: MST-8A
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 font-bold tracking-wider">Moisture Content</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-headline-md text-headline-md text-forest animate-data-pulse">NOMINAL</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">REL VOL</span>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                <span>0%</span>
                <span>Target: 40%</span>
                <span>100%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high relative rounded-full overflow-hidden border border-surface-container-high">
                <div className="absolute top-0 left-0 h-full bg-secondary-container" style={{ width: '42.8%' }}></div>
                <div className="absolute -top-1 -bottom-1 -left-1 w-0.5 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
              </div>
            </div>
          </article>

          {/* Inert Material Card */}
          <article className="bg-surface-container-lowest border border-surface-container-high rounded-[24px] p-gutter relative min-h-[200px] flex flex-col justify-between group hover:border-forest transition-colors duration-300">
            <div className="absolute top-4 right-4 font-label-sm text-label-sm text-on-surface-variant tracking-widest border border-surface-container-high px-2 py-0.5 rounded-full">
              ID: INR-2B
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 font-bold tracking-wider">Inert Fraction</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-headline-md text-headline-md text-forest animate-data-pulse">OPTIMAL</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">MASS</span>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                <span>0%</span>
                <span>Limit: &lt;15%</span>
                <span>50%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high relative rounded-full overflow-hidden border border-surface-container-high">
                <div className="absolute top-0 left-0 h-full bg-forest" style={{ width: '22.8%' }}></div>
                <div className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-outline z-10" style={{ left: '30%' }}></div>
              </div>
            </div>
          </article>

          {/* Particle Size Card */}
          <article className="bg-surface-container-lowest border border-surface-container-high rounded-[24px] p-gutter relative min-h-[200px] flex flex-col justify-between group hover:border-forest transition-colors duration-300">
            <div className="absolute top-4 right-4 font-label-sm text-label-sm text-on-surface-variant tracking-widest border border-surface-container-high px-2 py-0.5 rounded-full">
              ID: PSD-9X
            </div>
            <div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-2 font-bold tracking-wider">Particle Size &lt;50mm</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-headline-md text-headline-md text-forest animate-data-pulse">TARGET</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">PASSING</span>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-1">
                <span>0%</span>
                <span>Optimum: &gt;80%</span>
                <span>100%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-high relative rounded-full overflow-hidden border border-surface-container-high">
                <div className="absolute top-0 left-0 h-full bg-secondary-container" style={{ width: '86.2%' }}></div>
                <div className="absolute top-0 h-full bg-primary/20 z-10" style={{ left: '80%', right: 0 }}></div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}