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

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  status: string;
  farmer_id: number;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
}

export const MOCK_PRODUCTS: Product[] = [
  // Vegetables
  { id: 1, name: 'Fresh Tomatoes', description: 'Organic red vine tomatoes, perfect for salads and stews', category: 'Vegetables', price: 15.00, unit: 'kg', stock_quantity: 120, status: 'Active', farmer_id: 1, rating: 4.8, reviews_count: 24 },
  { id: 2, name: 'Garden Eggs', description: 'Crisp, locally grown garden eggs (eggplants) from Eastern Region', category: 'Vegetables', price: 12.00, unit: 'kg', stock_quantity: 85, status: 'Active', farmer_id: 1, rating: 4.7, reviews_count: 18 },
  { id: 3, name: 'Fresh Carrots', description: 'Sweet, crunchy orange carrots harvested fresh daily from Aburi highlands', category: 'Vegetables', price: 10.00, unit: 'kg', stock_quantity: 90, status: 'Active', farmer_id: 1, rating: 4.9, reviews_count: 31 },
  { id: 4, name: 'Fresh Onions', description: 'Pungent Bawku red onions, long shelf life and bursting with flavor', category: 'Vegetables', price: 8.00, unit: 'kg', stock_quantity: 150, status: 'Active', farmer_id: 2, rating: 4.6, reviews_count: 15 },
  { id: 5, name: 'Fresh Okra', description: 'Tender baby okra pods, ideal for Ghanaian soups and sauces', category: 'Vegetables', price: 14.00, unit: 'kg', stock_quantity: 65, status: 'Active', farmer_id: 2, rating: 4.5, reviews_count: 12 },

  // Fruits
  { id: 6, name: 'Ripe Bananas', description: 'Naturally sweet Cavendish bananas from the Ashanti green belt', category: 'Fruits', price: 10.00, unit: 'bunch', stock_quantity: 110, status: 'Active', farmer_id: 2, rating: 4.9, reviews_count: 42 },
  { id: 7, name: 'Fresh Pineapples', description: 'Sugar loaf pineapples from Nsawam, golden and bursting with juice', category: 'Fruits', price: 20.00, unit: 'piece', stock_quantity: 75, status: 'Active', farmer_id: 1, rating: 5.0, reviews_count: 38 },
  { id: 8, name: 'Watermelon', description: 'Juicy, deep-red sweet watermelons grown under Ada sunshine', category: 'Fruits', price: 25.00, unit: 'piece', stock_quantity: 45, status: 'Active', farmer_id: 1, rating: 4.8, reviews_count: 29 },
  { id: 9, name: 'Fresh Avocado', description: 'Rich, buttery Hass and local hybrid avocados packed with nutrients', category: 'Fruits', price: 18.00, unit: 'kg', stock_quantity: 50, status: 'Active', farmer_id: 1, rating: 4.7, reviews_count: 22 },
  { id: 10, name: 'Ripe Mangoes', description: 'Sweet Keitt mangoes handpicked at peak ripeness in Somanya', category: 'Fruits', price: 22.00, unit: 'kg', stock_quantity: 80, status: 'Active', farmer_id: 2, rating: 4.9, reviews_count: 35 },

  // Grains & Tubers
  { id: 11, name: 'Sweet Corn', description: 'Freshly harvested yellow sweet corn on the cob', category: 'Grains', price: 8.00, unit: 'piece', stock_quantity: 200, status: 'Active', farmer_id: 1, rating: 4.6, reviews_count: 19 },
  { id: 12, name: 'Premium Rice', description: 'Aromatic local Ghana jasmine rice, stone-free and parboiled', category: 'Grains', price: 35.00, unit: 'kg', stock_quantity: 160, status: 'Active', farmer_id: 1, rating: 4.9, reviews_count: 53 },
  { id: 13, name: 'Brown Beans', description: 'Clean brown cowpea beans, high in protein and cook tenderly', category: 'Grains', price: 28.00, unit: 'kg', stock_quantity: 100, status: 'Active', farmer_id: 2, rating: 4.7, reviews_count: 20 },
  { id: 14, name: 'Pearl Millets', description: 'Nutritious golden millet grains from Upper East, gluten-free', category: 'Grains', price: 30.00, unit: 'kg', stock_quantity: 80, status: 'Active', farmer_id: 2, rating: 4.8, reviews_count: 14 },
  { id: 15, name: 'Fresh Cassava', description: 'Starchy, firm cassava roots freshly uprooted for banku and fufu', category: 'Grains', price: 12.00, unit: 'kg', stock_quantity: 130, status: 'Active', farmer_id: 1, rating: 4.5, reviews_count: 17 },
  { id: 16, name: 'White Yam', description: 'Pona grade Ghanaian white yam, ideal for frying, boiling, or pounding', category: 'Grains', price: 20.00, unit: 'kg', stock_quantity: 95, status: 'Active', farmer_id: 1, rating: 5.0, reviews_count: 48 },
  { id: 17, name: 'Cocoyam', description: 'Creamy cocoyam tubers and fresh tender kontomire leaves', category: 'Grains', price: 15.00, unit: 'kg', stock_quantity: 70, status: 'Active', farmer_id: 2, rating: 4.6, reviews_count: 16 },
  { id: 18, name: 'Sweet Potatoes', description: 'Beta-carotene rich orange sweet potatoes from Volta basin', category: 'Grains', price: 16.00, unit: 'kg', stock_quantity: 85, status: 'Active', farmer_id: 2, rating: 4.7, reviews_count: 21 },

  // Poultry & Eggs
  { id: 19, name: 'Free Range Eggs', description: 'Farm fresh crate of 30 brown eggs from pasture-raised hens', category: 'Poultry', price: 30.00, unit: 'crate', stock_quantity: 60, status: 'Active', farmer_id: 1, rating: 4.9, reviews_count: 64 },
  { id: 20, name: 'Whole Chicken', description: 'Dressed organic farm chicken, healthy and antibiotic-free', category: 'Poultry', price: 55.00, unit: 'piece', stock_quantity: 40, status: 'Active', farmer_id: 1, rating: 4.8, reviews_count: 33 },
  { id: 21, name: 'Duck Meat', description: 'Freshly prepped tender farm duck meat, rich and flavorful', category: 'Poultry', price: 65.00, unit: 'kg', stock_quantity: 25, status: 'Active', farmer_id: 2, rating: 4.6, reviews_count: 11 },
  { id: 22, name: 'Turkey', description: 'Plump festive local turkey, premium raised on grain feed', category: 'Poultry', price: 120.00, unit: 'piece', stock_quantity: 18, status: 'Active', farmer_id: 2, rating: 4.9, reviews_count: 15 },

  // Meat
  { id: 23, name: 'Fresh Beef', description: 'Prime local grass-fed beef cuts, inspected and hygienically butchered', category: 'Meat', price: 80.00, unit: 'kg', stock_quantity: 45, status: 'Active', farmer_id: 1, rating: 4.8, reviews_count: 28 },
  { id: 24, name: 'Pork Meat', description: 'Tender grain-fed pork chops and cuts, farm inspected', category: 'Meat', price: 70.00, unit: 'kg', stock_quantity: 35, status: 'Active', farmer_id: 1, rating: 4.7, reviews_count: 19 },
  { id: 25, name: 'Goat Meat', description: 'Succulent Sahelian goat meat, popular for light soup and grilling', category: 'Meat', price: 90.00, unit: 'kg', stock_quantity: 30, status: 'Active', farmer_id: 2, rating: 5.0, reviews_count: 36 },
  { id: 26, name: 'Fresh Fish', description: 'Fresh tilapia caught from Volta lake, cleaned and scaled', category: 'Meat', price: 45.00, unit: 'kg', stock_quantity: 55, status: 'Active', farmer_id: 2, rating: 4.9, reviews_count: 40 },
  { id: 27, name: 'Snail Meat', description: 'Giant African land snails, cleaned and vacuum sealed', category: 'Meat', price: 55.00, unit: 'kg', stock_quantity: 25, status: 'Active', farmer_id: 1, rating: 4.9, reviews_count: 23 },
  { id: 28, name: 'Rabbit Meat', description: 'Lean, low-cholesterol farm-raised rabbit meat cuts', category: 'Meat', price: 60.00, unit: 'kg', stock_quantity: 20, status: 'Active', farmer_id: 1, rating: 4.6, reviews_count: 8 },

  // Dairy
  { id: 29, name: 'Fresh Milk', description: 'Pasteurized whole cow milk straight from Amrahia dairy farms', category: 'Dairy', price: 18.00, unit: 'liter', stock_quantity: 60, status: 'Active', farmer_id: 2, rating: 4.8, reviews_count: 27 },

  // Spices & Condiments
  { id: 30, name: 'Hot Pepper', description: 'Fiery scotch bonnet peppers, pungent and aromatic', category: 'Spices', price: 20.00, unit: 'kg', stock_quantity: 40, status: 'Active', farmer_id: 1, rating: 4.9, reviews_count: 32 },
  { id: 31, name: 'Fresh Chilli', description: 'Long green and red birds eye chilies from Keta sand spits', category: 'Spices', price: 25.00, unit: 'kg', stock_quantity: 35, status: 'Active', farmer_id: 1, rating: 4.7, reviews_count: 16 },
  { id: 32, name: 'Fresh Ginger', description: 'Potent aromatic ginger roots harvested from Juaben', category: 'Spices', price: 22.00, unit: 'kg', stock_quantity: 50, status: 'Active', farmer_id: 2, rating: 4.9, reviews_count: 29 },
  { id: 33, name: 'Raw Honey', description: 'Unfiltered 100% pure wildflower bush honey from Afram Plains', category: 'Spices', price: 45.00, unit: 'jar', stock_quantity: 40, status: 'Active', farmer_id: 2, rating: 5.0, reviews_count: 51 },
  { id: 34, name: 'Shito Pepper', description: 'Artisanal authentic black pepper sauce cooked with dried shrimp and fish', category: 'Spices', price: 35.00, unit: 'jar', stock_quantity: 60, status: 'Active', farmer_id: 1, rating: 5.0, reviews_count: 74 },
  { id: 35, name: 'Prekese Spice', description: 'Aromatic medicinal prekese (Aidan fruit) pods for palm nut soup', category: 'Spices', price: 15.00, unit: 'piece', stock_quantity: 80, status: 'Active', farmer_id: 1, rating: 4.8, reviews_count: 21 },
];

