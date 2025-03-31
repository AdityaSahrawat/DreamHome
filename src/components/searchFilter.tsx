// components/SearchFilters.tsx
import { ChangeEvent } from 'react';

interface Filters {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  propertyType: string;
}

interface SearchFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onReset: () => void;
}

export default function SearchFilters({ filters, setFilters, onReset }: SearchFiltersProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filter Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Land">Land</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="number"
            name="minPrice"
            placeholder="$ Min"
            value={filters.minPrice}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="number"
            name="maxPrice"
            placeholder="$ Max"
            value={filters.maxPrice}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <button
          onClick={onReset}
          className="w-full mt-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}