import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: "cancelled",
      cancelled: true,
      cancelledAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Booking cancelled successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
