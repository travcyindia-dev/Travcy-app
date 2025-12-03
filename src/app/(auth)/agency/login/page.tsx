"use client"

import Link from "next/link"
import { Chrome, Building2, Mail, Phone, MapPin, Camera, Globe, FileText, Loader2 } from "lucide-react"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth"
import axios from "axios"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"
import signIn from "@/lib/auth/signin/SignIn"
import { handleGoogleAgencyAuth } from "@/lib/auth/agency/googleLogin"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export default function AgencyLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [location, setLocation] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Enhanced signup fields
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [taxId, setTaxId] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  
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
              router.replace("/agency");
              return;
            } else {
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

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!agencyName.trim()) {
      toastError("Please enter your agency name");
      return;
    }
    if (!location.trim()) {
      toastError("Please enter your agency location");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Update display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: agencyName,
      });

      // 3. Upload logo/profile picture if provided
      let logoUrl = null;
      if (profilePic) {
        const formData = new FormData();
        formData.append("file", profilePic);
        try {
          const uploadRes = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          logoUrl = uploadRes.data.url;
        } catch (uploadError) {
          console.error("Logo upload error:", uploadError);
        }
      }

      // 4. Save agency to Firestore with all details
      await axios.post("/api/agencies/add-agencies", {
        email: email,
        name: agencyName,
        password: password,
        location: location,
        uid: uid,
        phone: phone || null,
        website: website || null,
        taxId: taxId || null,
        description: description || null,
        address: address || null,
        logo: logoUrl,
      });

      await userCredential.user.reload();
      
      toastSuccess("Registration submitted! Please wait for admin approval.");
      router.push("/agency/verify-notif");
      
    } catch (e: any) {
      let AlertMessage = "Something went wrong. Please try again.";
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
      toastError(`${alert}`);
      setIsLoading(false);
      return;
    }

    if (result) {
      try {
        const agencyRef = doc(db, "agencies", result.user.uid);
        const agencySnap = await getDoc(agencyRef);
        
        if (!agencySnap.exists()) {
          toastError("No agency account found. Please sign up first.");
          setIsLoading(false);
          return;
        }

        const agencyData = agencySnap.data();
        const token = await result.user.getIdToken();
        localStorage.setItem('token', token);

        if (agencyData.approved === true) {
          toastSuccess("Logged in as agency");
          router.push("/agency");
        } else {
          toastSuccess("Login successful. Your account is pending approval.");
          router.push("/agency/verify-notif");
        }
      } catch (err) {
        console.error("Error checking agency status:", err);
        toastError("Something went wrong. Please try again.");
      }
    }
    setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4 py-8">
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

        {/* Form Card */}
        <form onSubmit={isSignup ? handleSignUp : handleSignIn} className="bg-white rounded-2xl border border-border p-8 space-y-5">
          
          {/* Signup Fields */}
          {isSignup && (
            <>
              {/* Agency Logo */}
              <div className="flex justify-center">
                <label htmlFor="agency-logo" className="cursor-pointer relative group">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                    {profilePicPreview ? (
                      <img src={profilePicPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                    <Camera className="w-4 h-4" />
                  </div>
                  <input
                    type="file"
                    id="agency-logo"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div>
              <p className="text-center text-xs text-slate-500">Upload agency logo (optional)</p>

              {/* Agency Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Agency Name *
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Travel Adventures Inc."
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Phone & Tax ID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Tax ID / GST
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="GST Number"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.yourwebsite.com"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Location & Address */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> City *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Mumbai"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Office Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full address"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">About Your Agency</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about your agency, specializations, years of experience..."
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
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
              placeholder="agency@email.com"
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
              <Link href="#" className="text-primary hover:opacity-80">
                Forgot password?
              </Link>
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
                {isSignup ? "Registering..." : "Logging in..."}
              </>
            ) : (
              isSignup ? "Register Agency" : "Login"
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
            className="w-full py-3 border border-border rounded-lg hover:bg-muted transition flex items-center justify-center gap-2 font-semibold" 
            onClick={() => handleGoogleAgencyAuth(router, isSignup ? "signup" : "login")}
          >
            <Chrome className="w-5 h-5" />
            {!isSignup ? "Login with Google" : "Sign up with Google"}
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
    </div>
  )
}
