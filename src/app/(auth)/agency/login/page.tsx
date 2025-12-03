"use client"

import Link from "next/link"
import { Chrome } from "lucide-react"
import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import { checkUserRole } from "../../checkUserRole"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"
import signIn from "@/lib/auth/signin/SignIn"
import { handleGoogleAgencyAuth } from "@/lib/auth/agency/googleLogin"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function AgencyLogin() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [agencyName, setAgencyName] = React.useState('')
  const [location, setLocation] = React.useState('');
  const [isSignup, setIsSignup] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is already logged in and redirect appropriately
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Check if agency exists and is approved
          const agencyRef = doc(db, "agencies", user.uid);
          const agencySnap = await getDoc(agencyRef);
          
          if (agencySnap.exists()) {
            const agencyData = agencySnap.data();
            if (agencyData.approved === true) {
              // Already approved, redirect to dashboard
              router.replace("/agency");
              return;
            } else {
              // Not approved yet, redirect to verification page
              router.replace("/agency/verify-notif");
              return;
            }
          }
        } catch (error) {
          console.error("Error checking agency status:", error);
        }
      }
      setIsCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignUp = async (event: any) => {
    event.preventDefault()
    let AlertMessage = '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const response = await axios.post("/api/agencies/add-agencies", {

        email: email,
        name: agencyName,
        password: password,
        location: location,
        uid: userCredential.user.uid
      })
      console.log("response:", response.data);
       await userCredential.user.reload();

      onAuthStateChanged(auth, (user) => {
   if (user) router.push("/agency/verify-notif")
})
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
          AlertMessage = "This email is already sent for verification";
          break;

        case "auth/invalid-credential":
          AlertMessage = "Invalid credentials. Please try again.";
          break;

        default:
          AlertMessage = "Something went wrong. Please try again.";

      }
      if(e){toastError(AlertMessage);}

    }
  
  }




  const handleSignIn = async (event: any) => {
    event.preventDefault()

    const { result, error, alert } = await signIn(email, password);

    if (error) {
      console.log("alert:", alert)
      toastError(`${alert}`);
      return console.log(error)
    }

    // else successful
    console.log(result);

    if (result) {
      try {
        // Check if agency exists in Firestore and its approval status
        const agencyRef = doc(db, "agencies", result.user.uid);
        const agencySnap = await getDoc(agencyRef);
        
        if (!agencySnap.exists()) {
          toastError("No agency account found. Please sign up first.");
          return;
        }

        const agencyData = agencySnap.data();
        const token = await result.user.getIdToken();
        localStorage.setItem('token', token);

        if (agencyData.approved === true) {
          // Agency is approved, redirect to dashboard
          toastSuccess("Logged in as agency");
          return router.push("/agency");
        } else {
          // Agency is not approved yet, redirect to verification page
          toastSuccess("Login successful. Your account is pending approval.");
          return router.push("/agency/verify-notif");
        }
      } catch (err) {
        console.error("Error checking agency status:", err);
        toastError("Something went wrong. Please try again.");
      }
    }
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{isSignup ? "Register Your Agency" : "Agency Login"}</h1>
          <p className="text-muted-foreground">
            {isSignup
              ? "Sign up to list your travel packages"
              : "Login to manage your agency dashboard"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-border p-8 space-y-6">
          {/* Email Field */}
          {isSignup &&
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Name</label>
                <input
                  type="text"
                  placeholder=""
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </>
          }
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Password Field */}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {isSignup &&
            <>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Location</label>
                <input
                  type="text"
                  placeholder=""
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>


            </>


          }
          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 border border-border rounded" />
              <span>Remember me</span>
            </label>
            <Link href="#" className="text-primary hover:opacity-80">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={isSignup ? handleSignUp : handleSignIn}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
            {isSignup ? "Sign Up" : "Login"}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button className="w-full py-3 border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2 font-semibold" onClick={()=>{handleGoogleAgencyAuth(router, isSignup ? "signup" : "login")}}>
            <Chrome className="w-5 h-5" />
            {!isSignup?"Login with Google":"Sign up with Google"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-semibold hover:opacity-80"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
