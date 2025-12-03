import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import Razorpay from "razorpay"

export async function POST(req: Request) {
    const { amount } = await req.json()
    try {
        let instance = new Razorpay({ key_id: process.env.NEXT_PUBLIC_RAZOR_PAY_TEST_API_KEY, key_secret: process.env.NEXT_PUBLIC_RAZOR_PAY_TEST_KEY_SECRET })

        // Razorpay expects amount in paise (smallest currency unit)
        // So ₹299 should be sent as 29900
        const amountInPaise = Math.round(Number(amount) * 100);

        const response = await instance.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt-${Date.now()}`,
        });
        console.log("response:",response);
        // const bookingResponse=await createBooking({userId:userId,packageId:packageId,agencyId:agencyId,amount:amount,orderId:orderId,paymentId:razorpayPaymentId,bookings:bookings});


        return NextResponse.json({response:response})
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({error:error});
    }
}