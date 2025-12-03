"use client"
import React, { FormEvent, useEffect, useState } from 'react';
import {
  Clock, CheckCircle, Briefcase, Plus, ShieldCheck, ArrowLeft,
  DollarSign, Image as ImageIcon, Loader2, Users, Calendar, Star,
  XCircle, AlertCircle, TrendingUp, Eye, X
} from 'lucide-react';
import { Card, Button, Badge, Input } from '@/components/ui/Shared';
import { Agency, AgencyTier, Booking } from '../../types';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import isAgencyAuth from '@/components/isAgencyAuth';
import { checkUserRole } from '../(auth)/checkUserRole';
import { useAgencyAuthContext } from '@/context/AgencyAuthContext';
import axios from 'axios';

// Modal Component for Booking Details
function BookingModal({ booking, onClose }: { booking: Booking | null; onClose: () => void }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Booking Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl ${
            booking.cancelled || booking.status === 'cancelled' 
              ? 'bg-red-50 border border-red-200' 
              : booking.status === 'confirmed' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              {booking.cancelled || booking.status === 'cancelled' ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : booking.status === 'confirmed' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Clock className="w-5 h-5 text-amber-600" />
              )}
              <span className={`font-semibold ${
                booking.cancelled || booking.status === 'cancelled'
                  ? 'text-red-700'
                  : booking.status === 'confirmed'
                    ? 'text-green-700'
                    : 'text-amber-700'
              }`}>
                {booking.cancelled || booking.status === 'cancelled' ? 'Cancelled' : booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Customer Information</h4>
            <div className="space-y-2">
              <p className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-medium">{booking.fullName}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Email:</span> <span className="font-medium">{booking.email}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Phone:</span> <span className="font-medium">{booking.phoneNumber}</span></p>
            </div>
          </div>

          {/* Trip Details */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Trip Details</h4>
            <div className="space-y-2">
              <p className="flex justify-between"><span className="text-slate-500">Destination:</span> <span className="font-medium">{booking.destination}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Dates:</span> <span className="font-medium">{booking.startDate} - {booking.endDate}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Travelers:</span> <span className="font-medium">{booking.numberOfTravelers} guests</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Accommodation:</span> <span className="font-medium capitalize">{booking.accommodation || 'Standard'}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Transportation:</span> <span className="font-medium capitalize">{booking.transportation || 'Standard'}</span></p>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Payment Information</h4>
            <div className="space-y-2">
              <p className="flex justify-between"><span className="text-slate-500">Amount:</span> <span className="font-bold text-lg text-emerald-600">₹{booking.amount}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Payment ID:</span> <span className="font-mono text-xs">{booking.paymentId}</span></p>
              <p className="flex justify-between"><span className="text-slate-500">Order ID:</span> <span className="font-mono text-xs">{booking.orderId}</span></p>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Special Requests</h4>
              <p className="bg-slate-50 rounded-lg p-3 text-sm">{booking.specialRequests}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  
  const { user } = useAgencyAuthContext();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.uid) return;
      
      setLoading(true);
      try {
        console.log("Fetching bookings for agency:", user.uid);
        const res = await axios(`/api/agency/fetch-bookings?agencyId=${user.uid}`);
        const data = res.data;
        console.log("Fetched bookings:", data);
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.uid]);

  // Calculate real statistics
  const stats = React.useMemo(() => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' && !b.cancelled).length;
    const pendingBookings = bookings.filter(b => b.status === 'pending' && !b.cancelled).length;
    const cancelledBookings = bookings.filter(b => b.cancelled || b.status === 'cancelled').length;
    
    // Calculate total revenue (only from non-cancelled bookings)
    const totalRevenue = bookings
      .filter(b => !b.cancelled && b.status !== 'cancelled')
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    
    // Calculate this month's bookings
    const now = new Date();
    const thisMonthBookings = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      thisMonthBookings
    };
  }, [bookings]);

  // Filter bookings based on active filter
  const filteredBookings = React.useMemo(() => {
    switch (activeFilter) {
      case 'confirmed':
        return bookings.filter(b => b.status === 'confirmed' && !b.cancelled);
      case 'pending':
        return bookings.filter(b => b.status === 'pending' && !b.cancelled);
      case 'cancelled':
        return bookings.filter(b => b.cancelled || b.status === 'cancelled');
      default:
        return bookings;
    }
  }, [bookings, activeFilter]);

  // Get status badge variant
  const getStatusBadge = (booking: Booking) => {
    if (booking.cancelled || booking.status === 'cancelled') {
      return { variant: 'danger' as const, label: 'Cancelled' };
    }
    if (booking.status === 'confirmed') {
      return { variant: 'success' as const, label: 'Confirmed' };
    }
    if (booking.status === 'pending') {
      return { variant: 'warning' as const, label: 'Pending' };
    }
    return { variant: 'default' as const, label: booking.status || 'Unknown' };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500">Welcome back, here's what's happening today.</p>
          </div>
          <Link href="/agency/add-package">
            <Button><Plus className="w-4 h-4" /> Create New Package</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
              <p className="text-xs text-slate-400">{stats.thisMonthBookings} this month</p>
            </div>
          </Card>
          
          <Card className="p-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> From {stats.confirmedBookings} bookings
              </p>
            </div>
          </Card>
          
          <Card className="p-5 flex items-center gap-4 border-l-4 border-l-amber-500">
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Pending</p>
              <p className="text-2xl font-bold">{stats.pendingBookings}</p>
              <p className="text-xs text-slate-400">Awaiting confirmation</p>
            </div>
          </Card>
          
          <Card className="p-5 flex items-center gap-4 border-l-4 border-l-red-500">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase">Cancelled</p>
              <p className="text-2xl font-bold">{stats.cancelledBookings}</p>
              <p className="text-xs text-slate-400">Total cancellations</p>
            </div>
          </Card>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Bookings Table */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-bold text-slate-800">All Bookings</h3>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setActiveFilter('all')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                        activeFilter === 'all' 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({stats.totalBookings})
                    </button>
                    <button
                      onClick={() => setActiveFilter('confirmed')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                        activeFilter === 'confirmed' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      }`}
                    >
                      Confirmed ({stats.confirmedBookings})
                    </button>
                    <button
                      onClick={() => setActiveFilter('pending')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                        activeFilter === 'pending' 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      }`}
                    >
                      Pending ({stats.pendingBookings})
                    </button>
                    <button
                      onClick={() => setActiveFilter('cancelled')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition ${
                        activeFilter === 'cancelled' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      Cancelled ({stats.cancelledBookings})
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Destination</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.length > 0 ? filteredBookings.map(booking => {
                        const statusBadge = getStatusBadge(booking);
                        return (
                          <tr key={booking.bookingId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
                                  {booking.fullName?.charAt(0) || booking.email?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900">{booking.fullName || 'N/A'}</p>
                                  <p className="text-xs text-slate-500">{booking.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium">{booking.destination}</td>
                            <td className="px-6 py-4 text-slate-500">
                              <div>
                                <p>{booking.startDate}</p>
                                <p className="text-xs text-slate-400">{booking.numberOfTravelers} guests</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-emerald-600">₹{booking.amount}</td>
                            <td className="px-6 py-4">
                              <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => setSelectedBooking(booking)}
                                className="flex items-center gap-1 text-blue-600 font-medium hover:underline text-xs"
                              >
                                <Eye className="w-3 h-3" /> View
                              </button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center gap-2">
                              <Calendar className="w-12 h-12 text-slate-300" />
                              <p className="text-slate-500 font-medium">No bookings found</p>
                              <p className="text-slate-400 text-xs">
                                {activeFilter !== 'all' 
                                  ? `No ${activeFilter} bookings. Try a different filter.`
                                  : 'Bookings will appear here when customers book your packages.'
                                }
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Action Center */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Quick Actions
              </h3>
              <div className="space-y-3 flex flex-col">
                <Link href="/agency/add-package">
                  <Button className="w-full justify-start shadow-md shadow-blue-100">
                    <Plus className="w-4 h-4 text-white" /> Add New Package
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 text-slate-400" /> Manage Guides
                </Button>
              </div>
            </Card>

            {/* Stats Summary */}
            <Card className="p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-400" /> Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                  <span className="text-slate-500 text-sm">Confirmation Rate</span>
                  <span className="font-bold text-emerald-600">
                    {stats.totalBookings > 0 
                      ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200">
                  <span className="text-slate-500 text-sm">Cancellation Rate</span>
                  <span className="font-bold text-red-600">
                    {stats.totalBookings > 0 
                      ? Math.round((stats.cancelledBookings / stats.totalBookings) * 100) 
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 text-sm">Avg. Booking Value</span>
                  <span className="font-bold text-slate-900">
                    ₹{stats.confirmedBookings > 0 
                      ? Math.round(stats.totalRevenue / stats.confirmedBookings).toLocaleString() 
                      : 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Boost Visibility Widget */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> Boost Visibility
                </h3>
                <p className="text-sm text-blue-800 mb-4 leading-relaxed">
                  Get featured on the homepage to increase your bookings by <span className="font-bold">30%</span>.
                </p>
                <Button className="w-full text-sm bg-blue-600 hover:bg-blue-700 border-none shadow-none">
                  Upgrade Plan
                </Button>
              </div>
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
            </Card>
          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
}

export default isAgencyAuth(Page);