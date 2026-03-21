export enum UserRole {
  ADMIN = 'Admin',
  FARMER = 'Farmer',
  CONSUMER = 'Consumer',
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
