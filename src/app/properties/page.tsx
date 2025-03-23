'use client';

import { useState } from 'react';
import Image from 'next/image';
import Footer from '@/src/components/footer';
import Navbar from '@/src/components/navbar';

export default function PropertyListingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [propertyType, setPropertyType] = useState('all');

  // Mock property data
  const properties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      location: "Bandra, Mumbai",
      price: 85000,
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 1850,
      featured: true,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 2,
      title: "Modern Studio Apartment",
      location: "Koramangala, Bangalore",
      price: 35000,
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      area: 650,
      featured: true,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 3,
      title: "Spacious 4BHK Villa",
      location: "Vasant Vihar, Delhi",
      price: 120000,
      type: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      area: 3200,
      featured: true,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 4,
      title: "Cozy 2BHK with Garden",
      location: "Jubilee Hills, Hyderabad",
      price: 42000,
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 5,
      title: "Luxury 3BHK with Pool",
      location: "Alwarpet, Chennai",
      price: 78000,
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 2100,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 6,
      title: "Rustic Cottage",
      location: "Lonavala, Maharashtra",
      price: 35000,
      type: "Cottage",
      bedrooms: 2,
      bathrooms: 1,
      area: 1000,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 7,
      title: "Modern 1BHK Apartment",
      location: "Viman Nagar, Pune",
      price: 25000,
      type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      area: 750,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 8,
      title: "Penthouse with Terrace",
      location: "Marine Drive, Mumbai",
      price: 175000,
      type: "Penthouse",
      bedrooms: 4,
      bathrooms: 4,
      area: 3500,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 9,
      title: "Minimalist 2BHK Flat",
      location: "Indiranagar, Bangalore",
      price: 48000,
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 10,
      title: "Heritage Bungalow",
      location: "Civil Lines, Delhi",
      price: 145000,
      type: "Bungalow",
      bedrooms: 5,
      bathrooms: 4,
      area: 4500,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 11,
      title: "Smart 3BHK Home",
      location: "Gachibowli, Hyderabad",
      price: 65000,
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
    {
      id: 12,
      title: "Compact Studio Apartment",
      location: "Powai, Mumbai",
      price: 28000,
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      area: 500,
      featured: false,
      available: true,
      image: "/api/placeholder/800/600",
    },
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceRange === 'all' ||
      (priceRange === 'under50k' && property.price < 50000) ||
      (priceRange === '50k-100k' && property.price >= 50000 && property.price <= 100000) ||
      (priceRange === 'above100k' && property.price > 100000);
    
    const matchesType = propertyType === 'all' || property.type === propertyType;
    
    return matchesSearch && matchesPrice && matchesType;
  });

  const featuredProperties = properties.filter(property => property.featured);

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/api/placeholder/1920/1080"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Home Today</h1>
          <p className="text-xl md:text-2xl mb-8">Browse premium rental properties, apply, and move in hassle-free.</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search by location or property name"
                  className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select 
                  className="p-3 border border-gray-300 rounded-md text-gray-800"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">Any Price</option>
                  <option value="under50k">Under ₹50,000</option>
                  <option value="50k-100k">₹50,000 - ₹100,000</option>
                  <option value="above100k">Above ₹100,000</option>
                </select>
                
                <select 
                  className="p-3 border border-gray-300 rounded-md text-gray-800"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Studio">Studio</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Cottage">Cottage</option>
                </select>
                
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Properties */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
        <p className="text-gray-600 mb-8">Explore our handpicked premium listings</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-64">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Available
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">₹{property.price.toLocaleString()}/month</span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>{property.bedrooms} beds</span>
                    <span>•</span>
                    <span>{property.bathrooms} baths</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-semibold">
            View More Properties
          </button>
        </div>
      </section>
      
      
      {/* All Properties */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2">Browse All Properties</h2>
        <p className="text-gray-600 mb-8">
          {filteredProperties.length} properties available
          {searchQuery || priceRange !== 'all' || propertyType !== 'all' ? ' matching your search' : ''}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1">{property.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.location}
                </div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span>{property.type}</span>
                  <div className="flex gap-2">
                    <span>{property.bedrooms} bed</span>
                    <span>•</span>
                    <span>{property.bathrooms} bath</span>
                    <span>•</span>
                    <span>{property.area} sq.ft</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">₹{property.price.toLocaleString()}/mo</span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-bold mb-2">No properties match your search</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                setSearchQuery('');
                setPriceRange('all');
                setPropertyType('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
        
        {filteredProperties.length > 0 && (
          <div className="flex justify-center mt-10">
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-semibold mx-2">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md mx-1">1</button>
            <button className="px-4 py-2 bg-white text-gray-800 rounded-md mx-1 hover:bg-gray-100">2</button>
            <button className="px-4 py-2 bg-white text-gray-800 rounded-md mx-1 hover:bg-gray-100">3</button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-semibold mx-2">
              Next
            </button>
          </div>
        )}
      </section>
      
      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Looking for the perfect home? Let's help you find it!</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied tenants who found their dream home with DreamHome. Our expert team is ready to assist you every step of the way.
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-bold text-lg">
            Get Started
          </button>
        </div>
      </section>

      <Footer/>

    </div>
  )
}