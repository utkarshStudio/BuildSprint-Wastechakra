const demoPickups = [
  {
    id: '5001', pickup_id: 'WC-2026-000284', pickup_type: 'HOME', waste_type: 'MIXED',
    estimated_quantity: '20-50', pickup_date: '2026-09-09', time_slot: 'Morning (9-12)',
    address: '123 Green Street, Eco District', status: 'EN_ROUTE', actual_weight_kg: null,
    user_email: 'citizen@wastechakra.com', collector_email: 'collector@wastechakra.com',
    latitude: 12.9716, longitude: 77.5946, created_at: '2026-09-09T06:00:00Z',
    waste_report: null, instructions: 'Please ring the bell and leave proof below.',
  },
  {
    id: '5002', pickup_id: 'WC-2026-000283', pickup_type: 'HOME', waste_type: 'RECYCLABLES',
    estimated_quantity: '5-20', pickup_date: '2026-09-07', time_slot: 'Afternoon (12-3)',
    address: '456 Green Street, Eco District', status: 'COMPLETED', actual_weight_kg: 12.5,
    user_email: 'citizen@wastechakra.com', collector_email: 'collector@wastechakra.com',
    latitude: 12.9720, longitude: 77.5960, created_at: '2026-09-07T06:00:00Z',
  },
  {
    id: '5003', pickup_id: 'WC-2026-000285', pickup_type: 'HOME', waste_type: 'ORGANIC',
    estimated_quantity: '5-20', pickup_date: '2026-09-10', time_slot: 'Evening (3-6)',
    address: '123 Green Street, Eco District', status: 'REQUESTED', actual_weight_kg: null,
    user_email: 'citizen@wastechakra.com', collector_email: null,
    latitude: 12.9716, longitude: 77.5946, created_at: '2026-09-09T08:00:00Z',
  },
  {
    id: '5004', pickup_id: 'WC-2026-000286', pickup_type: 'HOME', waste_type: 'E_WASTE',
    estimated_quantity: '<5', pickup_date: '2026-09-11', time_slot: 'Morning (9-12)',
    address: '789 Green Street, Eco District', status: 'ASSIGNED', actual_weight_kg: null,
    user_email: 'citizen@wastechakra.com', collector_email: 'collector@wastechakra.com',
    latitude: 12.9780, longitude: 77.6010, created_at: '2026-09-09T09:30:00Z',
  },
];

const demoReports = [
  {
    id: '6001', report_id: 'WC-1048', waste_type: 'MIXED', urgency: 'HIGH',
    estimated_quantity: '20-50', status: 'REPORTED', address: '123 Green Street, Eco District',
    latitude: 12.9716, longitude: 77.5946, description: 'Mixed household waste pile near entrance',
    user_email: 'citizen@wastechakra.com', created_at: '2026-09-09T05:00:00Z',
  },
  {
    id: '6002', report_id: 'WC-1049', waste_type: 'PLASTIC', urgency: 'NORMAL',
    estimated_quantity: '5-20', status: 'PICKUP_SCHEDULED', address: '456 Green Street, Eco District',
    latitude: 12.9720, longitude: 77.5960, description: 'Plastic bottles from community drive',
    user_email: 'citizen@wastechakra.com', created_at: '2026-09-08T05:00:00Z',
  },
  {
    id: '6003', report_id: 'WC-1050', waste_type: 'E_WASTE', urgency: 'URGENT',
    estimated_quantity: '50-100', status: 'PICKUP_SCHEDULED', address: 'Tech Park Building 4',
    latitude: 12.9750, longitude: 77.6000, description: 'Retired computers and batteries',
    user_email: 'business@wastechakra.com', created_at: '2026-09-09T07:00:00Z',
  },
];

