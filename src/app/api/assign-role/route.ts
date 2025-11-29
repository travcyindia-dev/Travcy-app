import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { uid, role } = await req.json();
    if (!uid || !role) {
      return NextResponse.json({ success: false, error: "Missing uid or role" }, { status: 400 });
    }

    // Only server-side Admin SDK can set custom claims
    await admin.auth().setCustomUserClaims(uid, { role });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
