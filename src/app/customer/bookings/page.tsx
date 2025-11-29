"use client"

import isAuth from "@/components/isAuth"
import { useAuthContext } from "@/context/AuthContext"
import { useBookingStore } from "@/store/bookingStore"
import { usePackageStore } from "@/store/packageStore"
import axios from "axios"
import { Calendar, MapPin, Users, ChevronRight, Book } from "lucide-react"
import { useEffect } from "react"



function Bookings() {
  const { user } = useAuthContext();
  const { setBookings, bookings, setHasFetchedOnce, hasFetchedOnce } = useBookingStore();
  const { packages } = usePackageStore();
  console.log("bookings:",bookings);

  async function fetchBookings() {
    const res = await axios.get(`/api/bookings/fetch-booking/${user?.uid}`);
    const data =  res.data.bookings;
    console.log("data for fetch booking:",data);
    setBookings(data);
    console.log("data:",data);
  }
  useEffect(() => {
    // if (!user || hasFetchedOnce) return;

    const run = async () => {
      console.log("running fetchBooking")
      await fetchBookings();
      setHasFetchedOnce(true);
    };
    console.log("hasFetchedOnce:",hasFetchedOnce);
    run();
  }, [user]);


  console.log("package:",packages);
  console.log("bookings:",bookings);
  console.log("hasFetchedOnce:",hasFetchedOnce);
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
        {bookings.map((booking) => {
          // ⭐ get package info here
          const pkg = packages.find((p) => p.id === booking.packageId);
          console.log("pkg:",pkg)
          return (
            <div key={booking.bookingId} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{pkg?.title}</h3>

                  <div className="flex items-center gap-4 text-muted-foreground text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pkg?.destination}
                    </div>

                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {booking.startDate}-{booking.endDate}
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {pkg?.maxTravellers} guests
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{booking?.amount}</p>
                  <p className={`text-sm font-semibold mt-1 ${booking.status === "CONFIRMED" ? "text-green-600" : "text-muted-foreground"}`}>
                    {booking.status === "CONFIRMED" ? "✓ Confirmed" : "Completed"}
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
          );
        })}
      </div>
    </div>
  )
}

export default isAuth(Bookings)