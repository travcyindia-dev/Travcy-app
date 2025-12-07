"use client"

import { useInView } from "@/hooks/use-in-view"
import { Zap, Users, Shield, Truck } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "All You Need",
    description: "Everything from booking to experience planning in one place",
  },
  {
    icon: Users,
    title: "Flexible Booking",
    description: "Easy modifications and flexible cancellation policies",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your transactions are protected with enterprise-grade security",
  },
  {
    icon: Truck,
    title: "24/7 Support",
    description: "Round-the-clock customer support when you need us",
  },
]

export default function Benefits() {
  const { ref, isVisible } = useInView()

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest mb-3">WHY CHOOSE US</p>
          <h2 className="text-4xl md:text-5xl font-bold text-balance">Why book using Travecy</h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-500 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
