"use client"

import VerificationPending from "@/components/verification-pending"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const router = useRouter();
  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      console.log("user:", user);

      if (!user) {
        router.replace("/agency/login");
        return;
      }

      const agencyRef = doc(db, "agencies", user.uid);

      // Real-time listener
      unsubDoc = onSnapshot(agencyRef, (snap) => {
        const data = snap.data();

        if (!data) {
          // If somehow the document is missing, log out user
          router.replace("/agency/login");
          return;
        }

        if (data.approved === true) {
          router.replace("/agency"); // approved, redirect to dashboard
        } else {
          router.replace("/agency/login"); // not approved, redirect to login
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, [router]);

  if (!mounted) return null;

  return <VerificationPending />
}
