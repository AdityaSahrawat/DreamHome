"use client";

import { useState, useEffect } from "react";

// Property type definition
export interface Property {
  id: string;
  title: string;
  price: number;
  pricePerSqFt?: number;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  propertyType: string;
  status: string;
  images: string[];
  features: {
    category: string;
    items: string[];
  }[];
  parking: number;
  lotSize: number;
  hoaFees?: number;
  mlsNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: {
    name: string;
    photo: string;
    phone: string;
    email: string;
    company: string;
  };
}

// Mock property data
const mockProperty: Property = {
  id: "123456",
  title: "Modern Luxury Villa with Ocean View",
  price: 1250000,
  pricePerSqFt: 625,
  location: "123 Coastal Drive, Malibu, CA 90265",
  description: "Perched on a picturesque hillside with breathtaking ocean views, this modern architectural masterpiece offers luxury living at its finest. Floor-to-ceiling windows flood the home with natural light while framing the stunning coastline vista. The open-concept layout features high-end finishes throughout, including Italian marble countertops, custom cabinetry, and wide-plank oak flooring. The gourmet kitchen boasts professional-grade appliances, a large island, and a walk-in pantry. The primary suite is a true retreat with a spa-like bathroom, walk-in closet, and private balcony. Additional features include a home office, media room, wine cellar, and fitness area. The outdoor living space includes a heated infinity pool, fire pit, outdoor kitchen, and professionally landscaped gardens.",
  bedrooms: 4,
  bathrooms: 3.5,
  squareFeet: 3200,
  yearBuilt: 2020,
  propertyType: "Single Family",
  status: "For Sale",
  images: [
    "https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
  ],
  features: [
    {
      category: "Interior Features",
      items: [
        "Open floor plan",
        "High ceilings",
        "Smart home system",
        "Hardwood floors",
        "Custom lighting",
        "Walk-in closets"
      ]
    },
    {
      category: "Exterior Features",
      items: [
        "Infinity pool",
        "Outdoor kitchen",
        "Landscaped garden",
        "Fire pit",
        "Multiple terraces",
        "2-car garage"
      ]
    },
    {
      category: "Kitchen & Dining",
      items: [
        "Chef's kitchen",
        "High-end appliances",
        "Custom cabinetry",
        "Breakfast bar",
        "Formal dining room",
        "Butler's pantry"
      ]
    },
    {
      category: "Amenities",
      items: [
        "Home theater",
        "Wine cellar",
        "Home office",
        "Fitness room",
        "Guest suite",
        "Laundry room"
      ]
    }
  ],
  parking: 2,
  lotSize: 0.5,
  hoaFees: 350,
  mlsNumber: "ML12345678",
  coordinates: {
    lat: 34.0259,
    lng: -118.7798
  },
  agent: {
    name: "Sarah Johnson",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    phone: "(310) 555-1234",
    email: "sarah.johnson@example.com",
    company: "Coastal Luxury Properties"
  }
};

// Hook for fetching property data
export const usePropertyData = (propertyId?: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch data from an API
        // For this demo, we'll simulate an API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return the mock property for any ID
        setProperty(mockProperty);
        setError(null);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch property'));
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  return { property, isLoading, error };
};