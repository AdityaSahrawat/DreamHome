// components/ResultsHeader.tsx
interface ResultsHeaderProps {
    count: number;
    sortOption: string;
    setSortOption: (option: string) => void;
    handleSearch: () => void;
  }
  
  export const ResultsHeader = ({ count, sortOption, setSortOption, handleSearch }: ResultsHeaderProps) => {
    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          {count} Properties Found
        </h2>
        
        <div className="flex items-center mt-4 md:mt-0">
          <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              handleSearch();
            }}
            className="border rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Bedrooms</option>
          </select>
        </div>
      </div>
    );
  };