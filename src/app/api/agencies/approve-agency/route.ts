import { doc, getDoc, updateDoc } from "firebase/firestore";
import { admin } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";
// const auth = getAuth();
const db = admin.firestore();
export async function POST(req: Request) {
    try {
        const { id, status } = await req.json();

        if (status == 'approved') {
            // 1️⃣ Update Firestore
            await db.collection("agencies").doc(id).update({ approved: true});

            // 2️⃣ Set role in custom claims
            await admin.auth().setCustomUserClaims(id, { role: "agency" });
            return new Response(JSON.stringify({ success: true, message: "account approved" }), { status: 200 });
        }
        else {
            await db.collection("agencies").doc(id).delete();
            await admin.auth().deleteUser(id);
            return new Response(JSON.stringify({ success: true, message: "account rejected" }), { status: 200 });
        }

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Failed to update" }), { status: 500 });
    }
}

