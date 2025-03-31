// components/HeroSection.tsx
import { Button } from "@/src/components/ui/button";
import { SearchBox } from "./searchBox";
import { SearchFilters } from "./searchFilter";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPropertyType: string;
  setSelectedPropertyType: (type: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  bedroomsFilter: string;
  setBedroomsFilter: (value: string) => void;
  clearFilters: () => void;
  handleSearch: () => void;
  propertyTypes: string[];
}

export const HeroSection = ({
  searchTerm,
  setSearchTerm,
  selectedPropertyType,
  setSelectedPropertyType,
  priceRange,
  setPriceRange,
  bedroomsFilter,
  setBedroomsFilter,
  clearFilters,
  handleSearch,
  propertyTypes
}: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Home</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Discover the perfect property with our extensive listings and advanced search tools</p>
        
        {/* Search Box */}
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <SearchBox 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
            />
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <SearchFilters
                selectedPropertyType={selectedPropertyType}
                setSelectedPropertyType={setSelectedPropertyType}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                bedroomsFilter={bedroomsFilter}
                setBedroomsFilter={setBedroomsFilter}
                clearFilters={clearFilters}
                handleSearch={handleSearch}
                propertyTypes={propertyTypes}
              />
              
              <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Shapes */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-16 w-full text-gray-50 fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </div>
  );
};