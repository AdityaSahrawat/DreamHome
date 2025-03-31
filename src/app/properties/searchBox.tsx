// components/SearchBox.tsx
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Search } from "lucide-react";

interface SearchBoxProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export const SearchBox = ({ searchTerm, setSearchTerm, handleSearch }: SearchBoxProps) => {
  return (
    <div className="flex-1">
      <Label htmlFor="search" className="text-gray-700 mb-2 block text-left">Location, Property, or Keyword</Label>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="search"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
};