export interface MockOrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

export interface MockOrder {
  id: number;
  total_amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
  delivery_address: string;
  items: MockOrderItem[];
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 1042,
    total_amount: 145.00,
    status: 'Delivered',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    delivery_address: '14 Independence Avenue, Airport Residential, Accra',
    items: [
      { product_name: 'Fresh Tomatoes (5kg)', quantity: 1, price: 75.00 },
      { product_name: 'Sweet Corn (5 pcs)', quantity: 2, price: 40.00 },
      { product_name: 'Fresh Pineapples', quantity: 1, price: 20.00 },
      { product_name: 'Fresh Ginger (1kg)', quantity: 1, price: 10.00 },
    ],
  },
  {
    id: 1043,
    total_amount: 95.00,
    status: 'Shipped',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    delivery_address: 'Plot 22, Ring Road Central, Kokomlemle, Accra',
    items: [
      { product_name: 'Free Range Eggs (Crate)', quantity: 1, price: 30.00 },
      { product_name: 'Whole Chicken (Fresh)', quantity: 1, price: 55.00 },
      { product_name: 'Hot Scotch Bonnet Peppers', quantity: 1, price: 10.00 },
    ],
  },
  {
    id: 1044,
    total_amount: 180.00,
    status: 'Processing',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    delivery_address: 'House No 8, East Legon Hills, Greater Accra',
    items: [
      { product_name: 'Premium Jasmine Rice (5kg)', quantity: 1, price: 105.00 },
      { product_name: 'Raw Wildflower Honey (1 Jar)', quantity: 1, price: 45.00 },
      { product_name: 'Shito Artisanal Pepper Sauce', quantity: 1, price: 30.00 },
    ],
  },
];

