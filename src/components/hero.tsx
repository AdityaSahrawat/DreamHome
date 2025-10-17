"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Image from "next/image";
import ActionButton from "./actionButton";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-indigo-700/95 to-purple-800/95 mix-blend-multiply" />
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.1)`,
          }}
        >
          <Image
            src="/uploads/dreamhome_hero.avif"
            alt="Modern building"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent"></div>
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>

      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in shadow-lg hover:bg-white/20 transition-colors cursor-pointer">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span>Trusted by 3,200+ Happy Renters</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] max-w-5xl animate-slide-up mb-6" style={{ animationDelay: "0.1s" }}>
            Your Journey to the
            <br />
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Perfect Home
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 10" preserveAspectRatio="none">
                <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              </svg>
            </span>
            <br />
            <span className="text-white/90 text-4xl md:text-5xl lg:text-6xl">Starts Here</span>
          </h1>

          <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-3xl animate-slide-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Discover, apply, and move into your dream home with our seamless platform designed for modern renters
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-5 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <ActionButton
              href="/properties"
              className="bg-white text-blue-700 hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl text-lg px-8 py-6 font-semibold"
            >
              Browse Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </ActionButton>
            <button className="group inline-flex items-center gap-3 px-8 py-6 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 transition-all duration-300 text-lg font-semibold">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                <Play className="h-5 w-5 ml-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full max-w-4xl animate-slide-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "5000+", label: "Properties", gradient: "from-blue-400 to-blue-200" },
              { value: "3200+", label: "Happy Renters", gradient: "from-indigo-400 to-indigo-200" },
              { value: "1500+", label: "Property Owners", gradient: "from-purple-400 to-purple-200" },
              { value: "15+", label: "Cities", gradient: "from-pink-400 to-pink-200" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;