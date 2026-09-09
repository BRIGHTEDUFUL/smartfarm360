export enum UserRole {
  ADMIN = 'Admin',
  FARMER = 'Farmer',
  CONSUMER = 'Consumer',
  AGRICULTURAL_OFFICER = 'AgriculturalOfficer',
}

export enum UserStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum ProductStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  REJECTED = 'Rejected',
  INACTIVE = 'Inactive',
  OUT_OF_STOCK = 'OutOfStock',
}

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'MobileMoney',
  CARD = 'Card',
  CASH_ON_DELIVERY = 'CashOnDelivery',
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}

export enum DeliveryMethod {
  HOME_DELIVERY = 'HomeDelivery',
  PICKUP = 'Pickup',
}

export enum VerificationStatus {
  UNVERIFIED = 'Unverified',
  PENDING = 'Pending',
  VERIFIED = 'Verified',
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  profile_photo_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// ─── Community ───────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: number;
  author_id: number;
  title: string;
  content: string;
  category: string;
  likes_count: number;
  replies_count: number;
  is_pinned: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author_first_name?: string;
  author_last_name?: string;
  author_role?: string;
  author_profile_photo_url?: string;
  user_liked?: number;
}

export interface CommunityReply {
  id: number;
  post_id: number;
  author_id: number;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  author_first_name?: string;
  author_last_name?: string;
  author_role?: string;
  author_profile_photo_url?: string;
  user_liked?: number;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: number;
  created_at: string;
}

export interface Conversation {
  partner_id: number;
  partner_first_name: string;
  partner_last_name: string;
  partner_role: string;
  partner_profile_photo_url: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Connection {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: 'Pending' | 'Accepted' | 'Declined';
  created_at: string;
}

// ─── Weather ─────────────────────────────────────────────────────────────────

export interface WeatherData {
  location: string;
  latitude: number;
  longitude: number;
  current: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    is_day: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    windspeed_10m_max: number[];
    uv_index_max: number[];
  };
  hourly?: {
    time: string[];
    relativehumidity_2m: number[];
    soil_moisture_0_to_1cm: number[];
  };
}

export interface FarmingAlert {
  type: 'info' | 'warning' | 'danger';
  message: string;
  day?: string;
}

export interface GhanaRegion {
  name: string;
  lat: number;
  lon: number;
}

// ─── Irrigation ──────────────────────────────────────────────────────────────

export interface IrrigationSchedule {
  id: number;
  farmer_id: number;
  field_name: string;
  crop_type: string;
  area_hectares: number | null;
  irrigation_method: 'Drip' | 'Sprinkler' | 'Flood' | 'Manual' | null;
  frequency_days: number;
  last_watered_at: string | null;
  next_watering_at: string | null;
  notes: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface IrrigationLog {
  id: number;
  farmer_id: number;
  schedule_id: number | null;
  field_name: string;
  watered_at: string;
  duration_minutes: number | null;
  amount_liters: number | null;
  method: string | null;
  rainfall_mm: number;
  notes: string | null;
  created_at: string;
}
