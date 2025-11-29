import { db } from "@/lib/firebase";
import { randomUUID } from "crypto";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// A server-side helper function
export async function createBooking({ userId, packageId, agencyId, amount, orderId, paymentId, booking,destination }: { userId: string; packageId: string; agencyId: string; amount: number; orderId: string; paymentId: string; booking: any,destination:string }) {
    try {
        const bookingId = booking.bookingId;

        await setDoc(doc(db, "bookings", bookingId), {
            bookingId,
            fullName: booking.fullName,
            email: booking.email,
            phoneNumber: booking.phoneNumber,
            destination:destination,
            numberOfTravelers: Number.parseInt(booking.numberOfTravelers),
            startDate: booking.startDate,
            endDate: booking.endDate,
            accommodation: booking.accommodation,
            transportation: booking.transportation,
            specialRequests: booking.specialRequests,
            status: "confirmed",
            cancelled: false,
            userId,
            packageId,
            agencyId,
            paymentId,
            orderId,
            amount,
           
            // status: "CONFIRMED",
            createdAt: new Date(),
        }, {
            merge: true,
        });

        return {
            bookingResponse: {
                bookingId,
                fullName: booking.fullName,
                email: booking.email,
                phoneNumber: booking.phoneNumber,
                destination: booking.destination,
                numberOfTravelers: Number.parseInt(booking.numberOfTravelers),
                startDate: booking.startDate,
                endDate: booking.endDate,
                accommodation: booking.accommodation,
                transportation: booking.transportation,
                specialRequests: booking.specialRequests,
                status: "confirmed",
                cancelled: false,
                userId,
                packageId,
                agencyId,
                paymentId,
                orderId,
                amount,
                // status: "CONFIRMED",
                createdAt: new Date(),

            },
        };
    } catch (error) {
        return { error }
    }
}


