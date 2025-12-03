import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");

    if (!agencyId) {
      return NextResponse.json({ success: false, error: "Missing agencyId" }, { status: 400 });
    }
    
    const firestore = admin.firestore();
    const snap = await firestore
      .collection("bookings")
      .where("agencyId", "==", agencyId)
      .get();

    const bookings = snap.docs.map((d: any) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Convert Firestore timestamps
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
      };
    });

    return NextResponse.json({ success: true, bookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
