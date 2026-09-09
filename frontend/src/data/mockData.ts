// Comprehensive professional mock data for Smart Farming 360 Ghana

export interface Officer {
  id: number;
  first_name: string;
  last_name: string;
  role: string;
  title: string;
  region: string;
  specialization: string;
  phone: string;
  email: string;
  profile_photo_url: string | null;
  bio: string;
  experience_years: number;
  verified: boolean;
  created_at: string;
}

export interface Post {
  id: number;
  author_id: number;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  replies_count: number;
  is_pinned: number;
  created_at: string;
  author_first_name: string;
  author_last_name: string;
  author_role: string;
  author_profile_photo_url: string | null;
  user_liked?: number;
}

export interface Reply {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  likes_count: number;
  created_at: string;
  author_first_name: string;
  author_last_name: string;
  author_role: string;
  user_liked?: number;
}

export const MOCK_OFFICERS: Officer[] = [
  {
    id: 101,
    first_name: 'Dr. Abena',
    last_name: 'Boateng',
    role: 'AgriculturalOfficer',
    title: 'Senior Agronomist & Crop Protection Specialist',
    region: 'Ashanti Region (Kumasi)',
    specialization: 'Vegetable Agronomy, Integrated Pest Management (IPM)',
    phone: '+233 24 412 3456',
    email: 'abena.boateng@mofa.gov.gh',
    profile_photo_url: null,
    bio: '14+ years experience with Ministry of Food & Agriculture (MoFA). Advising greenhouse and open-field tomato, pepper, and onion growers across Ashanti and Bono regions.',
    experience_years: 14,
    verified: true,
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 102,
    first_name: 'Yaw',
    last_name: 'Darko',
    role: 'AgriculturalOfficer',
    title: 'District Extension Officer',
    region: 'Eastern Region (Koforidua)',
    specialization: 'Soil Fertility, Drip Irrigation & Nursery Management',
    phone: '+233 20 876 5432',
    email: 'yaw.darko@mofa.gov.gh',
    profile_photo_url: null,
    bio: 'Specialist in low-cost micro-irrigation systems, composting, and dry-season vegetable production for smallholder farming cooperatives.',
    experience_years: 9,
    verified: true,
    created_at: '2024-02-10T09:30:00Z',
  },
  {
    id: 103,
    first_name: 'Hajia Amina',
    last_name: 'Salifu',
    role: 'AgriculturalOfficer',
    title: 'Horticulture & Post-Harvest Specialist',
    region: 'Northern Region (Tamale)',
    specialization: 'Grain Storage, Post-Harvest Loss Prevention, Legumes',
    phone: '+233 54 991 2233',
    email: 'amina.salifu@mofa.gov.gh',
    profile_photo_url: null,
    bio: 'Leading post-harvest loss reduction programs and hermetic storage bag adoption for maize, sorghum, and soybean producers in Northern Ghana.',
    experience_years: 12,
    verified: true,
    created_at: '2024-03-01T10:00:00Z',
  },
  {
    id: 104,
    first_name: 'Emmanuel',
    last_name: 'Osei',
    role: 'AgriculturalOfficer',
    title: 'Plant Health & Biosecurity Officer',
    region: 'Central Region (Cape Coast)',
    specialization: 'Citrus, Cocoa, Cassava Disease Control',
    phone: '+233 26 554 1122',
    email: 'emmanuel.osei@mofa.gov.gh',
    profile_photo_url: null,
    bio: 'Advising tree crop and root tuber farmers on viral and fungal disease containment, organic pesticides, and soil moisture conservation.',
    experience_years: 8,
    verified: true,
    created_at: '2024-04-12T11:15:00Z',
  },
  {
    id: 105,
    first_name: 'Grace',
    last_name: 'Afriyie',
    role: 'AgriculturalOfficer',
    title: 'Agri-Business & Market Linkages Advisor',
    region: 'Greater Accra Region (Accra)',
    specialization: 'Export Certification, Organic Standards, Farm Bookkeeping',
    phone: '+233 50 334 7788',
    email: 'grace.afriyie@mofa.gov.gh',
    profile_photo_url: null,
    bio: 'Connecting local peri-urban commercial farms with retail buyers, aggregators, and organic certification programs for Ghana GAP compliance.',
    experience_years: 11,
    verified: true,
    created_at: '2024-05-20T14:20:00Z',
  },
  {
    id: 106,
    first_name: 'Kwame',
    last_name: 'Asante',
    role: 'AgriculturalOfficer',
    title: 'Livestock & Veterinary Extension Officer',
    region: 'Volta Region (Ho)',
    specialization: 'Poultry, Ruminant Nutrition & Disease Prevention',
    phone: '+233 24 118 9900',
    email: 'kwame.asante@mofa.gov.gh',
    profile_photo_url: null,
    bio: 'Assisting commercial poultry farms and small ruminant herders with vaccination schedules, biosecurity, and feed formulation.',
    experience_years: 10,
    verified: true,
    created_at: '2024-06-05T08:45:00Z',
  },
];

