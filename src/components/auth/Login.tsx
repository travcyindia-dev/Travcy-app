import React, { useState } from 'react';
import { Card, Input, Button } from '../ui/Shared';
import { toastError } from '../ui/ToastTypes';

interface LoginProps {
  onLogin: (email: string, type: 'general' | 'agency') => void;
  onRegisterAgency: () => void;
}

export const UnifiedLogin: React.FC<LoginProps> = ({ onLogin, onRegisterAgency }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'agency'>('general');
  const [email, setEmail] = useState('');
  
  const handleSubmit = () => {
    if(!email) return toastError("Please enter an email");
    onLogin(email, activeTab);
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login for demo purposes
    onLogin('user@gmail.com', 'general');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Wanderlust</h1>
          <p className="text-slate-500">Travel Platform Access</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'general' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            User
          </button>
          <button 
            onClick={() => setActiveTab('agency')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'agency' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
          >
            Partner Agency
          </button>
        </div>

        <div className="space-y-4">
          <Input 
            label={activeTab === 'general' ? "Email Address" : "Business Email"} 
            placeholder={activeTab === 'general' ? "admin@admin.com OR user@gmail.com" : "contact@agency.com"}
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <Input label="Password" type="password" placeholder="••••••••" />
          
          <Button className="w-full" onClick={handleSubmit}>
            {activeTab === 'general' ? 'Login' : 'Login to Partner Portal'}
          </Button>

          {activeTab === 'general' && (
            <>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">OR CONTINUE WITH</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              <Button variant="outline" className="w-full relative" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </>
          )}

          {activeTab === 'agency' && (
             <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-2">New partner?</p>
                <Button variant="outline" className="w-full" onClick={onRegisterAgency}>Register Agency</Button>
             </div>
          )}
        </div>
      </Card>
    </div>
  );
};