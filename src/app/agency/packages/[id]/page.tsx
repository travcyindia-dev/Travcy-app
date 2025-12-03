"use client"

import { useState, useEffect, use } from "react"
import { useAgencyAuthContext } from "@/context/AgencyAuthContext"
import { useRouter } from "next/navigation"
import { 
    ArrowLeft,
    Save,
    Loader2,
    MapPin,
    Clock,
    Users,
    DollarSign,
    Star,
    Image,
    Plus,
    X,
    Calendar,
    TrendingUp,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    Package
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { toastError, toastSuccess } from "@/components/ui/ToastTypes"

interface PackageStats {
    totalBookings: number
    confirmedBookings: number
    cancelledBookings: number
    pendingBookings: number
    totalRevenue: number
    totalTravelers: number
}

interface ItineraryDay {
    day: number
    title: string
    description: string
}

interface TravelPackage {
    id: string
    packageId: string
    agencyId: string
    title: string
    destination: string
    duration: string
    price: number
    maxTravellers: number
    description: string
    imgUrl: string
    highlights: string[]
    inclusions: string[]
    exclusions: string[]
    itinerary: ItineraryDay[]
    rating: number
    reviewCount: number
    createdAt: string
    isActive?: boolean
    stats: PackageStats
}

interface Booking {
    bookingId: string
    packageId: string
    fullName: string
    email: string
    phoneNumber: string
    startDate: string
    endDate: string
    numberOfTravelers: number
    amount: string
    status: string
    cancelled: boolean
    createdAt: string
}

export default function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: packageId } = use(params)
    const { user } = useAgencyAuthContext()
    const router = useRouter()
    
    const [pkg, setPkg] = useState<TravelPackage | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState<"overview" | "edit" | "bookings">("overview")

    // Edit form fields
    const [title, setTitle] = useState("")
    const [destination, setDestination] = useState("")
    const [duration, setDuration] = useState("")
    const [price, setPrice] = useState("")
    const [maxTravellers, setMaxTravellers] = useState("")
    const [description, setDescription] = useState("")
    const [imgUrl, setImgUrl] = useState("")
    const [highlights, setHighlights] = useState<string[]>([])
    const [inclusions, setInclusions] = useState<string[]>([])
    const [exclusions, setExclusions] = useState<string[]>([])
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
    const [isActive, setIsActive] = useState(true)

    // Temp inputs for dynamic fields
    const [newHighlight, setNewHighlight] = useState("")
    const [newInclusion, setNewInclusion] = useState("")
    const [newExclusion, setNewExclusion] = useState("")

    useEffect(() => {
        const fetchPackageData = async () => {
            if (!user || !packageId) return
            
            try {
                // Fetch all packages and find the one we need
                const res = await axios.get(`/api/agency/fetch-packages?agencyId=${user.uid}`)
                if (res.data.success) {
                    const foundPkg = res.data.packages.find((p: TravelPackage) => p.packageId === packageId)
                    if (foundPkg) {
                        setPkg(foundPkg)
                        // Initialize form fields
                        setTitle(foundPkg.title)
                        setDestination(foundPkg.destination)
                        setDuration(foundPkg.duration)
                        setPrice(foundPkg.price.toString())
                        setMaxTravellers(foundPkg.maxTravellers.toString())
                        setDescription(foundPkg.description)
                        setImgUrl(foundPkg.imgUrl)
                        setHighlights(foundPkg.highlights || [])
                        setInclusions(foundPkg.inclusions || [])
                        setExclusions(foundPkg.exclusions || [])
                        setItinerary(foundPkg.itinerary || [])
                        setIsActive(foundPkg.isActive !== false)
                    } else {
                        toastError("Package not found")
                        router.push("/agency/packages")
                    }
                }

                // Fetch bookings for this package
                const bookingsRes = await axios.get(`/api/agency/fetch-bookings?agencyId=${user.uid}`)
                if (bookingsRes.data.success) {
                    const packageBookings = bookingsRes.data.bookings.filter(
                        (b: Booking) => b.packageId === packageId
                    )
                    setBookings(packageBookings)
                }
            } catch (error) {
                console.error("Error fetching package:", error)
                toastError("Failed to load package details")
            } finally {
                setIsLoading(false)
            }
        }

        fetchPackageData()
    }, [user, packageId, router])

    const handleAddItem = (
        type: "highlight" | "inclusion" | "exclusion",
        value: string,
        setter: React.Dispatch<React.SetStateAction<string[]>>,
        clearInput: () => void
    ) => {
        if (value.trim()) {
            setter(prev => [...prev, value.trim()])
            clearInput()
        }
    }

    const handleRemoveItem = (
        type: "highlight" | "inclusion" | "exclusion",
        index: number,
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter(prev => prev.filter((_, i) => i !== index))
    }

    const handleAddItineraryDay = () => {
        setItinerary(prev => [
            ...prev,
            { day: prev.length + 1, title: "", description: "" }
        ])
    }

    const handleUpdateItinerary = (index: number, field: "title" | "description", value: string) => {
        setItinerary(prev => prev.map((item, i) => 
            i === index ? { ...item, [field]: value } : item
        ))
    }

    const handleRemoveItineraryDay = (index: number) => {
        setItinerary(prev => prev
            .filter((_, i) => i !== index)
            .map((item, i) => ({ ...item, day: i + 1 }))
        )
    }

    const handleSave = async () => {
        if (!user || !pkg) return
        
        setIsSaving(true)
        
        try {
            await axios.post("/api/agency/update-package", {
                packageId: pkg.packageId,
                agencyId: user.uid,
                title,
                destination,
                duration,
                price: parseFloat(price),
                maxTravellers: parseInt(maxTravellers),
                description,
                imgUrl,
                highlights,
                inclusions,
                exclusions,
                itinerary,
                isActive,
            })

            toastSuccess("Package updated successfully!")
            setActiveTab("overview")
            
            // Refresh package data
            const res = await axios.get(`/api/agency/fetch-packages?agencyId=${user.uid}`)
            if (res.data.success) {
                const updatedPkg = res.data.packages.find((p: TravelPackage) => p.packageId === packageId)
                if (updatedPkg) {
                    setPkg(updatedPkg)
                }
            }
        } catch (error) {
            console.error("Error updating package:", error)
            toastError("Failed to update package")
        } finally {
            setIsSaving(false)
        }
    }

    const handleToggleStatus = async () => {
        if (!user || !pkg) return
        
        try {
            await axios.post("/api/agency/update-package", {
                packageId: pkg.packageId,
                agencyId: user.uid,
                isActive: !isActive,
            })

            setIsActive(!isActive)
            setPkg(prev => prev ? { ...prev, isActive: !isActive } : null)
            toastSuccess(isActive ? "Package deactivated" : "Package activated")
        } catch (error) {
            console.error("Error toggling status:", error)
            toastError("Failed to update status")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!pkg) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Package not found</h3>
                <Link href="/agency/packages" className="text-primary hover:underline">
                    Back to packages
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/agency/packages"
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{pkg.title}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{pkg.destination}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                                {isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleToggleStatus}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        isActive 
                            ? "border border-red-200 text-red-600 hover:bg-red-50" 
                            : "border border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                >
                    {isActive ? "Deactivate Package" : "Activate Package"}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-primary">{pkg.stats.totalBookings}</p>
                    <p className="text-xs text-muted-foreground">Total Bookings</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{pkg.stats.confirmedBookings}</p>
                    <p className="text-xs text-muted-foreground">Confirmed</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{pkg.stats.pendingBookings}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">{pkg.stats.cancelledBookings}</p>
                    <p className="text-xs text-muted-foreground">Cancelled</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{pkg.stats.totalTravelers}</p>
                    <p className="text-xs text-muted-foreground">Travelers</p>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">₹{(pkg.stats.totalRevenue / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="flex border-b border-border">
                    {[
                        { id: "overview", label: "Overview", icon: Eye },
                        { id: "edit", label: "Edit Package", icon: Save },
                        { id: "bookings", label: "Bookings", icon: Calendar },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 sm:flex-none px-6 py-4 flex items-center justify-center gap-2 font-medium transition ${
                                activeTab === tab.id
                                    ? "text-primary border-b-2 border-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            {/* Main Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <img
                                        src={pkg.imgUrl || "/placeholder-package.jpg"}
                                        alt={pkg.title}
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                {pkg.duration}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Max Travelers</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                {pkg.maxTravellers}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Price</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                                ₹{pkg.price.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <p className="text-sm text-muted-foreground">Rating</p>
                                            <p className="font-semibold flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                {pkg.rating > 0 ? `${pkg.rating.toFixed(1)} (${pkg.reviewCount})` : "No reviews"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Description</p>
                                        <p className="text-sm">{pkg.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Highlights, Inclusions, Exclusions */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Highlights</h3>
                                    <ul className="space-y-2">
                                        {pkg.highlights?.map((h, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                {h}
                                            </li>
                                        ))}
                                        {(!pkg.highlights || pkg.highlights.length === 0) && (
                                            <p className="text-sm text-muted-foreground">No highlights added</p>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">Inclusions</h3>
                                    <ul className="space-y-2">
                                        {pkg.inclusions?.map((inc, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                                {inc}
                                            </li>
                                        ))}
                                        {(!pkg.inclusions || pkg.inclusions.length === 0) && (
                                            <p className="text-sm text-muted-foreground">No inclusions added</p>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">Exclusions</h3>
                                    <ul className="space-y-2">
                                        {pkg.exclusions?.map((exc, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                {exc}
                                            </li>
                                        ))}
                                        {(!pkg.exclusions || pkg.exclusions.length === 0) && (
                                            <p className="text-sm text-muted-foreground">No exclusions added</p>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* Itinerary */}
                            {pkg.itinerary && pkg.itinerary.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-4">Itinerary</h3>
                                    <div className="space-y-4">
                                        {pkg.itinerary.map((day, i) => (
                                            <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                                                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                                                    {day.day}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{day.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{day.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Edit Tab */}
                    {activeTab === "edit" && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Package Title *</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Destination *</label>
                                    <input
                                        type="text"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Duration *</label>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="e.g., 5 Days / 4 Nights"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Max Travelers *</label>
                                    <input
                                        type="number"
                                        value={maxTravellers}
                                        onChange={(e) => setMaxTravellers(e.target.value)}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Image URL</label>
                                    <input
                                        type="url"
                                        value={imgUrl}
                                        onChange={(e) => setImgUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Description *</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                            </div>

                            {/* Highlights */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Highlights</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newHighlight}
                                        onChange={(e) => setNewHighlight(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddItem("highlight", newHighlight, setHighlights, () => setNewHighlight(""))
                                            }
                                        }}
                                        placeholder="Add a highlight"
                                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem("highlight", newHighlight, setHighlights, () => setNewHighlight(""))}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {highlights.map((h, i) => (
                                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            {h}
                                            <button type="button" onClick={() => handleRemoveItem("highlight", i, setHighlights)}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Inclusions */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Inclusions</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newInclusion}
                                        onChange={(e) => setNewInclusion(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddItem("inclusion", newInclusion, setInclusions, () => setNewInclusion(""))
                                            }
                                        }}
                                        placeholder="Add an inclusion"
                                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem("inclusion", newInclusion, setInclusions, () => setNewInclusion(""))}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {inclusions.map((inc, i) => (
                                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            {inc}
                                            <button type="button" onClick={() => handleRemoveItem("inclusion", i, setInclusions)}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Exclusions */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold">Exclusions</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newExclusion}
                                        onChange={(e) => setNewExclusion(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddItem("exclusion", newExclusion, setExclusions, () => setNewExclusion(""))
                                            }
                                        }}
                                        placeholder="Add an exclusion"
                                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddItem("exclusion", newExclusion, setExclusions, () => setNewExclusion(""))}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {exclusions.map((exc, i) => (
                                        <span key={i} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                            {exc}
                                            <button type="button" onClick={() => handleRemoveItem("exclusion", i, setExclusions)}>
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Itinerary */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold">Day-by-Day Itinerary</label>
                                    <button
                                        type="button"
                                        onClick={handleAddItineraryDay}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Day
                                    </button>
                                </div>
                                {itinerary.map((day, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-primary">Day {day.day}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItineraryDay(i)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={day.title}
                                            onChange={(e) => handleUpdateItinerary(i, "title", e.target.value)}
                                            placeholder="Day title"
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <textarea
                                            value={day.description}
                                            onChange={(e) => handleUpdateItinerary(i, "description", e.target.value)}
                                            placeholder="Day description"
                                            rows={2}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bookings Tab */}
                    {activeTab === "bookings" && (
                        <div>
                            {bookings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                                    <p className="text-muted-foreground">
                                        When customers book this package, they'll appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                                                <th className="text-left py-3 px-4 font-semibold">Travel Date</th>
                                                <th className="text-left py-3 px-4 font-semibold">Travelers</th>
                                                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                                                <th className="text-left py-3 px-4 font-semibold">Status</th>
                                                <th className="text-left py-3 px-4 font-semibold">Booked On</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking) => (
                                                <tr key={booking.bookingId} className="border-b border-border hover:bg-slate-50">
                                                    <td className="py-3 px-4">
                                                        <div>
                                                            <p className="font-medium">{booking.fullName}</p>
                                                            <p className="text-sm text-muted-foreground">{booking.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 px-4">{booking.numberOfTravelers}</td>
                                                    <td className="py-3 px-4 font-semibold">₹{parseFloat(booking.amount).toLocaleString()}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            booking.cancelled 
                                                                ? "bg-red-100 text-red-700"
                                                                : booking.status === "Confirmed"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                            {booking.cancelled ? "Cancelled" : booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-muted-foreground">
                                                        {new Date(booking.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
