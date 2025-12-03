import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@/lib/email";

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

    // Get booking details before updating
    const bookingRef = doc(db, "bookings", bookingId);
    const bookingDoc = await getDoc(bookingRef);
    const bookingData = bookingDoc.exists() ? bookingDoc.data() : null;

    await updateDoc(bookingRef, {
      status: "cancelled",
      cancelled: true,
      cancelledAt: new Date().toISOString(),
    });

    // Send cancellation email to customer (fire-and-forget, don't block response)
    if (bookingData?.email) {
      const template = emailTemplates.bookingCancellation({
        customerName: bookingData.fullName || "Customer",
        bookingId: bookingId,
        packageTitle: bookingData.packageTitle || bookingData.destination || "Travel Package",
        destination: bookingData.destination || "Destination",
        amount: parseFloat(bookingData.amount) || 0,
      });
      sendEmail(bookingData.email, template).catch(err => console.error("Cancellation email failed:", err));
    }

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