export const MOCK_COMMUNITY_POSTS: Post[] = [
  {
    id: 1,
    author_id: 101,
    title: '🌾 Welcome to SmartFarm360 Ghana – Official Advisory & Knowledge Hub',
    content: `Welcome Ghanaian farmers, agribusinesses, and consumers!

This platform connects farmers directly with certified Agricultural Officers from the Ministry of Food and Agriculture (MoFA) across all 16 regions of Ghana.

Here you can:
• Ask questions on pest outbreaks, disease symptoms, or fertilizer rates.
• Check real-time weather forecasts and irrigation advisories.
• Follow live wholesale & retail market prices.
• Send direct messages to regional officers for 1-on-1 guidance.

Feel free to post your challenges, crop updates, and harvest announcements!`,
    category: 'General',
    likes_count: 42,
    replies_count: 8,
    is_pinned: 1,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    author_first_name: 'Dr. Abena',
    author_last_name: 'Boateng',
    author_role: 'AgriculturalOfficer',
    author_profile_photo_url: null,
    user_liked: 1,
  },
  {
    id: 2,
    author_id: 201,
    title: 'Best irrigation schedule for dry-season tomatoes in Ashanti?',
    content: `I have 1.5 acres of Roma tomatoes in Agogo, Ashanti Region. During this dry spell, I am irrigating via drip every 2 days early morning (6:00 AM - 7:30 AM). 

Should I increase watering frequency to daily when flowering peaks, or maintain 2 days to avoid root rot in clay-loam soil? Any mulch recommendations?`,
    category: 'Irrigation',
    likes_count: 18,
    replies_count: 5,
    is_pinned: 0,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    author_first_name: 'Kwame',
    author_last_name: 'Mensah',
    author_role: 'Farmer',
    author_profile_photo_url: null,
    user_liked: 0,
  },
  {
    id: 3,
    author_id: 101,
    title: '⚠️ Pest Alert: Fall Armyworm detected in Northern and Savannah Regions',
    content: `Officers have confirmed early instar Fall Armyworm (Spodoptera frugiperda) larvae on late-planted maize in West Gonja and Savelugu districts.

Key action items:
1. Inspect the whorls of maize plants early in the morning.
2. Look for window-pane leaf damage and sawdust-like frass.
3. For biological control: Apply Neem seed kernel extract (NSKE 5%) or Bacillus thuringiensis (Bt).
4. If chemical control is necessary, use approved systemic insecticides like Emamectin benzoate or Chlorantraniliprole.

Contact your local extension office immediately if infestation exceeds 10% of plants.`,
    category: 'Pest Control',
    likes_count: 35,
    replies_count: 7,
    is_pinned: 1,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    author_first_name: 'Dr. Abena',
    author_last_name: 'Boateng',
    author_role: 'AgriculturalOfficer',
    author_profile_photo_url: null,
    user_liked: 1,
  },
  {
    id: 4,
    author_id: 102,
    title: 'Weekly Market Price Digest: Techiman, Kumasi & Agbogbloshie Markets',
    content: `Summary of commodity price trends across major Ghana trading hubs this week:

• Fresh Tomatoes (Navrongo/Local, 50kg crate): GH₵ 680 - GH₵ 750 (Stable)
• White Maize (100kg bag, Techiman): GH₵ 380 - GH₵ 410 (Slight rise)
• Yellow Onions (Bawku, 100kg bag): GH₵ 820 - GH₵ 890 (High demand)
• Local Brown Rice (50kg bag): GH₵ 480 - GH₵ 520
• Plantain (Apantu, large bunch): GH₵ 45 - GH₵ 60

Farmers planning to harvest next week are advised to coordinate transport early to capture weekend wholesale premiums.`,
    category: 'Market Prices',
    likes_count: 29,
    replies_count: 4,
    is_pinned: 0,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    author_first_name: 'Yaw',
    author_last_name: 'Darko',
    author_role: 'AgriculturalOfficer',
    author_profile_photo_url: null,
    user_liked: 0,
  },
  {
    id: 5,
    author_id: 202,
    title: 'How I reduced damping-off disease in my sweet pepper nursery by 90%',
    content: `Last season I lost over 40% of my sweet pepper seedlings to damping-off fungi. This year I made three simple changes:

1. Solarized the nursery soil under clear plastic sheets for 3 weeks before seed sowing.
2. Switched to raised nursery beds (15cm above ground level) for rapid drainage.
3. Applied Trichoderma organic bio-fungicide during seed treatment.

Result: 95%+ germination and zero seedling loss! Hope this helps fellow vegetable farmers.`,
    category: 'Seeds & Planting',
    likes_count: 24,
    replies_count: 3,
    is_pinned: 0,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    author_first_name: 'Ama',
    author_last_name: 'Asante',
    author_role: 'Farmer',
    author_profile_photo_url: null,
    user_liked: 0,
  },
  {
    id: 6,
    author_id: 104,
    title: 'Effective Soil Acidity Correction with Agricultural Lime in Western Region',
    content: `Many farms in Western and Western North regions face low soil pH (pH 4.2 - 5.0) due to heavy leaching rainfall, which locks up phosphorus and magnesium.

Recommendations:
• Test soil pH before each major planting season.
• Apply agricultural limestone (calcium carbonate) or dolomite lime at 1.5 - 2 tons per hectare 4 weeks prior to planting.
• Incorporate poultry manure to enhance microbial organic matter buffering.`,
    category: 'Soil Health',
    likes_count: 19,
    replies_count: 2,
    is_pinned: 0,
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    author_first_name: 'Emmanuel',
    author_last_name: 'Osei',
    author_role: 'AgriculturalOfficer',
    author_profile_photo_url: null,
    user_liked: 0,
  },
];

