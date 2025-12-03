"use client"

import { useInView } from "@/hooks/use-in-view"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const destinations = [
  {
    name: "Paradise Beach",
    country: "Bali",
    price: "₹899",
    image: "/bali-tropical-paradise-beach.jpg",
  },
  {
    name: "Mountain Peak",
    country: "Himalayas",
    price: "₹1,299",
    image: "/himalayan-mountain-peak.jpg",
  },
  {
    name: "Cultural Gem",
    country: "Japan",
    price: "₹1,099",
    image: "/japan-temple-culture.jpg",
  },
]

export default function Destinations() {
  const { ref, isVisible } = useInView()
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length)
  }

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest mb-3">TOP DESTINATIONS</p>
            <h2 className="text-4xl md:text-5xl font-bold">Explore top destinations</h2>
          </div>

          {/* Controls */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border/50 hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border/50 hover:border-primary hover:bg-primary/10 transition-all flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid md:grid-cols-3 gap-6 overflow-hidden">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className={`group cursor-pointer transform transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{destination.name}</h3>
                  <p className="text-white/80 text-sm mb-4">{destination.country}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-accent">{destination.price}</span>
                    <button className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
