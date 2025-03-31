
"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="relative rounded-xl overflow-hidden">
        {/* Main image */}
        <div className="aspect-[16/9] relative">
          <img
            src={images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-4 right-4 space-x-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="bg-white/80 hover:bg-white rounded-full"
              onClick={() => setShowFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Navigation arrows */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded-md">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
        
        {/* Thumbnail gallery */}
        <div className="flex mt-2 gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2",
                currentIndex === index ? "border-primary" : "border-transparent"
              )}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
      
      {/* Fullscreen gallery */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="p-4 flex justify-between">
            <div className="text-white">
              {currentIndex + 1} / {images.length}
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="text-white"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <img
              src={images[currentIndex]}
              alt={`Property image ${currentIndex + 1}`}
              className="max-h-screen max-w-full object-contain"
            />
          </div>
          
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/20 hover:bg-white/30"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/20 hover:bg-white/30"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};