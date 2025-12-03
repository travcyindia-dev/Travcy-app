import { app } from "@/lib/firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(app)

export async function POST(req: any) {
    const body = await req.json();
    let result = null;

    try {
        const uid = body.uid;

        result = await setDoc(doc(db, "agencies", uid), {
            uid,
            name: body.name,
            location: body.location,
            email: body.email,
            phone: body.phone || null,
            website: body.website || null,
            taxId: body.taxId || null,
            description: body.description || null,
            address: body.address || null,
            logo: body.logo || null,
            approved: false,
            createdAt: new Date(),
        }, {
            merge: true,
        });

        return NextResponse.json(
            { success: true, uid, result: result },
            { status: 200 },
        );
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message },
            { status: 500 }
        );
    }
}

