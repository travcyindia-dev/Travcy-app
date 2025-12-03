"use client"

import { useState, useEffect } from "react"
import { useAgencyAuthContext } from "@/context/AgencyAuthContext"
import { 
    Package, 
    Plus, 
    Search, 
    Filter, 
    TrendingUp, 
    Users, 
    DollarSign, 
    Calendar,
    MapPin,
    Clock,
    Star,
    Eye,
    Edit,
    MoreVertical,
    Loader2,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3
} from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { toastError } from "@/components/ui/ToastTypes"

interface PackageStats {
    totalBookings: number
    confirmedBookings: number
    cancelledBookings: number
    pendingBookings: number
    totalRevenue: number
    totalTravelers: number
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
    itinerary: { day: number; title: string; description: string }[]
    rating: number
    reviewCount: number
    createdAt: string
    isActive?: boolean
    stats: PackageStats
}

export default function PackagesManagementPage() {
    const { user } = useAgencyAuthContext()
    const [packages, setPackages] = useState<TravelPackage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all")
    const [sortBy, setSortBy] = useState<"newest" | "bookings" | "revenue">("newest")

    useEffect(() => {
        const fetchPackages = async () => {
            if (!user) return
            
            try {
                const res = await axios.get(`/api/agency/fetch-packages?agencyId=${user.uid}`)
                if (res.data.success) {
                    setPackages(res.data.packages)
                }
            } catch (error) {
                console.error("Error fetching packages:", error)
                toastError("Failed to load packages")
            } finally {
                setIsLoading(false)
            }
        }

        fetchPackages()
    }, [user])

    // Calculate overall stats
    const overallStats = {
        totalPackages: packages.length,
        activePackages: packages.filter(p => p.isActive !== false).length,
        totalBookings: packages.reduce((sum, p) => sum + p.stats.totalBookings, 0),
        totalRevenue: packages.reduce((sum, p) => sum + p.stats.totalRevenue, 0),
        totalTravelers: packages.reduce((sum, p) => sum + p.stats.totalTravelers, 0),
    }

    // Filter and sort packages
    const filteredPackages = packages
        .filter(pkg => {
            const matchesSearch = 
                pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesFilter = 
                filterStatus === "all" ||
                (filterStatus === "active" && pkg.isActive !== false) ||
                (filterStatus === "inactive" && pkg.isActive === false)
            
            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            } else if (sortBy === "bookings") {
                return b.stats.totalBookings - a.stats.totalBookings
            } else {
                return b.stats.totalRevenue - a.stats.totalRevenue
            }
        })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Package Management</h1>
                    <p className="text-muted-foreground mt-1">Manage and track your travel packages</p>
                </div>
                <Link
                    href="/agency/add-package"
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add New Package
                </Link>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalPackages}</p>
                            <p className="text-xs text-muted-foreground">Total Packages</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.activePackages}</p>
                            <p className="text-xs text-muted-foreground">Active Packages</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalBookings}</p>
                            <p className="text-xs text-muted-foreground">Total Bookings</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{overallStats.totalTravelers}</p>
                            <p className="text-xs text-muted-foreground">Total Travelers</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">₹{overallStats.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Revenue</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border border-border p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search packages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    
                    {/* Filter Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                    >
                        <option value="newest">Newest First</option>
                        <option value="bookings">Most Bookings</option>
                        <option value="revenue">Highest Revenue</option>
                    </select>
                </div>
            </div>

            {/* Packages List */}
            {filteredPackages.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-12 text-center">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No packages found</h3>
                    <p className="text-muted-foreground mb-6">
                        {packages.length === 0 
                            ? "You haven't created any packages yet. Start by adding your first travel package!"
                            : "No packages match your search criteria."}
                    </p>
                    {packages.length === 0 && (
                        <Link
                            href="/agency/add-package"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                        >
                            <Plus className="w-5 h-5" />
                            Create Your First Package
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredPackages.map((pkg) => (
                        <PackageCard key={pkg.id} package={pkg} />
                    ))}
                </div>
            )}
        </div>
    )
}

function PackageCard({ package: pkg }: { package: TravelPackage }) {
    const [showActions, setShowActions] = useState(false)

    const getPerformanceLevel = () => {
        if (pkg.stats.totalBookings >= 10) return { label: "Excellent", color: "text-green-600 bg-green-100" }
        if (pkg.stats.totalBookings >= 5) return { label: "Good", color: "text-blue-600 bg-blue-100" }
        if (pkg.stats.totalBookings >= 1) return { label: "Growing", color: "text-amber-600 bg-amber-100" }
        return { label: "New", color: "text-slate-600 bg-slate-100" }
    }

    const performance = getPerformanceLevel()
    const conversionRate = pkg.stats.totalBookings > 0 
        ? ((pkg.stats.confirmedBookings / pkg.stats.totalBookings) * 100).toFixed(0) 
        : 0

    return (
        <div className={`bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition ${pkg.isActive === false ? 'opacity-60' : ''}`}>
            <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-64 h-48 lg:h-auto relative shrink-0">
                    <img
                        src={pkg.imgUrl || "/placeholder-package.jpg"}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                    />
                    {pkg.isActive === false && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium">
                                Inactive
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        {/* Package Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold">{pkg.title}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${performance.color}`}>
                                    {performance.label}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {pkg.destination}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {pkg.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Max {pkg.maxTravellers}
                                </span>
                                <span className="font-semibold text-foreground">
                                    ₹{pkg.price.toLocaleString()}
                                </span>
                            </div>
                            {pkg.rating > 0 && (
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-medium">{pkg.rating.toFixed(1)}</span>
                                    <span className="text-muted-foreground">({pkg.reviewCount} reviews)</span>
                                </div>
                            )}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 lg:gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary">{pkg.stats.totalBookings}</p>
                                <p className="text-xs text-muted-foreground">Bookings</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{pkg.stats.confirmedBookings}</p>
                                <p className="text-xs text-muted-foreground">Confirmed</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-emerald-600">₹{(pkg.stats.totalRevenue / 1000).toFixed(1)}k</p>
                                <p className="text-xs text-muted-foreground">Revenue</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats Bar */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                <span className="text-muted-foreground">Pending:</span>
                                <span className="font-medium">{pkg.stats.pendingBookings}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <span className="text-muted-foreground">Cancelled:</span>
                                <span className="font-medium">{pkg.stats.cancelledBookings}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Conversion:</span>
                                <span className="font-medium">{conversionRate}%</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Travelers:</span>
                                <span className="font-medium">{pkg.stats.totalTravelers}</span>
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/customer/package/${pkg.packageId}`}
                                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-slate-50 transition flex items-center gap-1.5"
                            >
                                <Eye className="w-4 h-4" />
                                View
                            </Link>
                            <Link
                                href={`/agency/packages/${pkg.packageId}`}
                                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-1.5"
                            >
                                <Edit className="w-4 h-4" />
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
