"use client"

import React, { useEffect, useState } from 'react';
import { ShieldCheck, LogOut, DollarSign, Briefcase, Bell, LayoutDashboard, Users, MapPin, FileText } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Shared';
import { Agency } from '../../types';
import axios from 'axios';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AdminDashboardProps {
  agencies: Agency[];
  onVerify: (id: number, status: 'approved' | 'rejected') => void;
  onLogout: () => void;
}

const MOCK_AGENCIES: Agency[] = [
  { uid: 1, name: 'Global Treks', location: 'Goa', verified: true, taxId: 'TAX-111' },
  { uid: 2, name: 'Himalayan Highs', location: 'Himachal', verified: true, taxId: 'TAX-222' },
  { uid: 3, name: 'Desert Safari Co', location: 'Rajasthan', verified: false, taxId: 'TAX-333' },
];


export default function AdminDashboard() {
  const [agencies, setAgencies] = useState<any>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'financials'>('overview');
  const pendingAgencies = MOCK_AGENCIES.filter(a => !a.verified);
  const activeAgenciesCount = MOCK_AGENCIES.filter(a => a.verified).length;

  const fetchUnverifiedAgencies = async () => {
    const response = await axios.get('/api/agencies/fetch-agencies');
    const data = response.data.agencies
    setAgencies(data);
    console.log("agencies :", data);
  }

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

    console.log("Realtime pending agencies:", result);
    setAgencies(result); 
  });

  return () => unsubscribe();
}, []);



  const onLogout = () => {
    console.log("logout")
  };
  const onVerify = async (id: number, status: 'approved' | 'rejected') => {
    const response = await axios.post('/api/agencies/approve-agency',
      {
        uid: id,
        status: status
      }
    );
    // Update UI instantly
    setAgencies((prev:any) =>
      prev.map((agency:any) =>
        agency.uid === id
          ? { ...agency, approved:true, status }
          : agency
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block fixed h-full z-10">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheck className="text-blue-500" /> AdminPanel
        </h2>

        <nav className="space-y-2">
          <div
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg flex items-center gap-3 font-medium cursor-pointer transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Overview
          </div>
          <div
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg flex items-center gap-3 font-medium cursor-pointer transition-colors ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" /> User Management
          </div>
          <div
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 rounded-lg flex items-center gap-3 font-medium cursor-pointer transition-colors ${activeTab === 'financials' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <DollarSign className="w-5 h-5" /> Financials
          </div>
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
            {activeTab === 'overview' ? 'Dashboard Overview' : activeTab === 'users' ? 'User Management' : 'Financial Reports'}
          </h1>
          <div className="text-sm text-slate-500">Logged in as <span className="font-bold text-blue-600">Super Admin</span></div>
        </header>

        {activeTab === 'overview' ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 border-l-4 border-l-blue-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900">$42,500</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full text-blue-600"><DollarSign className="w-6 h-6" /></div>
              </Card>
              <Card className="p-6 border-l-4 border-l-emerald-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Active Agencies</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900">{activeAgenciesCount}</h3>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full text-emerald-600"><Briefcase className="w-6 h-6" /></div>
              </Card>
              <Card className="p-6 border-l-4 border-l-amber-500 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Pending Approvals</p>
                  <h3 className="text-3xl font-bold mt-1 text-slate-900">{pendingAgencies.length}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-full text-amber-600"><Bell className="w-6 h-6" /></div>
              </Card>
            </div>

            {/* Verification Queue */}
            <Card>
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Agency Verification Queue</h3>
                <Badge variant="warning">{pendingAgencies.length} Pending</Badge>
              </div>
              <div className="divide-y divide-slate-100">
                {agencies.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">All caught up! No pending verifications.</div>
                ) : (
                  agencies.map((agency: Agency & { trustScore?: number; website?: string }) => (
                  <div key={agency.uid} className="p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg text-slate-900">{agency.name}</h4>
                      {/* <Badge variant="default">{agency.Tier}</Badge> */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-slate-600 mt-2">
                      <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {agency.location}</div>
                      <div className="flex items-center gap-2"><FileText className="w-3 h-3" /> {agency.taxId}</div>
                      <div className="flex items-center gap-2 col-span-2 mt-1">
                      <a href="#" className="text-blue-600 underline hover:text-blue-800 transition-colors">{agency.website || 'No website provided'}</a>
                      </div>
                    </div>
                    </div>

                    {/* Trust Score Logic */}
                    <div className="flex flex-col items-center px-4 border-l border-r border-slate-200 mx-4 min-w-[140px]">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trust Score</span>
                    <div className={`text-3xl font-bold my-1 ${agency.trustScore && agency.trustScore > 70 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {agency.trustScore || 0}%
                    </div>
                    <span className="text-[10px] text-slate-400 text-center leading-tight">Automated risk assessment</span>
                    </div>

                    <div className="flex gap-2 w-full xl:w-auto">
                    <Button variant="outline" className="text-xs h-9 flex-1 xl:flex-none">View Docs</Button>
                    <Button variant="danger" className="text-xs h-9 flex-1 xl:flex-none" onClick={() => onVerify(agency.uid, 'rejected')}>Reject</Button>
                    <Button variant="success" className="text-xs h-9 flex-1 xl:flex-none" onClick={() => onVerify(agency.uid, 'approved')}>Approve</Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </Card>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-xl border-dashed border-2 border-slate-200">
            <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">This module is under development.</p>
            <p className="text-sm">Check back later for updates.</p>
          </div>
        )}
      </main>
    </div>
  );
};