export const MOCK_DEFAULT_WEATHER = {
  location: 'Greater Accra',
  latitude: 5.6037,
  longitude: -0.1870,
  current: {
    temperature: 28.5,
    weathercode: 2,
    windspeed: 14.2,
    is_day: 1,
  },
  daily: {
    time: [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 86400000).toISOString().split('T')[0],
      new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    ],
    temperature_2m_max: [31.2, 30.8, 31.5, 32.0, 31.0, 30.5, 31.8],
    temperature_2m_min: [24.1, 23.8, 24.5, 24.0, 23.9, 24.2, 24.0],
    precipitation_sum: [0.0, 1.2, 0.4, 0.0, 3.5, 0.8, 0.0],
    precipitation_probability_max: [10, 35, 20, 15, 60, 25, 10],
    weathercode: [1, 2, 2, 1, 61, 2, 1],
    windspeed_10m_max: [15.1, 16.5, 14.0, 13.8, 18.2, 14.5, 13.2],
    uv_index_max: [9.2, 8.8, 9.5, 9.8, 7.5, 9.0, 9.4],
  },
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => `${new Date().toISOString().split('T')[0]}T${String(i).padStart(2, '0')}:00`),
    relativehumidity_2m: [82, 84, 86, 88, 90, 91, 88, 82, 75, 68, 65, 63, 62, 64, 67, 71, 74, 78, 80, 82, 83, 84, 84, 83],
    soil_moisture_0_to_1cm: Array.from({ length: 24 }, () => 0.28),
  },
};

