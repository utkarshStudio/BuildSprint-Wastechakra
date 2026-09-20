import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';
import { Icon } from '../components/AppIcons';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const homeFor = (role) => {
    if (role === 'COLLECTOR') return '/collector';
    if (role === 'BUSINESS') return '/business';
    if (role === 'FACILITY_MANAGER') return '/facility';
    if (['ADMIN', 'SUPER_ADMIN'].includes(role)) return '/admin';
    return '/app';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      const dest = location.state?.from || homeFor(user.role);
      navigate(dest);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (em) => { setEmail(em); setPassword('admin12345'); };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-container/20 blur-[100px] rounded-full" />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-container-lowest rounded-[28px] border border-surface-container-high shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <Link to="/"><img alt="WasteChakra" className="h-12 object-contain bg-white rounded-lg" src="/images/logo-aida.png" /></Link>
            <h1 className="font-headline-md text-headline-md text-primary font-bold mt-4">Welcome back</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Continue your circular journey</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-xs text-primary font-bold uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-4 py-3 font-body-md text-sm outline-none focus:border-secondary transition-all"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
                <Icon name="error" className="text-[18px]" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-container text-primary font-bold py-3 hover:bg-[#bbfb64] transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && <Spinner size="sm" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          {(import.meta.env.DEV || import.meta.env.VITE_SHOW_DEMO_ACCOUNTS === 'true' || import.meta.env.VITE_DEMO_MODE === 'true') && (
            <div className="mt-6 pt-6 border-t border-surface-container-high">
              <p className="text-xs text-on-surface-variant font-semibold mb-2 text-center">Demo accounts (password: admin12345)</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={() => quickFill('citizen@wastechakra.com')} className="px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container cursor-pointer">Citizen</button>
                <button onClick={() => quickFill('collector@wastechakra.com')} className="px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container cursor-pointer">Collector</button>
                <button onClick={() => quickFill('business@wastechakra.com')} className="px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container cursor-pointer">Business</button>
                {/* <button onClick={() => quickFill('facility@wastechakra.com')} className="px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container cursor-pointer">Facility</button> */}
                <button onClick={() => quickFill('admin@wastechakra.com')} className="px-3 py-1.5 rounded-full bg-surface-container-high text-xs font-bold text-primary hover:bg-surface-container cursor-pointer">Admin</button>
              </div>
            </div>
          )}

          <p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-6">
            Don't have an account? <Link to="/register" className="text-secondary font-bold hover:text-primary">Create one</Link>
          </p>
        </div>
        <p className="text-center text-xs text-on-surface-variant mt-4">♻️ Turning Waste Into Resources</p>
      </div>
    </div>
  );
}