import { useState } from "react";
import { useStageIds } from "../hooks/useLeaderboardAPI";
 const StageList = () => {
  const { data } = useStageIds();
  const [showId, setShowId] = useState(false);
 
  return (
    <div className="bg-game-800 rounded-xl shadow-lg p-4 space-y-4">
      <button 
        onClick={() => setShowId(!showId)}
        className="w-full px-6 py-3 bg-neon-blue/20 text-neon-blue rounded-lg
        hover:bg-neon-blue/30 disabled:opacity-50 flex items-center justify-center gap-2
        border border-neon-blue hover:shadow-neon transition-all duration-300
        font-semibold"
      >
        {showId ? 'Hide Stage IDs' : 'Show Stage IDs'}
      </button>
 
      {showId && (
        <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-game-700 
        scrollbar-thumb-neon-blue space-y-2 pr-2">
          {data?.stageIds.map((id, index) => (
            <div 
              key={id}
              className="p-3 bg-game-700/50 rounded-lg text-neon-blue text-sm font-mono"
            >
              Stage {index + 1}: {id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
 };

export default StageList