export function getMockWeatherForRegion(regionName: string) {
  const isNorthern = ['Northern', 'Upper East', 'Upper West', 'North East', 'Savannah'].includes(regionName);
  const baseTemp = isNorthern ? 34.0 : 28.5;
  return {
    ...MOCK_DEFAULT_WEATHER,
    location: regionName,
    current: {
      ...MOCK_DEFAULT_WEATHER.current,
      temperature: baseTemp,
    },
  };
}


export function getDynamicGhanaWeather(regionName: string, date: Date = new Date()): any {
  const hour = date.getHours();
  const isNorthern = ['Northern', 'Upper East', 'Upper West', 'North East', 'Savannah'].includes(regionName);
  const isForest = ['Ashanti', 'Eastern', 'Western', 'Western North', 'Central', 'Bono', 'Bono East', 'Ahafo'].includes(regionName);
  
  // Base day/night temperatures by zone
  const maxDayTemp = isNorthern ? 36.5 : isForest ? 30.8 : 30.0;
  const minNightTemp = isNorthern ? 24.5 : isForest ? 22.0 : 23.5;
  
  // Sinusoidal temperature curve across 24h: coolest at 5am, warmest at 2:30pm (14:30)
  const radians = ((hour - 5) / 24) * 2 * Math.PI;
  const tempOffset = (Math.sin(radians - Math.PI / 2) + 1) / 2; // 0 at 5am, 1 at 2pm
  const currentTemp = Math.round((minNightTemp + (maxDayTemp - minNightTemp) * tempOffset) * 10) / 10;

  const isDay = (hour >= 6 && hour < 18) ? 1 : 0;
  
  // Dynamic weather code based on time of day
  let weatherCode = 1; // Mainly clear
  if (hour >= 12 && hour <= 16 && isForest) {
    weatherCode = 2; // Partly cloudy
  } else if (hour >= 20 || hour <= 5) {
    weatherCode = 0; // Clear starry night
  } else if (hour >= 6 && hour <= 10) {
    weatherCode = 1; // Gentle morning sun
  }

  const windspeed = Math.round((9 + tempOffset * 8 + (isNorthern ? 4 : 2)) * 10) / 10;

  // 7-day forecast starting with today
  const dailyTime: string[] = [];
  const dailyMax: number[] = [];
  const dailyMin: number[] = [];
  const dailyRainSum: number[] = [];
  const dailyRainProb: number[] = [];
  const dailyCodes: number[] = [];
  const dailyWindMax: number[] = [];
  const dailyUvMax: number[] = [];

  for (let d = 0; d < 7; d++) {
    const dayDate = new Date(date.getTime() + d * 86400000);
    dailyTime.push(dayDate.toISOString().split('T')[0]);
    const variance = Math.sin(d * 1.5) * 1.2;
    dailyMax.push(Math.round((maxDayTemp + variance) * 10) / 10);
    dailyMin.push(Math.round((minNightTemp + variance * 0.5) * 10) / 10);
    
    const rainProb = isForest ? Math.round(25 + Math.sin(d) * 25) : isNorthern ? Math.round(5 + Math.sin(d) * 10) : Math.round(15 + Math.sin(d) * 15);
    dailyRainProb.push(Math.max(5, Math.min(80, rainProb)));
    dailyRainSum.push(rainProb > 40 ? Math.round(rainProb * 0.12 * 10) / 10 : 0);
    dailyCodes.push(rainProb > 50 ? 61 : rainProb > 30 ? 2 : 1);
    dailyWindMax.push(Math.round((14 + Math.cos(d) * 3) * 10) / 10);
    dailyUvMax.push(isNorthern ? 10.2 : 9.0);
  }

  // 24-hour hourly simulation
  const todayStr = date.toISOString().split('T')[0];
  const hourlyTime: string[] = [];
  const hourlyHumidity: number[] = [];
  const hourlySoilMoisture: number[] = [];

  for (let h = 0; h < 24; h++) {
    hourlyTime.push(`${todayStr}T${String(h).padStart(2, '0')}:00`);
    const hOffset = (Math.sin(((h - 5) / 24) * 2 * Math.PI - Math.PI / 2) + 1) / 2;
    const humidity = Math.round(88 - hOffset * (isNorthern ? 45 : 30));
    hourlyHumidity.push(Math.max(25, Math.min(96, humidity)));
    hourlySoilMoisture.push(Math.round((0.32 - hOffset * 0.06) * 100) / 100);
  }

  return {
    location: regionName,
    latitude: 5.6037,
    longitude: -0.1870,
    current: {
      temperature: currentTemp,
      weathercode: weatherCode,
      windspeed,
      is_day: isDay,
    },
    daily: {
      time: dailyTime,
      temperature_2m_max: dailyMax,
      temperature_2m_min: dailyMin,
      precipitation_sum: dailyRainSum,
      precipitation_probability_max: dailyRainProb,
      weathercode: dailyCodes,
      windspeed_10m_max: dailyWindMax,
      uv_index_max: dailyUvMax,
    },
    hourly: {
      time: hourlyTime,
      relativehumidity_2m: hourlyHumidity,
      soil_moisture_0_to_1cm: hourlySoilMoisture,
    },
  };
}

