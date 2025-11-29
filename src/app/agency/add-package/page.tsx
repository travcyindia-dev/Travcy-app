"use client"
import isAuth from '@/components/isAuth'
import { Button, Card, Input } from '@/components/ui/Shared'
import { useAuthContext } from '@/context/AuthContext'
import { app } from '@/lib/firebase'
import axios from 'axios'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { ArrowLeft, DollarSign, ImageIcon, Loader2 } from 'lucide-react'
import Link from 'next/link'
import React, { FormEvent } from 'react'
import { v4 as uuid } from "uuid";
export const storage = getStorage(app);
const page = () => {
    const { user } = useAuthContext();
    console.log("user:", user);
    const [loading, setLoading] = React.useState(false);
    const [packageTitle, setPackageTitle] = React.useState('');
    const [destination, setDestination] = React.useState('');
    const [duration, setDuration] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [maxTravellers, setMaxTravellers] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [Pkgimage, setPkgImage] = React.useState<File | null>(null);
    const [imgurl,setImgUrl]=React.useState('');
    // console.log("package title:",packageTitle);
    // --- HANDLERS ---
    const handlePublishPackage = async (e: FormEvent) => {
        const formData = new FormData();
        if (user) {
            formData.append('agencyId', user?.uid);
        }
        
        e.preventDefault();
        setLoading(true);
        try {
            // 1️⃣ Upload Image if exists
             let uploadedImageUrl = ""
            if (Pkgimage) {
                formData.append("file", Pkgimage);
               const res = await axios.post("/api/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" }
                });
                // const imageRef = ref(storage, `packages/${user?.uid}/${uuid()}`);
                // await uploadBytes(imageRef, Pkgimage);
                // imageUrl = await getDownloadURL(imageRef);
                uploadedImageUrl = res.data.url;
                console.log("result of cloudinary:", res);
              
            }


            // 2️⃣ Send data to API
             
                 const response = await axios.post("/api/agency/add-package", {
                    agencyId: user?.uid,
                    title: packageTitle,
                    destination:destination,
                    duration:duration,
                    price:price,
                    maxTravellers:maxTravellers,
                    description:description,
                    imgUrl:uploadedImageUrl,
                });
            
            const res =  response.data;
            setLoading(false);

            if (res.error) {
                alert("Failed to publish package");
            } else {
                alert("Package created!");
            }
        } catch (err) {
            setLoading(false);
            alert("Something went wrong");
        }
    };
    console.log("image:", Pkgimage);
    return (
        <div>
            <main className="max-w-3xl mx-auto p-8 animate-in fade-in slide-in-from-right-4">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors" >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </div>
                </div>
                <Card className="p-8">
                    <div className="mb-8 border-b border-slate-100 pb-4">
                        <h1 className="text-2xl font-bold text-slate-900">Create New Package</h1>
                        <p className="text-slate-500">Add details for your new tour package.</p>
                    </div>
                    <form onSubmit={handlePublishPackage} className="space-y-6">
                        <Input label="Package Title" placeholder="e.g. 5 Days in Paradise" value={packageTitle} onChange={(e: any) => setPackageTitle(e.target.value)} required />

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Destination" placeholder="e.g. Bali" required value={destination} onChange={(e: any) => setDestination(e.target.value)} />
                            <Input label="Duration (Days)" type="number" min="1" placeholder="e.g. 5" required value={duration} onChange={(e: any) => setDuration(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Price (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input type="number" min="0" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" placeholder="299" required value={price} onChange={(e:any)=>setPrice(e.target.value)} />
                                </div>
                            </div>
                            <Input label="Max Travelers" type="number" min="1" placeholder="e.g. 15" value={maxTravellers} onChange={(e: any) => setMaxTravellers(e.target.value)} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                                placeholder="Describe the itinerary, highlights, and what's included..."
                                required
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Image Upload Mock */}
                        <div className="flex flex-col gap-1.5 relative">
                            <label className="text-sm font-medium text-slate-700"  >Cover Image</label>
                            <label
                                htmlFor="pkg-img"
                                className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors group"
                            >
                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <p className="text-sm text-slate-900 font-medium">Click to upload image</p>
                                <p className="text-xs text-slate-500">SVG, PNG, JPG (Max 2MB)</p>
                            </label>

                            <input
                                type="file"
                                id="pkg-img"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setPkgImage(file);
                                    console.log("Uploaded Image:", file);
                                }
                                }
                            />
                        </div>

                        <div className="pt-4 flex gap-3 justify-end border-t border-slate-100 mt-4">
                            <Link href={'/agency'}>
                                <Button variant="secondary" type="button">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</> : 'Publish Package'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
        </div>
    )
}

export default isAuth(page)