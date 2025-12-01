"use client"

import { useEffect, useState } from "react"
// import { Button } from ""
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/Shared"

export default function VerificationPending() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-teal-50 to-blue-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Card container with fade and scale animation */}
      <div
        className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Main card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-white/20">
          {/* Icon container with rotating animation */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />

              {/* Inner static circle */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center shadow-lg">
                {/* Shield/verification icon */}
                <svg
                  className="w-10 h-10 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M10 12l2 2 4-4" />
                </svg>
              </div>

              {/* Pulse effect ring */}
              <div className="absolute inset-0 rounded-full border-4 border-teal-500 opacity-0 animate-pulse-ring" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-4 mb-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Verification in Progress</h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Thank you for signing up. Your agency account is currently under review. You'll get access once an admin
              approves your verification.
            </p>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200/50">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm font-medium text-gray-700">Processing</span>
          </div>

          {/* Timeline indicator */}
          <div className="flex gap-2 mb-8">
            <div className="flex-1">
              <div className="h-1 bg-teal-500 rounded-full"></div>
              <p className="text-xs text-teal-600 font-semibold mt-1">Submitted</p>
            </div>
            <div className="flex-1">
              <div className="h-1 bg-teal-200 rounded-full"></div>
              <p className="text-xs text-gray-500 font-semibold mt-1">Under Review</p>
            </div>
            <div className="flex-1">
              <div className="h-1 bg-teal-100 rounded-full"></div>
              <p className="text-xs text-gray-400 font-semibold mt-1">Approval</p>
            </div>
          </div>

          {/* Info message */}
          <div className="text-center mb-8 p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
            <p className="text-sm text-gray-600">
              ⏱️ <span className="font-semibold">This usually takes a few hours.</span> We'll send you an email
              notification once approved.
            </p>
          </div>

          {/* Button */}
          {/* <Button
            onClick={handleReturnHome}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          >
            Return to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Button> */}
        </div>

        {/* Bottom decorative text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Questions? Contact support at <span className="font-semibold text-gray-700">support@agency.com</span>
        </p>
      </div>

      {/* Styles for custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
