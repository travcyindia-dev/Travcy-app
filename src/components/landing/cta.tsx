"use client"

import { useInView } from "@/hooks/use-in-view"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CTA() {
  const { ref, isVisible } = useInView()

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-12 md:p-16 text-center overflow-hidden transform transition-all duration-1000 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">Reimagining How India Travels</h2>
            <p className="text-xl text-white/90 mb-8 text-balance">
              Join thousands of travelers discovering amazing destinations with Travcy
            </p>

            <Link href="/customer/login">
            <button className="inline-flex cursor-pointer items-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-semibold hover:bg-gray-50 transition-all hover:shadow-lg group">
              Start Your Journey
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
