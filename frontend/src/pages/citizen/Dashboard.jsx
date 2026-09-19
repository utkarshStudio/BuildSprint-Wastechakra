import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataProvider } from '../../services/dataProvider';
import { Card, StatCard, StatusBadge, Skeleton, ErrorState, EmptyState, formatWeight, formatDate, TimeAgo } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pickupData, impactData] = await Promise.all([
        dataProvider.getPickups(),
        dataProvider.getImpact(),
      ]);
      setPickups(pickupData || []);
      setImpact(impactData || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const firstName = user?.first_name || user?.email?.split('@')[0] || 'there';
  const points = impact?.chakra_points ?? user?.profile?.chakra_points ?? 0;
  const streakDays = impact?.streak_days ?? user?.profile?.streak_days ?? 1;
  const recentPickup = pickups.length > 0 ? pickups[0] : null;

  if (loading) {
    return (
      <div className="flex flex-col gap-4 sm:gap-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        {/* Hero Card Skeleton */}
        <Skeleton className="h-48 sm:h-52 w-full rounded-3xl" />

        {/* Quick Actions Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>

        {/* Live Pickup Skeleton */}
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 max-w-6xl mx-auto w-full">
      {/* 1. Mobile App Greeting Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/app/profile" className="relative group shrink-0" title="Go to Profile">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-forest text-[#abf854] font-extrabold flex items-center justify-center text-base sm:text-lg ring-2 ring-[#abf854]/40 shadow-xs group-hover:scale-105 transition-transform">
              {(firstName[0] || 'C').toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#abf854] ring-2 ring-surface" />
          </Link>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Citizen Portal
            </span>
            <h1 className="font-headline-md text-xl sm:text-2xl text-primary font-extrabold truncate">
              Hello, {firstName} 👋
            </h1>
          </div>
        </div>

        {/* Gamified Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 shadow-2xs">
          <Icon name="local_fire_department" className="text-amber-500 text-base sm:text-lg animate-bounce" />
          <span className="text-xs sm:text-sm font-extrabold font-mono">{streakDays}d Streak</span>
        </div>
      </div>

      {/* 2. Hero Digital Impact Wallet Card */}
      <div className="relative rounded-3xl bg-linear-to-br from-[#00180b] via-[#052b19] to-[#00180b] p-5 sm:p-6 text-white border border-[#abf854]/25 shadow-xl overflow-hidden group">
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(#abf854_1px,transparent_1px)] bg-size-[16px_16px] opacity-10 pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#abf854]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
          {/* Top Label Strip */}
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 font-bold border border-white/10 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#abf854] animate-pulse" />
              Eco Balance
            </span>
            <span className="text-[11px] font-mono text-[#abf854] font-bold">Level 2 Champion</span>
          </div>

          {/* Large Point Balance & Redeem Action */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-white/60 text-xs font-medium block">Total Redeemable Points</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#abf854] tracking-tight">
                  {points.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white/80 uppercase tracking-wide">PTS</span>
              </div>
            </div>

            <Link
              to="/app/rewards"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#abf854] text-[#00180b] hover:bg-[#bcfd6b] active:scale-95 font-extrabold text-xs tracking-wide shadow-sm transition-all self-start sm:self-auto cursor-pointer"
            >
              <Icon name="card_giftcard" className="text-sm" />
              <span>Redeem Rewards</span>
              <Icon name="arrow_forward" className="text-xs" />
            </Link>
          </div>

          {/* Micro KPI Ribbon */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-center">
            <div className="flex flex-col items-center">
              <span className="text-white/60 text-[10px] sm:text-xs">Recovered</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white mt-0.5">
                {formatWeight(impact?.waste_recovered_kg || 104)}
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-white/15">
              <span className="text-white/60 text-[10px] sm:text-xs">CO₂ Diverted</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#abf854] mt-0.5">
                ~{Math.round((impact?.waste_recovered_kg || 104) * 1.8)} kg
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white/60 text-[10px] sm:text-xs">Impact Score</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white mt-0.5">
                {Math.round(points / 10)}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 Daily Streak & Continuity Tracker Widget */}
      <div className="rounded-3xl bg-surface border border-surface-container-high p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 ring-4 ring-amber-500/10">
            <Icon name="local_fire_department" className="text-2xl animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-primary">Daily Streak: {streakDays} Days</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                🔥 Active
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Submit a waste photo or schedule a pickup today to keep your streak alive!
            </p>
          </div>
        </div>

        {/* 7-Day Visual Continuity Bubble Strip */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
            const dayNum = idx + 1;
            const isCompleted = dayNum <= Math.min(streakDays, 7);
            const isToday = dayNum === Math.min(streakDays, 7);
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                    isToday
                      ? 'bg-amber-500 text-white ring-2 ring-amber-300 shadow-xs scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? <Icon name="check" className="text-xs" /> : day}
                </div>
                <span className="text-[9px] font-bold text-on-surface-variant uppercase">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Quick Action "App Launcher" Grid (4 Core App Actions) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs sm:text-sm font-extrabold text-primary uppercase tracking-wider">Quick Actions</h2>
          <span className="text-[11px] text-on-surface-variant font-medium">1-Tap Service</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Action 1: Report Waste */}
          <Link
            to="/app/report"
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-surface border border-surface-container-high hover:border-[#abf854] hover:shadow-md active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Icon name="add_a_photo" className="text-xl text-primary" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                +10 Pts
              </span>
            </div>
            <div>
              <span className="font-bold text-sm text-primary block group-hover:text-forest transition-colors">
                Report Waste
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                Instant Optical AI
              </span>
            </div>
          </Link>

          {/* Action 2: Schedule Pickup */}
          <Link
            to="/app/pickups"
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-surface border border-surface-container-high hover:border-sky-400 hover:shadow-md active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Icon name="schedule" className="text-xl" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-extrabold border border-sky-200">
                Doorstep
              </span>
            </div>
            <div>
              <span className="font-bold text-sm text-primary block group-hover:text-sky-900 transition-colors">
                Schedule Pickup
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                Free collector visit
              </span>
            </div>
          </Link>

          {/* Action 3: Eco Map & Bins */}
          <Link
            to="/app/map"
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-surface border border-surface-container-high hover:border-emerald-400 hover:shadow-md active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Icon name="map" className="text-xl" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                Live
              </span>
            </div>
            <div>
              <span className="font-bold text-sm text-primary block group-hover:text-emerald-900 transition-colors">
                Eco Map & Bins
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                Nearby drop-offs
              </span>
            </div>
          </Link>

          {/* Action 4: My Waste & Journey */}
          <Link
            to="/app/waste"
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-surface border border-surface-container-high hover:border-purple-400 hover:shadow-md active:scale-95 transition-all shadow-2xs cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                <Icon name="delete_sweep" className="text-xl" />
              </div>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-extrabold border border-purple-200">
                History
              </span>
            </div>
            <div>
              <span className="font-bold text-sm text-primary block group-hover:text-purple-900 transition-colors">
                My Waste
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5 block">
                Track passports
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Active / Current Pickup Live Card */}
      {recentPickup ? (
        <Card className="p-4 sm:p-5 border border-surface-container-high bg-surface-container-lowest rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
              <h2 className="text-xs sm:text-sm font-extrabold text-primary uppercase tracking-wider">
                Live Pickup Status
              </h2>
            </div>
            <Link
              to={`/app/pickups/${recentPickup.id}`}
              className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
            >
              <span>Track Details</span>
              <Icon name="chevron_right" className="text-xs" />
            </Link>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#00180b] text-[#abf854] flex items-center justify-center shrink-0 shadow-xs">
              <Icon name="local_shipping" className="text-2xl" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-mono text-xs sm:text-sm font-extrabold text-primary">
                  {recentPickup.pickup_id}
                </span>
                <StatusBadge status={recentPickup.status} pending={recentPickup.status === 'EN_ROUTE'} />
              </div>

              <p className="text-xs sm:text-sm text-on-surface-variant truncate font-medium">
                {recentPickup.waste_type} · {recentPickup.address}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mt-2 font-mono">
                <span className="flex items-center gap-1">
                  <Icon name="calendar_today" className="text-xs text-secondary" />
                  {formatDate(recentPickup.pickup_date)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Icon name="schedule" className="text-xs text-secondary" />
                  {recentPickup.time_slot}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 sm:p-5 border border-dashed border-surface-container-highest bg-surface-container-lowest rounded-2xl text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary-container/40 text-primary flex items-center justify-center">
            <Icon name="local_shipping" className="text-2xl" />
          </div>
          <div>
            <p className="font-bold text-sm text-primary">No Active Pickups Scheduled</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Book a free doorstep collection anytime. Our verified collectors handle segregated pickup.
            </p>
          </div>
          <Link
            to="/app/pickups"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary-container text-primary font-bold text-xs hover:bg-[#bcfd6b] active:scale-95 transition-all shadow-xs"
          >
            <Icon name="add" className="text-xs" />
            <span>Schedule Doorstep Pickup</span>
          </Link>
        </Card>
      )}

      {/* 5. Interactive Simulation Banner (Showcase Feature) */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-[#0a3a2a] to-[#00180b] text-white border border-[#abf854]/20 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 text-[#abf854] shrink-0">
            <Icon name="view_in_ar" className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm tracking-wide">
              Smart MRF Simulation Twin
            </h3>
            <p className="text-[11px] text-white/70 mt-0.5">
              Experience the 9-station plant sorting your discarded waste in real-time.
            </p>
          </div>
        </div>
        <Link
          to="/simulation"
          className="shrink-0 px-3.5 py-2 rounded-xl bg-secondary-container text-primary font-extrabold text-xs hover:bg-[#bcfd6b] active:scale-95 transition-all"
        >
          Launch Twin
        </Link>
      </div>
    </div>
  );
}
