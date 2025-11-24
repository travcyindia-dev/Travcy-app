'use client'
import React, { useState } from 'react';
import { UnifiedLogin } from '../components/auth/Login';
import { AgencyRegistrationForm } from '../components/agency/AgencyRegistration';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AgencyPortal } from '../components/agency/AgencyPortal';
import { TravelerDashboard } from '../components/traveler/TravelerDashboard';
import { Agency, UserRole, ViewState, AgencyTier, Booking } from '../types';

// Mock Data
const MOCK_AGENCIES: Agency[] = [
  { id: 1, name: 'Global Treks', location: 'Goa', rating: 4.8, verified: true, paid: true, priceStart: 200, Tier: 'Pro', taxId: 'TAX-111' },
  { id: 2, name: 'Himalayan Highs', location: 'Himachal', rating: 4.5, verified: true, paid: true, priceStart: 150, Tier: 'Basic', taxId: 'TAX-222' },
  { id: 3, name: 'Desert Safari Co', location: 'Rajasthan', rating: 4.2, verified: false, paid: false, priceStart: 180, Tier: 'Pending', taxId: 'TAX-333' },
];

// Added Mock Bookings to fix the error
const MOCK_BOOKINGS: Booking[] = [
  { id: 101, user: 'Alice Smith', destination: 'Goa', date: '2023-12-25', status: 'Confirmed', amount: 400 },
  { id: 102, user: 'Bob Jones', destination: 'Goa', date: '2024-01-10', status: 'Pending', amount: 200 },
];

export default function TravelPlatform() {
  const [view, setView] = useState<ViewState>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  
  // Central State
  const [agencies, setAgencies] = useState<Agency[]>(MOCK_AGENCIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS); // Added bookings state
  const [currentAgencyId, setCurrentAgencyId] = useState<number | null>(null);

  // --- HANDLERS ---

  const handleLogin = (email: string, type: 'general' | 'agency') => {
    if (type === 'agency') {
      // Simulate Agency Login: Default to Agency ID 1 (Verified/Paid) for demo
      setCurrentAgencyId(1); 
      setUserRole('agency');
      setView('dashboard');
    } else {
      // UNIFIED LOGIN LOGIC
      if (email.toLowerCase().includes('admin')) {
        setUserRole('admin');
      } else {
        setUserRole('user');
      }
      setView('dashboard');
    }
  };

  const handleAgencyRegistration = (data: Partial<Agency>) => {
    const newId = Date.now();
    const newAgency = { ...data, id: newId } as Agency;
    setAgencies([...agencies, newAgency]);
    setCurrentAgencyId(newId);
    setUserRole('agency'); 
    setView('dashboard');
  };

  const handleAdminVerify = (id: number, status: 'approved' | 'rejected') => {
    if (status === 'rejected') {
      setAgencies(agencies.filter(a => a.id !== id));
    } else {
      setAgencies(agencies.map(a => a.id === id ? { ...a, verified: true } : a));
    }
  };

  const handleAgencyPayment = (id: number, plan: AgencyTier) => {
    setAgencies(agencies.map(a => a.id === id ? { ...a, paid: true, Tier: plan } : a));
  };

  const handleLogout = () => {
    setUserRole(null);
    setView('login');
    setCurrentAgencyId(null);
  };

  // --- ROUTING ---

  if (view === 'login') {
    return <UnifiedLogin onLogin={handleLogin} onRegisterAgency={() => setView('register-agency')} />;
  }

  if (view === 'register-agency') {
    return <AgencyRegistrationForm onCancel={() => setView('login')} onSubmit={handleAgencyRegistration} />;
  }

  // --- DASHBOARDS ---

  if (userRole === 'admin') {
    return <AdminDashboard agencies={agencies} onVerify={handleAdminVerify} onLogout={handleLogout} />;
  }

  if (userRole === 'agency') {
    const myAgency = agencies.find(a => a.id === currentAgencyId);
    if (!myAgency) return <div className="p-10">Error: Agency not found. <button onClick={handleLogout}>Logout</button></div>;
    // Fix: Passed bookings prop here
    return <AgencyPortal agency={myAgency} bookings={bookings} onPayment={handleAgencyPayment} onLogout={handleLogout} />;
  }

  if (userRole === 'user') {
    // Fix: Passed bookings prop here
    return <TravelerDashboard agencies={agencies} bookings={bookings} onLogout={handleLogout} />;
  }

  return <div>Unknown State</div>;
}