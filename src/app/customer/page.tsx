"use client"

import { SearchIcon, MapPin, Calendar, ChevronRight, Clock, Star, Heart, ImageIcon } from "lucide-react"
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

function SearchDestinations() {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [duration, setDuration] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { setPackages, packages } = usePackageStore();



  async function handleSearch() {
    setLoading(true);
    try {
      let packagesRef = collection(db, "packages");

      const constraints: any[] = [];
      let q = null;
      if (destination) {
        q = query(packagesRef, where("destination", "==", destination))
      }

      // if (duration) {
      //   // Assuming duration is a string like "3-5", we can parse it
      //   const [min, max] = duration.split("-").map(Number);
      //   if (!isNaN(min) && !isNaN(max)) {
      //     constraints.push(query(q, where("duration", ">=", min), where("duration", "<=", max)));
      //   } else if (duration === "14+") {
      //     constraints.push(query(q, where("duration", ">=", 14)));
      //   }
      // }

      // Combine queries (Firestore allows only a limited number of 'where' clauses)
      // let finalQuery = q;
      // if (constraints.length) finalQuery = constraints; // simplified for one constraint
      if (q) {
        const snap = await getDocs(q);
        const filtered = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setResults(filtered);
      }

    } catch (error) {
      console.error("Search failed:", error);
    }
    setLoading(false);
  }
  // filtering as soon as user types
  useEffect(() => {
    if (destination.length > 1) { // min 2 chars
      const timeout = setTimeout(() => {
        const match = packages.filter((pkg) => pkg.destination.toLowerCase().includes(destination.toLowerCase()));
        setResults(match);
       
      }, 100); // debounce 100ms
      return () => clearTimeout(timeout);
    }
    if(!destination){
      setResults([]);
    }
  }, [destination]);
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
          ...data,
        };
      });

      // console.log('packages:', packagesData);
      // Store in Zustand
      setPackages(packagesData);


      return packagesData;
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      return [];
    }
  }

  useEffect(() => {
    fetchAll();
  }, [packages])
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
            <label className="text-sm font-semibold">Check In</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
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
              <option value="3-5">3-5 days</option>
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
                        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                          {pkg.destination} Adventure
                        </h3>
                      </div>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">Hosted by {pkg.agencyName || "Unknown Agency"}. An immersive experience into the heart of {pkg.destination}.</p>

                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                          <Clock className="w-3.5 h-3.5" /> {pkg.duration} Days
                        </div>
                        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pkg.rating || "N/A"}
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</p>
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-xl text-slate-900">${pkg.price}</span>
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
                        {pkg.destination} Adventure
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">Hosted by {pkg.agencyName || "Unknown Agency"}. An immersive experience into the heart of {pkg.destination}.</p>

                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5" /> {pkg.duration} Days
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {pkg.rating || "N/A"}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</p>
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-xl text-slate-900">${pkg.price}</span>
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