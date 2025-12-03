"use client"

import isAuth from "@/components/isAuth"
import { useAuthContext } from "@/context/AuthContext"
import { useBookingStore, Booking } from "@/store/bookingStore"
import { usePackageStore } from "@/store/packageStore"
import axios from "axios"
import { Calendar, MapPin, Users, ChevronRight, X, AlertTriangle, Check, Edit3, Phone, Mail, User, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { toastSuccess, toastError } from "@/components/ui/ToastTypes"

// Modal Component
function Modal({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// View Details Modal Content
function ViewDetailsContent({ booking, packageInfo, onClose }: { booking: Booking; packageInfo: any; onClose: () => void }) {
  return (
    <div className="p-6 space-y-6">
      {/* Package Info */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
        <h3 className="font-bold text-lg">{packageInfo?.title || "Travel Package"}</h3>
        <p className="text-muted-foreground text-sm mt-1">{booking.destination}</p>
      </div>

      {/* Booking Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Booking ID</p>
          <p className="font-mono text-sm">{booking.bookingId?.slice(0, 12)}...</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
          <span className={`inline-flex items-center gap-1 text-sm font-semibold ${booking.status === "confirmed" ? "text-green-600" : booking.cancelled ? "text-red-600" : "text-amber-600"}`}>
            {booking.status === "confirmed" ? <Check className="w-4 h-4" /> : null}
            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Travel Dates</p>
          <p className="text-sm">{booking.startDate} - {booking.endDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Travelers</p>
          <p className="text-sm">{booking.numberOfTravelers} guests</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Amount Paid</p>
          <p className="text-lg font-bold text-primary">₹{booking.amount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Payment ID</p>
          <p className="font-mono text-xs">{booking.paymentId?.slice(0, 16)}...</p>
        </div>
      </div>

      {/* Traveler Info */}
      <div className="border-t border-border pt-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <User className="w-4 h-4" /> Traveler Information
        </h4>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> {booking.fullName}</p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> {booking.email}</p>
          <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> {booking.phoneNumber}</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="border-t border-border pt-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Preferences
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Accommodation</p>
            <p className="capitalize">{booking.accommodation || "Standard"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Transportation</p>
            <p className="capitalize">{booking.transportation || "Standard"}</p>
          </div>
        </div>
        {booking.specialRequests && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">Special Requests</p>
            <p className="text-sm mt-1 bg-muted/50 rounded-lg p-3">{booking.specialRequests}</p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
      >
        Close
      </button>
    </div>
  );
}

// Manage Booking Modal Content
function ManageBookingContent({ 
  booking, 
  onClose, 
  onUpdate, 
  onCancel 
}: { 
  booking: Booking; 
  onClose: () => void; 
  onUpdate: (updates: Partial<Booking>) => void;
  onCancel: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: booking.fullName,
    email: booking.email,
    phoneNumber: booking.phoneNumber,
    numberOfTravelers: booking.numberOfTravelers,
    specialRequests: booking.specialRequests || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    await onUpdate(formData);
    setIsLoading(false);
    setIsEditing(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    await onCancel();
    setIsLoading(false);
  };

  if (showCancelConfirm) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-600">Cancel Booking?</h3>
          <p className="text-muted-foreground mt-2">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>Note:</strong> Cancellation may be subject to the agency's refund policy. 
            Please contact support for refund queries.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowCancelConfirm(false)}
            className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
            disabled={isLoading}
          >
            Go Back
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
          >
            {isLoading ? "Cancelling..." : "Yes, Cancel Booking"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Quick Actions */}
      {!isEditing && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 p-4 border border-border rounded-xl hover:bg-muted transition"
          >
            <Edit3 className="w-5 h-5 text-primary" />
            <span className="font-semibold">Edit Details</span>
          </button>
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="flex items-center justify-center gap-2 p-4 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition"
          >
            <X className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-600">Cancel</span>
          </button>
        </div>
      )}

      {/* Edit Form */}
      {isEditing ? (
        <div className="space-y-4">
          <h4 className="font-semibold">Edit Booking Details</h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full mt-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full mt-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Number of Travelers</label>
              <input
                type="number"
                min="1"
                value={formData.numberOfTravelers}
                onChange={(e) => setFormData({ ...formData, numberOfTravelers: parseInt(e.target.value) })}
                className="w-full mt-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={3}
                className="w-full mt-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Any special requirements..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Current Booking Summary */}
          <div className="border-t border-border pt-4">
            <h4 className="font-semibold mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-dashed border-border">
                <span className="text-muted-foreground">Destination</span>
                <span className="font-medium">{booking.destination}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-border">
                <span className="text-muted-foreground">Travel Dates</span>
                <span className="font-medium">{booking.startDate} - {booking.endDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-dashed border-border">
                <span className="text-muted-foreground">Travelers</span>
                <span className="font-medium">{booking.numberOfTravelers} guests</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold text-primary text-lg">₹{booking.amount}</span>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              Need help with your booking? Contact our support team at{" "}
              <a href="mailto:support@travelopia.com" className="text-primary font-semibold">
                support@travelopia.com
              </a>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
          >
            Close
          </button>
        </>
      )}
    </div>
  );
}

function Bookings() {
  const { user } = useAuthContext();
  const { setBookings, bookings, setHasFetchedOnce, hasFetchedOnce } = useBookingStore();
  const { packages } = usePackageStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<"view" | "manage" | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  console.log("bookings:", bookings);

  async function fetchBookings() {
    const res = await axios.get(`/api/bookings/fetch-booking/${user?.uid}`);
    const data = res.data.bookings;
    console.log("data for fetch booking:", data);
    setBookings(data);
  }

  useEffect(() => {
    const run = async () => {
      console.log("running fetchBooking")
      await fetchBookings();
      setHasFetchedOnce(true);
    };
    run();
  }, [user]);

  const openViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType("view");
  };

  const openManage = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalType("manage");
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalType(null);
  };

  const handleUpdateBooking = async (updates: Partial<Booking>) => {
    if (!selectedBooking) return;

    try {
      await axios.post("/api/bookings/update", {
        bookingId: selectedBooking.bookingId,
        updates,
      });

      // Update local state
      setBookings(
        bookings.map((b) =>
          b.bookingId === selectedBooking.bookingId ? { ...b, ...updates } : b
        )
      );

      toastSuccess("Booking updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating booking:", error);
      toastError("Failed to update booking. Please try again.");
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await axios.post("/api/bookings/cancel", {
        bookingId: selectedBooking.bookingId,
      });

      // Update local state
      setBookings(
        bookings.map((b) =>
          b.bookingId === selectedBooking.bookingId
            ? { ...b, status: "cancelled", cancelled: true }
            : b
        )
      );

      toastSuccess("Booking cancelled successfully!");
      closeModal();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toastError("Failed to cancel booking. Please try again.");
    }
  };

  // Filter bookings based on tab
  const upcomingBookings = bookings.filter(
    (b) => !b.cancelled && b.status !== "cancelled" && b.status !== "completed"
  );
  const completedBookings = bookings.filter(
    (b) => b.cancelled || b.status === "cancelled" || b.status === "completed"
  );

  const displayedBookings = activeTab === "upcoming" ? upcomingBookings : completedBookings;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-4xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage your upcoming and past trips</p>
      </section>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 font-semibold transition ${activeTab === "upcoming"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 font-semibold transition ${activeTab === "completed"
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
            }`}
        >
          Completed ({completedBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {displayedBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No {activeTab} bookings</h3>
            <p className="text-muted-foreground mt-1">
              {activeTab === "upcoming"
                ? "You don't have any upcoming trips. Start exploring!"
                : "Your completed trips will appear here."}
            </p>
          </div>
        ) : (
          displayedBookings.map((booking) => {
            const pkg = packages.find((p) => p.id === booking.packageId);
            return (
              <div
                key={booking.bookingId}
                className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{pkg?.title || "Travel Package"}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground text-sm mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {booking?.destination}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {booking.startDate}-{booking.endDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {booking.numberOfTravelers} guests
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{booking?.amount}</p>
                    <p
                      className={`text-sm font-semibold mt-1 ${booking.cancelled || booking.status === "cancelled"
                        ? "text-red-600"
                        : booking.status === "confirmed"
                          ? "text-green-600"
                          : booking.status === "completed"
                            ? "text-blue-600"
                            : "text-muted-foreground"
                        }`}
                    >
                      {booking.cancelled || booking.status === "cancelled"
                        ? "✗ Cancelled"
                        : booking.status === "confirmed"
                          ? "✓ Confirmed"
                          : booking.status === "completed"
                            ? "✓ Completed"
                            : booking.status}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openViewDetails(booking)}
                    className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
                  >
                    View Details
                  </button>

                  {!booking.cancelled && booking.status !== "cancelled" && (
                    <button
                      onClick={() => openManage(booking)}
                      className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                      Manage <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={modalType === "view" && selectedBooking !== null}
        onClose={closeModal}
        title="Booking Details"
      >
        {selectedBooking && (
          <ViewDetailsContent
            booking={selectedBooking}
            packageInfo={packages.find((p) => p.id === selectedBooking.packageId)}
            onClose={closeModal}
          />
        )}
      </Modal>

      {/* Manage Booking Modal */}
      <Modal
        isOpen={modalType === "manage" && selectedBooking !== null}
        onClose={closeModal}
        title="Manage Booking"
      >
        {selectedBooking && (
          <ManageBookingContent
            booking={selectedBooking}
            onClose={closeModal}
            onUpdate={handleUpdateBooking}
            onCancel={handleCancelBooking}
          />
        )}
      </Modal>
    </div>
  );
}

export default isAuth(Bookings)