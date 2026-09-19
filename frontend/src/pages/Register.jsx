import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';
import { Icon } from '../components/AppIcons';

const ROLES = [
  { value: 'CITIZEN', label: 'Citizen' },
  { value: 'COLLECTOR', label: 'Collector' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FACILITY_MANAGER', label: 'Facility' },
];

const homeFor = (role) => {
  if (role === 'COLLECTOR') return '/collector';
  if (role === 'BUSINESS') return '/business';
  if (role === 'FACILITY_MANAGER') return '/facility';
  return '/app';
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    role: 'CITIZEN',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register(form);
      navigate(homeFor(user.role));
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const msg = Object.values(data).flat().join('. ');
        setError(msg || 'Registration failed');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-container/20 blur-[100px] rounded-full" />
      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface-container-lowest rounded-[24px] sm:rounded-[28px] border border-surface-container-high shadow-xl p-5 sm:p-6">
          <div className="flex flex-col items-center mb-3">
            <Link to="/">
              <img alt="WasteChakra" className="h-10 object-contain bg-white rounded-lg shadow-sm" src="/images/logo-aida.png" />
            </Link>
            <h1 className="font-headline-md text-xl sm:text-2xl text-primary font-bold mt-2">Create account</h1>
            <p className="text-xs text-on-surface-variant">Join the circular economy</p>
          </div>

          {/* Clean Pill Role Selector (like Login page) */}
          <div className="mb-3.5">
            <p className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider text-center mb-1.5">
              I want to join as
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {ROLES.map((r) => {
                const isSelected = form.role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-secondary-container text-primary shadow-sm ring-1 ring-primary/20'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            {/* Row 1: Names */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-primary font-bold uppercase tracking-widest ml-1">First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={set('first_name')}
                  required
                  placeholder="Aarav"
                  className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm outline-none focus:border-secondary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-primary font-bold uppercase tracking-widest ml-1">Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={set('last_name')}
                  placeholder="Sharma"
                  className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            {/* Row 2: Email & Username */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-primary font-bold uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm outline-none focus:border-secondary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-primary font-bold uppercase tracking-widest ml-1">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={set('username')}
                  required
                  placeholder="aarav"
                  className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            {/* Row 3: Password & Confirm */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-primary font-bold uppercase tracking-widest ml-1">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm outline-none focus:border-secondary transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-primary font-bold uppercase tracking-widest ml-1">Confirm</label>
                <input
                  type="password"
                  value={form.password_confirm}
                  onChange={set('password_confirm')}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-surface-container-high bg-surface-container-lowest px-3 py-2 text-xs sm:text-sm outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-2">
                <Icon name="error" className="text-[16px] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-container text-primary font-bold py-2.5 hover:bg-[#bbfb64] transition-all disabled:opacity-50 text-sm mt-1 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading && <Spinner size="sm" />}
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-on-surface-variant mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-bold hover:text-primary">
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-[11px] text-on-surface-variant mt-2.5">♻️ Turning Waste Into Resources</p>
      </div>
    </div>
  );
}
