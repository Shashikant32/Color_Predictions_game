import React from 'react';
import { useGame } from '../../contexts/GameContext';

const GameTimer: React.FC = () => {
  const { timeRemaining, currentRound } = useGame();
  
  // Calculate percentage for progress bar
  const progressPercentage = (timeRemaining / 60) * 100;
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">Round #{currentRound?.roundNumber}</h3>
        <span className="text-white bg-gray-700 px-3 py-1 rounded-full text-sm">
          {timeRemaining}s
        </span>
      </div>
      
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            timeRemaining <= 10 ? 'bg-red-500 animate-pulse' : 'bg-violet-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-center text-sm text-gray-400">
        {currentRound?.status === 'active' 
          ? 'Place your bets before time runs out!' 
          : 'Round ended. Results will be announced shortly.'}
      </div>
    </div>
  );
};

export default GameTimer;