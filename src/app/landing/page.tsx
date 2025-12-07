import Link from "next/link"
import { Star, MapPin, Users } from "lucide-react"

export default function Landing() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest">Welcome to Travcy</p>
                <h1 className="text-5xl lg:text-6xl font-bold text-balance">Discover Your Next Adventure</h1>
                <p className="text-xl text-muted-foreground">
                  Connect with travel agents to book unforgettable experiences. Find curated destinations and
                  personalized itineraries.
                </p>
              </div>

              {/* Features */}
              <div className="grid gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Explore Destinations</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover thousands of verified destinations worldwide
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">Expert Agents</h3>
                    <p className="text-sm text-muted-foreground">
                      Work with professional travel agents to plan your trip
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">5-Star Service</h3>
                    <p className="text-sm text-muted-foreground">Highly rated packages and trusted experiences</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link
                  href="/user/login"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition text-center"
                >
                  Login as Customer
                </Link>
                <Link
                  href="/agent/login"
                  className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition text-center"
                >
                  Login as Travel Agent
                </Link>
              </div>
            </div>

            {/* Right Image Placeholder */}
            <div className="relative hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">✈️</div>
                  <p className="text-muted-foreground text-sm">Beautiful destinations await</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
