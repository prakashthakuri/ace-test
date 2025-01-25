import React from 'react';
import ImportButton from './components/ImportButton';
import LeaderboardTable from './components/LeaderboardTable';

function App() {
  const stageId = '1702862654102x427489097778987000';

  return (
    <div className="min-h-screen bg-game-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-game-800 rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <div className="w-full max-w-sm">
              <ImportButton />
            </div>
            <div className="px-4 py-1.5 bg-game-700/50 rounded-full border border-neon-blue/20 text-neon-blue text-sm font-mono">
              {stageId}
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        <LeaderboardTable stageId={stageId} />
      </div>
    </div>
  );
}

export default App;