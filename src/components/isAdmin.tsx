"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShieldX } from "lucide-react";

// List of admin emails - you can also store this in Firestore or environment variables
const ADMIN_EMAILS = [
  "admin@travelopia.com",
  // Add your admin email here
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
].filter(Boolean);

export default function isAdmin(Component: any) {
  return function IsAdmin(props: any) {
    const { user } = useAuthContext();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAdminAccess = async () => {
        if (!user) {
          router.push("/admin/login");
          return;
        }

        try {
          // Check if user email is in admin list
          const isEmailAdmin = ADMIN_EMAILS.includes(user.email || "");

          // Also check Firestore for admin role
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          const isRoleAdmin = userData?.role === "admin";

          if (isEmailAdmin || isRoleAdmin) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Error checking admin access:", error);
          setIsAuthorized(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkAdminAccess();
    }, [user, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Verifying admin access...</p>
          </div>
        </div>
      );
    }

    if (isAuthorized === false) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldX className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h1>
            <p className="text-slate-600 mb-6">
              You don't have permission to access the admin panel. This area is restricted to authorized administrators only.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/")}
                className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
              >
                Go to Homepage
              </button>
              <button
                onClick={() => router.push("/admin/login")}
                className="w-full px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
              >
                Login as Admin
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-6">
              If you believe this is an error, please contact the system administrator.
            </p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}
