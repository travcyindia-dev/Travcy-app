import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { agenciesCollection, db } from "../../../lib/firebase";

export async function GET() {
  try {
    let querySnapshot = null;

    
    // use admin.firestore() to access server-side Firestore
    querySnapshot = await admin.firestore().collection('travelAgencies').get();
    const localPosts = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return NextResponse.json({ success: true, agencies: localPosts });
  } catch (err) {
    console.error("Error fetching agencies:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
