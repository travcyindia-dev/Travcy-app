import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@/lib/email";

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { uid, role, email, displayName, phone, address, city, profilePic } = await req.json();
    if (!uid || !role) {
      return NextResponse.json({ success: false, error: "Missing uid or role" }, { status: 400 });
    }

    // Set custom claims for role-based access
    await admin.auth().setCustomUserClaims(uid, { role });

    // Also save user to Firestore users collection
    await db.collection("users").doc(uid).set({
      uid,
      role,
      email: email || null,
      displayName: displayName || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      profilePic: profilePic || null,
      createdAt: new Date().toISOString(),
    }, { merge: true });

    // Send welcome email to customer (fire-and-forget, don't block response)
    if (role === "customer" && email) {
      const template = emailTemplates.customerWelcome(displayName || "Traveler");
      sendEmail(email, template).catch(err => console.error("Welcome email failed:", err));
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
