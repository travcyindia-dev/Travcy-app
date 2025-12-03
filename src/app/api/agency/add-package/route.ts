import { app } from "@/lib/firebase";
import { randomUUID } from "crypto";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const db = getFirestore(app)

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
}

export async function POST(req: any) {
    const body = await req.json();
    let result = null;
    let error = null;

    try {
        // Fetch agency name from agency document
        let agencyName = "Travel Agency";
        if (body.agencyId) {
            const agencyDoc = await getDoc(doc(db, "agencies", body.agencyId));
            if (agencyDoc.exists()) {
                agencyName = agencyDoc.data().agencyName || agencyDoc.data().name || "Travel Agency";
            }
        }

        const packageId = randomUUID();
        result = await setDoc(doc(db, "packages", packageId), {
            packageId,
            agencyId: body.agencyId,
            agencyName: body.agencyName || agencyName,
            title: body.title,
            destination: body.destination,
            duration: body.duration,
            price: body.price,
            maxTravellers: body.maxTravellers,
            description: body.description,
            imgUrl: body.imgUrl,
            highlights: body.highlights || [],
            inclusions: body.inclusions || [],
            exclusions: body.exclusions || [],
            itinerary: body.itinerary || [],
            rating: 0,
            reviewCount: 0,
            createdAt: new Date(),
        }, {
            merge: true,
        });
        
        console.log("Package created successfully:", packageId);
        return NextResponse.json(
            { success: true, packageId, result: result },
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