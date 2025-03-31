"use client";

import React, { useEffect } from "react";
import { 
  Bed, 
  Bath, 
  MapPin, 
  Square, 
  Calendar, 
  Heart, 
  Share2, 
  ArrowLeft,
  Phone
} from "lucide-react";

import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/seperator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { PropertyGallery } from "./propertyGallery";
import { PropertyAgent } from "./propertyAgent";
import { PropertyContactForm } from "./propertyContactForm";
import { PropertyMap } from "./propertyMap";
import { PropertyFeatures } from "./propertyFeature";
import { cn } from "@/lib/utils";
import type { Property, Property_image } from "@/src/types";
import axios from "axios";
import { useParams } from "next/navigation";
import Navbar from "@/src/components/navbar";


const Property = () => {
  const { id } = useParams();
  const [property, setProperty] = React.useState<Property | null>(null);
  const [photos, setPhotos] = React.useState<Property_image[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFavorite, setIsFavorite] = React.useState(false);

  React.useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token = localStorage.getItem('token')
        console.log("id : " , id)
        const response = await axios.get(`/api/properties/${id}` , {
          headers : {
            Authorization : `Bearer ${token}`,
            'Content-Type' : 'application/json'
          }
        })
        setProperty(response.data.property);
        setPhotos(response.data.photos);

        console.log(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return <PropertySkeleton />;
  }

  if (error || !property) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Sorry, we couldn't find that property
          </h2>
          <p className="mt-2 text-gray-600">
            {error || "The property you're looking for might have been removed or is temporarily unavailable."}
          </p>
          <Button 
            className="mt-6" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Format the location string
  const location = `${property.address}, ${property.city}`;

  // Convert property images to the expected format for the gallery
  const galleryImages = photos.map(photo => photo.photo_url);

  // Mock agent data (since it's not in the API response)
  const agent = {
    name: "John Doe",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
    phone: "(123) 456-7890",
    email: "john.doe@example.com",
    company: "Real Estate Inc."
  };

  // Mock features data (since it's not in the API response)
  const features = [
    {
      category: "Interior Features",
      items: [
        `${property.bedrooms} bedrooms`,
        `${property.bathrooms} bathrooms`,
        `${property.sqft} sqft`,
        "Hardwood floors"
      ]
    },
    {
      category: "Exterior Features",
      items: [
        property.type === 'house' ? "Private garden" : "Shared amenities",
        "Parking available"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>


      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Back button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to listings
        </Button>

        {/* Property header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold text-primary">${property.price.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground text-right">
              ${Math.round(property.price / property.sqft)}/sq ft
            </div>
          </div>
        </div>

        {/* Property gallery */}
        <div className="mb-8">
          <PropertyGallery images={galleryImages} />
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 mb-8">
          <Button 
            variant="outline" 
            className={cn(
              "flex-1 md:flex-none",
              isFavorite ? "bg-primary/10 text-primary" : ""
            )}
            onClick={toggleFavorite}
          >
            <Heart 
              className={cn("mr-2 h-4 w-4", isFavorite ? "fill-primary" : "")} 
            />
            {isFavorite ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="default" className="flex-1 md:flex-none">
            <Phone className="mr-2 h-4 w-4" />
            Contact Agent
          </Button>
        </div>

        {/* Property details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Quick info */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{property.sqft}</div>
                      <div className="text-sm text-muted-foreground">Square Feet</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{property.year_built}</div>
                      <div className="text-sm text-muted-foreground">Year Built</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different property aspects */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Property Overview</h3>
                <p className="text-muted-foreground mb-6">{property.description}</p>
                
                <Separator className="my-6" />
                
                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property Type</span>
                    <span className="font-medium">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listing Status</span>
                    <span className="font-medium capitalize">{property.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year Built</span>
                    <span className="font-medium">{property.year_built}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Square Feet</span>
                    <span className="font-medium">{property.sqft}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <PropertyFeatures features={features} />
              </TabsContent>
              
              <TabsContent value="map" className="mt-6">
                <PropertyMap location={{ lat: property.latitude, lng: property.longitude }} address={property.address} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            {/* Sidebar with agent info and contact form */}
            <div className="space-y-6">
              <PropertyAgent agent={agent} />
              <PropertyContactForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Loading skeleton
const PropertySkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6"></div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-48 bg-muted rounded animate-pulse mt-2"></div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="h-8 w-32 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="mb-8 aspect-video bg-muted rounded animate-pulse"></div>
      
      <div className="flex space-x-4 mb-8">
        <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
        <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
        <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
            <div className="h-32 bg-muted rounded animate-pulse"></div>
            <div className="h-64 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="h-96 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Property;