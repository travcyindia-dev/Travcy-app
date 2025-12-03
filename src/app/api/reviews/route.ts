import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

// GET - Fetch reviews for a package
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const packageId = searchParams.get("packageId");

        if (!packageId) {
            return NextResponse.json(
                { success: false, error: "Missing packageId" },
                { status: 400 }
            );
        }

        const reviewsSnapshot = await db
            .collection("reviews")
            .where("packageId", "==", packageId)
            .get();

        const reviews = reviewsSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
            };
        });

        // Sort by createdAt in memory (descending - newest first)
        reviews.sort((a: any, b: any) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        // Calculate average rating and distribution
        const totalRating = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        // Calculate rating distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((r: any) => {
            const rating = Math.round(r.rating || 0);
            if (rating >= 1 && rating <= 5) {
                distribution[rating as keyof typeof distribution]++;
            }
        });

        return NextResponse.json({
            success: true,
            reviews,
            stats: {
                totalReviews: reviews.length,
                averageRating: Math.round(averageRating * 10) / 10,
                distribution,
            },
        });
    } catch (error: any) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST - Add a new review
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { packageId, userId, userName, userPhoto, rating, title, comment, bookingId } = body;

        if (!packageId || !userId || !rating) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user has already reviewed this package
        const existingReview = await db
            .collection("reviews")
            .where("packageId", "==", packageId)
            .where("userId", "==", userId)
            .get();

        if (!existingReview.empty) {
            return NextResponse.json(
                { success: false, error: "You have already reviewed this package" },
                { status: 400 }
            );
        }

        // Verify user has a confirmed booking for this package (optional but recommended)
        const bookingSnapshot = await db
            .collection("bookings")
            .where("packageId", "==", packageId)
            .where("userId", "==", userId)
            .where("status", "==", "confirmed")
            .where("cancelled", "==", false)
            .get();

        const hasBooking = !bookingSnapshot.empty;

        // Create review
        const reviewRef = db.collection("reviews").doc();
        const reviewData = {
            id: reviewRef.id,
            packageId,
            userId,
            userName: userName || "Anonymous",
            userPhoto: userPhoto || null,
            rating: Math.min(5, Math.max(1, rating)), // Clamp between 1-5
            title: title || "",
            comment: comment || "",
            bookingId: bookingId || null,
            verified: hasBooking, // Mark as verified if user has booking
            helpful: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await reviewRef.set(reviewData);

        // Update package rating stats
        await updatePackageRating(packageId);

        return NextResponse.json({
            success: true,
            review: {
                ...reviewData,
                createdAt: new Date().toISOString(),
            },
        });
    } catch (error: any) {
        console.error("Error adding review:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// Helper function to update package rating
async function updatePackageRating(packageId: string) {
    try {
        const reviewsSnapshot = await db
            .collection("reviews")
            .where("packageId", "==", packageId)
            .get();

        const reviews = reviewsSnapshot.docs.map(doc => doc.data());
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        // Update the package document
        const packageSnapshot = await db
            .collection("packages")
            .where("packageId", "==", packageId)
            .get();

        if (!packageSnapshot.empty) {
            const packageDoc = packageSnapshot.docs[0];
            await packageDoc.ref.update({
                rating: Math.round(averageRating * 10) / 10,
                reviewCount: reviews.length,
            });
        }
    } catch (error) {
        console.error("Error updating package rating:", error);
    }
}
