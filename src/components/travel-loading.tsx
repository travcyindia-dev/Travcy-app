"use client"

import { useEffect, useState } from "react"

export default function TravelLoading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <style>{`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          @keyframes planeFloat {
            0% {
              transform: translateX(-120px) translateY(0px) rotate(-15deg);
              opacity: 0;
            }
            5% {
              opacity: 1;
              transform: translateX(-120px) translateY(0px) rotate(-15deg);
            }
            50% {
              transform: translateX(180px) translateY(-30px) rotate(0deg);
            }
            95% {
              opacity: 1;
              transform: translateX(480px) translateY(-50px) rotate(15deg);
            }
            100% {
              transform: translateX(480px) translateY(-50px) rotate(15deg);
              opacity: 0;
            }
          }

          @keyframes dashOffset {
            to {
              stroke-dashoffset: -1000;
            }
          }

          @keyframes pulseScale {
            0%, 100% {
              transform: scale(1);
              opacity: 0.6;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }

          @keyframes rotatePlane {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-fadeInScale {
            animation: fadeInScale 0.8s ease-out forwards;
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-planeFloat {
            animation: planeFloat 5s ease-in-out infinite;
          }

          .animate-dashOffset {
            animation: dashOffset 3s linear infinite;
          }

          .animate-pulseScale {
            animation: pulseScale 2s ease-in-out infinite;
          }

          .animate-rotatePlane {
            animation: rotatePlane 20s linear infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          .animation-delay-plane-1 {
            animation-delay: 0s;
          }

          .animation-delay-plane-2 {
            animation-delay: 1.7s;
          }

          .animation-delay-plane-3 {
            animation-delay: 3.4s;
          }
        `}</style>

        <div className="text-center animate-fadeInScale space-y-8">
          <div className="flex justify-center mb-8">
            <div className="relative w-[20rem] h-[20rem]">
              {/* Rotating compass background */}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 w-full h-full animate-rotatePlane"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/10"
                />
                {/* Compass points */}
                <text x="100" y="15" textAnchor="middle" className="text-xs fill-primary/40" fontSize="10">
                  N
                </text>
                <text x="185" y="105" textAnchor="middle" className="text-xs fill-primary/40" fontSize="10">
                  E
                </text>
                <text x="100" y="190" textAnchor="middle" className="text-xs fill-primary/40" fontSize="10">
                  S
                </text>
                <text x="15" y="105" textAnchor="middle" className="text-xs fill-primary/40" fontSize="10">
                  W
                </text>
              </svg>

              {/* Center pulse point */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-6 h-6 bg-primary rounded-full animate-pulseScale shadow-lg shadow-primary/50" />
              </div>

              {/* Animated path circle */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-primary/30 animate-dashOffset"
                  strokeDasharray="1000"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>

              {/* Flying planes */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Plane 1 */}
                <g className="animate-planeFloat animation-delay-plane-1">
                  <circle cx="40" cy="100" r="7" fill="currentColor" className="text-primary" />
                  <path
                    d="M 32 100 L 48 100 M 40 94 L 40 106"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary"
                    strokeLinecap="round"
                  />
                  <path d="M 42 95 L 48 92 L 42 88" fill="currentColor" className="text-primary" />
                </g>

                {/* Plane 2 */}
                <g className="animate-planeFloat animation-delay-plane-2">
                  <circle cx="40" cy="100" r="7" fill="currentColor" className="text-accent" opacity="0.8" />
                  <path
                    d="M 32 100 L 48 100 M 40 94 L 40 106"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-accent"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <path d="M 42 95 L 48 92 L 42 88" fill="currentColor" className="text-accent" opacity="0.8" />
                </g>

                {/* Plane 3 */}
                <g className="animate-planeFloat animation-delay-plane-3">
                  <circle cx="40" cy="100" r="7" fill="currentColor" className="text-primary/60" opacity="0.6" />
                  <path
                    d="M 32 100 L 48 100 M 40 94 L 40 106"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary/60"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  <path d="M 42 95 L 48 92 L 42 88" fill="currentColor" className="text-primary/60" opacity="0.6" />
                </g>
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            {/* <h1 className="text-2xl font-bold text-foreground tracking-tight">Loading</h1> */}
            <p className="text-sm text-muted-foreground font-medium">Preparing your journey...</p>
          </div>

          <div className="flex justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
