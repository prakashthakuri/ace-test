import React from 'react';
import { Trophy, RefreshCw, Search, User } from 'lucide-react';
const LeaderboardHeader = ({ stageName, threshold, totalPlayers, searchQuery, setSearchQuery, refetch }) => (
  <div className="bg-white bg-opacity-80 rounded-xl p-6 border border-gray-300 shadow-md mb-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-black" />
          <h1 className="text-3xl font-bold text-black">{stageName || "NA"}</h1>
        </div>
        <div className="flex items-center gap-6 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Threshold:</span>
            <span className="text-black font-mono font-bold text-lg">{threshold || "0.00"}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">Players:</span>
            <span className="text-black font-mono">{totalPlayers || 0}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search players..."
            className="w-full md:w-64 px-4 py-2 pr-10 bg-gray-200 border border-gray-300 rounded-lg text-black placeholder-gray-500
                       focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
        <button
          onClick={refetch}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 flex items-center gap-2
                     transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>
  </div>
);

export default LeaderboardHeader;