export const MOCK_REPLIES: Record<number, Reply[]> = {
  1: [
    {
      id: 1001,
      post_id: 1,
      author_id: 201,
      content: 'This is a tremendous initiative! Having direct access to officers like Dr. Abena will save us thousands in crop losses.',
      likes_count: 8,
      created_at: new Date(Date.now() - 3600000 * 40).toISOString(),
      author_first_name: 'Kwame',
      author_last_name: 'Mensah',
      author_role: 'Farmer',
      user_liked: 1,
    },
    {
      id: 1002,
      post_id: 1,
      author_id: 103,
      content: 'Northern region farmers, you can reach me directly here or on WhatsApp for grain preservation advice. Welcome everyone!',
      likes_count: 12,
      created_at: new Date(Date.now() - 3600000 * 35).toISOString(),
      author_first_name: 'Hajia Amina',
      author_last_name: 'Salifu',
      author_role: 'AgriculturalOfficer',
      user_liked: 0,
    },
  ],
  2: [
    {
      id: 1003,
      post_id: 2,
      author_id: 101,
      content: 'Hello Kwame! For Roma tomatoes in clay-loam soil during flowering, stick to every 2 days but increase the duration slightly rather than watering daily. Rice straw or dry grass mulching (5cm thick) will conserve 35% more soil moisture and keep root zone cool.',
      likes_count: 11,
      created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
      author_first_name: 'Dr. Abena',
      author_last_name: 'Boateng',
      author_role: 'AgriculturalOfficer',
      user_liked: 1,
    },
    {
      id: 1004,
      post_id: 2,
      author_id: 201,
      content: 'Thank you so much Dr. Abena! I will apply rice straw mulch tomorrow morning.',
      likes_count: 3,
      created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
      author_first_name: 'Kwame',
      author_last_name: 'Mensah',
      author_role: 'Farmer',
      user_liked: 0,
    },
  ],
  3: [
    {
      id: 1005,
      post_id: 3,
      author_id: 203,
      content: 'Noticed holes on our late maize yesterday in Damongo. Will prepare neem seed spray immediately. Thank you for the timely warning!',
      likes_count: 5,
      created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
      author_first_name: 'Issah',
      author_last_name: 'Yakubu',
      author_role: 'Farmer',
      user_liked: 0,
    },
  ],
};

