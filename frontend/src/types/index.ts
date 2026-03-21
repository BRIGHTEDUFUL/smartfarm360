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

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  profile_photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}
