"use client"

import { useInView } from "@/hooks/use-in-view"
import { Sparkles } from "lucide-react"

export default function TravelCoach() {
  const { ref, isVisible } = useInView()

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="relative">
              <div className="w-full h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img src="/professional-travel-consultant-woman-smiling.jpg" alt="Travel coach" className="w-full h-full object-cover" />
              </div>

              {/* Decorative circles */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-bounce" />
            </div>
          </div>

          {/* Content */}
          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <p className="text-primary text-sm font-semibold tracking-widest mb-3">TRAVEL EXPERT</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              We help you find your dream destination
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our dedicated travel coaches are here to personalize every aspect of your journey. From flight
              arrangements to local recommendations, we ensure your experience is seamless and unforgettable.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-background/80 backdrop-blur border border-border/50">
                <p className="text-3xl font-bold text-primary mb-1">200+</p>
                <p className="text-sm text-muted-foreground">Expert Coaches</p>
              </div>
              <div className="p-4 rounded-xl bg-background/80 backdrop-blur border border-border/50">
                <p className="text-3xl font-bold text-primary mb-1">450</p>
                <p className="text-sm text-muted-foreground">Destinations</p>
              </div>
              <div className="p-4 rounded-xl bg-background/80 backdrop-blur border border-border/50">
                <p className="text-3xl font-bold text-primary mb-1">10K+</p>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
            </div>

            <button className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2 group">
              <Sparkles className="w-4 h-4" />
              Book Your Travel Coach
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
