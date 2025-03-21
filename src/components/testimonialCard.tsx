"use client";

import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
  delay?: number;
}

const TestimonialCard = ({ name, role, quote, rating, image, delay = 0 }: TestimonialCardProps) => {
  return (
    <div 
      className="glass-card p-6 md:p-8 rounded-2xl transition-all duration-300 hover:shadow-md flex flex-col animate-slide-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center space-x-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
      
      <p className="text-foreground/90 text-lg italic mb-6">"{quote}"</p>
      
      <div className="mt-auto flex items-center">
        <div className="relative w-12 h-12 rounded-full mr-4 overflow-hidden">
          <Image 
            src={image} 
            alt={name} 
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;