export type UserRole = 'admin' | 'user' | 'agency' | null;
export type ViewState = 'login' | 'register-agency' | 'dashboard';
export type AgencyTier = 'Basic' | 'Pro' | 'Enterprise' | 'Pending';

export interface Agency {
  uid: number;
  name: string;
  location: string;
  // rating: number;
  verified: boolean;
  paid?: boolean;
  // priceStart: number;
  // Tier: AgencyTier;
  trustScore?: number;
  docUrl?: string;
  website?: string;
  taxId?: string;
}

export interface Booking {
  id: number;
  user: string;
  destination: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  amount: number;
}