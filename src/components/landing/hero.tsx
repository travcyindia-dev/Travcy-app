"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-6">
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest mb-2">EXPLORE THE WORLD</p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
                Your <span className="text-primary">Best Travel Agency</span> a click away
              </h1>
            </div>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Discover extraordinary destinations and create unforgettable memories with curated travel experiences
              designed for modern explorers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/customer/login">
                <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 group">
                  Start Exploring
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="#benefits">
                <button className="px-8 py-4 rounded-full border border-primary/20 text-primary font-semibold hover:bg-primary/5 transition-all">
                  Learn More
                </button>
              </Link>
            </div>

          </div>
        </div>

        {/* Right Gallery */}
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative h-[500px] sm:h-[600px]">
            <div className="absolute inset-0 grid grid-cols-2 gap-4">
              <div className="animate-in fade-in slide-in-from-top-6 duration-1000">
                <img
                  src="/tropical-beach-with-turquoise-water.jpg"
                  alt="Tropical beach"
                  className="w-full h-[280px] object-cover rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
                />
              </div>
              <div className="animate-in fade-in slide-in-from-top-6 duration-1000 animation-delay-200">
                <img
                  src="/mountain-sunset-landscape.jpg"
                  alt="Mountain sunset"
                  className="w-full h-[280px] object-cover rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
                />
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 animation-delay-300">
                <img
                  src="/ancient-temple.png"
                  alt="Temple"
                  className="w-full h-[280px] object-cover rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
                />
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 animation-delay-500">
                <img
                  src="/nighttime-cityscape.png"
                  alt="City night"
                  className="w-full h-[280px] object-cover rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
                />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent/20 rounded-full blur-2xl animate-bounce" />
            <div className="absolute bottom-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
