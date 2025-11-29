"use client"

import { SearchIcon, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useState } from "react"
import isAuth from "@/app/components/isAuth"

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

  async function handleSearch() {
    setLoading(true)
    try {
      const res = await axios.get("/api/search", {
        params: { destination, checkIn, duration },
      })
      setResults(res.data)
    } catch (error) {
      console.error("Search failed:", error)
    }
    setLoading(false)
  }

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
        <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <Link key={dest.id} href={`/user/destination/${dest.id}`}>
              <div className="group cursor-pointer">
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
                  <img
                    src={dest.image || "/placeholder.svg"}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>
                <h3 className="font-bold text-lg">{dest.name}</h3>
                <p className="text-sm text-muted-foreground">{dest.country}</p>
                <p className="text-xs text-primary font-semibold mt-1">{dest.packages} packages</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Search Results */}
      {results.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mt-10 mb-4">Search Results</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {results.map((pkg) => (
              <div
                key={pkg.id}
                className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">{pkg.destination}</p>
                <p>{pkg.duration} days</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
export default isAuth(SearchDestinations)