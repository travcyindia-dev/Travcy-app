"use client"

import isAuth from "@/app/components/isAuth"
import { Calendar, MapPin, Users, ChevronRight, Book } from "lucide-react"

const bookings = [
  {
    id: 1,
    destination: "Zanzibar Paradise",
    location: "Tanzania",
    startDate: "2025-02-15",
    endDate: "2025-02-22",
    guests: 2,
    status: "confirmed",
    price: 3200,
  },
  {
    id: 2,
    destination: "Greece Adventure",
    location: "Greece",
    startDate: "2024-12-20",
    endDate: "2024-12-27",
    guests: 4,
    status: "completed",
    price: 2800,
  },
]

 function Bookings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage your upcoming and past trips</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button className="px-4 py-2 font-semibold text-primary border-b-2 border-primary">Upcoming (1)</button>
        <button className="px-4 py-2 text-muted-foreground hover:text-foreground">Completed (1)</button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{booking.destination}</h3>
                <div className="flex items-center gap-4 text-muted-foreground text-sm mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {booking.startDate} - {booking.endDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {booking.guests} guests
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${booking.price}</p>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    booking.status === "confirmed" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {booking.status === "confirmed" ? "✓ Confirmed" : "Completed"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition">
                View Details
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                Manage <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default isAuth(Bookings)