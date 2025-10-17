"use client"

import { useEffect, useMemo, useState } from "react";
import { PropertyCard } from "./propertyCard";
import { PropertySkeleton } from "./propertySkeleton";
import { HeroSection } from "./heroSection";
import { NoResults } from "./noResult";
import { ResultsHeader } from "./resultHeader";
import { CallToAction } from "./callToAction";
import { Pagination } from "./pagination";
import Footer from "@/src/components/footer";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import Navbar from "@/src/components/navbar";

const ITEMS_PER_PAGE = 4;
const PROPERTY_TYPES = ["All Types", "House", "Apartment", "Villa", "Studio", "Condo", "Cabin"];

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
  created_at: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("All Types");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [bedroomsFilter, setBedroomsFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState("Featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProperties = async () => {
    setIsLoading(true);
    setError(null);
    // const token = window.localStorage.getItem("token")
    
    try {
      const response = await axios.get('/api/properties/all', {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   'Content-Type': 'application/json',
        // },
      });
  // Removed debug log

      if (response.data && response.data.properties) {
        setAllProperties(response.data.properties);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch properties on component mount
  useEffect(() => {
    fetchAllProperties();
  }, []);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...allProperties];
    
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedPropertyType !== "All Types") {
      filtered = filtered.filter(property => property.type === selectedPropertyType);
    }
    
    if (priceRange.min) {
      filtered = filtered.filter(property => property.price >= parseInt(priceRange.min));
    }
    
    if (priceRange.max) {
      filtered = filtered.filter(property => property.price <= parseInt(priceRange.max));
    }
    
    if (bedroomsFilter) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(bedroomsFilter));
    }
    
    // Apply sorting
    if (sortOption === "Price: Low to High") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Price: High to Low") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Bedrooms") {
      filtered = filtered.sort((a, b) => b.bedrooms - a.bedrooms);
    } else if (sortOption === "Newest") {
      filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    return filtered;
  }, [allProperties, searchTerm, selectedPropertyType, priceRange, bedroomsFilter, sortOption]);

  // Paginate the filtered properties
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);

  const handleSearch = () => {
    setCurrentPage(1);
    // No need to fetch again, we're filtering client-side
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPropertyType("All Types");
    setPriceRange({ min: "", max: "" });
    setBedroomsFilter("");
    setCurrentPage(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    fetchAllProperties();
    clearFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <div className="h-16 md:h-20"></div>
      
      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedPropertyType={selectedPropertyType}
        setSelectedPropertyType={setSelectedPropertyType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        bedroomsFilter={bedroomsFilter}
        setBedroomsFilter={setBedroomsFilter}
        clearFilters={clearFilters}
        handleSearch={handleSearch}
        propertyTypes={PROPERTY_TYPES}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Error loading properties</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">{error}</p>
            <Button onClick={handleRefresh} className="mt-6">
              Refresh Properties
            </Button>
          </div>
        ) : (
          <>
            <ResultsHeader 
              count={filteredProperties.length} 
              sortOption={sortOption}
              setSortOption={setSortOption}
              handleSearch={handleSearch}
            />
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <PropertySkeleton key={i} />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <NoResults clearFilters={clearFilters} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProperties.map(property => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      formatPrice={formatPrice} 
                    />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      
      <CallToAction />
      <Footer/>
    </div>
  );
};

export default Index;