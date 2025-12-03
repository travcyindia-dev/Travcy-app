"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/context/AuthContext"
import { User, Mail, Phone, MapPin, Camera, Loader2, Save, X } from "lucide-react"
import axios from "axios"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"
import { updateProfile } from "firebase/auth"

interface ProfileData {
  uid: string
  displayName: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  profilePic: string | null
  role: string
  createdAt: string
}

export default function CustomerProfilePage() {
  const { user } = useAuthContext()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Edit form fields
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      try {
        const res = await axios.get(`/api/profile?uid=${user.uid}&type=customer`)
        if (res.data.success && res.data.profile) {
          setProfile(res.data.profile)
          setDisplayName(res.data.profile.displayName || user.displayName || "")
          setPhone(res.data.profile.phone || "")
          setAddress(res.data.profile.address || "")
          setCity(res.data.profile.city || "")
          setProfilePicPreview(res.data.profile.profilePic || user.photoURL || null)
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error)
        // If profile doesn't exist (404), use auth data as defaults
        if (user) {
          setDisplayName(user.displayName || "")
          setProfilePicPreview(user.photoURL || null)
          // Create a minimal profile object from auth data
          setProfile({
            uid: user.uid,
            displayName: user.displayName || "",
            email: user.email || "",
            phone: null,
            address: null,
            city: null,
            profilePic: user.photoURL || null,
            role: "customer",
            createdAt: "",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewProfilePic(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      // Upload new profile pic if provided
      let profilePicUrl = profile?.profilePic || null
      if (newProfilePic) {
        const formData = new FormData()
        formData.append("file", newProfilePic)
        try {
          const uploadRes = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          profilePicUrl = uploadRes.data.url
        } catch (uploadError) {
          console.error("Profile pic upload error:", uploadError)
        }
      }

      // Update Firebase Auth display name
      await updateProfile(user, {
        displayName: displayName,
        photoURL: profilePicUrl || undefined,
      })

      // Update Firestore profile
      await axios.post("/api/profile", {
        uid: user.uid,
        type: "customer",
        displayName,
        phone: phone || null,
        address: address || null,
        city: city || null,
        profilePic: profilePicUrl,
      })

      setProfile(prev => prev ? {
        ...prev,
        displayName,
        phone: phone || null,
        address: address || null,
        city: city || null,
        profilePic: profilePicUrl,
      } : null)

      toastSuccess("Profile updated successfully!")
      setIsEditing(false)
      setNewProfilePic(null)
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toastError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setDisplayName(profile?.displayName || "")
    setPhone(profile?.phone || "")
    setAddress(profile?.address || "")
    setCity(profile?.city || "")
    setProfilePicPreview(profile?.profilePic || null)
    setNewProfilePic(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {profilePicPreview ? (
                <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-slate-400" />
              )}
            </div>
            {isEditing && (
              <label htmlFor="profile-pic-edit" className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-primary/90 transition">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="profile-pic-edit"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            )}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{profile?.displayName || user?.displayName || "User"}</h2>
            <p className="text-muted-foreground">{profile?.email || user?.email}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                {profile?.displayName || user?.displayName || "Not set"}
              </div>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email Address
            </label>
            <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-muted-foreground">
              {profile?.email || user?.email}
              <span className="ml-2 text-xs text-slate-400">(cannot be changed)</span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                {profile?.phone || "Not set"}
              </div>
            )}
          </div>

          {/* City & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                  {profile?.city || "Not set"}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your address"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                  {profile?.address || "Not set"}
                </div>
              )}
            </div>
          </div>

          {/* Member Since */}
          {profile?.createdAt && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric" 
                })}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-6 py-3 border border-border rounded-lg font-semibold hover:bg-slate-50 transition flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
