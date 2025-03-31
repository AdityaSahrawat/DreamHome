// components/PropertyCard.tsx
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  photos: string[];
}

interface PropertyCardProps {
  property: Property;
  formatPrice: (price: number) => string;
}

export const PropertyCard = ({ property, formatPrice }: PropertyCardProps) => {
  const router = useRouter()
  const mainPhoto = property.photos.length > 0 
    ? `${property.photos[0]}` 
    : '/placeholder-property.jpg';

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={mainPhoto}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {property.type}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-1">{property.title}</h3>
        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">{property.address}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{property.description}</p>
        <div className="text-blue-600 font-bold text-xl mb-3">
          {formatPrice(property.price)}
        </div>
        <div className="flex justify-between text-gray-600 border-t pt-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.area} sqft</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-3 border-t">
        <Button variant="outline" className="w-full" onClick={()=>{router.push(`/properties/${property.id}`)}}>View Details</Button>
      </CardFooter>
    </Card>
  );
};