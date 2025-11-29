// src/store/usebookingstore.ts
import { create } from "zustand";

export interface Booking {
                bookingId:string;
                fullName: string,
                email: string,
                phoneNumber: string,
                destination:string,
                numberOfTravelers: number,
                startDate: string,
                endDate: string,
                accommodation: string,
                transportation:string,
                specialRequests: string,
                status: string,
                cancelled: boolean,
                userId:string,
                packageId:string,
                agencyId:string,
                paymentId:string,
                orderId:string,
                amount:number,
                createdAt: Date,
}

interface BookingState {
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
    addBooking: (book: Booking) => void;
    cancelBooking: (id: string) => void;
    hasFetchedOnce: boolean;
    setHasFetchedOnce: (hasFetchedOnce: boolean) => void;
    reset:()=>void;
}
export const useBookingStore = create<BookingState>((set) => ({
    bookings: [],
    hasFetchedOnce: false,
    setBookings: (bookings) => set({ bookings: bookings }),
    addBooking: (book) => set((state) => ({ bookings: [...state.bookings, book] })),
    cancelBooking: (id) =>
        set((state) => ({ bookings: state.bookings.filter((p) => p.bookingId !== id) })),
    setHasFetchedOnce: (value) => set({ hasFetchedOnce: value }),
    reset:()=>set({bookings:[]})
}));

