import { Search } from "lucide-react";


const SearchBar = ({ stageId, setStageId, handleSearch, isFetching, isSearching }) => (
  <div className="bg-white bg-opacity-80 rounded-xl p-4 border border-gray-300 shadow-md mb-6">
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Enter Stage ID..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
        value={stageId}
        onChange={(e) => setStageId(e.target.value)}
      />
              <div>      
                <button
          onClick={handleSearch}
          disabled={isFetching || !stageId.trim()}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 flex items-center gap-2"
                  >
                          <Search className="w-5 h-5" />

          {isFetching ? "Searching..." : "Search"}
        </button>
      </div>
                   
    </div>
  </div>
);

export default SearchBar