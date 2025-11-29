import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createHmac } from "crypto";
import axios from "axios";
import { createBooking } from "../create-booking/route";

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