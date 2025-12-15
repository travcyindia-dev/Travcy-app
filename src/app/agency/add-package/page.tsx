"use client"
import isAgencyAuth from '@/components/isAgencyAuth'
import { Button, Card, Input } from '@/components/ui/Shared'
import { useAgencyAuthContext } from '@/context/AgencyAuthContext'
import { app } from '@/lib/firebase'
import axios from 'axios'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ArrowLeft, DollarSign, ImageIcon, Loader2, Plus, X, Eye, EyeOff, Check, Star, MapPin, Calendar, Users, ShieldCheck, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import { toastSuccess, toastError } from '@/components/ui/ToastTypes'

export const storage = getStorage(app);

interface ItineraryDay {
    day: number;
    title: string;
    description: string;
}

const Page = () => {
    const { user } = useAgencyAuthContext();
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'itinerary' | 'reviews'>('overview');
    
    // Basic Details
    const [packageTitle, setPackageTitle] = useState('');
    const [destination, setDestination] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [maxTravellers, setMaxTravellers] = useState('');
    const [description, setDescription] = useState('');
    const [Pkgimage, setPkgImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    // New Fields
    const [highlights, setHighlights] = useState<string[]>(['']);
    const [inclusions, setInclusions] = useState<string[]>(['']);
    const [exclusions, setExclusions] = useState<string[]>(['']);
    const [itinerary, setItinerary] = useState<ItineraryDay[]>([
        { day: 1, title: '', description: '' }
    ]);

    // Handle image selection with preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setPkgImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Dynamic list handlers
    const addListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        setList([...list, '']);
    };

    const removeListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        if (list.length > 1) {
            setList(list.filter((_, i) => i !== index));
        }
    };

    const updateListItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        const newList = [...list];
        newList[index] = value;
        setList(newList);
    };

    // Itinerary handlers
    const addItineraryDay = () => {
        setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
    };

    const removeItineraryDay = (index: number) => {
        if (itinerary.length > 1) {
            const newItinerary = itinerary.filter((_, i) => i !== index).map((item, i) => ({
                ...item,
                day: i + 1
            }));
            setItinerary(newItinerary);
        }
    };

    const updateItineraryDay = (index: number, field: 'title' | 'description', value: string) => {
        const newItinerary = [...itinerary];
        newItinerary[index][field] = value;
        setItinerary(newItinerary);
    };

    // Filter empty items before submission
    const filterEmptyItems = (list: string[]) => list.filter(item => item.trim() !== '');
    const filterEmptyItinerary = (list: ItineraryDay[]) => list.filter(item => item.title.trim() !== '' || item.description.trim() !== '');

    const handlePublishPackage = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!packageTitle || !destination || !duration || !price) {
            toastError("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        if (user) {
            formData.append('agencyId', user?.uid);
        }
        
        setLoading(true);
        try {
            let uploadedImageUrl = "";
            if (Pkgimage) {
                formData.append("file", Pkgimage);
                const res = await axios.post("/api/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                uploadedImageUrl = res.data.url;
            }

            const response = await axios.post("/api/agency/add-package", {
                agencyId: user?.uid,
                title: packageTitle,
                destination: destination,
                duration: duration,
                price: price,
                maxTravellers: maxTravellers,
                description: description,
                imgUrl: uploadedImageUrl,
                highlights: filterEmptyItems(highlights),
                inclusions: filterEmptyItems(inclusions),
                exclusions: filterEmptyItems(exclusions),
                itinerary: filterEmptyItinerary(itinerary),
            });

            const res = response.data;
            setLoading(false);

            if (res.error) {
                toastError("Failed to publish package");
            } else {
                toastSuccess("Package created successfully!");
                // Reset form
                setPackageTitle('');
                setDestination('');
                setDuration('');
                setPrice('');
                setMaxTravellers('');
                setDescription('');
                setPkgImage(null);
                setImagePreview(null);
                setHighlights(['']);
                setInclusions(['']);
                setExclusions(['']);
                setItinerary([{ day: 1, title: '', description: '' }]);
            }
        } catch (err) {
            setLoading(false);
            toastError("Something went wrong");
        }
    };

    // Preview Component
    const PreviewModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPreview(false)}></div>
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Close Button */}
                <button 
                    onClick={() => setShowPreview(false)}
                    className="absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left: Image & Summary */}
                <div className="md:w-1/3 bg-slate-50 border-r border-slate-100 flex flex-col">
                    <div className="h-48 md:h-64 bg-slate-200 relative overflow-hidden">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Package" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-16 h-16 opacity-30" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                            {duration || '0'} Days / {Math.max(0, parseInt(duration || '0') - 1)} Nights
                        </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                        <h2 className="text-2xl font-bold text-slate-900">{packageTitle || 'Package Title'}</h2>
                        <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4" />
                            <span>{destination || 'Destination'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <span className="font-medium text-blue-600">Your Agency</span>
                            <span>•</span>
                            <div className="flex items-center text-amber-500">
                                <Star className="w-3 h-3 fill-current" /> New
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Base Price</span>
                                <span className="text-xl font-bold text-slate-900">₹{price || '0'}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-100">
                                <span className="text-slate-500 text-sm">Max Travelers</span>
                                <span className="text-sm font-medium">Up to {maxTravellers || '0'}</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                            <Button className="w-full h-12 text-lg" disabled>Book Now</Button>
                            <p className="text-center text-xs text-slate-400 mt-3">Free cancellation up to 48 hours before.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Details Tabs */}
                <div className="md:w-2/3 flex flex-col h-full bg-white overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex space-x-6 bg-white sticky top-0 z-10">
                        {['Overview', 'Itinerary', 'Reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActivePreviewTab(tab.toLowerCase() as any)}
                                className={`text-sm font-medium pb-4 border-b-2 transition-colors ${
                                    activePreviewTab === tab.toLowerCase()
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {activePreviewTab === 'overview' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">About this trip</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {description || 'No description provided yet.'}
                                    </p>
                                </div>

                                {filterEmptyItems(highlights).length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-3">Highlights</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {filterEmptyItems(highlights).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                                        <Star className="w-3 h-3" />
                                                    </div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filterEmptyItems(inclusions).length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-3">What's Included</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {filterEmptyItems(inclusions).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filterEmptyItems(exclusions).length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-3">What's Not Included</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {filterEmptyItems(exclusions).map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                                        <X className="w-3 h-3" />
                                                    </div>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                                    <div className="p-2 bg-white rounded-lg h-fit text-blue-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-sm">Verified Agency</h4>
                                        <p className="text-xs text-blue-700 mt-1">This trip is hosted by a verified partner.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePreviewTab === 'itinerary' && (
                            <div className="space-y-6">
                                {filterEmptyItinerary(itinerary).length > 0 ? (
                                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                                        {filterEmptyItinerary(itinerary).map((day, index) => (
                                            <div key={index} className="relative pl-8">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white"></div>
                                                <h4 className="font-bold text-slate-900 text-sm">Day {day.day}: {day.title || 'Untitled'}</h4>
                                                <p className="text-slate-600 text-sm mt-1">{day.description || 'No description'}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-center py-8">No itinerary added yet.</p>
                                )}
                            </div>
                        )}

                        {activePreviewTab === 'reviews' && (
                            <div className="text-center py-12 text-slate-500">
                                <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No reviews yet. Reviews will appear here once customers book and review your package.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <main className="max-w-4xl mx-auto p-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/agency" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <Button 
                        variant="outline" 
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2"
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </Button>
                </div>

                <Card className="p-8">
                    <div className="mb-8 border-b border-slate-100 pb-4">
                        <h1 className="text-2xl font-bold text-slate-900">Create New Package</h1>
                        <p className="text-slate-500">Add details for your new tour package.</p>
                    </div>

                    <form onSubmit={handlePublishPackage} className="space-y-8">
                        {/* Basic Information */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                                Basic Information
                            </h2>
                            
                            <Input 
                                label="Package Title *" 
                                placeholder="e.g. Magical Bali Adventure" 
                                value={packageTitle} 
                                onChange={(e: any) => setPackageTitle(e.target.value)} 
                                required 
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Input 
                                    label="Destination *" 
                                    placeholder="e.g. Bali, Indonesia" 
                                    required 
                                    value={destination} 
                                    onChange={(e: any) => setDestination(e.target.value)} 
                                />
                                <Input 
                                    label="Duration (Days) *" 
                                    type="number" 
                                    min="1" 
                                    placeholder="e.g. 5" 
                                    required 
                                    value={duration} 
                                    onChange={(e: any) => setDuration(e.target.value)} 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Price (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" 
                                            placeholder="29999" 
                                            required 
                                            value={price} 
                                            onChange={(e: any) => setPrice(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <Input 
                                    label="Max Travelers" 
                                    type="number" 
                                    min="1" 
                                    placeholder="e.g. 15" 
                                    value={maxTravellers} 
                                    onChange={(e: any) => setMaxTravellers(e.target.value)} 
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Description *</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                    placeholder="Describe the experience, what makes this package special, and what travelers can expect..."
                                    required
                                    value={description}
                                    onChange={(e: any) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">2</span>
                                Highlights
                            </h2>
                            <p className="text-sm text-slate-500">Key attractions and experiences of this package</p>
                            
                            {highlights.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateListItem(highlights, setHighlights, index, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        placeholder="e.g. Visit ancient temples"
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeListItem(highlights, setHighlights, index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addListItem(highlights, setHighlights)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Highlight
                            </button>
                        </div>

                        {/* Inclusions */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
                                What's Included
                            </h2>
                            <p className="text-sm text-slate-500">Things included in the package price</p>
                            
                            {inclusions.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateListItem(inclusions, setInclusions, index, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        placeholder="e.g. Airport transfers"
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeListItem(inclusions, setInclusions, index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addListItem(inclusions, setInclusions)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Inclusion
                            </button>
                        </div>

                        {/* Exclusions */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm">4</span>
                                What's Not Included
                            </h2>
                            <p className="text-sm text-slate-500">Things not included in the package price</p>
                            
                            {exclusions.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => updateListItem(exclusions, setExclusions, index, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        placeholder="e.g. Personal expenses"
                                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeListItem(exclusions, setExclusions, index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addListItem(exclusions, setExclusions)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Exclusion
                            </button>
                        </div>

                        {/* Itinerary */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm">5</span>
                                Day-by-Day Itinerary
                            </h2>
                            <p className="text-sm text-slate-500">Outline what travelers will experience each day</p>
                            
                            {itinerary.map((day, index) => (
                                <div key={index} className="p-4 bg-slate-50 rounded-xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-700">Day {day.day}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeItineraryDay(index)}
                                            className="p-1 text-red-500 hover:bg-red-100 rounded transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={day.title}
                                        onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        placeholder="Day title (e.g. Arrival & Welcome)"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <textarea
                                        value={day.description}
                                        onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                        placeholder="Describe activities for this day..."
                                        rows={2}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItineraryDay}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-4 h-4" /> Add Day
                            </button>
                        </div>

                        {/* Cover Image */}
                        <div className="space-y-4 pt-6 border-t border-slate-100">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">6</span>
                                Cover Image
                            </h2>
                            
                            <label
                                htmlFor="pkg-img"
                                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors group block"
                            >
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                        <p className="text-sm text-slate-500 mt-2">Click to change image</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm text-slate-900 font-medium">Click to upload image</p>
                                        <p className="text-xs text-slate-500">PNG, JPG (Max 2MB)</p>
                                    </>
                                )}
                            </label>

                            <input
                                type="file"
                                id="pkg-img"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* Actions */}
                        <div className="pt-6 flex gap-3 justify-between border-t border-slate-100">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setShowPreview(true)}
                            >
                                <Eye className="w-4 h-4" /> Preview Package
                            </Button>
                            <div className="flex gap-3">
                                <Link href="/agency">
                                    <Button variant="secondary" type="button">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : 'Publish Package'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </main>

            {/* Preview Modal */}
            {showPreview && <PreviewModal />}
        </div>
    );
};

export default isAgencyAuth(Page);