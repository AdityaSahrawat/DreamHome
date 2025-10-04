"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import ActionButton from "./actionButton";


const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-800/90 mix-blend-multiply" />
        <div className="absolute inset-0">
          <Image
            src="/uploads/dreamhome_hero.avif"
            alt="Modern building"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in">
            Discover Your Perfect Living Space (test)
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight max-w-4xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Find Your Perfect Home with <span className="text-blue-200">DreamHome</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-white/90 max-w-2xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Rent hassle-free, manage properties, and get approved quickly with our streamlined platform designed for modern living.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <ActionButton
              href="/properties"
              className="bg-white text-blue-700 hover:bg-white/90"
              variant="outline"
            >
              Browse Properties
            </ActionButton>
            <ActionButton
              href="/how-it-works"
              variant="ghost"
              className="text-white border border-white/30 hover:bg-white/10"
            >
              How It Works <ArrowRight className="ml-2 h-4 w-4" />
            </ActionButton>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">5000+</p>
              <p className="text-white/80 text-sm mt-1">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">3200+</p>
              <p className="text-white/80 text-sm mt-1">Happy Renters</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">1500+</p>
              <p className="text-white/80 text-sm mt-1">Property Owners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-white">15+</p>
              <p className="text-white/80 text-sm mt-1">Cities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;