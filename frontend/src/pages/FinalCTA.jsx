import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function FinalCTA() {
  return (
    <div className="flex-grow flex items-center justify-center w-full min-h-[calc(100vh-88px)] bg-surface relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(theme('colors.surface-container-highest') 1px, transparent 1px), linear-gradient(90deg, theme('colors.surface-container-highest') 1px, transparent 1px)", backgroundSize: '40px 40px', opacity: 0.5 }}></div>

      <div className="w-full max-w-[1440px] px-margin-mobile md:px-margin-desktop py-24 relative z-10 flex flex-col items-center justify-center">
        {/* Core Content Box */}
        <div className="bg-surface-container-lowest border-2 border-forest w-full max-w-4xl p-8 md:p-16 relative rounded-[32px] shadow-[0_0_40px_rgba(13,42,26,0.1)]">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-forest rounded-tl-[30px]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-forest rounded-tr-[30px]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-forest rounded-bl-[30px]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-forest rounded-br-[30px]"></div>

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-4 rounded-full border border-surface-container-high font-label-md text-label-md text-on-surface-variant">
            SYSTEM_READY // INITIATE_DEPLOYMENT
          </div>

          <div className="text-center">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-display-hero text-primary mb-6 tracking-tight">
              STOP MANAGING WASTE. <br/>
              <span className="text-secondary">START ENGINEERING IT.</span>
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
              The Adaptive Architecture is ready for integration. Standardize your outputs, achieve compliance certainty, and eliminate chaotic processing variables.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/impact" className="group relative inline-flex items-center justify-center bg-secondary-container text-primary font-label-md font-bold px-8 py-5 text-sm rounded-full transition-all hover:bg-secondary-fixed-dim shadow-lg overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  REQUEST TECHNICAL SPECIFICATIONS
                  <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/simulation" className="inline-flex items-center justify-center font-label-md font-bold text-primary bg-surface-container hover:bg-surface-container-high rounded-full border border-surface-container-high px-8 py-5 text-sm transition-colors">
                VIEW VIRTUAL DEMO
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Data Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mt-16 border-t border-surface-container-highest pt-8">
          <div className="text-center md:text-left border-r border-surface-container-highest border-opacity-0 md:border-opacity-100 last:border-r-0">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1 font-bold tracking-wider">Architecture</div>
            <div className="font-headline-md text-headline-md text-primary">MODULAR</div>
          </div>
          <div className="text-center md:text-left border-r border-surface-container-highest border-opacity-0 md:border-opacity-100 last:border-r-0">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1 font-bold tracking-wider">Processing</div>
            <div className="font-headline-md text-headline-md text-primary">ADAPTIVE</div>
          </div>
          <div className="text-center md:text-left border-r border-surface-container-highest border-opacity-0 md:border-opacity-100 last:border-r-0">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1 font-bold tracking-wider">Outputs</div>
            <div className="font-headline-md text-headline-md text-primary">HOMOGENEOUS</div>
          </div>
          <div className="text-center md:text-left">
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1 font-bold tracking-wider">RDF Quality</div>
            <div className="font-headline-md text-headline-md text-primary">PREDICTABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}