import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const agencyId = searchParams.get("agencyId");

        if (!agencyId) {
            return NextResponse.json(
                { success: false, error: "Missing agencyId" },
                { status: 400 }
            );
        }

        // Fetch all packages for this agency
        const packagesSnapshot = await db
            .collection("packages")
            .where("agencyId", "==", agencyId)
            .get();

        const packages = packagesSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
            };
        });

        // Fetch all bookings for this agency to calculate stats
        const bookingsSnapshot = await db
            .collection("bookings")
            .where("agencyId", "==", agencyId)
            .get();

        const bookings = bookingsSnapshot.docs.map((doc) => doc.data());

        // Calculate stats for each package
        const packagesWithStats = packages.map((pkg: any) => {
            const packageBookings = bookings.filter((b: any) => b.packageId === pkg.packageId);
            
            // Normalize status comparison (case-insensitive)
            const confirmedBookings = packageBookings.filter((b: any) => {
                const status = (b.status || "").toLowerCase();
                return (status === "confirmed" || status === "completed") && !b.cancelled;
            });
            const cancelledBookings = packageBookings.filter((b: any) => b.cancelled === true);
            const pendingBookings = packageBookings.filter((b: any) => {
                const status = (b.status || "").toLowerCase();
                return (status === "pending" || status === "") && !b.cancelled;
            });

            // Calculate revenue from all paid bookings (confirmed + completed)
            const totalRevenue = packageBookings
                .filter((b: any) => !b.cancelled && b.paymentId)
                .reduce((sum: number, b: any) => {
                    return sum + (parseFloat(b.amount) || 0);
                }, 0);

            const totalTravelers = packageBookings
                .filter((b: any) => !b.cancelled)
                .reduce((sum: number, b: any) => {
                    return sum + (b.numberOfTravelers || 1);
                }, 0);

            return {
                ...pkg,
                stats: {
                    totalBookings: packageBookings.length,
                    confirmedBookings: confirmedBookings.length,
                    cancelledBookings: cancelledBookings.length,
                    pendingBookings: pendingBookings.length,
                    totalRevenue,
                    totalTravelers,
                },
            };
        });

        // Sort by creation date (newest first)
        packagesWithStats.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

        return NextResponse.json({
            success: true,
            packages: packagesWithStats,
        });
    } catch (error: any) {
        console.error("Error fetching packages:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
