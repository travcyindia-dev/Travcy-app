import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

// GET - Fetch user profile
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid");
        const type = searchParams.get("type"); // 'customer' or 'agency'

        if (!uid) {
            return NextResponse.json({ success: false, error: "Missing uid" }, { status: 400 });
        }

        if (type === "agency") {
            const agencyDoc = await db.collection("agencies").doc(uid).get();
            if (!agencyDoc.exists) {
                return NextResponse.json({ success: false, error: "Agency not found" }, { status: 404 });
            }
            const data = agencyDoc.data();
            return NextResponse.json({ 
                success: true, 
                profile: { 
                    id: agencyDoc.id, 
                    ...data,
                    createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt || null,
                } 
            });
        } else {
            const userDoc = await db.collection("users").doc(uid).get();
            if (!userDoc.exists) {
                return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
            }
            const data = userDoc.data();
            return NextResponse.json({ 
                success: true, 
                profile: { 
                    id: userDoc.id, 
                    ...data,
                    createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt || null,
                } 
            });
        }
    } catch (err: any) {
        console.error("Profile fetch error:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

// POST - Update user profile
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { uid, type, ...profileData } = body;

        if (!uid) {
            return NextResponse.json({ error: "Missing uid" }, { status: 400 });
        }

        const collection = type === "agency" ? "agencies" : "users";
        
        await db.collection(collection).doc(uid).set({
            ...profileData,
            updatedAt: new Date().toISOString(),
        }, { merge: true });

        // If there's a display name, also update Firebase Auth
        if (profileData.displayName || profileData.name) {
            try {
                await admin.auth().updateUser(uid, {
                    displayName: profileData.displayName || profileData.name,
                    photoURL: profileData.photoURL || profileData.profilePic || undefined,
                });
            } catch (authError) {
                console.error("Auth update error:", authError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Profile update error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
