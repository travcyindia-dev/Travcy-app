"use client"

import { useState, useEffect } from "react"
import { useAgencyAuthContext } from "@/context/AgencyAuthContext"
import { Building2, Mail, Phone, MapPin, Camera, Loader2, Save, X, Globe, FileText } from "lucide-react"
import axios from "axios"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"
import { updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AgencyProfile {
  uid: string
  name: string
  email: string
  phone: string | null
  website: string | null
  taxId: string | null
  description: string | null
  location: string | null
  address: string | null
  logo: string | null
  approved: boolean
  createdAt: string
}

export default function AgencyProfilePage() {
  const { agency, user } = useAgencyAuthContext()
  const [profile, setProfile] = useState<AgencyProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // Edit form fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [taxId, setTaxId] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [newLogo, setNewLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      
      try {
        const res = await axios.get(`/api/profile?uid=${user.uid}&type=agency`)
        if (res.data.success) {
          const profileData = res.data.profile
          setProfile(profileData)
          setName(profileData.name || "")
          setPhone(profileData.phone || "")
          setWebsite(profileData.website || "")
          setTaxId(profileData.taxId || "")
          setDescription(profileData.description || "")
          setLocation(profileData.location || "")
          setAddress(profileData.address || "")
          setLogoPreview(profileData.logo)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        // Use agency context data if API fails
        if (agency) {
          setName(agency.name || "")
          setLocation(agency.location || "")
          setLogoPreview(agency.logo)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, agency])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setIsSaving(true)
    
    try {
      // Upload new logo if provided
      let logoUrl = profile?.logo || null
      if (newLogo) {
        const formData = new FormData()
        formData.append("file", newLogo)
        try {
          const uploadRes = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          logoUrl = uploadRes.data.url
        } catch (uploadError) {
          console.error("Logo upload error:", uploadError)
        }
      }

      // Update Firebase Auth display name
      const currentUser = auth.currentUser
      if (currentUser) {
        await updateProfile(currentUser, {
          displayName: name,
          photoURL: logoUrl || undefined,
        })
      }

      // Update Firestore profile
      await axios.post("/api/profile", {
        uid: user.uid,
        type: "agency",
        name,
        phone: phone || null,
        website: website || null,
        taxId: taxId || null,
        description: description || null,
        location: location || null,
        address: address || null,
        logo: logoUrl,
      })

      setProfile(prev => prev ? {
        ...prev,
        name,
        phone: phone || null,
        website: website || null,
        taxId: taxId || null,
        description: description || null,
        location: location || null,
        address: address || null,
        logo: logoUrl,
      } : null)

      toastSuccess("Profile updated successfully!")
      setIsEditing(false)
      setNewLogo(null)
      
    } catch (error) {
      console.error("Error updating profile:", error)
      toastError("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setName(profile?.name || "")
    setPhone(profile?.phone || "")
    setWebsite(profile?.website || "")
    setTaxId(profile?.taxId || "")
    setDescription(profile?.description || "")
    setLocation(profile?.location || "")
    setAddress(profile?.address || "")
    setLogoPreview(profile?.logo || null)
    setNewLogo(null)
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
        <h1 className="text-3xl font-bold">Agency Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your agency information</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-8">
        {/* Status Badge */}
        <div className="flex justify-end mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            profile?.approved 
              ? "bg-green-100 text-green-700" 
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {profile?.approved ? "Verified Agency" : "Pending Verification"}
          </span>
        </div>

        {/* Agency Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-xl bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Agency Logo" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-16 h-16 text-slate-400" />
              )}
            </div>
            {isEditing && (
              <label htmlFor="logo-edit" className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-primary/90 transition">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="logo-edit"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            )}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">{profile?.name || agency?.name || "Agency"}</h2>
            <p className="text-muted-foreground">{profile?.email || user?.email}</p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Agency Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Agency Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                {profile?.name || agency?.name || "Not set"}
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

          {/* Phone & Tax ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> Phone
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Tax ID / GST
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="GST Number"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                  {profile?.taxId || "Not set"}
                </div>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" /> Website
            </label>
            {isEditing ? (
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://www.yourwebsite.com"
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                {profile?.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {profile.website}
                  </a>
                ) : "Not set"}
              </div>
            )}
          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                  {profile?.location || "Not set"}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Office Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground">
                  {profile?.address || "Not set"}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">About Your Agency</label>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell customers about your agency..."
                rows={4}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50 rounded-lg text-foreground min-h-[100px]">
                {profile?.description || "Not set"}
              </div>
            )}
          </div>

          {/* Member Since */}
          {profile?.createdAt && (
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Registered since {new Date(profile.createdAt).toLocaleDateString("en-US", { 
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
