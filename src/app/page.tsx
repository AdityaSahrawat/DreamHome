"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { ArrowRight, Search, Shield, Clock, Home, PenTool, CheckCircle } from "lucide-react";
import Navbar from "@/src/components/navbar";
// Lazy load heavy hero section to reduce initial JS on low resource (B1s) instances
const Hero = dynamic(() => import('@/src/components/hero'), { ssr: true, loading: () => (
  <div className="w-full h-72 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-500">Loading...</div>
) });
import FeatureCard from "@/src/components/featureCard";
import ActionButton from "@/src//components/actionButton";
import Footer from "@/src/components/footer";

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
  <Navbar />
      <Hero />
      
  {/* Primary Actions (trimmed) */}
  <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
              Get Started
            </span>
            {/* Tagline removed per redesign request */}
            <p className="text-lg text-muted-foreground max-w-2xl">
              Whether you&apos;re looking to rent, buy, or manage properties, explore opportunities with a streamlined experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{animationDelay: "0.1s"}}>
              <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <Home className="h-16 w-16 text-white" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">Find Properties</h3>
                <p className="text-muted-foreground mb-6">
                  Browse thousands of listings with detailed filters to find your perfect match.
                </p>
                <ActionButton href="/properties" variant="outline" className="w-full">
                  Browse Homes <ArrowRight className="ml-2 h-4 w-4" />
                </ActionButton>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{animationDelay: "0.2s"}}>
              <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <PenTool className="h-16 w-16 text-white" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">Apply Online</h3>
                <p className="text-muted-foreground mb-6">
                  Complete your application online in minutes with our secure form.
                </p>
                <ActionButton href="/register" className="w-full">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </ActionButton>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{animationDelay: "0.3s"}}>
              <div className="h-40 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-3">Check Status</h3>
                <p className="text-muted-foreground mb-6">
                  Track your application status in real-time with our transparent process.
                </p>
                <ActionButton href="/application-status" variant="outline" className="w-full">
                  Check Status <ArrowRight className="ml-2 h-4 w-4" />
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </section>

  {/* Core Features (reduced) */}
  <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
              Our Advantages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose DreamHome?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We&apos;ve reimagined the rental experience with these key benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Smart Search"
              description="Find properties fast with powerful filters."
              delay={0.1}
              cta={{ text: "Search", href: "/properties" }}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure"
              description="Bank-level protection for your data."
              delay={0.15}
              cta={{ text: "Security", href: "/how-it-works" }}
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Fast Approval"
              description="Streamlined application decisions."
              delay={0.2}
              cta={{ text: "How it works", href: "/how-it-works" }}
            />
          </div>
        </div>
      </section>

      {/* CTA Section (simplified, removed heavy background image) */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Home?</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">Join renters already using our platform.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <ActionButton 
                href="/register" 
                className="bg-white text-blue-700 hover:bg-white/90"
                variant="outline"
                icon={<PenTool className="h-5 w-5" />}
              >
                Create Account
              </ActionButton>
              <ActionButton 
                href="/properties" 
                variant="ghost"
                className="text-white border border-white/30 hover:bg-white/10"
                icon={<Home className="h-5 w-5" />}
              >
                Browse Properties
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;