const demoPassport = {
  id: '7001', passport_id: 'WP-2026-000001', origin: 'RESIDENTIAL',
  pickup: 'WC-2026-000283', input_weight_kg: 12.5, plastic_recovered_kg: 3.2,
  paper_recovered_kg: 2.1, organic_recovered_kg: 4.4, metal_recovered_kg: 0.8,
  rdf_produced_kg: 1.5, inert_kg: 0.3, residual_kg: 0.2, processing_status: 'COMPLETED',
  recovery_rate: 96,
  created_at: '2026-09-08T06:00:00Z', completed_at: '2026-09-08T06:00:00Z',
};

const demoImpact = {
  total_pickups: 4,
  total_weight_kg: 38.5,
  chakra_points: 1280,
  streak_days: 7,
  waste_submitted_kg: 127,
  waste_recovered_kg: 104,
  monthly: [
    { month: 'January', submitted: 18, recovered: 15 },
    { month: 'February', submitted: 22, recovered: 19 },
    { month: 'March', submitted: 15, recovered: 12 },
    { month: 'April', submitted: 28, recovered: 24 },
  ],
};

const demoEvents = [
  {
    id: '1',
    title: 'Purnia Riverbank Shoreline Cleanup',
    category: 'Cleanup',
    type: 'cleanup',
    location: 'Saura River Ghat, Purnia',
    date: 'Next Saturday · 7:00 AM - 10:00 AM',
    participants: 64,
    target_kg: 450,
    targetKg: 450,
    waste_recovered_kg: 120,
    description: 'Clearing plastic packaging and debris along the ghat. Safety gloves, bags, and tea provided.',
    reward_points: 50,
    status: 'OPEN',
  },
  {
    id: '2',
    title: 'Mega E-Waste & Battery Drop-off Drive',
    category: 'Collection',
    type: 'e-waste',
    location: 'City Center Market, Main Square',
    date: 'This Sunday · 9:00 AM - 4:00 PM',
    participants: 112,
    target_kg: 800,
    targetKg: 800,
    waste_recovered_kg: 340,
    description: 'Bring old chargers, dead laptops, televisions, and batteries. Instant scrap payout & e-waste cert.',
    reward_points: 50,
    status: 'OPEN',
  },
  {
    id: '3',
    title: 'Zero-Odor Home Composting Workshop',
    category: 'Workshops',
    type: 'workshops',
    location: 'Botanical Garden Community Hall',
    date: 'Sep 20, 2026 · 11:00 AM - 1:00 PM',
    participants: 48,
    target_kg: 120,
    targetKg: 120,
    waste_recovered_kg: 0,
    description: 'Hands-on training on converting kitchen food scraps into black-gold soil fertilizer in balconies.',
    reward_points: 30,
    status: 'OPEN',
  },
  {
    id: '4',
    title: 'Ward 14 Residential Plastic-Free Drive',
    category: 'Cleanup',
    type: 'cleanup',
    location: 'Green Valley Colony Park',
    date: 'Sep 27, 2026 · 8:00 AM - 11:00 AM',
    participants: 75,
    target_kg: 350,
    targetKg: 350,
    waste_recovered_kg: 90,
    description: 'Community door-to-door awareness walk and single-use plastic collection with school students.',
    reward_points: 50,
    status: 'OPEN',
  },
  {
    id: '5',
    title: 'Old Clothes & Textile Upcycling Drive',
    category: 'Collection',
    type: 'collection',
    location: 'Civic Center Auditorium',
    date: 'Oct 04, 2026 · 10:00 AM - 5:00 PM',
    participants: 89,
    target_kg: 620,
    targetKg: 620,
    waste_recovered_kg: 210,
    description: 'Donate unwearable worn-out clothes for industrial shredding into acoustic insulation & mattress felt.',
    reward_points: 50,
    status: 'OPEN',
  },
  {
    id: '6',
    title: 'School Green Champions Segregation Fair',
    category: 'Workshops',
    type: 'workshops',
    location: 'DAV Public School Campus',
    date: 'Oct 11, 2026 · 9:30 AM - 1:30 PM',
    participants: 140,
    target_kg: 200,
    targetKg: 200,
    waste_recovered_kg: 0,
    description: 'Fun interactive games teaching children how to sort wet, dry, and domestic hazardous waste.',
    reward_points: 40,
    status: 'OPEN',
  },
];

