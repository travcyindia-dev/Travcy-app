"use client"

import { SearchIcon, MapPin, Calendar, ChevronRight, Clock, Star, Heart, ImageIcon, Building2, Users2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useState, useEffect } from "react"
import isAuth from "@/components/isAuth"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Badge, Button, Card } from "@/components/ui/Shared"
import { usePackageStore } from "@/store/packageStore"
import Image from "next/image"
import { useBookingStore } from "@/store/bookingStore"

const destinations = [
  { id: 1, name: "Zanzibar", country: "Tanzania", image: "/zanzibar-beach.jpg", packages: 24 },
  { id: 2, name: "Santorini", country: "Greece", image: "/santorini-greece-whitewashed.jpg", packages: 18 },
  { id: 3, name: "Bali", country: "Indonesia", image: "/bali-tropical-rice-terrace.jpg", packages: 32 },
  { id: 4, name: "Paris", country: "France", image: "/paris-eiffel-tower.png", packages: 21 },
]

type PackageDoc = {
  destination?: string;
  title?: string;
  duration?: number;
  maxTravellers?: number;
  price?: number;
  imgUrl?: string;
};

function SearchDestinations() {
  const [destination, setDestination] = useState("")
  const [noOfTravellers, setNoOfTravellers] = useState<number>(0)
  const [duration, setDuration] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { setPackages, packages } = usePackageStore();

  function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebounced(value);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  }

  const debouncedDestination = useDebounce(destination, 300);
  const debouncedTravellers = useDebounce(noOfTravellers, 300);
  const debouncedDuration = useDebounce(duration, 300);

  // console.log("packages from store:", packages);
  async function handleSearch() {
    setLoading(true);

    try {
      const packagesRef = collection(db, "packages");
      let baseDocs: PackageDoc[] = [];

      if (destination.trim() !== "") {
        const char = destination[0];
        const upper = char.toUpperCase();
        const lower = char.toLowerCase();

        const q1 = query(
          packagesRef,
          where("destination", ">=", upper),
          where("destination", "<=", upper + "\uf8ff"),
          limit(50)
        );
        const q2 = query(
          packagesRef,
          where("destination", ">=", lower),
          where("destination", "<=", lower + "\uf8ff"),
          limit(50)
        );

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const merged = [...snap1.docs, ...snap2.docs];

        baseDocs = merged.map(doc => ({ id: doc.id, ...(doc.data() as PackageDoc) }));

        // Filter exact prefix in-memory
        const lowerDest = destination.toLowerCase();
        baseDocs = baseDocs.filter(pkg =>
          pkg.destination?.toLowerCase().startsWith(lowerDest)
        );
      } else {
        const snap = await getDocs(query(packagesRef, limit(100)));
        baseDocs = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as PackageDoc) }));
      }

      // Filter by travellers
      if (noOfTravellers > 0) {
        baseDocs = baseDocs.filter(pkg => (pkg.maxTravellers ?? 0) >= noOfTravellers);
      }

      // Filter by duration
      if (duration) {
        if (duration.includes("-")) {
          const [min, max] = duration.split("-").map(Number);
          baseDocs = baseDocs.filter(pkg => pkg.duration! >= min && pkg.duration! <= max);
        } else if (duration === "14+") {
          baseDocs = baseDocs.filter(pkg => pkg.duration! >= 14);
        }
      }

      setResults(baseDocs);
      console.log("Search results:", baseDocs);
    } catch (error) {
      console.error("Search failed:", error);
    }

    setLoading(false);
  }



  
