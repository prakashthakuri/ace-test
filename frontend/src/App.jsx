import React from 'react';
import ImportButton from './components/ImportButton';
import LeaderboardTable from './components/LeaderboardTable';
import StageList from './components/StageList';

function App() {
  return (
    <div className="min-h-screen bg-game-900 p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-game-800 rounded-xl shadow-lg p-4 md:p-8">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text">
              Shooting Range Results
            </h1>
            <div className="w-full max-w-sm">
              <ImportButton />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-3">
            <div className="bg-game-800 rounded-xl shadow-lg p-4 overflow-auto max-h-[70vh] md:max-h-full">
              <StageList />
            </div>
          </div>
          <div className="md:col-span-9">
            <div className="bg-game-800 rounded-xl shadow-lg overflow-auto">
              <LeaderboardTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;