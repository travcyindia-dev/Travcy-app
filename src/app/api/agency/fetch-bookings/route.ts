import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId");

    if (!agencyId) {
      return NextResponse.json({ error: "Missing agencyId" }, { status: 400 });
    }
    
    const firestore = admin.firestore();
    const snap = await firestore
      .collection("bookings")
      .where("agencyId", "==", agencyId)
      .get();

    const bookings = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ bookings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
