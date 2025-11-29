"use client"

import Link from "next/link"
import { Star, MapPin, Calendar, Users, Check } from "lucide-react"
import isAuth from "@/components/isAuth"

function PackageDetail({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <Link href="/user/search" className="text-primary text-sm font-semibold hover:opacity-80 mb-4 inline-block">
          ← Back
        </Link>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-8">
            {/* Image */}
            <div className="md:col-span-2">
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img src="/luxurious-zanzibar-resort.jpg" alt="Package" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Luxury Zanzibar Escape</h1>
                <p className="text-muted-foreground mt-1">Paradise Travel Agency</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(128 reviews)</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>7 Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>2-4 guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Zanzibar, Tanzania</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-4xl font-bold text-primary">$3,200</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
                  Book Now
                </button>
                <button className="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition">
                  Contact Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-bold text-lg mb-2">Day {day}</h3>
              <p className="text-muted-foreground">
                {day === 1
                  ? "Arrival at airport, hotel check-in, welcome dinner"
                  : day === 7
                    ? "Checkout and departure"
                    : `Day ${day} activities and sightseeing`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Inclusions */}
      <section>
        <h2 className="text-2xl font-bold mb-6">What's Included</h2>
        <div className="bg-white rounded-xl border border-border p-8">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Accommodation (5 nights)",
              "Daily breakfast",
              "Airport transfers",
              "Guided tours",
              "Travel insurance",
              "Complimentary activities",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>
        <div className="space-y-4">
          {[
            { name: "Sarah M.", rating: 5, text: "Amazing experience! The agent planned everything perfectly." },
            { name: "John D.", rating: 5, text: "Best vacation ever. Highly recommended!" },
            { name: "Emma K.", rating: 4, text: "Great package, very helpful agents." },
          ].map((review, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold">{review.name}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
export default isAuth(PackageDetail)