export function getDynamicFarmingAlerts(regionName: string, date: Date = new Date()) {
  const hour = date.getHours();
  const alerts: { type: 'info' | 'warning' | 'danger'; message: string }[] = [];

  if (hour >= 5 && hour < 11) {
    alerts.push({
      type: 'info',
      message: '🌅 Morning Prime Irrigation: Ideal window for drip & root irrigation in ' + regionName + '. Evapotranspiration is lowest before 11:00 AM.',
    });
    alerts.push({
      type: 'info',
      message: '🌿 Foliar Health Check: Inspect underside of crop leaves for morning dew moisture and pest egg clusters.',
    });
  } else if (hour >= 11 && hour < 16) {
    alerts.push({
      type: 'warning',
      message: '☀️ Peak Midday Solar Radiation: High UV index. Avoid overhead sprinkler watering now to prevent leaf scorch.',
    });
    alerts.push({
      type: 'danger',
      message: '🛡️ Soil Thermal Alert: Ensure mulch coverage is intact over root beds in ' + regionName + ' to keep roots cool.',
    });
  } else if (hour >= 16 && hour < 20) {
    alerts.push({
      type: 'info',
      message: '🌇 Twilight Scouting Window: Nocturnal insect activity begins at dusk. Inspect perimeter rows.',
    });
    alerts.push({
      type: 'info',
      message: '💧 Evening Moisture Assessment: Review soil moisture. If topsoil is crusty, schedule a 30-minute top-up cycle.',
    });
  } else {
    alerts.push({
      type: 'info',
      message: '🌙 Night Soil Infiltration: Ambient night temperatures allow maximum deep moisture penetration with near-zero evaporation.',
    });
    alerts.push({
      type: 'info',
      message: '🚜 Overnight Ventilation: Ensure greenhouse and nursery vents are balanced to regulate night humidity.',
    });
  }

  return alerts;
}
