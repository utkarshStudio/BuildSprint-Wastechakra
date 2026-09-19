import { api } from './api';
import { demo } from './demoData';

const USE_DEMO = import.meta.env.VITE_DEMO_MODE === 'true' || import.meta.env.VITE_DEMO_MODE === '1';

async function withFallback(apiCall, demoValue) {
  if (USE_DEMO) return demoValue;
  try {
    const data = await apiCall();
    return data.results !== undefined ? data.results : data;
  } catch {
    return demoValue || [];
  }
}

export const dataProvider = {
  async getPickups(params = {}) {
    return withFallback(() => api.getPickups(params), demo.pickups);
  },
  async getPickup(id) {
    return withFallback(() => api.getPickup(id), demo.pickups.find((p) => p.id === id) || demo.pickups.find((p) => p.pickup_id === id) || demo.pickups[0]);
  },
  async getWasteReports(params = {}) {
    return withFallback(() => api.getWasteReports(params), demo.reports);
  },
  async getPassport(id) {
    return withFallback(() => api.getPassport(id), { ...demo.passport, id: id || demo.passport.id });
  },
  async getImpact() {
    return withFallback(() => api.getImpact(), demo.impact);
  },
  async getEvents(params = {}) {
    return withFallback(async () => {
      const res = await api.getCommunityEvents(params);
      return res.results || res;
    }, demo.events);
  },
  async joinEvent(eventId, data = {}) {
    try {
      const res = await api.joinCommunityEvent(eventId, data);
      try {
        const stored = JSON.parse(localStorage.getItem('wc_joined_events') || '{}');
        stored[eventId] = true;
        localStorage.setItem('wc_joined_events', JSON.stringify(stored));
      } catch {}
      return res;
    } catch {
      try {
        const stored = JSON.parse(localStorage.getItem('wc_joined_events') || '{}');
        stored[eventId] = true;
        localStorage.setItem('wc_joined_events', JSON.stringify(stored));
      } catch {}
      return {
        success: true,
        message: 'Successfully registered for event!',
        event_id: eventId,
        already_joined: false,
        reward_info: {
          points_earned: 50,
          current_points: (demo.impact.chakra_points || 1280) + 50,
          streak_days: (demo.impact.streak_days || 7) + 1,
        },
      };
    }
  },
  getJoinedEvents() {
    try {
      return JSON.parse(localStorage.getItem('wc_joined_events') || '{}');
    } catch {
      return {};
    }
  },
  async getRewards() {
    return withFallback(async () => {
      const data = await api.getRewards();
      return data.catalog || data;
    }, demo.rewards);
  },
  async getRewardSummary() {
    return withFallback(() => api.getRewards(), {
      catalog: demo.rewards,
      user: { chakra_points: demo.impact.chakra_points, streak_days: demo.impact.streak_days },
    });
  },
  async getRewardHistory() {
    return withFallback(() => api.getRewardHistory(), { transactions: [], redemptions: [] });
  },
  async redeemReward(rewardId) {
    return api.redeemReward(rewardId);
  },
  async getLeaderboard() {
    return demo.leaderboard;
  },
  async getAchievements() {
    return demo.achievements;
  },
  async getNotifications() {
    return demo.notifications;
  },
};

export const labels = {
  wasteTypes: {
    MIXED: 'Mixed Waste', PLASTIC: 'Plastic', ORGANIC: 'Organic', PAPER: 'Paper',
    METAL: 'Metal', TEXTILE: 'Textile', E_WASTE: 'E-Waste', CONSTRUCTION: 'Construction Waste',
    BULK: 'Bulk Waste', HAZARDOUS: 'Hazardous Waste', RECYCLABLES: 'Recyclables', OTHER: 'Other',
  },
  status: {
    REQUESTED: 'Requested', CONFIRMED: 'Confirmed', ASSIGNED: 'Assigned', EN_ROUTE: 'En Route',
    ARRIVED: 'Arrived', COLLECTED: 'Collected', PROCESSING: 'Processing', COMPLETED: 'Completed',
    CANCELLED: 'Cancelled', REPORTED: 'Reported', PICKUP_SCHEDULED: 'Pickup Scheduled',
  },
};