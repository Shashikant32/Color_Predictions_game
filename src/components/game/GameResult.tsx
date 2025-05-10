import React, { useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { ColorOption } from '../../types';

const GameResult: React.FC = () => {
  const { currentRound, gameHistory } = useGame();
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<{ color: ColorOption | null, round: number | null }>(
    { color: null, round: null }
  );
  
  useEffect(() => {
    // When a round ends, show the result
    if (currentRound?.status === 'ended' && currentRound.winningColor) {
      setLastResult({
        color: currentRound.winningColor,
        round: currentRound.roundNumber
      });
      setShowResult(true);
      
      // Hide result after 5 seconds
      const timer = setTimeout(() => {
        setShowResult(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    // If we have history but no last result yet, set it from history
    if (gameHistory.length > 0 && !lastResult.color) {
      const lastGame = gameHistory[0];
      if (lastGame.winningColor) {
        setLastResult({
          color: lastGame.winningColor,
          round: lastGame.roundNumber
        });
      }
    }
  }, [currentRound, gameHistory]);
  
  // If nothing to show, render previous results
  if (!showResult) {
    return (
      <div className="mt-6">
        <h3 className="text-white text-xl font-semibold mb-3">Previous Results</h3>
        <div className="flex flex-wrap gap-2">
          {gameHistory.slice(0, 10).map((round) => (
            <div 
              key={round.id}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                ${round.winningColor === 'red' ? 'bg-red-600' : 
                  round.winningColor === 'green' ? 'bg-green-600' : 
                  round.winningColor === 'violet' ? 'bg-violet-600' : 'bg-gray-600'}
              `}
              title={`Round #${round.roundNumber}`}
            >
              {round.winningColor?.charAt(0).toUpperCase()}
            </div>
          ))}
          
          {gameHistory.length === 0 && (
            <div className="text-gray-400">No previous results yet</div>
          )}
        </div>
      </div>
    );
  }
  
  // Show the animated result
  return (
    <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg animate-fade-in">
      <h3 className="text-white text-xl font-semibold mb-4 text-center">
        Round #{lastResult.round} Result
      </h3>
      
      <div className="flex justify-center">
        <div 
          className={`
            w-32 h-32 rounded-full flex items-center justify-center text-white text-2xl font-bold
            animate-bounce-in
            ${lastResult.color === 'red' ? 'bg-red-600' : 
              lastResult.color === 'green' ? 'bg-green-600' : 
              lastResult.color === 'violet' ? 'bg-violet-600' : 'bg-gray-600'}
          `}
        >
          {lastResult.color?.toUpperCase()}
        </div>
      </div>
      
      <p className="text-center mt-4 text-gray-300">
        {lastResult.color === 'red' ? 'Red wins!' : 
         lastResult.color === 'green' ? 'Green wins!' : 
         lastResult.color === 'violet' ? 'Violet wins!' : ''}
      </p>
    </div>
  );
};

export default GameResult;