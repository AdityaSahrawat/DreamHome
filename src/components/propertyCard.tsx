// components/PropertyCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { PropertyTest } from '@/src/types';

export default function PropertyCard({ property }: { property: PropertyTest }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="relative h-48">
        {property.photos.length > 0 ? (
          <Image
            src={property.photos[0]}
            alt={property.title}
            fill
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="bg-gray-200 h-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
          {property.type}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold truncate">{property.title}</h3>
          <span className="text-blue-600 font-bold">${property.price.toLocaleString()}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.address}</p>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          {/* <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span> */}
          {/* <span>{property.sqft.toLocaleString()} sqft</span> */}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(property.created_at).toLocaleDateString()}
          </div>
          <Link 
            href={`/properties/${property.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}