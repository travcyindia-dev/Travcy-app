"use client"

import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import isAuth from "@/app/components/isAuth"

const packages = [
  {
    id: 1,
    title: "Luxury Zanzibar Escape",
    agent: "Paradise Travel Agency",
    price: 3200,
    duration: "7 Days",
    guests: 2,
    rating: 5,
    reviews: 128,
    image: "/luxury-resort.png",
  },
  {
    id: 2,
    title: "Budget Zanzibar Adventure",
    agent: "Budget Tours Ltd",
    price: 1800,
    duration: "5 Days",
    guests: 2,
    rating: 4,
    reviews: 85,
    image: "/adventure-tour.jpg",
  },
  {
    id: 3,
    title: "Family Zanzibar Holiday",
    agent: "Family Vacations",
    price: 2500,
    duration: "7 Days",
    guests: 4,
    rating: 5,
    reviews: 156,
    image: "/tropical-family-resort.png",
  },
]
function DestinationPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-2">
        <Link href="/user/search" className="text-primary text-sm font-semibold hover:opacity-80">
          ← Back to Search
        </Link>
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <MapPin className="w-8 h-8 text-primary" />
          Zanzibar
        </h1>
        <p className="text-muted-foreground">Africa, Tanzania</p>
      </section>

      {/* Packages List */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Available Packages</h2>
        <div className="space-y-4">
          {packages.map((pkg) => (
            <Link key={pkg.id} href={`/user/package/${pkg.id}`}>
              <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition cursor-pointer">
                <div className="grid md:grid-cols-4 gap-6 items-center">
                  {/* Image */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted md:col-span-1">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.title}
                      className="w-full h-full object-cover hover:scale-110 transition"
                    />
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 space-y-2">
                    <h3 className="text-lg font-bold">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground">by {pkg.agent}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < pkg.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({pkg.reviews} reviews)</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📅 {pkg.duration}</span>
                      <span>👥 {pkg.guests} guests</span>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="md:col-span-1 flex flex-col items-end gap-2">
                    <span className="text-2xl font-bold text-primary">${pkg.price}</span>
                    <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition whitespace-nowrap">
                      View Details
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

export default isAuth(DestinationPage)
