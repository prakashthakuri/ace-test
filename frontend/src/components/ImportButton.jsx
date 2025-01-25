import React from 'react';
import { useImportLeaderboard } from '../hooks/useLeaderboardAPI';

const ImportButton = () => {
  const { mutate, isLoading, error, isError } = useImportLeaderboard();

  return (
    <div className="w-full space-y-4">
      <button
        onClick={() => mutate()}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-neon-blue/20 text-neon-blue rounded-lg
                 hover:bg-neon-blue/30 disabled:opacity-50 flex items-center justify-center gap-2
                 border border-neon-blue hover:shadow-neon transition-all duration-300
                 font-semibold disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-neon-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Importing...
          </>
        ) : (
          'Import Leaderboard'
        )}
      </button>
      
      {isError && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
};

export default ImportButton;