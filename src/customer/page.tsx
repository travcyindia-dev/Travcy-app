"use client"

import { Star } from "lucide-react"
import Link from "next/link"

 

const featuredPackages = [
  {
    id: 1,
    title: "Zanzibar Paradise",
    location: "Europe, Greece",
    rating: 5,
    price: 2550,
    duration: "7 Days",
    guests: 2,
    image: "/zanzibar-tropical-beach-resort.jpg",
  },
  {
    id: 2,
    title: "Greece Explorer",
    location: "Europe, Greece",
    rating: 5,
    price: 2550,
    duration: "7 Days",
    guests: 2,
    image: "/greece-mediterranean-coast.jpg",
  },
  {
    id: 3,
    title: "Island Getaway",
    location: "Europe, Greece",
    rating: 4,
    price: 2100,
    duration: "5 Days",
    guests: 2,
    image: "/island-luxury-resort.jpg",
  },
]

export default function UserDashboard() {
  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">Discover new destinations and book your next adventure</p>
      </section>

      {/* Featured Packages */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Packages</h2>
          <Link href="/user/search" className="text-primary font-semibold hover:opacity-80">
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPackages.map((pkg) => (
            <Link key={pkg.id} href={`/user/package/${pkg.id}`}>
              <div className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition cursor-pointer">
                {/* Image */}
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={pkg.image || "/placeholder.svg"}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.location}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < pkg.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>👥 {pkg.guests}</span>
                      <span>📅 {pkg.duration}</span>
                    </div>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-bold text-primary">${pkg.price}</span>
                    <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
