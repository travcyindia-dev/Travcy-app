import React, { useState, FormEvent } from 'react';
import { 
  Clock, CheckCircle, Briefcase, Plus, ShieldCheck, ArrowLeft, 
  DollarSign, Image as ImageIcon, Loader2, Users, Calendar, Star 
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../ui/Shared';
import { Agency, AgencyTier, Booking } from '../../types';

interface AgencyPortalProps {
  agency: Agency;
  bookings: Booking[];
  onLogout: () => void;
  onPayment: (id: number, plan: AgencyTier) => void;
}

export const AgencyPortal: React.FC<AgencyPortalProps> = ({ agency, bookings, onLogout, onPayment }) => {
  const [dashView, setDashView] = useState<'overview' | 'add-package'>('overview');
  const [loading, setLoading] = useState(false);

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
  if (!agency.verified) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Verification Pending</h2>
            <p className="text-slate-500 mt-2">
              Thanks for registering, <b>{agency.name}</b>. <br/>
              Our admin team is currently reviewing your documents.
            </p>
          </div>
          <div className="bg-slate-100 p-4 rounded text-sm text-slate-600">
             Estimated wait time: <b>24 hours</b>
          </div>
          <Button variant="outline" className="w-full" onClick={onLogout}>Back to Login</Button>
        </Card>
      </div>
    );
  }

  // ============================================================================
  // STATE 2: PAYMENT REQUIRED (VERIFIED BUT NOT PAID)
  // ============================================================================
  if (agency.verified && !agency.paid) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
        <div className="mb-8 text-center">
          <Badge variant="success" className="mb-4 text-sm py-1 px-3">
             <CheckCircle className="w-3 h-3 inline mr-1" /> Application Approved
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900">Select Your Plan</h2>
          <p className="text-slate-500 mt-2">Unlock your dashboard to start receiving bookings.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
           {/* Starter Plan */}
           <Card className="p-8 hover:border-blue-300 transition-all cursor-pointer">
             <h3 className="font-bold text-xl text-slate-900">Starter</h3>
             <p className="text-3xl font-bold mt-4 mb-6">$29<span className="text-base font-normal text-slate-500">/mo</span></p>
             <ul className="space-y-3 mb-8 text-slate-600 text-sm">
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500"/> List up to 5 packages</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500"/> Basic Analytics</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500"/> Email Support</li>
             </ul>
             <Button className="w-full" variant="outline" onClick={() => onPayment(agency.uid, 'Basic')}>Select Starter</Button>
           </Card>
           
           {/* Pro Plan */}
           <Card className="p-8 border-2 border-blue-600 relative bg-blue-50/20">
             <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">MOST POPULAR</div>
             <h3 className="font-bold text-xl text-blue-900">Professional</h3>
             <p className="text-3xl font-bold mt-4 mb-6">$79<span className="text-base font-normal text-slate-500">/mo</span></p>
             <ul className="space-y-3 mb-8 text-slate-700 text-sm">
               <li className="flex items-center gap-2 font-bold"><CheckCircle className="w-4 h-4 text-blue-600"/> Unlimited packages</li>
               <li className="flex items-center gap-2 font-bold"><CheckCircle className="w-4 h-4 text-blue-600"/> Priority Listing</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600"/> Advanced Analytics</li>
               <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-600"/> 24/7 Support</li>
             </ul>
             <Button className="w-full" onClick={() => onPayment(agency.uid, 'Pro')}>Select Professional</Button>
           </Card>
        </div>
        <div className="mt-8">
            <Button variant="outline" onClick={onLogout} className="text-slate-400 hover:text-slate-600 border-none">Log out for now</Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // STATE 3: MAIN DASHBOARD (ACTIVE)
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
         <div className="flex items-center gap-2 font-bold text-lg text-slate-800">
            <Briefcase className="text-blue-600" /> Partner Portal
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900">{agency.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
                  <p className="text-xs text-emerald-600 font-medium">Active</p>
                </div>
            </div>
            <Button variant="outline" className="text-xs" onClick={onLogout}>Logout</Button>
         </div>
      </header>
      
      {dashView === 'add-package' ? (
        // ---------------------------------------------------------
        // VIEW: ADD PACKAGE FORM
        // ---------------------------------------------------------
        <main className="max-w-3xl mx-auto p-8 animate-in fade-in slide-in-from-right-4">
           <div className="mb-6 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors" onClick={() => setDashView('overview')}>
               <ArrowLeft className="w-4 h-4" /> Back to Dashboard
             </div>
           </div>
           <Card className="p-8">
             <div className="mb-8 border-b border-slate-100 pb-4">
               <h1 className="text-2xl font-bold text-slate-900">Create New Package</h1>
               <p className="text-slate-500">Add details for your new tour package.</p>
             </div>
             <form onSubmit={handlePublishPackage} className="space-y-6">
               <Input label="Package Title" placeholder="e.g. 5 Days in Paradise" required />
               
               <div className="grid grid-cols-2 gap-4">
                 <Input label="Destination" placeholder="e.g. Bali" required />
                 <Input label="Duration (Days)" type="number" min="1" placeholder="e.g. 5" required />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5">
                   <label className="text-sm font-medium text-slate-700">Price (USD)</label>
                   <div className="relative">
                     <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                     <input type="number" min="0" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="299" required />
                   </div>
                 </div>
                 <Input label="Max Travelers" type="number" min="1" placeholder="e.g. 15" />
               </div>
               
               <div className="flex flex-col gap-1.5">
                 <label className="text-sm font-medium text-slate-700">Description</label>
                 <textarea 
                   rows={4} 
                   className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none" 
                   placeholder="Describe the itinerary, highlights, and what's included..."
                   required
                 ></textarea>
               </div>
               
               {/* Image Upload Mock */}
               <div className="flex flex-col gap-1.5">
                   <label className="text-sm font-medium text-slate-700">Cover Image</label>
                   <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                     <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                       <ImageIcon className="w-6 h-6" />
                     </div>
                     <p className="text-sm text-slate-900 font-medium">Click to upload image</p>
                     <p className="text-xs text-slate-500">SVG, PNG, JPG (Max 2MB)</p>
                   </div>
               </div>
               
               <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 mt-4">
                   <Button variant="secondary" type="button" onClick={() => setDashView('overview')}>Cancel</Button>
                   <Button type="submit" disabled={loading}>
                     {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Publishing...</> : 'Publish Package'}
                   </Button>
               </div>
             </form>
           </Card>
        </main>
      ) : (
        // ---------------------------------------------------------
        // VIEW: DASHBOARD OVERVIEW
        // ---------------------------------------------------------
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
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Calendar className="w-6 h-6"/></div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Bookings</p>
                  <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
             </Card>
             <Card className="p-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><DollarSign className="w-6 h-6"/></div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Revenue</p>
                  <p className="text-2xl font-bold">$12,450</p>
                </div>
             </Card>
             <Card className="p-5 flex items-center gap-4 border-l-4 border-l-amber-500">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Star className="w-6 h-6"/></div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Rating</p>
                  <p className="text-2xl font-bold">No rating</p>
                </div>
             </Card>
             <Card className="p-5 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10">
                     <p className="text-slate-400 text-xs font-bold uppercase">Current Plan</p>
                     <div className="flex justify-between items-end">
                       <p className="text-xl font-bold">Pro</p>
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
                              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-lg text-slate-600">
                                {booking.email.charAt(0)}
                              </div>
                              <span>{booking.userId}</span>
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
                  <div className="space-y-3">
                    <Button className="w-full justify-start shadow-md shadow-blue-100" onClick={() => setDashView('add-package')}>
                      <Plus className="w-4 h-4 text-white"/> Add New Package
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="w-4 h-4 text-slate-400"/> Manage Guides
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
      )}
    </div>
  );
};