import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request, context:any) {
    const { userId } = await context.params;  // FIXED
    console.log("userId:",userId);
    try {       
        const snap = await getDocs(
            query(
                collection(db, "bookings"),
                where("userId", "==", userId)
            )
        );

        const bookings = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log("bookings:",bookings);
        return NextResponse.json({ bookings });
    } catch (err) {
        console.error("error", err);
        return NextResponse.json({ error: "Could not fetch bookings" }, { status: 500 });
    }

}