import React, { useState } from 'react';
import { Card, Input, Button } from '../ui/Shared';
import { Agency } from '../../types';
import { FileText, ShieldCheck, Loader2 } from 'lucide-react';

interface RegistrationProps {
  onCancel: () => void;
  onSubmit: (data: Partial<Agency>) => void;
}

export const AgencyRegistrationForm: React.FC<RegistrationProps> = ({ onCancel, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    taxId: '',
    website: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
        if (!formData.name || !formData.location || !formData.email) return alert("Please fill in required fields");
        setStep(2);
    }
  };

  const handleSubmit = () => {
    if(!formData.taxId) return alert("Tax ID is required for verification");
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onSubmit({ 
        name: formData.name, 
        location: formData.location, 
        taxId: formData.taxId,
        website: formData.website,
        verified: false, 
        paid: false, 
        // Tier: 'Pending', 
        // rating: 0, 
        // priceStart: 0 
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
       <div className="max-w-2xl mx-auto">
         {/* Progress Bar */}
         <div className="mb-8 flex items-center justify-between relative max-w-xs mx-auto">
           <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 z-0"></div>
           <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= 1 ? 'bg-blue-600' : 'bg-slate-300'}`}>1</div>
           <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors ${step >= 2 ? 'bg-blue-600' : 'bg-slate-300'}`}>2</div>
         </div>

         <Card className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Business Details</h2>
                  <p className="text-slate-500">Step 1 of 2: Basic Information</p>
                </div>
                
                <Input label="Agency Name" value={formData.name} onChange={(e: any) => handleChange('name', e.target.value)} placeholder="e.g. Dream Travels" />
                <Input label="Business Email" value={formData.email} onChange={(e: any) => handleChange('email', e.target.value)} placeholder="contact@agency.com" />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" value={formData.phone} onChange={(e: any) => handleChange('phone', e.target.value)} placeholder="+1 234..." />
                  <Input label="Headquarters (City)" value={formData.location} onChange={(e: any) => handleChange('location', e.target.value)} placeholder="e.g. London" />
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={onCancel}>Cancel</Button>
                  <Button onClick={handleNext}>Next Step</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                 <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">Verification (KYC)</h2>
                  <p className="text-slate-500">Step 2 of 2: Submit Documents for Review</p>
                </div>

                <Input label="Tax ID / Business License" value={formData.taxId} onChange={(e: any) => handleChange('taxId', e.target.value)} placeholder="XXXX-XXXX-XXXX" />
                <Input label="Website URL" value={formData.website} onChange={(e: any) => handleChange('website', e.target.value)} placeholder="https://" />
                
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                  <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-medium text-slate-700">Upload Business Certification</p>
                  <p className="text-xs text-slate-400">PDF or JPG up to 5MB</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-800">Admin Approval Required</h4>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      Once you submit, our admins will verify your documents. You will be able to select a plan and pay only <b>after</b> approval.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Submitting...</> : 'Submit Application'}
                  </Button>
                </div>
              </div>
            )}
         </Card>
       </div>
    </div>
  );
};