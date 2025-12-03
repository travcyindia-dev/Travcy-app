import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const { orderId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature, userId,packageId,agencyId,amount,booking,destination,packageTitle} = await req.json();
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
            const response=await createBooking({userId:userId,packageId:packageId,agencyId:agencyId,amount:amount,orderId:orderId,paymentId:razorpayPaymentId,booking:booking,destination:destination,packageTitle:packageTitle})
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
export async function createBooking({ userId, packageId, agencyId, amount, orderId, paymentId, booking,destination,packageTitle }: { userId: string; packageId: string; agencyId: string; amount: number; orderId: string; paymentId: string; booking: any,destination:string,packageTitle?:string }) {
    try {
        const bookingId = booking.bookingId;

        await setDoc(doc(db, "bookings", bookingId), {
            bookingId,
            fullName: booking.fullName,
            email: booking.email,
            phoneNumber: booking.phoneNumber,
            destination:destination,
            packageTitle: packageTitle || destination,
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

        // Send confirmation email to customer (fire-and-forget, don't block response)
        if (booking.email) {
            const customerTemplate = emailTemplates.bookingConfirmation({
                customerName: booking.fullName,
                bookingId: bookingId,
                packageTitle: packageTitle || destination,
                destination: destination,
                startDate: booking.startDate,
                endDate: booking.endDate,
                travelers: Number.parseInt(booking.numberOfTravelers),
                amount: amount,
                paymentId: paymentId,
            });
            sendEmail(booking.email, customerTemplate).catch(err => console.error("Booking confirmation email failed:", err));
        }

        // Send notification email to agency (fire-and-forget, don't block response)
        getDoc(doc(db, "agencies", agencyId)).then(agencyDoc => {
            if (agencyDoc.exists()) {
                const agencyData = agencyDoc.data();
                if (agencyData?.email) {
                    const agencyTemplate = emailTemplates.agencyNewBooking({
                        agencyName: agencyData.name || "Agency",
                        customerName: booking.fullName,
                        customerEmail: booking.email,
                        customerPhone: booking.phoneNumber,
                        bookingId: bookingId,
                        packageTitle: packageTitle || destination,
                        destination: destination,
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        travelers: Number.parseInt(booking.numberOfTravelers),
                        amount: amount,
                    });
                    sendEmail(agencyData.email, agencyTemplate).catch(err => 
                        console.error("Agency notification email failed:", err)
                    );
                }
            }
        }).catch(err => console.error("Error fetching agency for email:", err));

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


