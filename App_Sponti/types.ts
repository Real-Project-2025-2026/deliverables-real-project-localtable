export enum UserRole {
  CUSTOMER = 'customer',
  OWNER = 'owner'
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  profilePicture: string;
  favorites: string[]; // Restaurant IDs
  pushEnabled: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Main' | 'Side' | 'Drink' | 'Dessert';
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  phone: string;
  location: { lat: number; lng: number };
  address: string;
  photos: string[];
  cuisineType: string;
  openingHours: string;
  rating: number;
  menu: MenuItem[];
}

export interface Deal {
  id: string;
  restaurantId: string;
  title: string;
  description: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  originalPrice?: number;
  startTime: string; // ISO String
  endTime: string; // ISO String
  createdByAi: boolean;
  maxRedemptions: number;
  redemptionsCount: number;
  isActive: boolean;
}

export interface QRRedemption {
  id: string;
  userId: string;
  dealId: string;
  restaurantId: string; // Denormalized for easier lookup
  qrUuid: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'redeemed' | 'expired';
}

export interface MagicDealSuggestion {
  title: string;
  description: string;
  discountValue: number;
  discountType: 'fixed' | 'percent';
  durationMinutes: number;
  maxRedemptions: number;
}