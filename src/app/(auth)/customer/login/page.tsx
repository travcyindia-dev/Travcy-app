"use client"

import Link from "next/link"
import { Chrome } from "lucide-react"
import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { getAuth } from "firebase/auth"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"
import { checkUserRole } from "../../checkUserRole"
import signUp from "@/lib/auth/signup/customer/Signup"
import signIn from "@/lib/auth/signin/SignIn"
import { handleGoogleLogin } from "@/lib/auth/signin/googleLogin"
import { useAuthContext } from "@/context/AuthContext"


console.log("Loaded API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
export default function UserLogin() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSignup, setIsSignup] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthContext()

  // Check if user is already logged in and redirect to dashboard
  React.useEffect(() => {
    const checkExistingAuth = async () => {
      if (user) {
        try {
          const checkRole = await checkUserRole();
          const role = checkRole?.role;
          console.log("Existing user role:", role);
          
          if (role === "customer") {
            router.push('/customer');
            return;
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }
      setIsCheckingAuth(false);
    };
    
    checkExistingAuth();
  }, [user, router]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSignUp = async (event: any) => {
    event.preventDefault()

    const { result, error, alert } = await signUp(email, password);

    if (error) {
      toastError(alert ?? "Something went wrong");
      console.log(error)
      return;
    }

    // else successful
    console.log(result)
    if (result) {
      // getIdToken is a function that returns Promise<string>, so await it
      const token = await result.user.getIdToken();
      const checkRole = await checkUserRole();
      const role = checkRole?.role;
      console.log("role:", role);
      console.log("pathname:", pathname);
      
      if (token && role === "customer") {
        localStorage.setItem('token', token);
        console.log("token:", token);
        toastSuccess("Signup Successful")
        return router.push(`/customer`)
      }
      if (role !== "customer") {
        toastError("Please login as a customer")
        localStorage.clear()
      }
    }
  }

  const handleSignIn = async (event: any) => {
    event.preventDefault()

    const { result, error, alert } = await signIn(email, password);

    if (error) {
      toastError(alert ?? "Something went wrong");
      console.log(error)
    }

    // else successful
    console.log(result);

    if (result) {
      // getIdToken is a function that returns Promise<string>, so await it

      const token = await result.user.getIdToken();
      const checkRole = await checkUserRole();
      const role = checkRole?.role
      console.log("role:", role);
      console.log("pathname:", pathname);
      if (token && role && role === "customer") {
        localStorage.setItem('token', token);
        console.log("token:", token);
        toastSuccess("Login Successful")
        return router.push(`/customer`)
      }
      if (role !== "customer") {
        toastError("Please login as a customer")
        localStorage.clear()
      }

    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          {isSignup ? "Create an Account" : "Welcome Back"}
          <p className="text-muted-foreground">
            {isSignup
              ? "Sign up to start booking"
              : "Login to your account to continue booking"}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-border p-8 space-y-6">
          {/* Email Field */}
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
          <button className="w-full py-3 border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2 font-semibold" onClick={()=>{handleGoogleLogin(router)}}>
            <Chrome className="w-5 h-5" />
            Google
        
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
