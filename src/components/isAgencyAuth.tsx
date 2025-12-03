"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAgencyAuthContext } from "@/context/AgencyAuthContext";
import Loading from "@/app/loading/page";
import { toastError } from "./ui/ToastTypes";

export default function isAgencyAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const { user, agencyApproved } = useAgencyAuthContext();
    const router = useRouter();
    const hasRedirected = useRef(false);

    // Redirect if needed
    useEffect(() => {
      if (hasRedirected.current) return;

      // Wait for auth state to be determined
      if (user === undefined) return;

      if (user === null) {
        hasRedirected.current = true;
        toastError("You must be logged in to access this page.");
        router.replace("/agency/login");
        return;
      }

      // Wait for approval status to be determined
      if (agencyApproved === null) return;

      if (agencyApproved === false) {
        hasRedirected.current = true;
        toastError("Your agency account is not approved yet.");
        router.replace("/agency/verify-notif");
        return;
      }
    }, [user, agencyApproved, router]);

    // Show loading while auth or approval status is being fetched
    if (user === null || user === undefined || agencyApproved === null) {
      return <Loading />;
    }

    // Block access if not approved
    if (agencyApproved === false) {
      return <Loading />;
    }

    // Render the protected component
    return <Component {...props} />;
  };
}
