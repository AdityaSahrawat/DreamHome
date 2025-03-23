"use client"

import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Search, 
  Shield, 
  Clock, 
  Home, 
  BadgeCheck, 
  MapPin, 
  DollarSign,
  PenTool,
  CheckCircle,
  Sparkles,
  Bookmark,
  Lock
} from "lucide-react";
import Navbar from "@/src/components/navbar";
import Hero from "@/src/components/hero";
import FeatureCard from "@/src/components/featureCard";
import TestimonialCard from "@/src/components/testimonialCard";
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
      
      {/* Main Actions Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
              Get Started
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Path to the Perfect Home
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Whether you're looking to rent, buy, or manage properties, we've made the process simple and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
              Our Advantages
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose DreamHome?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We've reimagined the rental experience with these key benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Smart Search"
              description="Our advanced filters help you find properties that match your exact needs and preferences."
              delay={0.1}
              cta={{ text: "Try it now", href: "/properties" }}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure Process"
              description="Your personal information and payments are protected with bank-level security."
              delay={0.2}
              cta={{ text: "Learn more", href: "/how-it-works" }}
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Fast Approval"
              description="Get approved quickly with our streamlined application process."
              delay={0.3}
              cta={{ text: "See how it works", href: "/how-it-works" }}
            />
            <FeatureCard
              icon={<BadgeCheck className="h-6 w-6" />}
              title="Verified Listings"
              description="Every property is verified by our team to ensure accurate information."
              delay={0.4}
              cta={{ text: "View properties", href: "/properties" }}
            />
            <FeatureCard
              icon={<MapPin className="h-6 w-6" />}
              title="Virtual Tours"
              description="Explore properties remotely with immersive 3D tours and detailed photos."
              delay={0.5}
              cta={{ text: "Take a tour", href: "/properties" }}
            />
            <FeatureCard
              icon={<DollarSign className="h-6 w-6" />}
              title="Transparent Pricing"
              description="No hidden fees or surprises. Know exactly what you're paying for."
              delay={0.6}
              cta={{ text: "See pricing", href: "/how-it-works" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Premium Listings"
              description="Access exclusive properties not available on other platforms."
              delay={0.7}
              cta={{ text: "View premium", href: "/properties" }}
              className="md:col-span-1"
            />
            <FeatureCard
              icon={<Bookmark className="h-6 w-6" />}
              title="Save Favorites"
              description="Bookmark properties you love and compare them side by side."
              delay={0.8}
              cta={{ text: "Create account", href: "/register" }}
              className="md:col-span-1"
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Secure Applications"
              description="Apply with confidence knowing your data is encrypted and protected."
              delay={0.9}
              cta={{ text: "Apply now", href: "/register" }}
              className="md:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Don't just take our word for it – here's what our satisfied customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Renter"
              quote="DreamHome made finding my apartment incredibly easy. The virtual tours saved me so much time!"
              rating={5}
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              delay={0.1}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Property Owner"
              quote="Managing my rental properties has never been easier. The dashboard is intuitive and powerful."
              rating={4}
              image="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              delay={0.2}
            />
            <TestimonialCard
              name="Jessica Patel"
              role="Renter"
              quote="The application process was so fast! I was approved within 48 hours and could move in right away."
              rating={5}
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of happy renters who found their perfect home with us.
            </p>
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
      
      {/* Newsletter Section */}
      <section className="py-24 bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest property listings and housing tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 rounded-xl border border-gray-200 flex-grow focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <ActionButton icon={<ArrowRight className="h-5 w-5" />}>
                Subscribe
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