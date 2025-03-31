
"use client";

import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface PropertyMapProps {
  location: {
    lat: number;
    lng: number;
  };
  address: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({ location, address }) => {
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Custom pin icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the screen width is small (e.g., mobile)
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize);
    
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);


  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Location</h3>

      <div className="overflow-hidden rounded-lg">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={15}
          style={{ height: "300px", width: "100%" }}
          scrollWheelZoom={!isMobile} 
          dragging={!isMobile} 
          zoomControl={!isMobile} 
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[location.lat, location.lng]} icon={customIcon}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      </div>
      


      
      <div>
        <h4 className="font-medium mb-2">Nearby Amenities</h4>
        <ul className="text-sm space-y-1">
          <li className="flex justify-between">
            <span className="text-muted-foreground">Schools</span>
            <span>0.5 miles</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Shopping</span>
            <span>0.8 miles</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Parks</span>
            <span>1.2 miles</span>
          </li>
          <li className="flex justify-between">
            <span className="text-muted-foreground">Public Transit</span>
            <span>0.3 miles</span>
          </li>
        </ul>
      </div>
    </div>
  );
};