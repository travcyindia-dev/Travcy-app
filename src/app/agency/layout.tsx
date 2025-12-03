"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Home, LogOut, MapPin, Building2 } from "lucide-react"
import type React from "react"
import { Suspense } from "react"
import { useAuthContext } from "@/context/AuthContext"
import Loading from "../loading/page"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {logout}=useAuthContext();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Suspense fallback={<Loading/>}>
        <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/agency" className="flex items-center gap-2 font-bold text-xl text-primary">
              <MapPin className="w-6 h-6" />
              Travelopia
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/agency"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  pathname === "/agency"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/agency/profile"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  isActive("/agency/profile")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button className="px-4 py-2 rounded-lg flex items-center gap-2 text-muted-foreground hover:text-destructive transition" onClick={logout}>
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </Suspense>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
