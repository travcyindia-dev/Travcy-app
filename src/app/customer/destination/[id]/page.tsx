"use client"

import Link from "next/link"
import { Star, MapPin, ImageIcon, Check, ShieldCheck } from "lucide-react"
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

// const packages = [
//   {
//     id: 1,
//     title: "Luxury Zanzibar Escape",
//     agent: "Paradise Travel Agency",
//     price: 3200,
//     duration: "7 Days",
//     guests: 2,
//     rating: 5,
//     reviews: 128,
//     image: "/luxury-resort.png",
//   },
//   {
//     id: 2,
//     title: "Budget Zanzibar Adventure",
//     agent: "Budget Tours Ltd",
//     price: 1800,
//     duration: "5 Days",
//     guests: 2,
//     rating: 4,
//     reviews: 85,
//     image: "/adventure-tour.jpg",
//   },
//   {
//     id: 3,
//     title: "Family Zanzibar Holiday",
//     agent: "Family Vacations",
//     price: 2500,
//     duration: "7 Days",
//     guests: 4,
//     rating: 5,
//     reviews: 156,
//     image: "/tropical-family-resort.png",
//   },
// ]


const getPackageDetails = () => ({
  images: [1, 2, 3], // Placeholders
  description: `Experience the magic of  with our premium tour package. This comprehensive 5-day journey covers all major attractions, hidden gems, and authentic culinary experiences. Perfect for families and couples alike.`,
  inclusions: ['4 Star Accommodation', 'Daily Breakfast & Dinner', 'Airport Transfers', 'English Speaking Guide', 'All Entry Fees'],
  itinerary: [
    { day: 1, title: 'Arrival & Welcome', desc: 'Transfer to hotel, welcome drink, and evening leisure walk.' },
    { day: 2, title: 'City Tour', desc: 'Visit historical landmarks, museums, and local markets.' },
    { day: 3, title: 'Adventure Day', desc: 'Hiking, water sports, or desert safari depending on location.' },
    { day: 4, title: 'Cultural Immersion', desc: 'Cooking class, traditional dance show, and village visit.' },
    { day: 5, title: 'Departure', desc: 'Breakfast and transfer to airport with souvenirs.' },
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
  const [pkg, setpkg] = useState<any>(undefined);
  const [rzr_payment_id, set_rzr_pyment_id] = useState("");
  const [rzr_order_id, set_rzr_order_id] = useState("");
  const [order_id, set_order_id] = useState("");
  const [rzr_pay_signature, set_rzr_pay_signature] = useState("");
  const { setBookings, addBooking } = useBookingStore();
  const details = getPackageDetails();
  async function getPackageById() {
    const docRef = doc(db, "packages", id);
    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      const res = docSnap.data();
      return res;
    } else {
      // docSnap.data() will be undefined in this case
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



  // const handleBooking = async () => {
  //   try {
  //     await handleOrderAndVerification();
  //     if(isPaymentSuccess){
  // console.log("response:",response);
  // }

  // const response = await axios.post('src/app/api/bookings/create-booking', {
  //   orderId: order_id,
  //   razorpayPaymentId: rzr_payment_id,
  //   razorpayOrderId: rzr_order_id,
  //   razorpaySignature: rzr_pay_signature,
  // })

  // console.log("response:",response);
  // return response;
  //   } catch (error) {
  //     console.error("error", error);
  //   }
  // }

  // async function PaymentPipeline() {
  //   await handleBooking();
  //   if (rzr_order_id && rzr_pay_signature && rzr_pay_signature) {
  //     const response = await verifyPayment();
  //     console.log("response after verification:", response);
  //   }
  //   else {
  //     console.log("Signature and order id not recieved");
  //   }
  // }
  return (
    <div className="">
      {/* Header */}
      <section className="">
        <Link href="/customer" className="text-primary text-sm font-semibold hover:opacity-80">
          ← Back to Search
        </Link>
        {/* <h1 className="text-4xl font-bold flex items-center gap-2">
          <MapPin className="w-8 h-8 text-primary" />
          Zanzibar
        </h1>
        <p className="text-muted-foreground">Africa, Tanzania</p> */}
      </section>

      {/* Packages List */}
      <section>
        <div className=" w-full flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full   rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">

            {/* Left: Image Gallery & Summary (Mobile: Top) */}
            <div className="md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
              <div className="h-48 md:h-64 bg-slate-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-16 h-16 opacity-30" />
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  5 Days / 4 Nights
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900">{pkg?.destination} Explorer</h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <span className="font-medium text-blue-600">{pkg?.name || "Global Treks"}</span>
                  <span>•</span>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {pkg?.rating}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Base Price</span>
                    <span className="text-xl font-bold text-slate-900">${pkg?.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-500 text-sm">Travelers</span>
                    <span className="text-sm font-medium">Up to 15</span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <Link href={`/customer/destination/${id}/book-now`}>
                    <Button className="w-full h-12 text-lg shadow-blue-200 shadow-lg" >Book Now</Button>
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
                {/* <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button> */}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">

                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <div>
                      <h3 className="font-bold text-lg mb-2">About this trip</h3>
                      <p className="text-slate-600 leading-relaxed text-sm">{pkg?.description}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-3">What's Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {details.inclusions.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

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
                      {details.itinerary.map((day) => (
                        <div key={day.day} className="relative pl-8">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white"></div>
                          <h4 className="font-bold text-slate-900 text-sm">Day {day.day}: {day.title}</h4>
                          <p className="text-slate-600 text-sm mt-1">{day.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                    {details.reviews.map((review, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-slate-900 text-sm">{review.user}</span>
                          <div className="flex text-amber-500"><Star className="w-3 h-3 fill-current" /> <span className="text-xs ml-1 text-slate-600">{review.rating}.0</span></div>
                        </div>
                        <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                      </div>
                    ))}
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