useEffect(() => {
  async function runSearch() {
    setLoading(true);
    try {
      const packagesRef = collection(db, "packages");
      let baseDocs: PackageDoc[] = [];

      if (debouncedDestination.trim() !== "") {
        const char = debouncedDestination[0];
        const upper = char.toUpperCase();
        const lower = char.toLowerCase();

        const q1 = query(
          packagesRef,
          where("destination", ">=", upper),
          where("destination", "<=", upper + "\uf8ff"),
          limit(50)
        );
        const q2 = query(
          packagesRef,
          where("destination", ">=", lower),
          where("destination", "<=", lower + "\uf8ff"),
          limit(50)
        );

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const merged = [...snap1.docs, ...snap2.docs];

        baseDocs = merged.map(doc => ({ id: doc.id, ...(doc.data() as PackageDoc) }));

        // Filter exact prefix in-memory
        const lowerDest = debouncedDestination.toLowerCase();
        baseDocs = baseDocs.filter(pkg =>
          pkg.destination?.toLowerCase().startsWith(lowerDest)
        );
      } else {
        const snap = await getDocs(query(packagesRef, limit(100)));
        baseDocs = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as PackageDoc) }));
      }

      // Filter by travellers
      if (debouncedTravellers > 0) {
        baseDocs = baseDocs.filter(pkg => (pkg.maxTravellers ?? 0) >= debouncedTravellers);
      }

      // Filter by duration
      if (debouncedDuration) {
        if (debouncedDuration.includes("-")) {
          const [min, max] = debouncedDuration.split("-").map(Number);
          baseDocs = baseDocs.filter(pkg => pkg.duration! >= min && pkg.duration! <= max);
        } else if (debouncedDuration === "14+") {
          baseDocs = baseDocs.filter(pkg => pkg.duration! >= 14);
        }
      }

      setResults(baseDocs);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  }

  runSearch();
}, [debouncedDestination, debouncedTravellers, debouncedDuration]);

  console.log("destination:", debouncedDestination);
  // console.log("packages:",packages);
  // console.log("bookings:",useBookingStore.getState().bookings);
  async function fetchAll() {
    try {
      const packagesSnap = await getDocs(collection(db, "packages"));
      const packagesData = packagesSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          destination: data.destination || "",
          duration: data.duration || 0,
          price: data.price || 0,
          maxTravellers: data.maxTravellers || 0,
          agencyName: data.agencyName || "",
          agencyId: data.agencyId || "",
          description: data.description || "",
          ...data,
        };
      });

      // Fetch agency names for packages that don't have them
      const packagesWithAgency = await Promise.all(
        packagesData.map(async (pkg) => {
          if (!pkg.agencyName && pkg.agencyId) {
            try {
              const agencySnap = await getDocs(
                query(collection(db, "agencies"), where("uid", "==", pkg.agencyId))
              );
              if (!agencySnap.empty) {
                const agencyData = agencySnap.docs[0].data();
                return {
                  ...pkg,
                  agencyName: agencyData.agencyName || agencyData.name || "Travel Agency",
                };
              }
            } catch (e) {
              console.error("Error fetching agency:", e);
            }
          }
          return pkg;
        })
      );

      // Store in Zustand
      setPackages(packagesWithAgency);

      return packagesWithAgency;
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      return [];
    }
  }

  useEffect(() => {
    fetchAll();
  }, [])
  // console.log("packages:",packages);
  //  console.log("packages", Packages);
  // Toggle Wishlist
  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  return (
    <div className="space-y-8">
      {/* Search Header */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold">Find Your Destination</h1>
        <p className="text-muted-foreground text-lg">Search from thousands of verified travel packages</p>
      </section>

      {/* Search Form */}
      <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-4">

          {/* Destination */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">No of Travellers</label>
            <div className="relative">
              <Users2 className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={noOfTravellers}
                onChange={(e) => setNoOfTravellers(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Any duration</option>
              <option value="2-5">2-5 days</option>
              <option value="5-7">5-7 days</option>
              <option value="7-14">7-14 days</option>
              <option value="14+">14+ days</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <SearchIcon className="w-5 h-5" />
          {loading ? "Searching..." : "Search Packages"}
        </button>
      </div>

      {/* Popular Destinations */}
      <section>
        {!results.length &&
          <>
            <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <Link key={pkg.id} href={`/customer/destination/${pkg.id}`}>
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2 group cursor-pointer border-slate-100 rounded-2xl bg-white flex flex-col h-full">
                    <div className="h-56 bg-slate-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                        {pkg.imgUrl ? <img src={pkg.imgUrl} alt={pkg.destination || "Package image"} className=" w-full h-full" /> : <ImageIcon className="w-12 h-12" />}
                      </div>

                      <div className="absolute top-4 left-4 z-20">
                        <Badge variant="default" className="bg-white/95 text-slate-900 backdrop-blur-md shadow-sm font-bold px-3 py-1">
                          {pkg.destination}
                        </Badge>
                      </div>
                      {/* <button
                    // onClick={(e) => toggleWishlist(e, pkg.id)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-colors group/heart"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(pkg.id) ? 'fill-red-500 text-red-500' : 'text-white group-hover/heart:text-red-500'}`} />
                  </button> */}
                      {/* Wishlist button and other logic can be added here if needed */}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold leading-tight group-hover:text-blue-600 transition-colors flex justify-center items-center gap-3">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center ">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <h1 className="text-lg text-slate-900 font-bold leading-tight group-hover:text-blue-600 transition-colors ">{pkg.agencyName || "Travel Agency"}</h1>
                        </h3>
                      </div>

                      {/* Agency Info */}
                      <div className="flex items-center gap-2 mb-3">
                        {pkg.title || `${pkg.destination} Adventure`}
                      </div>

                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{pkg.description || `An immersive experience into the heart of ${pkg.destination}.`}</p>

                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                          <Clock className="w-3.5 h-3.5" /> {pkg.duration} Days
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {pkg.rating ? `${Number(pkg.rating).toFixed(1)} (${pkg.reviewCount || 0})` : "New"}
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</p>
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-xl text-slate-900">₹{pkg.price}</span>
                            <span className="text-xs text-slate-400">/person</span>
                          </div>
                        </div>
                        <Button className="rounded-xl px-4 bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-none h-10">
                          View <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        }
      </section>

      {/* Search Results */}
      {results.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mt-10 mb-4">Search Results</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {results.map((pkg) => (
              <Link key={pkg.id} href={`/customer/destination/${pkg.id}`}>
                <Card key={pkg.id} className="overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2 group cursor-pointer border-slate-100 rounded-2xl bg-white flex flex-col h-full">
                  <div className="h-56 bg-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                      {pkg.imgUrl ? <img src={pkg.imgUrl} alt={pkg.destination || "Package image"} className=" w-full h-full" /> : <ImageIcon className="w-12 h-12" />}
                    </div>

                    <div className="absolute top-4 left-4 z-20">
                      <Badge variant="default" className="bg-white/95 text-slate-900 backdrop-blur-md shadow-sm font-bold px-3 py-1">
                        {pkg.destination}
                      </Badge>
                    </div>
                    {/* <button
                    // onClick={(e) => toggleWishlist(e, pkg.id)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-colors group/heart"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(pkg.id) ? 'fill-red-500 text-red-500' : 'text-white group-hover/heart:text-red-500'}`} />
                  </button> */}
                    {/* Wishlist button and other logic can be added here if needed */}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {pkg.title || `${pkg.destination} Adventure`}
                      </h3>
                    </div>

                    {/* Agency Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm text-slate-600 font-medium">{pkg.agencyName || "Travel Agency"}</span>
                    </div>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{pkg.description || `An immersive experience into the heart of ${pkg.destination}.`}</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5" /> {pkg.duration} Days
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {pkg.rating ? `${Number(pkg.rating).toFixed(1)} (${pkg.reviewCount || 0})` : "New"}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-xl text-slate-900">₹{pkg.price}</span>
                          <span className="text-xs text-slate-400">/person</span>
                        </div>
                      </div>
                      <Button className="rounded-xl px-4 bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-none h-10">
                        View <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
export default isAuth(SearchDestinations)