import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase";

export default async function signUp(email: string, password: string) {
    let result=null;
    let error:any|null=null;
    let AlertMessage:string|null=null;
    try {
    // 1. Sign up the user with Firebase client SDK
    result = await createUserWithEmailAndPassword(auth, email, password);
    const uid = result.user.uid;

    // 2. Call your server API to assign role and save user to Firestore
    await axios.post("/api/assign-role", { 
      uid, 
      role: "customer",
      email: email,
      displayName: result.user.displayName || null
    });

    // 3. Refresh token to include custom claims
    await result.user.getIdToken(true);

    console.log("Signup complete and role assigned!");
  } catch (e: any) {

        switch (e.code) {
            case "auth/user-not-found":
                AlertMessage = "No account found. Please sign up first.";
                break;

            case "auth/wrong-password":
                AlertMessage = "Incorrect password.";
                break;

            case "auth/email-already-in-use":
                AlertMessage = "This email is already registered.";
                break;

            case "auth/invalid-credential":
                AlertMessage = "Invalid credentials. Please try again.";
                break;

            default:
                AlertMessage = "Something went wrong. Please try again.";
        }
        error = e
    }
    NextResponse.json({ result: result, error: error });
    return { result: result, error: error, alert: AlertMessage }
}
