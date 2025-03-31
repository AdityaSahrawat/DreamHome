// components/SearchFilters.tsx
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Filter } from "lucide-react";

interface SearchFiltersProps {
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

export const SearchFilters = ({
  selectedPropertyType,
  setSelectedPropertyType,
  priceRange,
  setPriceRange,
  bedroomsFilter,
  setBedroomsFilter,
  clearFilters,
  handleSearch,
  propertyTypes
}: SearchFiltersProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex gap-2 items-center text-gray-700 border-gray-300"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            <select
              id="propertyType"
              value={selectedPropertyType}
              onChange={(e) => setSelectedPropertyType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Minimum Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              placeholder="Bedrooms"
              value={bedroomsFilter}
              onChange={(e) => setBedroomsFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
          <Button onClick={handleSearch}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};