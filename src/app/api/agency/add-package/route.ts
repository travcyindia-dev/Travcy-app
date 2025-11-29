import { app } from "@/lib/firebase";
import { randomUUID } from "crypto";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(app)
export async function POST(req: any) {
    const body = await req.json();
    // const { agencyId, ...packageData } = body;
    // const agencyId=form.get('agencyId');
    let result = null;
    let error = null;

    try {
        const packageId = randomUUID();
        result = await setDoc(doc(db, "packages", packageId), {
            packageId,
            agencyId: body.agencyId,   //who created it
            title: body.title,
            destination: body.destination,
            duration: body.duration,
            price: body.price,
            maxTravellers: body.maxTravellers,
            description: body.description,
            imgUrl: body.imgUrl,
            createdAt: new Date(),

        }, {
            merge: true,
        });
        
        console.log("result of cloudinary:", result);
         return NextResponse.json(
            { success: true, packageId, result:result },
            { status: 200},
        );
    } catch (e:any) {
        error = e;
        return NextResponse.json(
            { success: false, error: e.message },
            { status: 500 }
        );
    }
    
}