import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { uid, role, email, displayName } = await req.json();
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
      createdAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
