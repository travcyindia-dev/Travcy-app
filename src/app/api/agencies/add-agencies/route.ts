import { app } from "@/lib/firebase";
import { randomUUID } from "crypto";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
const auth = getAuth(app);
const db = getFirestore(app)
export async function POST(req: any) {
    const body = await req.json();
    // const { agencyId, ...packageData } = body;
    // const agencyId=form.get('agencyId');
    let result = null;
    let error = null;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, body.email, body.password);
        const uid = userCredential.user.uid;

        result = await setDoc(doc(db, "agencies", uid), {
            uid,
            name: body.name,
            location: body.location,
            email: body.email,
            // price: body.price,
            approved: false,
            createdAt: new Date(),

        }, {
            merge: true,
        });

        // console.log("result of cloudinary:", result);
        return NextResponse.json(
            { success: true, uid, result: result },
            { status: 200 },
        );
    } catch (e: any) {
        error = e;
        return NextResponse.json(
            { success: false, error: e.message },
            { status: 500 }
        );
    }

}

