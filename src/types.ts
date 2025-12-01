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
accommodation:string


agencyId:string


amount:string


bookingId:string


cancelled:Boolean


createdAt:string


destination:string


email:string


endDate:string


fullName:string


numberOfTravelers:number


orderId:string


packageId:string


paymentId:string


phoneNumber:string


specialRequests:string


startDate:string


status:string


transportation:string


userId:string



}