import { admin } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { packageId, agencyId, ...updateData } = body;

        if (!packageId || !agencyId) {
            return NextResponse.json(
                { success: false, error: "Missing packageId or agencyId" },
                { status: 400 }
            );
        }

        // Verify the package belongs to this agency
        const packageDoc = await db.collection("packages").doc(packageId).get();
        
        if (!packageDoc.exists) {
            return NextResponse.json(
                { success: false, error: "Package not found" },
                { status: 404 }
            );
        }

        const packageData = packageDoc.data();
        if (packageData?.agencyId !== agencyId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Update the package
        await db.collection("packages").doc(packageId).update({
            ...updateData,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: "Package updated successfully",
        });
    } catch (error: any) {
        console.error("Error updating package:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete/deactivate a package
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const packageId = searchParams.get("packageId");
        const agencyId = searchParams.get("agencyId");

        if (!packageId || !agencyId) {
            return NextResponse.json(
                { success: false, error: "Missing packageId or agencyId" },
                { status: 400 }
            );
        }

        // Verify the package belongs to this agency
        const packageDoc = await db.collection("packages").doc(packageId).get();
        
        if (!packageDoc.exists) {
            return NextResponse.json(
                { success: false, error: "Package not found" },
                { status: 404 }
            );
        }

        const packageData = packageDoc.data();
        if (packageData?.agencyId !== agencyId) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Soft delete - mark as inactive instead of deleting
        await db.collection("packages").doc(packageId).update({
            isActive: false,
            deactivatedAt: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            message: "Package deactivated successfully",
        });
    } catch (error: any) {
        console.error("Error deleting package:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
