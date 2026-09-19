import { Link } from 'react-router-dom';
import { Icon } from '../components/AppIcons';

export default function NotFound() {
  return (
    <div className="grow w-full max-w-container-max mx-auto px-gutter py-16 md:py-space-3xl flex items-center justify-center min-h-[calc(100vh-88px)]">
      <div className="text-center flex flex-col items-center gap-space-lg">
        <span className="font-display-lg text-display-lg text-primary font-bold leading-none select-none">404</span>
        <div className="w-16 h-1 bg-secondary-container rounded-full"></div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">
          Page Not Found
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          This page seems to have been recycled into something else.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-sm">
          <Link to="/" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-secondary-container text-primary font-label-md text-label-md font-bold hover:bg-secondary-fixed-dim hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(171,248,84,0.4)] transition-all duration-300">
            <span>Back to Home</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
          <Link to="/simulation" className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-surface-container-high/60 hover:bg-surface-container-high text-primary font-label-md text-label-md font-bold transition-colors">
            <Icon name="view_in_ar" className="text-[18px]" />
            <span>Try Simulation</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