export const MOCK_IRRIGATION_SCHEDULES = [
  {
    id: 1,
    farmer_id: 201,
    field_name: 'Main Tomato Block A',
    crop_type: 'Tomatoes (Roma VF)',
    area_hectares: 0.8,
    irrigation_method: 'Drip',
    frequency_days: 2,
    last_watered_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    next_watering_at: new Date(Date.now() + 3600000 * 12).toISOString(),
    notes: 'Water early morning (6:00 AM). Check emitter flow and filter pressure before starting.',
    is_active: 1,
  },
  {
    id: 2,
    farmer_id: 201,
    field_name: 'Sweet Pepper Nursery',
    crop_type: 'Bell Pepper (California Wonder)',
    area_hectares: 0.2,
    irrigation_method: 'Sprinkler',
    frequency_days: 1,
    last_watered_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    next_watering_at: new Date(Date.now() + 3600000 * 4).toISOString(),
    notes: 'Delicate seedlings. Use fine mist sprinkler for 20 mins to prevent soil compaction.',
    is_active: 1,
  },
  {
    id: 3,
    farmer_id: 201,
    field_name: 'Onion & Shallot Field',
    crop_type: 'Bawku Red Onions',
    area_hectares: 0.5,
    irrigation_method: 'Drip',
    frequency_days: 3,
    last_watered_at: new Date(Date.now() - 3600000 * 50).toISOString(),
    next_watering_at: new Date(Date.now() + 3600000 * 22).toISOString(),
    notes: 'Reduce water application rate 2 weeks prior to bulb harvest.',
    is_active: 1,
  },
];

export const MOCK_IRRIGATION_LOGS = [
  {
    id: 1,
    field_name: 'Main Tomato Block A',
    crop_type: 'Tomatoes (Roma VF)',
    watered_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    duration_minutes: 60,
    amount_liters: 1200,
    method: 'Drip',
    rainfall_mm: 0,
    notes: 'Completed 60min cycle. Soil moisture verified at 15cm depth.',
  },
  {
    id: 2,
    field_name: 'Sweet Pepper Nursery',
    crop_type: 'Bell Pepper',
    watered_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    duration_minutes: 25,
    amount_liters: 300,
    method: 'Sprinkler',
    rainfall_mm: 0,
    notes: 'Morning misting cycle completed. Seedlings looking crisp.',
  },
  {
    id: 3,
    field_name: 'Onion & Shallot Field',
    crop_type: 'Bawku Red Onions',
    watered_at: new Date(Date.now() - 3600000 * 74).toISOString(),
    duration_minutes: 45,
    amount_liters: 900,
    method: 'Drip',
    rainfall_mm: 2,
    notes: 'Light shower recorded. Top-up irrigation applied.',
  },
];

export const MOCK_CONVERSATIONS = [
  {
    partner_id: 101,
    partner_first_name: 'Dr. Abena',
    partner_last_name: 'Boateng',
    partner_role: 'AgriculturalOfficer',
    last_message: 'Your soil test results look great! You can proceed with the NPK 15-15-15 top dressing.',
    last_message_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    unread_count: 1,
  },
  {
    partner_id: 102,
    partner_first_name: 'Yaw',
    partner_last_name: 'Darko',
    partner_role: 'AgriculturalOfficer',
    last_message: 'I have shared the drip irrigation parts supplier in Kumasi. Check your email.',
    last_message_at: new Date(Date.now() - 3600000 * 22).toISOString(),
    unread_count: 0,
  },
];
