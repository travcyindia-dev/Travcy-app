"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { ShieldCheck, LogOut, DollarSign, Briefcase, Bell, LayoutDashboard, Users, MapPin, FileText, Package, TrendingUp, Calendar, CheckCircle, XCircle, Clock, Eye, X, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Shared';
import { Agency, Booking } from '../../types';
import axios from 'axios';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  approvedAgencies: number;
  pendingAgencies: number;
  totalAgencies: number;
  totalUsers: number;
  totalPackages: number;
}

interface UserData {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  createdAt?: any;
}

interface PackageData {
  id: string;
  title: string;
  destination: string;
  price: string;
  agencyId: string;
  createdAt?: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<any[]>([]);
  const [allAgencies, setAllAgencies] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [allPackages, setAllPackages] = useState<PackageData[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'financials' | 'agencies' | 'bookings'>('overview');
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // Filter states
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [agencyFilter, setAgencyFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch admin stats
  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/stats');
      const data = response.data;
      setStats(data.stats);
      setAllAgencies(data.agencies);
      setAllBookings(data.bookings);
      setAllUsers(data.users);
      setAllPackages(data.packages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  // Real-time listener for pending agencies
  useEffect(() => {
    const q = query(
      collection(db, "agencies"),
      where("approved", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAgencies(result);
    });

    return () => unsubscribe();
  }, []);

  const onLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const onVerify = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await axios.post('/api/agencies/approve-agency', {
        uid: id,
        status: status
      });
      
      // Update UI instantly
      setAgencies((prev) => prev.filter((agency) => agency.uid !== id && agency.id !== id));
      
      // Refresh stats
      fetchAdminStats();
    } catch (error) {
      console.error("Error verifying agency:", error);
    }
  };

  // Filtered data
  const filteredBookings = useMemo(() => {
    let filtered = allBookings;
    
    if (bookingFilter === 'confirmed') {
      filtered = filtered.filter((b: any) => !b.cancelled && b.status !== 'Cancelled');
    } else if (bookingFilter === 'cancelled') {
      filtered = filtered.filter((b: any) => b.cancelled || b.status === 'Cancelled');
    }
    
    if (searchTerm) {
      filtered = filtered.filter((b: any) => 
        b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [allBookings, bookingFilter, searchTerm]);

  const filteredAgencies = useMemo(() => {
    let filtered = allAgencies;
    
    if (agencyFilter === 'approved') {
      filtered = filtered.filter((a: any) => a.approved === true);
    } else if (agencyFilter === 'pending') {
      filtered = filtered.filter((a: any) => a.approved === false);
    }
    
    if (searchTerm) {
      filtered = filtered.filter((a: any) => 
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [allAgencies, agencyFilter, searchTerm]);

  // Get agency name by ID
  const getAgencyName = (agencyId: string) => {
    const agency = allAgencies.find((a: any) => a.uid === agencyId || a.id === agencyId);
    return agency?.name || 'Unknown Agency';
  };

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Format currency
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  // Booking Detail Modal
  const BookingModal = ({ booking, onClose }: { booking: Booking; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Booking Details</h2>
            <p className="text-sm text-slate-500">{booking.bookingId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant={booking.cancelled || booking.status === 'Cancelled' ? 'danger' : 'success'}>
              {booking.cancelled || booking.status === 'Cancelled' ? 'Cancelled' : booking.status}
            </Badge>
            <span className="text-2xl font-bold text-slate-900">{formatCurrency(booking.amount)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Customer</p>
              <p className="font-semibold">{booking.fullName}</p>
              <p className="text-sm text-slate-600">{booking.email}</p>
              <p className="text-sm text-slate-600">{booking.phoneNumber}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Destination</p>
              <p className="font-semibold">{booking.destination}</p>
              <p className="text-sm text-slate-600">{booking.numberOfTravelers} travelers</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Travel Dates</p>
              <p className="font-semibold">{formatDate(booking.startDate)}</p>
              <p className="text-sm text-slate-600">to {formatDate(booking.endDate)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Agency</p>
              <p className="font-semibold">{getAgencyName(booking.agencyId)}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Accommodation</p>
              <p className="font-semibold">{booking.accommodation}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 mb-1">Transportation</p>
              <p className="font-semibold">{booking.transportation}</p>
            </div>
          </div>
          
          {booking.specialRequests && (
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-xs text-amber-700 mb-1">Special Requests</p>
              <p className="text-sm">{booking.specialRequests}</p>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-700 mb-1">Payment Details</p>
            <p className="text-sm"><span className="font-medium">Order ID:</span> {booking.orderId}</p>
            <p className="text-sm"><span className="font-medium">Payment ID:</span> {booking.paymentId}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block fixed h-full z-10">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheck className="text-blue-500" /> AdminPanel
        </h2>

        <nav className="space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'bookings', icon: Calendar, label: 'All Bookings' },
            { id: 'agencies', icon: Briefcase, label: 'All Agencies' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'financials', icon: DollarSign, label: 'Financials' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setSearchTerm(''); }}
              className={`px-4 py-2 rounded-lg flex items-center gap-3 font-medium cursor-pointer transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </div>
          ))}
        </nav>

        <div className="mt-auto absolute bottom-6 w-52">
          <Button variant="danger" className="w-full justify-start" onClick={onLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'bookings' && 'All Bookings'}
            {activeTab === 'agencies' && 'All Agencies'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'financials' && 'Financial Reports'}
          </h1>
          <div className="text-sm text-slate-500">Logged in as <span className="font-bold text-blue-600">Super Admin</span></div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 border-l-4 border-l-blue-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{formatCurrency(stats?.totalRevenue || 0)}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full text-blue-600"><DollarSign className="w-6 h-6" /></div>
              </Card>
              <Card className="p-6 border-l-4 border-l-emerald-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Bookings</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats?.totalBookings || 0}</h3>
                  <p className="text-xs text-emerald-600">{stats?.confirmedBookings} confirmed</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-600"><Calendar className="w-6 h-6" /></div>
              </Card>
              <Card className="p-6 border-l-4 border-l-purple-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Active Agencies</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{stats?.approvedAgencies || 0}</h3>
                  <p className="text-xs text-purple-600">{stats?.totalAgencies} total</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full text-purple-600"><Briefcase className="w-6 h-6" /></div>
              </Card>
              <Card className="p-6 border-l-4 border-l-amber-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pending Approvals</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-900">{agencies.length}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-full text-amber-600"><Bell className="w-6 h-6" /></div>
              </Card>
            </div>

            {/* More Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 flex items-center gap-4">
                <div className="p-3 bg-cyan-50 rounded-full text-cyan-600"><Users className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <h3 className="text-xl font-bold text-slate-900">{stats?.totalUsers || 0}</h3>
                </div>
              </Card>
              <Card className="p-6 flex items-center gap-4">
                <div className="p-3 bg-pink-50 rounded-full text-pink-600"><Package className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-slate-500">Total Packages</p>
                  <h3 className="text-xl font-bold text-slate-900">{stats?.totalPackages || 0}</h3>
                </div>
              </Card>
              <Card className="p-6 flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-full text-red-600"><XCircle className="w-6 h-6" /></div>
                <div>
                  <p className="text-sm text-slate-500">Cancelled Bookings</p>
                  <h3 className="text-xl font-bold text-slate-900">{stats?.cancelledBookings || 0}</h3>
                </div>
              </Card>
            </div>

            {/* Verification Queue */}
            <Card>
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Agency Verification Queue</h3>
                <Badge variant="warning">{agencies.length} Pending</Badge>
              </div>
              <div className="divide-y divide-slate-100">
                {agencies.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>All caught up! No pending verifications.</p>
                  </div>
                ) : (
                  agencies.map((agency: any) => (
                    <div key={agency.id || agency.uid} className="p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-lg text-slate-900">{agency.name}</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-600 mt-2">
                          <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {agency.location || 'N/A'}</div>
                          <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> {agency.taxId || 'N/A'}</div>
                          <div className="flex items-center gap-2">Email: {agency.email || 'N/A'}</div>
                          <div className="flex items-center gap-2">
                            <a href={agency.website || '#'} target="_blank" className="text-blue-600 underline hover:text-blue-800 transition-colors">
                              {agency.website || 'No website provided'}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full xl:w-auto">
                        <Button variant="danger" className="text-xs h-9 flex-1 xl:flex-none" onClick={() => onVerify(agency.uid || agency.id, 'rejected')}>Reject</Button>
                        <Button variant="success" className="text-xs h-9 flex-1 xl:flex-none" onClick={() => onVerify(agency.uid || agency.id, 'approved')}>Approve</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'confirmed', 'cancelled'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBookingFilter(filter as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        bookingFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Bookings Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Destination</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">No bookings found</td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking: any) => (
                        <tr key={booking.id || booking.bookingId} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">{booking.bookingId}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-900">{booking.fullName}</p>
                            <p className="text-xs text-slate-500">{booking.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{booking.destination}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(booking.amount)}</td>
                          <td className="px-6 py-4">
                            <Badge variant={booking.cancelled || booking.status === 'Cancelled' ? 'danger' : 'success'}>
                              {booking.cancelled || booking.status === 'Cancelled' ? 'Cancelled' : booking.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{formatDate(booking.startDate)}</td>
                          <td className="px-6 py-4">
                            <Button variant="outline" className="text-xs h-8" onClick={() => setSelectedBooking(booking)}>
                              <Eye className="w-3 h-3" /> View
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t bg-slate-50 text-sm text-slate-500">
                Showing {filteredBookings.length} of {allBookings.length} bookings
              </div>
            </Card>
          </div>
        )}

        {/* AGENCIES TAB */}
        {activeTab === 'agencies' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search agencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'approved', 'pending'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setAgencyFilter(filter as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        agencyFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Agencies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgencies.length === 0 ? (
                <Card className="col-span-full p-12 text-center text-slate-500">
                  No agencies found
                </Card>
              ) : (
                filteredAgencies.map((agency: any) => (
                  <Card key={agency.id || agency.uid} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{agency.name}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {agency.location || 'N/A'}
                        </p>
                      </div>
                      <Badge variant={agency.approved ? 'success' : 'warning'}>
                        {agency.approved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><span className="font-medium">Email:</span> {agency.email || 'N/A'}</p>
                      <p><span className="font-medium">Tax ID:</span> {agency.taxId || 'N/A'}</p>
                      <p><span className="font-medium">Website:</span> {agency.website || 'N/A'}</p>
                    </div>
                    {!agency.approved && (
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button variant="danger" className="flex-1 text-xs" onClick={() => onVerify(agency.uid || agency.id, 'rejected')}>Reject</Button>
                        <Button variant="success" className="flex-1 text-xs" onClick={() => onVerify(agency.uid || agency.id, 'approved')}>Approve</Button>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <Card>
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="font-bold text-slate-800">Registered Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No users found</td>
                      </tr>
                    ) : (
                      allUsers.map((user: any) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-900">{user.displayName || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <Badge variant={user.role === 'admin' ? 'warning' : user.role === 'agency' ? 'default' : 'success'}>
                              {user.role || 'user'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400 font-mono">{user.id.slice(0, 12)}...</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t bg-slate-50 text-sm text-slate-500">
                Total: {allUsers.length} users
              </div>
            </Card>
          </div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-2">{formatCurrency(stats?.totalRevenue || 0)}</h3>
                <p className="text-blue-100 text-xs mt-2">From {stats?.confirmedBookings} confirmed bookings</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <p className="text-emerald-100 text-sm font-medium">Average Booking Value</p>
                <h3 className="text-3xl font-bold mt-2">
                  {formatCurrency(stats?.confirmedBookings ? (stats.totalRevenue / stats.confirmedBookings) : 0)}
                </h3>
                <p className="text-emerald-100 text-xs mt-2">Per confirmed booking</p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white">
                <p className="text-red-100 text-sm font-medium">Cancellation Rate</p>
                <h3 className="text-3xl font-bold mt-2">
                  {stats?.totalBookings ? ((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(1) : 0}%
                </h3>
                <p className="text-red-100 text-xs mt-2">{stats?.cancelledBookings} cancelled bookings</p>
              </Card>
            </div>

            {/* Revenue by Agency */}
            <Card>
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="font-bold text-slate-800">Revenue by Agency</h3>
              </div>
              <div className="p-6">
                {allAgencies.filter((a: any) => a.approved).length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No approved agencies yet</p>
                ) : (
                  <div className="space-y-4">
                    {allAgencies
                      .filter((a: any) => a.approved)
                      .map((agency: any) => {
                        const agencyBookings = allBookings.filter(
                          (b: any) => (b.agencyId === agency.uid || b.agencyId === agency.id) && !b.cancelled && b.status !== 'Cancelled'
                        );
                        const agencyRevenue = agencyBookings.reduce((sum: number, b: any) => sum + (parseFloat(b.amount) || 0), 0);
                        const percentage = stats?.totalRevenue ? (agencyRevenue / stats.totalRevenue) * 100 : 0;

                        return (
                          <div key={agency.id || agency.uid} className="flex items-center gap-4">
                            <div className="w-40 font-medium text-slate-900 truncate">{agency.name}</div>
                            <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full transition-all"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              ></div>
                            </div>
                            <div className="w-32 text-right">
                              <span className="font-bold text-slate-900">{formatCurrency(agencyRevenue)}</span>
                              <span className="text-xs text-slate-500 ml-2">({agencyBookings.length} bookings)</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <div className="px-6 py-4 border-b bg-slate-50">
                <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {allBookings.slice(0, 10).map((booking: any) => (
                  <div key={booking.id || booking.bookingId} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.cancelled || booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {booking.cancelled || booking.status === 'Cancelled' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{booking.fullName}</p>
                        <p className="text-xs text-slate-500">{booking.destination} • {formatDate(booking.startDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${booking.cancelled || booking.status === 'Cancelled' ? 'text-red-600 line-through' : 'text-slate-900'}`}>
                        {formatCurrency(booking.amount)}
                      </p>
                      <p className="text-xs text-slate-500">{booking.bookingId}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && <BookingModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
};