import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const snap = await getDocs(
            query(
                collection(db, "agencies"),
                where("approved", "==", false)
            )
        );

        const agencies = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log("agencies:",agencies)
        return NextResponse.json({ agencies });
    } catch (err) {
        console.error("error", err);
        return NextResponse.json({ error: "Could not fetch bookings" }, { status: 500 });
    }
}