const demoRewards = [
  { id: '9001', title: '₹50 Eco Voucher', cost: 500, description: 'Redeem for a ₹50 voucher at partner stores', icon: 'ticket' },
  { id: '9002', title: 'Reusable Bottle', cost: 800, description: 'Premium stainless steel eco bottle', icon: 'water_bottle' },
  { id: '9003', title: 'Eco Kit', cost: 1200, description: 'Bamboo essentials kit: straws, brush, utensils', icon: 'yard' },
  { id: '9004', title: 'Community Champion Badge', cost: 2000, description: 'Exclusive badge for your profile', icon: 'military_tech' },
];

const demoLeaderboard = {
  individuals: [
    { name: 'Aarav', points: 2840, rank: 1 },
    { name: 'Priya', points: 2510, rank: 2 },
    { name: 'Rahul', points: 2210, rank: 3 },
    { name: 'Danish', points: 1280, rank: 4 },
    { name: 'Meera', points: 980, rank: 5 },
  ],
  neighborhoods: [
    { name: 'Green Valley Society', points: 18400, rank: 1 },
    { name: 'Lake View Apartments', points: 15600, rank: 2 },
    { name: 'Sunrise Residency', points: 12900, rank: 3 },
  ],
};

const demoAchievements = [
  { id: 'a1', name: 'First Recycler', desc: 'Submit your first recyclable pickup', icon: 'recycling', unlocked: true, progress: 100, progressTarget: 1, progressValue: 1 },
  { id: 'a2', name: 'Plastic Warrior', desc: 'Report 10 plastic waste reports', icon: 'delete', unlocked: true, progress: 100, progressTarget: 10, progressValue: 12 },
  { id: 'a3', name: 'Waste Reporter', desc: 'Submit 5 waste reports', icon: 'camera_alt', unlocked: true, progress: 100, progressTarget: 5, progressValue: 6 },
  { id: 'a4', name: '100 KG Recovered', desc: 'Recover 100 kg of waste', icon: 'scale', unlocked: true, progress: 100, progressTarget: 100, progressValue: 104 },
  { id: 'a5', name: 'Pickup Regular', desc: 'Complete 10 pickups', icon: 'local_shipping', unlocked: false, progress: 60, progressTarget: 10, progressValue: 6 },
  { id: 'a6', name: 'RDF Supporter', desc: 'Contribute 50 kg to RDF', icon: 'local_fire_department', unlocked: false, progress: 44, progressTarget: 50, progressValue: 22 },
  { id: 'a7', name: 'Community Champion', desc: 'Join 5 community events', icon: 'emoji_events', unlocked: false, progress: 20, progressTarget: 5, progressValue: 1 },
  { id: 'a8', name: 'Earth Guardian', desc: 'Recover 500 kg of waste', icon: 'public', unlocked: false, progress: 21, progressTarget: 500, progressValue: 104 },
];

const demoNotifications = [
  { id: 'n1', title: 'Pickup confirmed', message: 'Your pickup WC-2026-000285 has been confirmed for 10 Sep, evening slot.', time: '2h ago', read: false, icon: 'check_circle' },
  { id: 'n2', title: 'Collector is nearby', message: 'Ravi is on their way for pickup WC-2026-000284.', time: '30m ago', read: false, icon: 'local_shipping' },
  { id: 'n3', title: 'You earned 50 Chakra Points', message: 'Community cleanup participation reward.', time: '1d ago', read: true, icon: 'stars' },
  { id: 'n4', title: 'Processing complete', message: 'Your waste batch WP-2026-000001 finished processing. Passport ready.', time: '2d ago', read: true, icon: 'precision_manufacturing' },
];

export const demo = {
  pickups: demoPickups,
  reports: demoReports,
  passport: demoPassport,
  impact: demoImpact,
  events: demoEvents,
  rewards: demoRewards,
  leaderboard: demoLeaderboard,
  achievements: demoAchievements,
  notifications: demoNotifications,
};