import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { GameRound, ColorOption } from '../../types';
import { Calendar, Search, Eye } from 'lucide-react';

const GameHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [viewingGame, setViewingGame] = useState<GameRound | null>(null);
  
  // Mock game data
  const gameRounds: GameRound[] = Array.from({ length: 20 }, (_, i) => {
    const roundNumber = 10000 - i;
    const date = new Date();
    date.setHours(date.getHours() - i);
    const endDate = new Date(date);
    endDate.setMinutes(endDate.getMinutes() + 1);
    
    const colors: ColorOption[] = ['red', 'green', 'violet'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      id: `round-${roundNumber}`,
      roundNumber,
      startTime: date.toISOString(),
      endTime: endDate.toISOString(),
      winningColor: randomColor,
      status: 'ended'
    };
  });
  
  // Mock bets for game details
  const gameBets = [
    { user: 'john_doe', color: 'red', amount: 50, won: false },
    { user: 'alice_smith', color: 'green', amount: 20, won: true },
    { user: 'bob_johnson', color: 'red', amount: 100, won: false },
    { user: 'emma_wilson', color: 'green', amount: 80, won: true }
  ];
  
  // Filter games based on search and date
  const filteredGames = gameRounds.filter(game => {
    // Filter by round number if search term is a number
    if (searchTerm && !isNaN(Number(searchTerm))) {
      return game.roundNumber.toString().includes(searchTerm);
    }
    
    // Filter by date if date filter is set
    if (dateFilter) {
      const gameDate = new Date(game.startTime).toISOString().split('T')[0];
      return gameDate === dateFilter;
    }
    
    // Return all if no filters
    return true;
  });
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Game History
      </h1>
      
      {/* Search & Filter Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-violet-500"
              placeholder="Search by round number..."
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>
      
      {/* Games Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-white">Round #</th>
                <th className="py-3 px-4 text-left text-white">Date & Time</th>
                <th className="py-3 px-4 text-left text-white">Duration</th>
                <th className="py-3 px-4 text-left text-white">Winning Color</th>
                <th className="py-3 px-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredGames.map((game) => {
                const startTime = new Date(game.startTime);
                const endTime = new Date(game.endTime);
                const durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
                
                return (
                  <tr key={game.id} className="hover:bg-gray-700">
                    <td className="py-3 px-4 font-medium text-white">
                      #{game.roundNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {startTime.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {durationSeconds} seconds
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`
                          px-2 py-1 rounded text-white font-medium
                          ${game.winningColor === 'red' ? 'bg-red-600' : 
                            game.winningColor === 'green' ? 'bg-green-600' : 
                            'bg-violet-600'}
                        `}
                      >
                        {game.winningColor?.charAt(0).toUpperCase() + game.winningColor?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
                        onClick={() => setViewingGame(game)}
                        title="View Details"
                      >
                        <Eye size={16} className="mr-1" />
                        <span className="text-sm">Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {filteredGames.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-400">
                    No games found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Game Details Modal */}
      {viewingGame && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Round #{viewingGame.roundNumber} Details
                </h3>
                <button 
                  onClick={() => setViewingGame(null)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">Start Time</p>
                  <p className="text-white">
                    {new Date(viewingGame.startTime).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">End Time</p>
                  <p className="text-white">
                    {new Date(viewingGame.endTime).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg md:col-span-2">
                  <p className="text-gray-400 text-sm">Winning Color</p>
                  <div className="mt-2">
                    <span
                      className={`
                        px-4 py-2 rounded text-white font-medium text-lg
                        ${viewingGame.winningColor === 'red' ? 'bg-red-600' : 
                          viewingGame.winningColor === 'green' ? 'bg-green-600' : 
                          'bg-violet-600'}
                      `}
                    >
                      {viewingGame.winningColor?.charAt(0).toUpperCase() + viewingGame.winningColor?.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-white mb-4">Bets Placed</h4>
              
              <div className="bg-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-600">
                    <tr>
                      <th className="py-2 px-4 text-left text-white">User</th>
                      <th className="py-2 px-4 text-left text-white">Color</th>
                      <th className="py-2 px-4 text-left text-white">Amount</th>
                      <th className="py-2 px-4 text-left text-white">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {gameBets.map((bet, index) => (
                      <tr key={index} className="hover:bg-gray-600">
                        <td className="py-2 px-4 text-gray-300">
                          {bet.user}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`
                              px-2 py-1 rounded text-white text-xs
                              ${bet.color === 'red' ? 'bg-red-600' : 
                                bet.color === 'green' ? 'bg-green-600' : 
                                'bg-violet-600'}
                            `}
                          >
                            {bet.color.charAt(0).toUpperCase() + bet.color.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-gray-300">
                          ${bet.amount}
                        </td>
                        <td className="py-2 px-4">
                          <span className={`font-medium ${bet.won ? 'text-green-500' : 'text-red-500'}`}>
                            {bet.won ? 'Won' : 'Lost'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewingGame(null)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GameHistory;