"use client";

import { Star } from "lucide-react";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  rating: number;
  image?: string;
  delay?: number;
}

const TestimonialCard = ({ name, role, quote, rating, image, delay = 0 }: TestimonialCardProps) => {
  return (
    <div 
      className="p-6 md:p-8 rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md flex flex-col animate-slide-up"
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
        {image ? (
          <div className="relative w-12 h-12 rounded-full mr-4 overflow-hidden">
            <Image 
              src={image} 
              alt={name} 
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-foreground/80 font-medium">
            {name.split(" ").map(part => part[0]).slice(0,2).join("")}
          </div>
        )}
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;