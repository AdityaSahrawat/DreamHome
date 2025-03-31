// components/NoResults.tsx
import { Button } from "@/src/components/ui/button";
import { Home } from "lucide-react";

interface NoResultsProps {
  clearFilters: () => void;
}

export const NoResults = ({ clearFilters }: NoResultsProps) => {
  return (
    <div className="text-center py-20 bg-white rounded-lg shadow">
      <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Home className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
      <p className="mt-2 text-gray-500 max-w-md mx-auto">We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.</p>
      <Button onClick={clearFilters} className="mt-6">
        Reset All Filters
      </Button>
    </div>
  );
};