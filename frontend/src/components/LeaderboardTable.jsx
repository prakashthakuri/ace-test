import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useFetchLeaderboard } from "../hooks/useLeaderboardAPI";
import LeaderboardHeader from "./LeaderboardHeader";
import Pagination from "./Pagination";
import TableData from "./TableData";
import SearchBar from "./Searchbar";

const ITEMS_PER_PAGE = 10;

const getRankColor = (rank) => {
  const colors = {
    Diamond: "bg-blue-700 text-white border-blue-500",
    Platinum: "bg-purple-700 text-white border-purple-500",
    Gold: "bg-yellow-700 text-white border-yellow-500",
    Silver: "bg-gray-600 text-white border-gray-400",
    Bronze: "bg-orange-700 text-white border-orange-500",
    Steel: "bg-zinc-700 text-white border-zinc-500",
    Ace: "bg-green-700 text-white border-green-500",
  };
  return colors[rank] || "bg-gray-700 text-white border-gray-400";
};

// Format time into seconds or minutes + seconds
const formatTime = (timeInSeconds) => {
  if (timeInSeconds >= 60) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = (timeInSeconds % 60).toFixed(1);
    return `${minutes}m ${seconds}s`;
  }
  return `${(timeInSeconds * 100).toFixed(1)}s`;
};


const LeaderboardTable = ({ initialStageId }) => {
  const [stageId, setStageId] = useState(initialStageId || "");
  const [isSearching, setIsSearching] = useState(!!initialStageId);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "hitFactor", direction: "desc" });

  const { data, error, isError, isLoading, refetch } = useFetchLeaderboard(isSearching ? stageId : null);

  const handleSearch = () => {
    if (stageId.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "desc" ? "asc" : "desc",
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data?.scores) return [];

    let filtered = data.scores.filter((score) =>
      score.displayname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data?.scores, searchQuery, sortConfig]);

  const totalPages = Math.ceil((filteredAndSortedData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white bg-opacity-80 space-y-6 p-4">
      
      <SearchBar
        stageId={stageId}
        setStageId={setStageId}
        handleSearch={handleSearch}
        isLoading={isLoading}
        isSearching={isSearching}
      />
       <LeaderboardHeader
        stageName={data?.stage?.stageName}
        threshold={data?.stage?.threshold}
        totalPlayers={data?.scores?.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        refetch={refetch}
      />


      {isError ? (
        <div className="bg-red-100 border border-red-500 rounded-xl p-6 text-red-500">
          {error?.message || "Failed to load leaderboard data. Please check the Stage ID and try again."}
        </div>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden bg-white bg-opacity-50 border border-gray-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-300">
                    <th className="px-6 py-4 text-left text-sm font-bold text-black">#</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black">
                      <button
                        onClick={() => handleSort("displayname")}
                        className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                      >
                        Player
                        <SortIcon column="displayname" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black">
                      <button
                        onClick={() => handleSort("rank")}
                        className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                      >
                        Division
                        <SortIcon column="rank" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-black">
                      <button
                        onClick={() => handleSort("hitFactor")}
                        className="flex items-center gap-1 justify-end hover:text-gray-600 transition-colors w-full"
                      >
                        Hit Factor
                        <SortIcon column="hitFactor" />
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-black">
                      <button
                        onClick={() => handleSort("timeInSeconds")}
                        className="flex items-center gap-1 justify-end hover:text-gray-600 transition-colors w-full"
                      >
                        Time
                        <SortIcon column="timeInSeconds" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                {paginatedData.map((score, index) => (
                <TableData
                  key={score.id}
                  score={score}
                  position={(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                />
              ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardTable;
