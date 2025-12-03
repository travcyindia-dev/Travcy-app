"use client"

import Link from "next/link"
import { Chrome, User, Mail, Phone, Camera, Loader2, X } from "lucide-react"
import React, { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"
import { checkUserRole } from "../../checkUserRole"
import signIn from "@/lib/auth/signin/SignIn"
import { handleGoogleLogin } from "@/lib/auth/signin/googleLogin"
import { useAuthContext } from "@/context/AuthContext"
import { auth } from "@/lib/firebase"
import axios from "axios"

export default function UserLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
  // Google login state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleLoadingMessage, setGoogleLoadingMessage] = useState('');
  
  // Signup form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  
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

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!fullName.trim()) {
      toastError("Please enter your full name");
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Update display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      // 3. Upload profile picture if provided
      let profilePicUrl = null;
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        try {
          const uploadRes = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          profilePicUrl = uploadRes.data.url;
        } catch (uploadError) {
          console.error("Profile pic upload error:", uploadError);
        }
      }

      // 4. Save user to Firestore with all details
      await axios.post("/api/assign-role", { 
        uid, 
        role: "customer",
        email: email,
        displayName: fullName,
        phone: phone || null,
        address: address || null,
        city: city || null,
        profilePic: profilePicUrl,
      });

      // 5. Refresh token to include custom claims
      await userCredential.user.getIdToken(true);

      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      
      toastSuccess("Account created successfully!");
      router.push('/customer');
      
    } catch (e: any) {
      let AlertMessage = "Something went wrong";
      switch (e.code) {
        case "auth/email-already-in-use":
          AlertMessage = "This email is already registered.";
          break;
        case "auth/invalid-email":
          AlertMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          AlertMessage = "Password should be at least 6 characters.";
          break;
        default:
          AlertMessage = e.message || "Something went wrong. Please try again.";
      }
      toastError(AlertMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true);

    const { result, error, alert } = await signIn(email, password);

    if (error) {
      toastError(alert ?? "Something went wrong");
      setIsLoading(false);
      return;
    }

    if (result) {
      const token = await result.user.getIdToken();
      const checkRole = await checkUserRole();
      const role = checkRole?.role;
      
      if (token && role === "customer") {
        localStorage.setItem('token', token);
        toastSuccess("Login Successful");
        router.push('/customer');
      } else {
        toastError("Please login as a customer");
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      toastError("Please enter your email address");
      return;
    }

    setIsResetting(true);

    try {
      console.log("Attempting to send password reset email to:", resetEmail);
      
      // Action code settings for password reset
      const actionCodeSettings = {
        url: window.location.origin + '/customer/login',
        handleCodeInApp: false,
      };
      
      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      console.log("Password reset email sent successfully");
      toastSuccess("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      console.error("Password reset error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      switch (error.code) {
        case "auth/user-not-found":
          toastError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          toastError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          toastError("Too many requests. Please try again later.");
          break;
        case "auth/missing-android-pkg-name":
        case "auth/missing-continue-uri":
        case "auth/missing-ios-bundle-id":
        case "auth/invalid-continue-uri":
        case "auth/unauthorized-continue-uri":
          toastError("App configuration error. Please contact support.");
          break;
        default:
          toastError(error.message || "Failed to send reset email. Please try again.");
      }
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{isSignup ? "Create an Account" : "Welcome Back"}</h1>
          <p className="text-muted-foreground">
            {isSignup
              ? "Sign up to start booking your dream trips"
              : "Login to your account to continue booking"}
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={isSignup ? handleSignUp : handleSignIn} className="bg-white rounded-2xl border border-border p-8 space-y-5">
          
          {/* Signup Fields */}
          {isSignup && (
            <>
              {/* Profile Picture */}
              <div className="flex justify-center">
                <label htmlFor="profile-pic" className="cursor-pointer relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                    <Camera className="w-4 h-4" />
                  </div>
                  <input
                    type="file"
                    id="profile-pic"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <p className="text-center text-xs text-slate-500">Add profile picture (optional)</p>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" /> Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Your address"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Remember & Forgot (only for login) */}
          {!isSignup && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border border-border rounded" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setShowForgotPassword(true);
                }}
                className="text-primary hover:opacity-80"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isSignup ? "Creating Account..." : "Logging in..."}
              </>
            ) : (
              isSignup ? "Create Account" : "Login"
            )}
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
          <button 
            type="button"
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={() => handleGoogleLogin(router, {
              setIsGoogleLoading,
              setLoadingMessage: setGoogleLoadingMessage
            })}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {googleLoadingMessage || "Please wait..."}
              </>
            ) : (
              <>
                <Chrome className="w-5 h-5" />
                Google
              </>
            )}
          </button>

          {/* Toggle Signup/Login */}
          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-semibold hover:opacity-80"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </form>
      </div>

      {/* Google Loading Overlay */}
      {isGoogleLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-6 p-8">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 rounded-full mx-auto"></div>
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto animate-spin absolute top-0 left-1/2 -translate-x-1/2"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">{googleLoadingMessage || "Please wait..."}</h3>
              <p className="text-sm text-muted-foreground">Setting up your travel experience</p>
            </div>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForgotPassword(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Reset Password</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className="w-full py-3 text-muted-foreground hover:text-foreground transition font-medium"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
