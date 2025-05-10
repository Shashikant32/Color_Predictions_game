import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { ArrowRight, Clock, Wallet, BarChart3, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { userBets, timeRemaining } = useGame();
  const navigate = useNavigate();
  
  // Calculate statistics
  const totalBets = userBets.length;
  const wonBets = userBets.filter(bet => bet.won === true).length;
  const winRate = totalBets > 0 ? (wonBets / totalBets) * 100 : 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.username}
          </h1>
          <p className="text-gray-400 mt-2">
            Your gaming dashboard - place bets and track your progress.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-violet-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Wallet Balance</p>
                <p className="text-2xl font-bold text-white">
                  ${user?.walletBalance.toFixed(2)}
                </p>
              </div>
              <Wallet className="text-violet-400" size={24} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-white">
                  {winRate.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="text-green-400" size={24} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Bets</p>
                <p className="text-2xl font-bold text-white">
                  {totalBets}
                </p>
              </div>
              <Users className="text-red-400" size={24} />
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Next Round</p>
                <p className="text-2xl font-bold text-white">
                  {timeRemaining}s
                </p>
              </div>
              <Clock className="text-yellow-400" size={24} />
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-lg p-6 shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate('/game')}
          >
            <h3 className="text-xl font-bold text-white mb-3">
              Play Now
            </h3>
            <p className="text-violet-100 mb-4">
              Join the current round and place your bets.
            </p>
            <div className="flex justify-end">
              <ArrowRight className="text-white" size={20} />
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate('/transactions')}
          >
            <h3 className="text-xl font-bold text-white mb-3">
              Transaction History
            </h3>
            <p className="text-green-100 mb-4">
              View your complete payment history.
            </p>
            <div className="flex justify-end">
              <ArrowRight className="text-white" size={20} />
            </div>
          </div>
          
          <div 
            className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 shadow-lg cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate('/referrals')}
          >
            <h3 className="text-xl font-bold text-white mb-3">
              Refer & Earn
            </h3>
            <p className="text-red-100 mb-4">
              Share your referral link and earn commission.
            </p>
            <div className="flex justify-end">
              <ArrowRight className="text-white" size={20} />
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-700">
            <h2 className="text-xl font-bold text-white">
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            {userBets.length > 0 ? (
              <div className="space-y-4">
                {userBets.slice(0, 5).map((bet) => (
                  <div 
                    key={bet.id} 
                    className="flex items-center justify-between border-b border-gray-700 pb-3"
                  >
                    <div>
                      <p className="text-white font-medium">
                        Bet on {bet.colorPrediction.charAt(0).toUpperCase() + bet.colorPrediction.slice(1)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Amount: ${bet.amount}
                      </p>
                    </div>
                    <div>
                      {bet.won === null ? (
                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs">
                          Pending
                        </span>
                      ) : bet.won ? (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                          Won ${bet.amount * 2}
                        </span>
                      ) : (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">
                          Lost
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">
                No recent activity yet. Start placing bets!
              </p>
            )}
            
            {userBets.length > 0 && (
              <div className="mt-4 text-center">
                <button 
                  onClick={() => navigate('/transactions')}
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View All Activity
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;