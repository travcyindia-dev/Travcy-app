"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Globe } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
          <Globe className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Travcy
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Destinations
          </a>
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Services
          </a>
          <a href="#" className="text-sm hover:text-primary transition-colors">
            About
          </a>
          <div className="flex items-center gap-3">
            <Link href="/customer/login">
              <button className="px-4 py-2 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-all">
                Customer Login
              </button>
            </Link>
            <Link href="/agency/login">
              <button className="px-4 py-2 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-all">
                Agent Login
              </button>
            </Link>
            <button className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg">
              Book Now
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border/20 p-4 md:hidden animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Destinations
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                Services
              </a>
              <a href="#" className="text-sm hover:text-primary transition-colors">
                About
              </a>
              <Link href="/login/customer" className="w-full">
                <button className="w-full px-4 py-2 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-all">
                  Customer Login
                </button>
              </Link>
              <Link href="/login/agent" className="w-full">
                <button className="w-full px-4 py-2 rounded-full text-sm font-medium border border-primary text-primary hover:bg-primary/5 transition-all">
                  Agent Login
                </button>
              </Link>
              <button className="w-full px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
