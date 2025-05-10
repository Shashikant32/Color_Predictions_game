import React from 'react';
import { useGame } from '../../contexts/GameContext';

const BetHistory: React.FC = () => {
  const { userBets, gameHistory } = useGame();
  
  // Sort bets by creation date (newest first)
  const sortedBets = [...userBets].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Function to find game round information
  const getRoundInfo = (roundId: string) => {
    return gameHistory.find(round => round.id === roundId);
  };

  return (
    <div className="mt-8 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="p-4 bg-gray-700">
        <h3 className="text-white text-xl font-semibold">Your Recent Bets</h3>
      </div>
      
      {sortedBets.length === 0 ? (
        <div className="p-4 text-gray-400 text-center">
          You haven't placed any bets yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-white">Round</th>
                <th className="py-3 px-4 text-left text-white">Color</th>
                <th className="py-3 px-4 text-left text-white">Amount</th>
                <th className="py-3 px-4 text-left text-white">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedBets.map((bet) => {
                const round = getRoundInfo(bet.roundId);
                return (
                  <tr key={bet.id} className="hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-300">
                      #{round?.roundNumber || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`
                          px-2 py-1 rounded text-white font-medium
                          ${bet.colorPrediction === 'red' ? 'bg-red-600' : 
                            bet.colorPrediction === 'green' ? 'bg-green-600' : 
                            'bg-violet-600'}
                        `}
                      >
                        {bet.colorPrediction.charAt(0).toUpperCase() + bet.colorPrediction.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      ${bet.amount}
                    </td>
                    <td className="py-3 px-4">
                      {bet.won === null ? (
                        <span className="text-yellow-500">Pending</span>
                      ) : bet.won ? (
                        <span className="text-green-500">Won ${bet.amount * 2}</span>
                      ) : (
                        <span className="text-red-500">Lost</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BetHistory;