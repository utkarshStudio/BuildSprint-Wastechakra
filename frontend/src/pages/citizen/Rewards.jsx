import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dataProvider } from '../../services/dataProvider';
import { Card, Button, Modal, ProgressBar, Skeleton, ErrorState, EmptyState, formatDate } from '../../components/ui';
import { Icon } from '../../components/AppIcons';

export default function Rewards() {
  const { user } = useAuth();
  const [impact, setImpact] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [history, setHistory] = useState({ transactions: [], redemptions: [] });

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'vouchers' | 'ledger' | 'leaderboard'
  const [leaderboardType, setLeaderboardType] = useState('individual'); // 'individual' | 'neighborhood'
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redemption state
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState(null);
  const [activeVoucher, setActiveVoucher] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Local live points tracking
  const [livePoints, setLivePoints] = useState(null);
  const [liveStreak, setLiveStreak] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rewardSummary, achievementsData, leaderboardData, historyData, impactData] = await Promise.all([
        dataProvider.getRewardSummary(),
        dataProvider.getAchievements(),
        dataProvider.getLeaderboard(),
        dataProvider.getRewardHistory(),
        dataProvider.getImpact(),
      ]);

      const cat = rewardSummary?.catalog || [];
      setRewards(cat);
      setAchievements(achievementsData || []);
      setLeaderboard(leaderboardData || null);
      setHistory(historyData || { transactions: [], redemptions: [] });
      setImpact(impactData || null);

      const initPts = rewardSummary?.user?.chakra_points ?? impactData?.chakra_points ?? user?.profile?.chakra_points ?? 0;
      const initStreak = rewardSummary?.user?.streak_days ?? impactData?.streak_days ?? user?.profile?.streak_days ?? 1;
      setLivePoints(initPts);
      setLiveStreak(initStreak);
    } catch (err) {
      setError(err.message || 'Failed to load rewards center.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const points = livePoints ?? (user?.profile?.chakra_points || impact?.chakra_points || 0);
  const streakDays = liveStreak ?? (impact?.streak_days || user?.profile?.streak_days || 1);

  // Streak milestone calculation
  const nextMilestone = streakDays < 3 ? { days: 3, bonus: 25 } :
    streakDays < 7 ? { days: 7, bonus: 50 } :
    streakDays < 14 ? { days: 14, bonus: 100 } :
    streakDays < 30 ? { days: 30, bonus: 250 } :
    { days: streakDays + 10, bonus: 300 };

  const milestoneProgress = Math.min(100, Math.round((streakDays / nextMilestone.days) * 100));

  // Next reward goal
  const nextReward = rewards.find((r) => r.cost > points);

  // Categories
  const categories = ['ALL', 'VOUCHER', 'MERCHANDISE', 'DONATION', 'EXPERIENCE'];
  const filteredRewards = categoryFilter === 'ALL'
    ? rewards
    : rewards.filter((r) => r.category === categoryFilter);

  // Handle redemption
  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setRedeeming(true);
    setRedeemError(null);
    try {
      const res = await dataProvider.redeemReward(selectedReward.id);
      const remaining = res.remaining_points !== undefined ? res.remaining_points : (points - selectedReward.cost);
      setLivePoints(remaining);

      // Add to local redemptions & transactions
      const newVoucher = {
        id: res.redemption?.id || 'v-' + Date.now(),
        reward: selectedReward,
        voucher_code: res.voucher_code,
        points_spent: selectedReward.cost,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        expires_at: res.expires_at || new Date(Date.now() + 90 * 86400000).toISOString(),
      };

      setHistory((prev) => ({
        redemptions: [newVoucher, ...(prev.redemptions || [])],
        transactions: [
          {
            id: 't-' + Date.now(),
            points: -selectedReward.cost,
            balance_after: remaining,
            transaction_type: 'REDEEMED',
            activity_type: 'REWARD_REDEMPTION',
            description: `Redeemed: ${selectedReward.title}`,
            created_at: new Date().toISOString(),
          },
          ...(prev.transactions || []),
        ],
      }));

      setSelectedReward(null);
      setActiveVoucher(newVoucher);
    } catch (err) {
      setRedeemError(err.message || 'Redemption failed. Please check your points balance.');
    } finally {
      setRedeeming(false);
    }
  };

  const copyVoucherCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
        <Skeleton className="h-52 w-full rounded-3xl" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const leaderData = leaderboardType === 'individual' ? leaderboard?.individuals || [] : leaderboard?.neighborhoods || [];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-10">
      {/* 1. Gamified Impact Wallet & Streak Master Banner */}
      <div className="relative rounded-3xl bg-linear-to-br from-[#00180b] via-[#052b19] to-[#00180b] p-6 sm:p-8 text-white border border-[#abf854]/30 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(#abf854_1px,transparent_1px)] bg-size-[18px_18px] opacity-15 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#abf854]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Points Balance Column */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#abf854] text-[#00180b] flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(171,248,84,0.3)] ring-4 ring-white/10">
              <Icon name="stars" className="text-3xl sm:text-4xl animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold text-[#abf854] uppercase tracking-wider">
                  Chakra Points Wallet
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono text-[10px] font-bold">
                  Live Balance
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {points.toLocaleString()}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#abf854] uppercase tracking-wider">
                  PTS
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Earned via photo waste reports, pickups & optical AI scans
              </p>
            </div>
          </div>

          {/* Streak Milestone Pill & Next Reward Bar */}
          <div className="flex flex-col gap-3 min-w-[280px] bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Icon name="local_fire_department" className="text-xl animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] text-white/60 font-bold uppercase block">Daily Eco-Streak</span>
                  <span className="text-base font-extrabold font-mono text-white">{streakDays} Days Active</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#abf854] font-bold block">Next Milestone</span>
                <span className="text-xs font-mono font-bold text-white/90">{nextMilestone.days}d (+{nextMilestone.bonus} pts)</span>
              </div>
            </div>

            {/* Progress to next milestone */}
            <div>
              <div className="flex justify-between text-[11px] text-white/60 mb-1">
                <span>Continuity: {streakDays}/{nextMilestone.days} days</span>
                <span>{milestoneProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-[#abf854] rounded-full transition-all duration-700"
                  style={{ width: `${milestoneProgress}%` }}
                />
              </div>
            </div>

            {nextReward && (
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className="text-white/70 truncate mr-2">Next reward: <strong>{nextReward.title}</strong></span>
                <span className="font-mono text-[#abf854] shrink-0">{points} / {nextReward.cost}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-high pb-2">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <Icon name="card_giftcard" className="text-base" />
            <span>Marketplace</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{rewards.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'vouchers'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <Icon name="confirmation_number" className="text-base" />
            <span>My Vouchers</span>
            {(history.redemptions || []).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#abf854] text-[#00180b] text-[10px] font-mono font-extrabold">
                {history.redemptions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <Icon name="history" className="text-base" />
            <span>Points Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface hover:bg-surface-container text-on-surface-variant'
            }`}
          >
            <Icon name="emoji_events" className="text-base" />
            <span>Leaderboard</span>
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all ${
                  categoryFilter === cat
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold">
              Available Green Rewards
            </h2>
            <span className="text-xs text-on-surface-variant">
              {filteredRewards.length} items redeemable
            </span>
          </div>

          {filteredRewards.length === 0 ? (
            <EmptyState
              title="No rewards in this category"
              message="Select another category filter or check back soon."
              icon="card_giftcard"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => {
                const canAfford = points >= reward.cost;
                const isOutOfStock = reward.stock === 0;

                return (
                  <Card
                    key={reward.id}
                    className="flex flex-col justify-between p-5 border border-surface-container-high hover:border-[#abf854] hover:shadow-lg transition-all rounded-3xl group bg-surface relative overflow-hidden"
                  >
                    <div>
                      {/* Card Header & Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                            canAfford
                              ? 'bg-secondary-container text-primary shadow-sm'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          <Icon name={reward.icon || 'card_giftcard'} className="text-2xl" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-surface-container-low text-on-surface-variant border border-surface-container-high">
                          {reward.category}
                        </span>
                      </div>

                      <h3 className="font-title-md text-base sm:text-lg text-primary font-bold mb-1">
                        {reward.title}
                      </h3>
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                        {reward.description}
                      </p>

                      {reward.partner_name && (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold mb-4">
                          <Icon name="verified" className="text-xs text-emerald-600" />
                          <span>Partner: {reward.partner_name}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-surface-container-high flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Cost</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-mono text-lg font-extrabold text-primary">
                            {reward.cost.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-bold text-primary">PTS</span>
                        </div>
                      </div>

                      <Button
                        variant={canAfford ? 'primary' : 'outline'}
                        size="sm"
                        disabled={!canAfford || isOutOfStock}
                        onClick={() => setSelectedReward(reward)}
                        className={`rounded-xl px-4 py-2 text-xs font-extrabold cursor-pointer ${
                          canAfford ? 'shadow-sm hover:scale-105' : 'opacity-60 cursor-not-allowed'
                        }`}
                      >
                        {isOutOfStock
                          ? 'Out of Stock'
                          : canAfford
                          ? 'Redeem'
                          : `Need ${reward.cost - points} pts`}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: MY VOUCHERS */}
      {activeTab === 'vouchers' && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold">
                My Redeemed Vouchers
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Present these codes at partner stores or online checkouts
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-secondary-container px-2.5 py-1 rounded-full text-primary">
              {(history.redemptions || []).length} Active
            </span>
          </div>

          {(!history.redemptions || history.redemptions.length === 0) ? (
            <EmptyState
              title="No vouchers redeemed yet"
              message="Spend your Chakra Points in the Marketplace to unlock eco-coupons and merchandise."
              icon="confirmation_number"
              action={
                <Button variant="primary" size="sm" onClick={() => setActiveTab('catalog')}>
                  Browse Rewards Catalog
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.redemptions.map((red) => (
                <div
                  key={red.id}
                  className="rounded-3xl border border-dashed border-emerald-300 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xl shrink-0">
                        <Icon name={red.reward?.icon || 'card_giftcard'} className="text-2xl" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-primary">{red.reward?.title || 'Eco Reward Voucher'}</h4>
                        <span className="text-[11px] text-on-surface-variant block">
                          Redeemed on {formatDate(red.created_at)} • Spent {red.points_spent} pts
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                      {red.status}
                    </span>
                  </div>

                  {/* Voucher Code Box */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-surface-container-high">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant block">
                        Voucher Code
                      </span>
                      <span className="font-mono text-base sm:text-lg font-extrabold text-primary tracking-wider">
                        {red.voucher_code}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyVoucherCode(red.voucher_code)}
                      className="rounded-xl px-3 py-1.5 text-xs font-extrabold gap-1.5"
                    >
                      <Icon name={copiedCode ? 'check' : 'content_copy'} className="text-sm" />
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-black/5">
                    <span>Valid until: <strong>{formatDate(red.expires_at)}</strong></span>
                    <span className="text-emerald-800 font-bold">{red.reward?.partner_name || 'Verified Partner'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: POINTS LEDGER */}
      {activeTab === 'ledger' && (
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold">
                Chakra Points Activity Ledger
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Transparent history of all earned eco-credits and redemptions
              </p>
            </div>
          </div>

          {(!history.transactions || history.transactions.length === 0) ? (
            <EmptyState
              title="No transactions recorded yet"
              message="Upload photos or report waste to earn your first points."
              icon="history"
            />
          ) : (
            <Card className="p-0 overflow-hidden rounded-3xl border border-surface-container-high">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] tracking-wider border-b border-surface-container-high">
                    <tr>
                      <th className="px-5 py-3 font-bold">Activity</th>
                      <th className="px-5 py-3 font-bold">Type</th>
                      <th className="px-5 py-3 font-bold">Points</th>
                      <th className="px-5 py-3 font-bold">Balance After</th>
                      <th className="px-5 py-3 font-bold text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {history.transactions.map((tx) => {
                      const isEarned = tx.points > 0;
                      return (
                        <tr key={tx.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-primary">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${isEarned ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                <Icon name={isEarned ? 'stars' : 'card_giftcard'} className="text-sm" />
                              </div>
                              <span>{tx.description || tx.activity_type}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-on-surface-variant text-xs">
                            {tx.activity_type}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-extrabold text-sm">
                            <span className={isEarned ? 'text-emerald-700' : 'text-rose-700'}>
                              {isEarned ? `+${tx.points}` : tx.points} PTS
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-on-surface-variant">
                            {tx.balance_after ? tx.balance_after.toLocaleString() : '—'}
                          </td>
                          <td className="px-5 py-3.5 text-on-surface-variant text-right text-xs">
                            {formatDate(tx.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB: LEADERBOARDS & ACHIEVEMENTS */}
      {activeTab === 'leaderboard' && (
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div>
            <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold mb-3">
              Eco Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`bg-surface border border-surface-container-high rounded-3xl p-4 flex flex-col gap-2 transition-all ${
                    a.unlocked ? 'border-emerald-300 shadow-xs' : 'opacity-60 grayscale'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        a.unlocked
                          ? 'bg-secondary-container text-primary shadow-xs'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <Icon name={a.icon || 'military_tech'} className="text-xl" />
                    </div>
                    {a.unlocked && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Unlocked ✓
                      </span>
                    )}
                  </div>
                  <h3 className="font-title-md text-sm text-primary font-bold">{a.name}</h3>
                  <p className="text-xs text-on-surface-variant">{a.desc}</p>
                  <div className="mt-1">
                    <ProgressBar
                      value={a.progress || 0}
                      color={a.unlocked ? 'bg-secondary' : 'bg-surface-container-high'}
                    />
                    <span className="text-[10px] text-on-surface-variant mt-1 block">
                      {a.progressValue || 0} / {a.progressTarget || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline-md text-xl sm:text-2xl text-primary font-bold">
                Community Leaderboards
              </h2>
              <div className="flex gap-1.5 p-1 bg-surface-container-high rounded-full">
                {['individual', 'neighborhood'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setLeaderboardType(t)}
                    className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize transition-all cursor-pointer ${
                      leaderboardType === t
                        ? 'bg-white text-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <Card className="p-0 overflow-hidden rounded-3xl border border-surface-container-high">
              <div className="flex flex-col divide-y divide-surface-container-high">
                {leaderData.map((entry) => (
                  <div
                    key={entry.name}
                    className={`flex items-center gap-3 p-4 transition-colors ${
                      entry.name.toLowerCase() === (user?.first_name || '').toLowerCase() || entry.rank <= 3
                        ? 'bg-secondary-container/15'
                        : 'hover:bg-surface-container-low/50'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        entry.rank === 1
                          ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-300'
                          : entry.rank === 2
                          ? 'bg-slate-200 text-slate-800 ring-2 ring-slate-300'
                          : entry.rank === 3
                          ? 'bg-amber-700/20 text-amber-900 ring-2 ring-amber-700/30'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <span className="flex-1 font-bold text-sm text-primary">{entry.name}</span>
                    <span className="font-mono font-extrabold text-primary text-sm">
                      {entry.points.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 4. MODAL: CONFIRM REDEMPTION */}
      <Modal
        open={!!selectedReward}
        onClose={() => { setSelectedReward(null); setRedeemError(null); }}
        title="Confirm Reward Redemption"
      >
        {selectedReward && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-container-high">
              <div className="w-14 h-14 rounded-2xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <Icon name={selectedReward.icon || 'card_giftcard'} className="text-3xl" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-primary">{selectedReward.title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">{selectedReward.description}</p>
                {selectedReward.partner_name && (
                  <span className="text-[11px] text-emerald-800 font-bold block mt-1">
                    Partner: {selectedReward.partner_name}
                  </span>
                )}
              </div>
            </div>

            {/* Point Balance Breakdown */}
            <div className="rounded-2xl bg-surface p-4 border border-surface-container-high flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Current Balance</span>
                <span className="font-mono font-bold text-primary">{points.toLocaleString()} PTS</span>
              </div>
              <div className="flex justify-between text-rose-700 font-bold">
                <span>Reward Cost</span>
                <span className="font-mono">-{selectedReward.cost.toLocaleString()} PTS</span>
              </div>
              <div className="pt-2 border-t border-surface-container-high flex justify-between font-extrabold text-sm text-primary">
                <span>Remaining Balance</span>
                <span className="font-mono text-[#0a3a2a]">{(points - selectedReward.cost).toLocaleString()} PTS</span>
              </div>
            </div>

            {redeemError && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs font-bold">
                {redeemError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setSelectedReward(null)}
                disabled={redeeming}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 rounded-xl"
                loading={redeeming}
                onClick={handleConfirmRedeem}
              >
                Confirm & Redeem
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* 5. MODAL: REDEEMED VOUCHER SUCCESS */}
      <Modal
        open={!!activeVoucher}
        onClose={() => setActiveVoucher(null)}
        title="🎉 Voucher Generated!"
      >
        {activeVoucher && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-3xl shadow-inner">
              <Icon name="check_circle" className="text-4xl text-emerald-600" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-primary mb-1">
                {activeVoucher.reward?.title || 'Reward Unlocked!'}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Your digital eco-voucher code is ready. Use it during checkout with our partner.
              </p>
            </div>

            {/* Unique Voucher Code Card */}
            <div className="w-full p-4 rounded-2xl bg-linear-to-br from-[#00180b] to-[#052b19] text-white border border-[#abf854]/40 flex flex-col items-center gap-3 shadow-xl">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#abf854]">
                Digital Voucher Code
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-widest">
                {activeVoucher.voucher_code}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copyVoucherCode(activeVoucher.voucher_code)}
                className="rounded-xl px-4 py-2 font-extrabold text-xs gap-1.5 shadow-md"
              >
                <Icon name={copiedCode ? 'check' : 'content_copy'} className="text-sm" />
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Voucher Code'}</span>
              </Button>
            </div>

            <div className="w-full text-left bg-surface rounded-2xl p-4 border border-surface-container-high text-xs text-on-surface-variant flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span>Expires on:</span>
                <strong className="text-primary">{formatDate(activeVoucher.expires_at)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Points Spent:</span>
                <strong className="text-primary">{activeVoucher.points_spent} PTS</strong>
              </div>
              <p className="pt-2 border-t border-black/5 text-[11px]">
                Valid at partner outlets and online stores. Keep your voucher code safe; you can view it anytime in the <strong>My Vouchers</strong> tab.
              </p>
            </div>

            <Button
              variant="primary"
              className="w-full rounded-xl py-3"
              onClick={() => setActiveVoucher(null)}
            >
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
