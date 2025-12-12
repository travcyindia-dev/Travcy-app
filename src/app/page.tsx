"use client"

import Benefits from "@/components/landing/benefits"
import CTA from "@/components/landing/cta"
import Destinations from "@/components/landing/destination"
import Footer from "@/components/landing/footer"
import Header from "@/components/landing/header"
import Hero from "@/components/landing/hero"
import { useEffect, useState } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Benefits />
      <Destinations />
      <CTA />
      <Footer />
    </main>
  )
}
