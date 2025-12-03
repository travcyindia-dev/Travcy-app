"use client"
import { checkUserRole } from "@/app/(auth)/checkUserRole";
import { toastError, toastSuccess } from "@/components/ui/ToastTypes";
import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";

interface GoogleLoginOptions {
  setIsGoogleLoading?: (loading: boolean) => void;
  setLoadingMessage?: (message: string) => void;
}

export const handleGoogleLogin = async (router: any, options?: GoogleLoginOptions) => {
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
    
    // Check if user exists in users collection
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    
    // Check if this user is registered as an agency
    const agencyRef = doc(db, "agencies", user.uid);
    const agencySnap = await getDoc(agencyRef);
    
    if (agencySnap.exists()) {
      // This Google account is registered as an agency, not a customer
      toastError("This account is registered as an agency. Please use agency login.");
      await auth.signOut();
      localStorage.clear();
      setIsGoogleLoading?.(false);
      return;
    }

    // If user doesn't exist, create them as a customer (signup via Google)
    if (!userSnap.exists()) {
      setLoadingMessage?.("Creating your account...");
      
      // Create new customer account
      await axios.post("/api/assign-role", {
        uid: user.uid,
        role: "customer",
        email: user.email,
        displayName: user.displayName || "Google User",
        phone: null,
        address: null,
        city: null,
        profilePic: user.photoURL || null,
      });
      
      setLoadingMessage?.("Setting up your profile...");
      
      // Refresh token to include custom claims
      await user.getIdToken(true);
      
      const token = await user.getIdToken();
      localStorage.setItem("token", token);
      
      setLoadingMessage?.("Welcome! Redirecting...");
      toastSuccess("Account created successfully!");
      return router.push("/customer");
    }

    // User exists - check their role
    const userData = userSnap.data();
    
    if (userData?.role !== "customer") {
      toastError("Please login as a customer");
      await auth.signOut();
      localStorage.clear();
      setIsGoogleLoading?.(false);
      return;
    }

    // User is a customer - login successful
    setLoadingMessage?.("Logging you in...");
    const token = await user.getIdToken(true);
    localStorage.setItem("token", token);
    
    toastSuccess("Login Successful");
    return router.push("/customer");

  } catch (err: any) {
    console.error("Google login error:", err);
    setIsGoogleLoading?.(false);
    
    if (err.code === "auth/popup-closed-by-user") {
      // User closed the popup, no need to show error
      return;
    }
    
    toastError(err.message || "Something went wrong. Please try again.");
  }
};
