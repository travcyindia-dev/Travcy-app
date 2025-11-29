import { app } from "@/lib/firebase";
// import axios from "axios";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { NextResponse } from "next/server";


const auth = getAuth(app);
export default async function signIn(email: any, password: any) {
    let result = null;
    let error:string|null = null;
    let AlertMessage:string|null = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
        // const uid=result.user.uid;
        // 2. Call your server API to assign role
        // await axios.post("/api/assign-role", { uid, role: "customer" });
    }
    catch (e: any) {
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
        error = e;
    }
     console.log("user", result);
    return { result: result, error: error, alert:AlertMessage };
   
   
}