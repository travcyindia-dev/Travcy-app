"use client"

import Link from "next/link"
import { Star, MapPin, ImageIcon, Check, ShieldCheck, X } from "lucide-react"
import isAuth from "@/components/isAuth"
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { use, useEffect, useMemo, useState } from "react";
import { usePackageStore } from "@/store/packageStore";
import { Button } from "@/components/ui/Shared";
import { Agency } from "@/types";
import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import Razorpay from "razorpay";
import { useBookingStore } from "@/store/bookingStore";
import Router from "next/router";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface PackageData {
  id?: string;
  packageId?: string;
  title?: string;
  destination?: string;
  duration?: string;
  price?: string;
  maxTravellers?: string;
  description?: string;
  imgUrl?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: ItineraryDay[];
  rating?: number;
  reviewCount?: number;
  agencyId?: string;
  name?: string;
}

// Fallback data for packages that don't have all fields yet
const getDefaultDetails = () => ({
  inclusions: ['Accommodation', 'Daily Breakfast', 'Airport Transfers', 'English Speaking Guide', 'All Entry Fees'],
  itinerary: [
    { day: 1, title: 'Arrival & Welcome', description: 'Transfer to hotel, welcome drink, and evening leisure walk.' },
    { day: 2, title: 'City Tour', description: 'Visit historical landmarks, museums, and local markets.' },
    { day: 3, title: 'Adventure Day', description: 'Hiking, water sports, or desert safari depending on location.' },
    { day: 4, title: 'Cultural Immersion', description: 'Cooking class, traditional dance show, and village visit.' },
    { day: 5, title: 'Departure', description: 'Breakfast and transfer to airport with souvenirs.' },
  ],
  reviews: [
    { user: 'Sarah M.', rating: 5, comment: 'Absolutely wonderful experience! Highly recommended.' },
    { user: 'John D.', rating: 4, comment: 'Great guide, but the hotel was a bit far from the center.' }
  ]
});


function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuthContext();
  const Packages = usePackageStore((state) => state.packages);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
  const [pkg, setpkg] = useState<PackageData | undefined>(undefined);
  const [rzr_payment_id, set_rzr_pyment_id] = useState("");
  const [rzr_order_id, set_rzr_order_id] = useState("");
  const [order_id, set_order_id] = useState("");
  const [rzr_pay_signature, set_rzr_pay_signature] = useState("");
  const { setBookings, addBooking } = useBookingStore();
  const defaultDetails = getDefaultDetails();

  async function getPackageById() {
    const docRef = doc(db, "packages", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const res = docSnap.data();
      return res;
    } else {
      console.log("No such document!");
      return undefined;
    }
  }

  useEffect(() => {
    const p = Packages.find((p) => p.id === id);
    if (p) {
      setpkg(p);
      console.log("pkg from zustand:", p);
    } else {
      getPackageById().then((res) => {
        if (res) setpkg(res as any);
      });
    }
  }, [Packages, id]);

  // Get package details - use real data if available, fallback to defaults
  const inclusions = pkg?.inclusions?.length ? pkg.inclusions : defaultDetails.inclusions;
  const exclusions = pkg?.exclusions || [];
  const highlights = pkg?.highlights || [];
  const itinerary = pkg?.itinerary?.length ? pkg.itinerary : defaultDetails.itinerary;
  const reviews = defaultDetails.reviews; // Reviews would come from a separate collection in a real app

  return (
    <div className="">
      {/* Header */}
      <section className="">
        <Link href="/customer" className="text-primary text-sm font-semibold hover:opacity-80">
          ← Back to Search
        </Link>
      </section>

      {/* Package Details */}
      <section>
        <div className="w-full flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">

            {/* Left: Image Gallery & Summary */}
            <div className="md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
              <div className="h-48 md:h-64 bg-slate-200 relative overflow-hidden">
                {pkg?.imgUrl ? (
                  <img src={pkg.imgUrl} alt={pkg?.title || 'Package'} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-16 h-16 opacity-30" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  {pkg?.duration || '5'} Days / {Math.max(0, parseInt(pkg?.duration || '5') - 1)} Nights
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900">{pkg?.title || `${pkg?.destination} Explorer`}</h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span>{pkg?.destination}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <span className="font-medium text-blue-600">{pkg?.name || "Verified Agency"}</span>
                  <span>•</span>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {pkg?.rating || 'New'}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Base Price</span>
                    <span className="text-xl font-bold text-slate-900">₹{pkg?.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Max Travelers</span>
                    <span className="text-sm font-medium">Up to {pkg?.maxTravellers || '15'}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <Link href={`/customer/destination/${id}/book-now`}>
                    <Button className="w-full h-12 text-lg shadow-blue-200 shadow-lg">Book Now</Button>
                  </Link>
                  <p className="text-center text-xs text-slate-400 mt-3">Free cancellation up to 48 hours before.</p>
                </div>
              </div>
            </div>

            {/* Right: Detailed Content */}
            <div className="md:w-2/3 flex flex-col h-full bg-white">
              {/* Header & Tabs */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex space-x-6">
                  {['Overview', 'Itinerary', 'Reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase() as any)}
                      className={`text-sm font-medium pb-4 border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">

                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div>
                      <h3 className="font-bold text-lg mb-2">About this trip</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{pkg?.description || 'No description available.'}</p>
                    </div>

                    {highlights.length > 0 && (
                      <div>
                        <h3 className="font-bold text-lg mb-3">Highlights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {highlights.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                              <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                <Star className="w-3 h-3" />
                              </div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-lg mb-3">What's Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {inclusions.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {exclusions.length > 0 && (
                      <div>
                        <h3 className="font-bold text-lg mb-3">What's Not Included</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {exclusions.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                              <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                <X className="w-3 h-3" />
                              </div>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                      <div className="p-2 bg-white rounded-lg h-fit text-blue-600"><ShieldCheck className="w-6 h-6" /></div>
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm">Verified Agency</h4>
                        <p className="text-xs text-blue-700 mt-1">This trip is hosted by a verified partner with a 95% trust score.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                      {itinerary.map((day) => (
                        <div key={day.day} className="relative pl-8">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white"></div>
                          <h4 className="font-bold text-slate-900 text-sm">Day {day.day}: {day.title}</h4>
                          <p className="text-slate-600 text-sm mt-1">{day.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    {pkg?.reviewCount === 0 || !pkg?.reviewCount ? (
                      <div className="text-center py-12 text-slate-500">
                        <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No reviews yet. Be the first to review this package!</p>
                      </div>
                    ) : (
                      reviews.map((review, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-900 text-sm">{review.user}</span>
                            <div className="flex text-amber-500">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs ml-1 text-slate-600">{review.rating}.0</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default isAuth(DestinationPage)
