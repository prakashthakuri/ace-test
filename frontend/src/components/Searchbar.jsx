import { Search } from "lucide-react";

const SearchBar = ({ stageId, setStageId, handleSearch, isFetching }) => (
  <div className="p-2 sm:p-4 bg-white/80 rounded-xl shadow-md">
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <input
        type="text"
        placeholder="Enter Stage ID..."
        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
        value={stageId}
        onChange={(e) => setStageId(e.target.value)}
      />
      <button
        onClick={handleSearch}
        disabled={isFetching || !stageId.trim()}
        className="w-full sm:w-auto px-4 py-2 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: '#1F2937' }}
      >
        <Search className="w-5 h-5" />
        <span className="whitespace-nowrap">
          {isFetching ? "Searching..." : "Search"}
        </span>
      </button>
    </div>
  </div>
);

export default SearchBar;