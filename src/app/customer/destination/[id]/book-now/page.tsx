"use client"

import React from "react"

import { use, useEffect, useState } from "react"
import { Mail, Phone, MapPin, Users, Calendar, Home, Plane, FileText } from "lucide-react"
import { useAuthContext } from "@/context/AuthContext";
import { usePackageStore } from "@/store/packageStore";
import { useBookingStore } from "@/store/bookingStore";
import axios from "axios";
import Router from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
// import { saveBooking } from "@/lib/booking-store"
// import type { Booking } from "@/lib/types"

// interface BookingFormProps {
//   onSuccess: (bookingId: string) => void
// }

type FormFieldProps = {
  label: string;
  name: keyof BookingFormData;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  children?: React.ReactNode;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<any>) => void;
};

    type BookingFormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
    numberOfTravelers: string;
    startDate: string;
    endDate: string;
    accommodation: string;
    transportation: string;
    specialRequests: string;
};

export const FormField = React.memo(function FormField({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  required = true,
  children,
  value,
  error,
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>

      {children ? (
        children
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-lg ${
            error ? "border-destructive bg-destructive/5" : "border-border"
          }`}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});
export default function BookingForm({ params }: { params:{ id: string }}) {
    // const { id } = use(params);
    const  {id}  = useParams();
    console.log("id:", id);
    const { user } = useAuthContext();
    const { packages } = usePackageStore()
    const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
    const [pkg, setpkg] = useState<any>(undefined);
    const [rzr_payment_id, set_rzr_pyment_id] = useState("");
    const [rzr_order_id, set_rzr_order_id] = useState("");
    const [order_id, set_order_id] = useState("");
    const [rzr_pay_signature, set_rzr_pay_signature] = useState("");
    const { setBookings, addBooking } = useBookingStore();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        numberOfTravelers: "",
        startDate: "",
        endDate: "",
        accommodation: "",
        transportation: "",
        specialRequests: "",
    })

    // console.log("form Data:",formData);

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)


    // const details = getPackageDetails();
    async function getPackageById() {
        if (!id || typeof id !== "string") {
            console.log("Invalid package id");
            return undefined;
        }
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
        const p = packages.find((p) => p.id === id);
        if (p) {
            setpkg(p);
            console.log("pkg from zustand:", p);
        } else {
            getPackageById().then((res) => {
                if (res) setpkg(res as any);
            });
        }
    }, [packages, id]);
    // console.log("pkg.destination:",pkg);
    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email"
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
        if (!formData.numberOfTravelers) newErrors.numberOfTravelers = "Number of travelers is required"
        if (!formData.startDate) newErrors.startDate = "Start date is required"
        if (!formData.endDate) newErrors.endDate = "End date is required"
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
            newErrors.endDate = "End date must be after start date"
        }
        if (!formData.accommodation) newErrors.accommodation = "Accommodation preference is required"
        if (!formData.transportation) newErrors.transportation = "Transportation preference is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

   const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name as keyof BookingFormData]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            const booking = {
                bookingId: `BK-${Date.now()}`,
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                destination: pkg.destination,
                numberOfTravelers: Number.parseInt(formData.numberOfTravelers),
                startDate: formData.startDate,
                endDate: formData.endDate,
                accommodation: formData.accommodation,
                transportation: formData.transportation,
                specialRequests: formData.specialRequests,
                status: "Confirmed",
                createdAt: new Date().toISOString(),
            }

            //   saveBooking(booking)
            //   onSuccess(booking.id)
        } catch (error) {
            console.error("Error creating booking:", error)
        } finally {
            setIsLoading(false)
        }
    }




    
    // console.log("price:", pkg);
    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("clicking on booking")
        console.log("validate form:", validateForm());
        if (!validateForm()) return; // validate first

        setIsLoading(true);
        try {
            // creating orders
            const result = await axios.post('/api/bookings/order', {
                amount: pkg.price
            })
            console.log("result from order created:", result);
            const order_id = result.data.response.id;
            console.log("order id:", order_id);
            set_order_id(order_id);
            // integration with checkout on client-side
            // Amount must be in paise (smallest currency unit) - same as what was sent to create order
            const amountInPaise = Math.round(Number(pkg.price) * 100);
            
            let options = {
                "key": process.env.NEXT_PUBLIC_RAZOR_PAY_TEST_API_KEY || "", // Enter the Key ID generated from the Dashboard
                "amount": amountInPaise, // Amount is in currency subunits (paise)
                "currency": "INR",
                "name": "Acme Corp", //your business name
                "description": "Test Transaction",

                "order_id": order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": async function (response: any) {
                    // alert(response.razorpay_payment_id);
                    // alert(response.razorpay_order_id);
                    // alert(response.razorpay_signature);
                    set_rzr_pyment_id(response.razorpay_payment_id);
                    set_rzr_pay_signature(response.razorpay_signature);
                    set_rzr_order_id(response.razorpay_order_id);
                    try {

                        if (response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
                            const verifyResponse = await axios.post('/api/bookings/verification', {
                                orderId: order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature,
                                userId: user?.uid,
                                packageId: id,
                                agencyId: pkg.agencyId,
                                amount: pkg.price,
                                booking: {
                                    bookingId: `BK-${Date.now()}`,
                                    fullName: formData.fullName,
                                    email: formData.email,
                                    phoneNumber: formData.phoneNumber,

                                    numberOfTravelers: Number.parseInt(formData.numberOfTravelers),
                                    startDate: formData.startDate,
                                    endDate: formData.endDate,
                                    accommodation: formData.accommodation,
                                    transportation: formData.transportation,
                                    specialRequests: formData.specialRequests,
                                    status: "Confirmed",
                                },
                                destination: pkg.destination,


                            });


                            console.log("Verification success:", verifyResponse.data);
                            if (verifyResponse.data.bookingData) {
                                addBooking(verifyResponse.data.bookingData);
                                router.push('/customer/bookings');
                            }
                            // return {verifyResponse}
                        }
                        else {
                            console.log("fields missing");
                        }
                    } catch (error) {
                        console.error("Verification failed:", error);
                    }
                },
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                    "name": user?.displayName, //your customer's name
                    "email": user?.email,
                    "contact": user?.phoneNumber  //Provide the customer's phone number for better conversion rates 
                },
                // "notes": {
                //   "address": "Razorpay Corporate Office"
                // },
                "theme": {
                    "color": "#3399cc"
                }
            }
            const Razorpay = (window as any).Razorpay;
            let rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                // alert(response.error.code);
                // alert(response.error.description);
                // alert(response.error.source);
                // alert(response.error.step);
                // alert(response.error.reason);
                // alert(response.error.metadata.order_id);
                // alert(response.error.metadata.payment_id);
                console.log(response.error.code);
                console.log(response.error.description);
                console.log(response.error.source);
                console.log(response.error.step);
                console.log(response.error.reason);
                console.log(response.error.metadata.order_id);
                console.log(response.error.metadata.payment_id);
            });
            rzp1.open();


        }
        catch (error) {
            console.error("error in payment:", error);
        }
    }

console.log("formdata:",formData);
    return (
        <form onSubmit={handleBooking} className="bg-card rounded-lg border border-border p-8">
            <div className="space-y-8">
                {/* Personal Information */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField label="Full Name" name="fullName" placeholder="John Doe" error={errors.fullName} onChange={handleChange} value={formData.fullName}/>
                        <FormField label="Email" name="email" type="email" placeholder="john@example.com" icon={Mail} error={errors.email} onChange={handleChange} value={formData.email}/>
                        <FormField label="Phone Number" name="phoneNumber" placeholder="+1 (555) 123-4567" icon={Phone} error={errors.phoneNumber} onChange={handleChange} value={formData.phoneNumber}/>
                    </div>
                </div>

                {/* Travel Destination */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6">Travel Destination</h2>
                    <div className="grid md:grid-cols-1 gap-6">
                        {/* <FormField label="Destination" name="destination" placeholder="e.g., Paris, Tokyo, Bali" icon={MapPin} /> */}
                        <FormField
                            label="Number of Travelers"
                            name="numberOfTravelers"
                            type="number"
                            placeholder="1"
                            icon={Users}
                            error={errors.numberOfTravelers}
                            onChange={handleChange}
                            value={formData.numberOfTravelers}
                        />
                    </div>
                </div>

                {/* Travel Dates */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6">Travel Dates</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField label="Start Date" name="startDate" type="date" icon={Calendar}  
                        error={errors.startDate}
                            onChange={handleChange}
                            value={formData.startDate} />
                        <FormField 
                        label="End Date" name="endDate" type="date" icon={Calendar} 
                         error={errors.endDate}
                            onChange={handleChange}
                            value={formData.endDate}/>
                    </div>
                </div>

                {/* Preferences */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6">Travel Preferences</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField label="Accommodation Preference" name="accommodation" icon={Home}  error={errors.accommodation}
                            onChange={handleChange}
                            value={formData.accommodation}>
                            <select
                                name="accommodation"
                                value={formData.accommodation}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg transition-colors ${errors.accommodation
                                    ? "border-destructive bg-destructive/5"
                                    : "border-border bg-background hover:border-primary/50 focus:border-primary focus:outline-none"
                                    }`}
                            >
                                <option value="">Select accommodation</option>
                                <option value="Hotel">Hotel</option>
                                <option value="Airbnb">Airbnb</option>
                                <option value="Resort">Resort</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Villa">Villa</option>
                            </select>
                            {errors.accommodation && <p className="mt-1 text-sm text-destructive">{errors.accommodation}</p>}
                        </FormField>
                        <FormField label="Transportation Preference" name="transportation" icon={Plane}  error={errors.transportation}
                            onChange={handleChange}
                            value={formData.transportation}>
                            <select
                                name="transportation"
                                value={formData.transportation}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg transition-colors ${errors.transportation
                                    ? "border-destructive bg-destructive/5"
                                    : "border-border bg-background hover:border-primary/50 focus:border-primary focus:outline-none"
                                    }`}
                            >
                                <option value="">Select transportation</option>
                                <option value="Flight">Flight</option>
                                <option value="Train">Train</option>
                                <option value="Bus">Bus</option>
                                <option value="Car Rental">Car Rental</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                            {errors.transportation && <p className="mt-1 text-sm text-destructive">{errors.transportation}</p>}
                        </FormField>
                    </div>
                </div>

                {/* Special Requests */}
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-6">Additional Information</h2>
                    <FormField
                        label="Special Requests / Notes"
                        name="specialRequests"
                        placeholder="Any special requirements or preferences? (Optional)"
                        icon={FileText}
                        required={false}
                         error={errors.specialRequests}
                            onChange={handleChange}
                            value={formData.specialRequests}
                    >
                        <textarea
                            name="specialRequests"
                            placeholder="Any special requirements or preferences?"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background hover:border-primary/50 focus:border-primary focus:outline-none transition-colors resize-none"
                        />
                    </FormField>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Creating Booking..." : "Create Booking"}
                </button>
            </div>
        </form>
    )
}
