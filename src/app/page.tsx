"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { ArrowRight, Search, Shield, Clock, Home, PenTool, CheckCircle, Sparkles, TrendingUp, Users, Award, MapPin, Key, FileCheck, Zap, Star, MessageSquare } from "lucide-react";
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "New Homeowner",
      content: "DreamHome made finding my perfect apartment so easy. The process was seamless and the team was incredibly helpful!",
      rating: 5,
      image: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      content: "As a property manager, this platform has streamlined everything. Highly recommended for both renters and landlords.",
      rating: 5,
      image: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Happy Renter",
      content: "I found my dream home in just two weeks! The search filters and responsive support made all the difference.",
      rating: 5,
      image: "ER"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Search & Discover",
      description: "Browse through our extensive collection of verified properties with advanced filters.",
      icon: <Search className="h-8 w-8" />
    },
    {
      step: "02",
      title: "Schedule Visit",
      description: "Book property viewings at your convenience with instant confirmation.",
      icon: <MapPin className="h-8 w-8" />
    },
    {
      step: "03",
      title: "Apply Online",
      description: "Complete your application securely online with our streamlined process.",
      icon: <FileCheck className="h-8 w-8" />
    },
    {
      step: "04",
      title: "Move In",
      description: "Get approved quickly and move into your dream home hassle-free.",
      icon: <Key className="h-8 w-8" />
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Navbar />
      <Hero />
      
      <section className="relative py-20 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 backdrop-blur-sm text-blue-700 text-sm font-medium mb-6 animate-fade-in">
              <Zap className="h-4 w-4" />
              <span>Your Journey Starts Here</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-slide-up">
              Everything You Need,
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> All In One Place</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl animate-slide-up" style={{animationDelay: "0.1s"}}>
              From searching to signing, we&apos;ve streamlined the entire rental experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-slide-up" style={{animationDelay: "0.1s"}}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Find Properties</h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Browse thousands of verified listings with powerful filters and real-time updates.
                </p>
                <ActionButton href="/properties" variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-blue-600">
                  Explore Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </ActionButton>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-slide-up" style={{animationDelay: "0.2s"}}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <PenTool className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Apply Online</h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Complete your secure application in minutes with our smart, streamlined process.
                </p>
                <ActionButton href="/register" className="w-full bg-white text-indigo-600 hover:bg-white/90">
                  Get Started <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </ActionButton>
              </div>
            </div>

            <div className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-slide-up" style={{animationDelay: "0.3s"}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Track Progress</h3>
                <p className="text-white/90 mb-8 leading-relaxed">
                  Monitor your application status in real-time with instant notifications and updates.
                </p>
                <ActionButton href="/profile" variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-purple-600">
                  View Status <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 text-indigo-700 text-sm font-medium mb-6">
              <Clock className="h-4 w-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How It <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Get from search to move-in in just 4 simple steps
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {howItWorks.map((step, index) => (
                <div key={index} className={`group animate-slide-up`} style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="relative">
                    {/* Step Number Circle */}
                    <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-blue-500 to-indigo-600' :
                      index === 1 ? 'from-indigo-600 to-purple-600' :
                      index === 2 ? 'from-purple-600 to-pink-600' :
                      'from-pink-600 to-rose-600'
                    } text-white font-bold text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative`}>
                      {step.step}
                    </div>
                    
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-600 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
                        {step.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3 text-center">{step.title}</h3>
                    <p className="text-muted-foreground text-center text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200/50 text-blue-700 text-sm font-medium mb-6">
              <Award className="h-4 w-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Built For <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Modern Living</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We&apos;ve reimagined the rental experience with cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="AI-Powered Search"
              description="Find your perfect home faster with intelligent search filters and personalized recommendations."
              delay={0.1}
              cta={{ text: "Try Search", href: "/properties" }}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Bank-Level Security"
              description="Your data is protected with enterprise-grade encryption and security protocols."
              delay={0.15}
              cta={{ text: "Learn More", href: "/how-it-works" }}
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Instant Approvals"
              description="Get approved in hours, not days, with our streamlined verification process."
              delay={0.2}
              cta={{ text: "Apply Now", href: "/register" }}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="24/7 Support"
              description="Our dedicated team is always here to help you with any questions or concerns."
              delay={0.25}
              cta={{ text: "Contact Us", href: "/contact" }}
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              title="Verified Listings"
              description="Every property is verified and inspected to ensure quality and accuracy."
              delay={0.3}
              cta={{ text: "View Homes", href: "/properties" }}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Market Insights"
              description="Access real-time market data and trends to make informed decisions."
              delay={0.35}
              cta={{ text: "Explore Data", href: "/properties" }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <MessageSquare className="h-4 w-4" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved By Thousands
            </h2>
            <p className="text-lg text-white/80 max-w-2xl">
              Don&apos;t just take our word for it - hear from our happy customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Testimonial Content */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.image}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group animate-slide-up" style={{animationDelay: "0.1s"}}>
              <div className="relative inline-block">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  5000+
                </div>
                <div className="absolute -inset-4 bg-blue-100 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </div>
              <p className="text-muted-foreground font-medium">Properties Listed</p>
            </div>
            
            <div className="text-center group animate-slide-up" style={{animationDelay: "0.2s"}}>
              <div className="relative inline-block">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  3200+
                </div>
                <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </div>
              <p className="text-muted-foreground font-medium">Happy Renters</p>
            </div>
            
            <div className="text-center group animate-slide-up" style={{animationDelay: "0.3s"}}>
              <div className="relative inline-block">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  1500+
                </div>
                <div className="absolute -inset-4 bg-purple-100 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </div>
              <p className="text-muted-foreground font-medium">Property Owners</p>
            </div>
            
            <div className="text-center group animate-slide-up" style={{animationDelay: "0.4s"}}>
              <div className="relative inline-block">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
                  15+
                </div>
                <div className="absolute -inset-4 bg-pink-100 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </div>
              <p className="text-muted-foreground font-medium">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium Design */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              <span>Start Your Journey Today</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Find Your
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                Dream Home?
              </span>
            </h2>
            
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of happy renters who found their perfect home through our platform. Get started in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <ActionButton 
                href="/register" 
                className="bg-white text-blue-700 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl text-lg px-8 py-6"
                icon={<PenTool className="h-5 w-5" />}
              >
                Create Free Account
              </ActionButton>
              <ActionButton 
                href="/properties" 
                variant="outline"
                className="text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 text-lg px-8 py-6"
                icon={<Home className="h-5 w-5" />}
              >
                Browse Properties
              </ActionButton>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Free to Browse</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-300" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;