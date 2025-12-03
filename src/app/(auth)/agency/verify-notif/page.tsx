"use client"

import VerificationPending from "@/components/verification-pending"
import { useAgencyAuthContext } from "@/context/AgencyAuthContext"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toastSuccess } from "@/components/ui/ToastTypes"

export default function VerifyNotifPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter();
  const hasRedirected = useRef(false);
  const { user, agencyApproved } = useAgencyAuthContext();

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || hasRedirected.current) return;

    // If no user, redirect to login
    if (user === null) {
      hasRedirected.current = true;
      router.replace("/agency/login");
      return;
    }

    // If approved, redirect to dashboard
    if (agencyApproved === true) {
      hasRedirected.current = true;
      // Force refresh the token to get updated custom claims
      user.getIdToken(true).then(() => {
        toastSuccess("Your agency has been approved! Redirecting to dashboard...");
        setTimeout(() => {
          router.replace("/agency");
        }, 1500);
      });
    }
    // If not approved (false), stay on this page - no action needed
  }, [mounted, user, agencyApproved, router]);

  if (!mounted) return null;

  // Show verification pending UI while waiting for approval
  return <VerificationPending />
}
