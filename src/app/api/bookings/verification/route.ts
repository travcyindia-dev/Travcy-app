import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request) {
    try {
        const { orderId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature, userId,packageId,agencyId,amount,booking,destination} = await req.json();
            const secretKey = process.env.NEXT_PUBLIC_RAZOR_PAY_TEST_KEY_SECRET;
        
        if (!secretKey) {
            return NextResponse.json({ msg: "Server configuration error" }, { status: 500 });
        }
        
        const shasum = createHmac("sha256", secretKey);

        shasum.update(`${orderId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return NextResponse.json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        // console.log()
        let bookingData=null
        if(digest===razorpaySignature){
            const response=await createBooking({userId:userId,packageId:packageId,agencyId:agencyId,amount:amount,orderId:orderId,paymentId:razorpayPaymentId,booking:booking,destination:destination})
            bookingData=response.bookingResponse
        }
        return NextResponse.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            bookingData:bookingData
        })

    } catch (error) {
        console.log("error:", error);
    }
}


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


