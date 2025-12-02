"use client"
import { checkUserRole } from "@/app/(auth)/checkUserRole";
import { toastError, toastSuccess } from "@/components/ui/ToastTypes";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Router from "next/router";
// import { useRouter } from "next/navigation";
// import Router from "next/router";

export const handleGoogleLogin = async (router:any) => {
    // const router=useRouter();
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if (!result) return;

    // get ID token
    const token = await result.user.getIdToken(true);

    // fetch role using your existing util
    const checkRole = await checkUserRole();
    const role = checkRole?.role;

    if (role === "customer") {
      localStorage.setItem("token", token);
      toastSuccess("Login Successful");
      return router.push("/customer");
    }

    // If Google user has no role or wrong role
    toastError("Please login as a customer");
    await auth.signOut();
    localStorage.clear();
  } catch (err) {
    console.error(err);
    toastError(`${err}`);
  }
};
