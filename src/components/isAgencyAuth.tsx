"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAgencyAuthContext } from "@/context/AgencyAuthContext";
import Loading from "@/app/loading/page";
import { toastError } from "./ui/ToastTypes";

export default function isAgencyAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const { user, agencyApproved } = useAgencyAuthContext();
    //  const {user}=useAuthContext();
       
    
    // Redirect if needed
    useEffect(() => {
      if (user === null && agencyApproved !== null) {
        toastError("You must be logged in to access this page.");
        redirect("/agency/login");
      } else if (agencyApproved === false) {
        toastError("Your agency account is not approved yet.");
        redirect("/agency/verify-notif");
      }
    }, [user, agencyApproved]);

    // Show loading while auth or approval status is being fetched
    if (user === null || agencyApproved === null) {
      return <Loading />;
    }

    // Block access if not approved
    if (agencyApproved === false) toastError("Your agency account is not approved yet.");

    // Render the protected component
    return <Component {...props} />;
  };
}
