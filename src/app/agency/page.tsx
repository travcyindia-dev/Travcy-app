"use client"
import React, { FormEvent, useEffect, useState } from 'react';
import {
  Clock, CheckCircle, Briefcase, Plus, ShieldCheck, ArrowLeft,
  DollarSign, Image as ImageIcon, Loader2, Users, Calendar, Star
} from 'lucide-react';
import { Card, Button, Badge, Input } from '@/components/ui/Shared';
import { Agency, AgencyTier, Booking } from '../../types';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import isAgencyAuth from '@/components/isAgencyAuth';
import { checkUserRole } from '../(auth)/checkUserRole';
import { useAgencyAuthContext } from '@/context/AgencyAuthContext';
import axios from 'axios';

// Mock Data
// const MOCK_AGENCIES: Agency[] = [
//   { uid: 1, name: 'Global Treks', location: 'Goa', verified: true, taxId: 'TAX-111' },
//   { uid: 2, name: 'Himalayan Highs', location: 'Himachal', verified: true, taxId: 'TAX-222' },
//   { uid: 3, name: 'Desert Safari Co', location: 'Rajasthan', verified: false, taxId: 'TAX-333' },
// ];

// // Added Mock Bookings to fix the error
// const MOCK_BOOKINGS: Booking[] = [
//   { id: 101, user: 'Alice Smith', destination: 'Goa', date: '2023-12-25', status: 'Confirmed', amount: 400 },
//   { id: 102, user: 'Bob Jones', destination: 'Goa', date: '2024-01-10', status: 'Pending', amount: 200 },
// ];

interface AgencyPortalProps {
  agency: Agency;
  bookings: Booking[];
  onLogout: () => void;
  onPayment: (id: number, plan: AgencyTier) => void;
}






function Page() {

  const [agency, setAgency] = React.useState([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  // const [agencies, setAgencies] = React.useState();
 
  const {user}=useAgencyAuthContext();


  const [dashView, setDashView] = React.useState<'overview' | 'add-package'>('overview');
  const [loading, setLoading] = React.useState(false);

  // --- HANDLERS ---
  const handlePublishPackage = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      alert("Package published successfully!");
      setDashView('overview');
    }, 1500);
  };

  // ============================================================================
  // STATE 1: VERIFICATION PENDING
  // ============================================================================

  checkUserRole();
  useEffect(() => {
    const fetchBookings = async () => {
      console.log("user in useEffect:",user.uid);
      const res = await axios(`/api/agency/fetch-bookings?agencyId=${user.uid}`);
      const data = res.data;
      console.log("data for fetch booking:",data);
      setBookings(data.bookings);
    };

    if (user?.uid) fetchBookings();
  }, []);

  // Force refresh token to get latest custom claims
  console.log("bookings:",bookings);


// ============================================================================
// STATE 3: MAIN DASHBOARD (ACTIVE)
// ============================================================================
return (
  <div className="min-h-screen bg-slate-50">
    <main className="max-w-7xl mx-auto p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        {/* Mobile-only create button */}
        <div className="md:hidden">
          <Button onClick={() => setDashView('add-package')}><Plus className="w-4 h-4" /> Create New Package</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-blue-500">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Calendar className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Bookings</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Revenue</p>
            <p className="text-2xl font-bold">$12,450</p>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 border-l-4 border-l-amber-500">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Star className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase">Rating</p>
            <p className="text-2xl font-bold">{4.8}</p>
          </div>
        </Card>
        <Card className="p-5 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold uppercase">Current Plan</p>
            <div className="flex justify-between items-end">
              <p className="text-xl font-bold">{ }</p>
              <p className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Paid</p>
            </div>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-6 text-slate-800 opacity-30 w-24 h-24" />
        </Card>
      </div>

      {/* Main Layout Grid: Table (2/3) + Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Recent Bookings */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Recent Bookings</h3>
              <Button variant="outline" className="text-xs h-8">Download CSV</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Destination</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length > 0 ? bookings.map(booking => (
                    <tr key={booking.bookingId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                            {booking.email.charAt(0) }
                          </div>
                          {booking.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">{booking.destination}</td>
                      <td className="px-6 py-4 text-slate-500">{booking.startDate}</td>
                      <td className="px-6 py-4">
                        <Badge variant={booking.status === 'Confirmed' ? 'success' : 'warning'}>{booking.status}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 font-medium hover:underline text-xs">View Details</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-500">No bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
            <div className="space-y-5 flex flex-col">
              <Link href={'/agency/add-package'}>
                <Button className="w-full justify-start shadow-md shadow-blue-100" >
                  <Plus className="w-4 h-4 text-white" /> Add New Package
                </Button>
              </Link>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 text-slate-400" /> Manage Guides
              </Button>
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
              <Button className="w-full text-sm bg-blue-600 hover:bg-blue-700 border-none shadow-none">Upgrade Plan</Button>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
          </Card>
        </div>
      </div>
    </main>

  </div>
);
};

export default isAgencyAuth(Page);