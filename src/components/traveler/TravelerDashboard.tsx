import React, { useState, ChangeEvent, useMemo } from 'react';
import { 
  MapPin, User, Search, Image as ImageIcon, Star, Calendar, 
  DollarSign, Users, LayoutDashboard, Heart, X, Check, ShieldCheck,
  Clock, ArrowRight, ChevronRight, Filter
} from 'lucide-react';
import { Card, Button, Badge } from '../ui/Shared';
import { Agency, Booking } from '../../types';

interface TravelerDashboardProps {
  agencies: Agency[];
  bookings: Booking[];
  onLogout: () => void;
}

// --- MOCK DATA FOR ENHANCED FEATURES ---

const MOCK_LOCATIONS = ['Goa', 'Himachal', 'Kerala', 'Rajasthan', 'Sikkim', 'Kashmir', 'Vietnam', 'Thailand'];

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Desert', 'Cultural'];

// Simulate extended package details that aren't in the base Agency type
const getPackageDetails = (agency: Agency) => ({
  images: [1, 2, 3], // Placeholders
  description: `Experience the magic of ${agency.location} with our premium tour package. This comprehensive 5-day journey covers all major attractions, hidden gems, and authentic culinary experiences. Perfect for families and couples alike.`,
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

// --- SUB-COMPONENT: PACKAGE DETAILS MODAL ---

const PackageDetailsModal = ({ agency, onClose }: { agency: Agency; onClose: () => void }) => {
  const details = useMemo(() => getPackageDetails(agency), [agency]);
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
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
            <h2 className="text-2xl font-bold text-slate-900">{agency.location} Explorer</h2>
            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
              <span className="font-medium text-blue-600">{agency.name}</span>
              <span>•</span>
              <div className="flex items-center text-amber-500">
                <Star className="w-3 h-3 fill-current" /> 4
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Base Price</span>
                <span className="text-xl font-bold text-slate-900">$300</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Travelers</span>
                <span className="text-sm font-medium">Up to 15</span>
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Button className="w-full h-12 text-lg shadow-blue-200 shadow-lg">Book Now</Button>
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
                  className={`text-sm font-medium pb-4 border-b-2 transition-colors ${
                    activeTab === tab.toLowerCase() 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h3 className="font-bold text-lg mb-2">About this trip</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{details.description}</p>
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
                  <div className="p-2 bg-white rounded-lg h-fit text-blue-600"><ShieldCheck className="w-6 h-6"/></div>
                  <div>
                     <h4 className="font-bold text-blue-900 text-sm">Verified Agency</h4>
                     <p className="text-xs text-blue-700 mt-1">This trip is hosted by a verified partner with a {agency.trustScore || 95}% trust score.</p>
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
                       <div className="flex text-amber-500"><Star className="w-3 h-3 fill-current"/> <span className="text-xs ml-1 text-slate-600">{review.rating}.0</span></div>
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
  );
};

// --- MAIN COMPONENT ---

export const TravelerDashboard: React.FC<TravelerDashboardProps> = ({ agencies, bookings, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookings, setShowBookings] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPackage, setSelectedPackage] = useState<Agency | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Toggle Wishlist
  const toggleWishlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Filter Logic
  const activeAgencies = agencies.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' ? true : 
                            // Simulate category matching based on mock logic for demo
                            (selectedCategory === 'Beach' && ['Goa', 'Thailand', 'Vietnam'].includes(a.location)) ||
                            (selectedCategory === 'Mountain' && ['Himachal', 'Sikkim', 'Kashmir'].includes(a.location)) ||
                            (selectedCategory === 'Desert' && ['Rajasthan'].includes(a.location)) ||
                            (selectedCategory === 'City' && !['Goa', 'Himachal', 'Rajasthan'].includes(a.location));
    
    return a.verified && a.paid && matchesSearch && matchesCategory;
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const matches = MOCK_LOCATIONS.filter(loc => loc.toLowerCase().includes(term.toLowerCase()));
      setHints(matches);
    } else {
      setHints([]);
    }
  };

  const selectHint = (hint: string) => {
    setSearchTerm(hint);
    setHints([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Details Modal */}
      {selectedPackage && (
        <PackageDetailsModal agency={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}

      {/* Modern Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex justify-between items-center sticky top-0 z-40 transition-all">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowBookings(false)}>
          <div className="bg-blue-600 text-white p-1.5 rounded-lg"><MapPin className="w-4 h-4" /></div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Wanderlust</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
           <Button variant={showBookings ? "primary" : "outline"} className="hidden md:flex rounded-full px-6" onClick={() => setShowBookings(!showBookings)}>
            {showBookings ? 'Browse Packages' : 'My Trips'}
          </Button>
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-100/50 rounded-full text-sm border border-slate-200/50">
             <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><User className="w-3.5 h-3.5"/></div>
             <span className="text-slate-600 font-medium">Traveler</span>
          </div>
          <Button variant="secondary" onClick={onLogout} className="text-sm rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 border-transparent">
             <span className="md:hidden"><User className="w-4 h-4"/></span>
             <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </nav>

      {showBookings ? (
        // --- MY TRIPS VIEW (Redesigned) ---
        <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Your Journeys</h2>
              <p className="text-slate-500 mt-1">Manage your upcoming and past expeditions.</p>
            </div>
            <Button variant="outline" onClick={() => setShowBookings(false)} className="md:hidden">Back</Button>
          </div>
          <div className="space-y-6">
            {bookings.map(booking => (
              <Card key={booking.id} className="p-0 overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition-all duration-300 border-slate-200">
                <div className="w-full md:w-64 h-48 md:h-auto bg-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <div className="absolute bottom-4 left-4 z-20 text-white">
                      <p className="text-xs font-bold uppercase tracking-wider opacity-90">Destination</p>
                      <p className="text-2xl font-bold">{booking.destination}</p>
                    </div>
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-xl text-slate-900">{booking.destination} Premium Tour</h3>
                          <Badge variant={booking.status === 'Confirmed' ? 'success' : 'warning'} className="text-[10px] uppercase tracking-wide">{booking.status}</Badge>
                        </div>
                        <p className="text-slate-500 text-sm">Organized by Global Treks Ltd • Booking ID: #{booking.id}</p>
                      </div>
                      <div className="text-right hidden md:block">
                         <p className="text-sm text-slate-400">Total Paid</p>
                         <p className="text-xl font-bold text-slate-900">${booking.amount}</p>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 py-6 border-t border-b border-slate-100">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-5 h-5"/></div>
                       <div>
                         <p className="text-xs text-slate-500 font-bold">DATE</p>
                         <p className="text-sm font-medium">{booking.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Users className="w-5 h-5"/></div>
                       <div>
                         <p className="text-xs text-slate-500 font-bold">TRAVELERS</p>
                         <p className="text-sm font-medium">2 Adults, 1 Child</p>
                       </div>
                    </div>
                     <div className="flex items-center gap-3 md:hidden">
                       <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="w-5 h-5"/></div>
                       <div>
                         <p className="text-xs text-slate-500 font-bold">PAID</p>
                         <p className="text-sm font-medium">${booking.amount}</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 flex gap-3 justify-end">
                    {booking.status === 'Pending' && <Button variant="danger" className="text-sm">Cancel Booking</Button>}
                    <Button variant="outline" className="text-sm">Download Ticket</Button>
                    <Button className="text-sm bg-slate-900 text-white hover:bg-slate-800">Manage Trip</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* --- HERO SECTION (Enhanced) --- */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white pt-20 pb-24 px-6 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-4xl mx-auto">
                <Badge className="bg-white/20 text-white border-none mb-6 backdrop-blur-sm px-4 py-1.5 hover:bg-white/30 transition-colors cursor-default">
                   ✨ Explore the world with verified partners
                </Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                   Curated Adventures, <br/> Unforgettable Memories.
                </h1>
                <p className="text-blue-100 mb-10 text-lg md:text-xl max-w-2xl mx-auto font-light">
                   Discover over 500+ premium tours tailored for the modern traveler. 
                   Book securely with our trust-score guarantee.
                </p>
                
                <div className="max-w-2xl mx-auto relative group text-left">
                  <div className="relative transform transition-all hover:scale-[1.01]">
                    <Search className="absolute left-5 top-4 text-slate-400 w-5 h-5 z-20" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Where to next? (e.g. Bali, Swiss Alps)" 
                        className="w-full pl-14 pr-4 py-4 rounded-2xl text-slate-900 focus:outline-none shadow-2xl shadow-blue-900/20 text-lg placeholder:text-slate-400"
                    />
                    <div className="absolute right-2 top-2 bg-blue-600 text-white p-2.5 rounded-xl cursor-pointer hover:bg-blue-700 transition-colors">
                       <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Hints Dropdown */}
                  {hints.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 border border-slate-100">
                      {hints.map((hint, i) => (
                        <div key={i} onClick={() => selectHint(hint)} className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors">
                          <div className="bg-slate-100 p-1.5 rounded-full"><MapPin className="w-3.5 h-3.5 text-slate-500" /></div> 
                          <span className="font-medium">{hint}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div className="mt-10 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat 
                        ? 'bg-white text-blue-700 shadow-lg scale-105' 
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-overlay filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* --- RESULTS SECTION --- */}
          <div className="max-w-7xl mx-auto p-6 md:p-12 -mt-10 relative z-20">
            <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedCategory !== 'All' ? `${selectedCategory} Getaways` : 'Trending Packages'}
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">{activeAgencies.length} curated experiences available</p>
                </div>
                <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50">
                   <Filter className="w-4 h-4" /> Filter
                </div>
            </div>
            
            {activeAgencies.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No matches found</h3>
                    <p className="text-slate-500">Try adjusting your search or category filters.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}>Clear Filters</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {activeAgencies.map(agency => (
                    <Card key={agency.uid} className="overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-2 group cursor-pointer border-slate-100 rounded-2xl bg-white flex flex-col h-full">
                      {/* Card Image Area */}
                      <div className="h-56 bg-slate-200 relative overflow-hidden" onClick={() => setSelectedPackage(agency)}>
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-10"></div>
                          <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                             <ImageIcon className="w-12 h-12" />
                          </div>
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 z-20">
                            <Badge variant="default" className="bg-white/95 text-slate-900 backdrop-blur-md shadow-sm font-bold px-3 py-1">
                               {agency.location}
                            </Badge>
                          </div>
                          <button 
                            onClick={(e) => toggleWishlist(e, agency.uid)}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white transition-colors group/heart"
                          >
                             <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(agency.uid) ? 'fill-red-500 text-red-500' : 'text-white group-hover/heart:text-red-500'}`} />
                          </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-1" onClick={() => setSelectedPackage(agency)}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                              {agency.location} Adventure
                            </h3>
                          </div>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">Hosted by {agency.name}. An immersive experience into the heart of {agency.location}.</p>
                          
                          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">
                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                               <Clock className="w-3.5 h-3.5" /> 5 Days
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                               <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 2
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">From</p>
                                <div className="flex items-baseline gap-1">
                                  <span className="font-bold text-xl text-slate-900">$300</span>
                                  <span className="text-xs text-slate-400">/person</span>
                                </div>
                            </div>
                            <Button className="rounded-xl px-4 bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-none h-10">
                               View <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                      </div>
                    </Card>
                ))}
                </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};