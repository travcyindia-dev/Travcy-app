import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

export async function GET(req: Request) {
    try {
        // Fetch all bookings
        const bookingsSnap = await db.collection("bookings").get();
        const bookings = bookingsSnap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Fetch all agencies
        const agenciesSnap = await db.collection("agencies").get();
        const agencies = agenciesSnap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Fetch users from Firestore
        const usersSnap = await db.collection("users").get();
        const firestoreUsers = usersSnap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Also fetch users from Firebase Auth to get all users
        const authUsers: any[] = [];
        try {
            const listUsersResult = await admin.auth().listUsers(1000);
            listUsersResult.users.forEach((userRecord) => {
                // Check if user already exists in firestoreUsers
                const existingUser = firestoreUsers.find((u: any) => u.id === userRecord.uid);
                if (!existingUser) {
                    authUsers.push({
                        id: userRecord.uid,
                        uid: userRecord.uid,
                        email: userRecord.email || null,
                        displayName: userRecord.displayName || null,
                        role: userRecord.customClaims?.role || 'user',
                        createdAt: userRecord.metadata.creationTime,
                        photoURL: userRecord.photoURL || null,
                    });
                }
            });
        } catch (authError) {
            console.error("Error fetching auth users:", authError);
        }

        // Combine Firestore users and Auth users
        const allUsers = [...firestoreUsers, ...authUsers];

        // Fetch all packages
        const packagesSnap = await db.collection("packages").get();
        const packages = packagesSnap.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Calculate stats
        const totalRevenue = bookings
            .filter((b: any) => !b.cancelled && b.status !== 'Cancelled')
            .reduce((sum: number, b: any) => sum + (parseFloat(b.amount) || 0), 0);

        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter((b: any) => !b.cancelled && b.status !== 'Cancelled').length;
        const cancelledBookings = bookings.filter((b: any) => b.cancelled || b.status === 'Cancelled').length;

        const approvedAgencies = agencies.filter((a: any) => a.approved === true).length;
        const pendingAgencies = agencies.filter((a: any) => a.approved === false).length;

        const totalUsers = allUsers.length;
        const totalPackages = packages.length;

        return NextResponse.json({
            stats: {
                totalRevenue,
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                approvedAgencies,
                pendingAgencies,
                totalAgencies: agencies.length,
                totalUsers,
                totalPackages,
            },
            bookings,
            agencies,
            users: allUsers,
            packages,
        });
    } catch (err: any) {
        console.error("Admin stats error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
