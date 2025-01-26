import React from 'react';
import ImportButton from './components/ImportButton';
import LeaderboardTable from './components/LeaderboardTable';
import StageList from './components/StageList';

function App() {
  return (
    <div className="min-h-screen bg-game-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-game-800 rounded-xl shadow-lg p-8">
       
          <div className="flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text">
            Shooting Range Results
          </h1>
            <div className="w-full max-w-sm">
              <ImportButton />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-game-800 rounded-xl shadow-lg p-4">
              <StageList />
            </div>
          </div>
          
          <div className="col-span-9">
            <div className="bg-game-800 rounded-xl shadow-lg">
              <LeaderboardTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;