"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Users, Calendar, Home, Plane, FileText } from "lucide-react"
// import { saveBooking } from "@/lib/booking-store"
// import type { Booking } from "@/lib/types"

// interface BookingFormProps {
//   onSuccess: (bookingId: string) => void
// }

export default function BookingForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    destination: "",
    numberOfTravelers: "",
    startDate: "",
    endDate: "",
    accommodation: "",
    transportation: "",
    specialRequests: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    if (!formData.destination.trim()) newErrors.destination = "Destination is required"
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const booking= {
        id: `BK-${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        destination: formData.destination,
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

  const FormField = ({
    label,
    name,
    type = "text",
    placeholder,
    icon: Icon,
    children,
    required = true,
  }: {
    label: string
    name: string
    type?: string
    placeholder?: string
    icon?: React.ComponentType<{ className?: string }>
    children?: React.ReactNode
    required?: boolean
  }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg transition-colors ${
            errors[name]
              ? "border-destructive bg-destructive/5"
              : "border-border bg-background hover:border-primary/50 focus:border-primary focus:outline-none"
          }`}
        />
      )}
      {errors[name] && <p className="mt-1 text-sm text-destructive">{errors[name]}</p>}
    </div>
  )

  

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8">
      <div className="space-y-8">
        {/* Personal Information */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Personal Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Full Name" name="fullName" placeholder="John Doe" />
            <FormField label="Email" name="email" type="email" placeholder="john@example.com" icon={Mail} />
            <FormField label="Phone Number" name="phoneNumber" placeholder="+1 (555) 123-4567" icon={Phone} />
          </div>
        </div>

        {/* Travel Destination */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Travel Destination</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Destination" name="destination" placeholder="e.g., Paris, Tokyo, Bali" icon={MapPin} />
            <FormField
              label="Number of Travelers"
              name="numberOfTravelers"
              type="number"
              placeholder="1"
              icon={Users}
            />
          </div>
        </div>

        {/* Travel Dates */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Travel Dates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Start Date" name="startDate" type="date" icon={Calendar} />
            <FormField label="End Date" name="endDate" type="date" icon={Calendar} />
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Travel Preferences</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField label="Accommodation Preference" name="accommodation" icon={Home}>
              <select
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  errors.accommodation
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
            <FormField label="Transportation Preference" name="transportation" icon={Plane}>
              <select
                name="transportation"
                value={formData.transportation}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                  errors.transportation
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
