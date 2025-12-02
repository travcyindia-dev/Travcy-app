"use client"

import { useInView } from "@/hooks/use-in-view"
import { MapPin, Plane, CreditCard } from "lucide-react"

const services = [
  {
    icon: MapPin,
    title: "Expert Planning",
    description: "Curated itineraries tailored to your interests and budget",
  },
  {
    icon: Plane,
    title: "Flight & Hotels",
    description: "Best deals on accommodations and transportation worldwide",
  },
  {
    icon: CreditCard,
    title: "Easy Payment",
    description: "Flexible payment options with secure transactions",
  },
]

export default function Services() {
  const { ref, isVisible } = useInView()

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-primary text-sm font-semibold tracking-widest mb-3">OUR SERVICES</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-12">We offer best services</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className={`group p-8 rounded-2xl bg-gradient-to-br from-background to-card border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-500 transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
