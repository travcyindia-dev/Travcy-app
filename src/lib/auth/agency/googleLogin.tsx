"use client"
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toastError, toastSuccess } from "@/components/ui/ToastTypes";

interface GoogleAgencyAuthOptions {
  setIsGoogleLoading?: (loading: boolean) => void;
  setLoadingMessage?: (message: string) => void;
}

export const handleGoogleAgencyAuth = async (
  router: any, 
  mode: "signup" | "login",
  options?: GoogleAgencyAuthOptions
) => {
  const { setIsGoogleLoading, setLoadingMessage } = options || {};
  
  try {
    setIsGoogleLoading?.(true);
    setLoadingMessage?.("Connecting to Google...");
    
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    if (!result) {
      setIsGoogleLoading?.(false);
      return;
    }

    const user = result.user;
    setLoadingMessage?.("Checking account...");
    
    // Check if this user is registered as a customer
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists() && userSnap.data()?.role === "customer") {
      // This Google account is registered as a customer, not an agency
      toastError("This account is registered as a customer. Please use customer login.");
      await auth.signOut();
      localStorage.clear();
      setIsGoogleLoading?.(false);
      return;
    }
    
    const agencyRef = doc(db, "agencies", user.uid);
    const agencySnap = await getDoc(agencyRef);

    // 🟦 SIGNUP MODE (agency registering)
    if (mode === "signup") {
      if (agencySnap.exists()) {
        // Agency already exists
        const agencyData = agencySnap.data();
        if (agencyData.approved) {
          setLoadingMessage?.("Agency found! Logging you in...");
          toastSuccess("Agency already registered. Logging you in...");
          const token = await user.getIdToken(true);
          localStorage.setItem("token", token);
          router.push("/agency");
          return;
        } else {
          setLoadingMessage?.("Redirecting...");
          toastSuccess("Your agency is already registered and pending approval.");
          router.push("/agency/verify-notif");
          return;
        }
      }
      
      setLoadingMessage?.("Registering your agency...");
      
      // Create new agency
      await setDoc(agencyRef, {
        uid: user.uid,
        name: user.displayName || "Unnamed Agency",
        email: user.email,
        logo: user.photoURL || null,
        approved: false,
        createdAt: Date.now(),
      });

      setLoadingMessage?.("Registration complete!");
      toastSuccess("Agency registered successfully. Waiting for admin approval.");
      router.push("/agency/verify-notif");
      return;
    }

    // 🟩 LOGIN MODE (agency already registered)
    if (!agencySnap.exists()) {
      toastError("No agency account found. Please sign up first.");
      await auth.signOut();
      localStorage.clear();
      setIsGoogleLoading?.(false);
      return;
    }

    const agencyData = agencySnap.data();

    if (!agencyData.approved) {
      setLoadingMessage?.("Redirecting...");
      toastSuccess("Your agency is pending approval.");
      router.push("/agency/verify-notif");
      return;
    }

    setLoadingMessage?.("Logging you in...");
    const token = await user.getIdToken(true);
    localStorage.setItem("token", token);

    toastSuccess("Login Successful");
    router.push("/agency");

  } catch (err: any) {
    console.error("Agency Google auth error:", err);
    setIsGoogleLoading?.(false);
    
    if (err.code === "auth/popup-closed-by-user") {
      // User closed the popup, no need to show error
      return;
    }
    
    toastError(err.message || "Something went wrong. Please try again.");
  }
};
