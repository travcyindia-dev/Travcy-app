"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Home, Search, BookOpen, LogOut, MapPin } from "lucide-react"
import type React from "react"
import { Suspense } from "react"
import { useAuthContext } from "@/context/AuthContext"
import Loading from "../loading/page"

export default function UserLayout({
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
            <Link href="/customer" className="flex items-center gap-2 font-bold text-xl text-primary">
              <MapPin className="w-6 h-6" />
              Travelopia
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/customer"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  isActive("/user") && pathname !== "/user/search"
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              {/* <Link
                href="/user/search"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  isActive("/user/search")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Link> */}
              <Link
                href="/customer/bookings"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                  isActive("/user/bookings")
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Bookings</span>
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
