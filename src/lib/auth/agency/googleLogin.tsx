"use client"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toastError, toastSuccess } from "@/components/ui/ToastTypes";
import { getDisplayName } from "next/dist/shared/lib/utils";

export const handleGoogleAgencyAuth = async (router: any, mode: "signup" | "login") => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    if (!result) return;

    const user = result.user;
    const agencyRef = doc(db, "agencies", user.uid);
    const agencySnap = await getDoc(agencyRef);

    // 🟦 SIGNUP MODE (agency registering)
    if (mode === "signup") {
      if (!agencySnap.exists()) {
        await setDoc(agencyRef, {
          uid:user.uid,
          name:user.displayName||"Unnamed Agency",
          email: user.email,
          approved: false,
          createdAt: Date.now(),
        });
      }

      toastSuccess("Signed up successfully. Waiting for admin approval.");
      router.push("/agency/verify-notif");
      return;
    }

    // 🟩 LOGIN MODE (agency already registered)
    if (!agencySnap.exists()) {
      toastError("Your agency is not registered in the system. Please sign up first.");
      await auth.signOut();
      return;
    }

    const agencyData = agencySnap.data();

    if (!agencyData.approved) {
      toastError("Your agency registration is still pending approval.");
      await auth.signOut();
      return;
    }

    const token = await user.getIdToken(true);
    localStorage.setItem("token", token);

    toastSuccess("Login Successful");
    router.push("/agency");

  } catch (err) {
    console.error(err);
    toastError(String(err));
  }
};
