import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, DollarSign, BarChart3, ArrowRight } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock statistics data
  const stats = {
    totalUsers: 157,
    activeUsers: 32,
    totalGames: 583,
    totalBets: 2945,
    totalVolume: 12580,
    platformProfit: 1850
  };
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        Admin Dashboard
      </h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-violet-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalUsers}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.activeUsers} active now
              </p>
            </div>
            <Users className="text-violet-400" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-1">Total Games</p>
              <p className="text-2xl font-bold text-white">
                {stats.totalGames}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.totalBets} bets placed
              </p>
            </div>
            <Clock className="text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-white">
                ${stats.totalVolume}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ${stats.platformProfit} profit
              </p>
            </div>
            <DollarSign className="text-green-400" size={24} />
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div 
          className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-lg p-6 shadow-lg cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => navigate('/admin/users')}
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Manage Users
          </h3>
          <p className="text-violet-100 mb-4">
            View and manage user accounts, wallets, and permissions.
          </p>
          <div className="flex justify-end">
            <ArrowRight className="text-white" size={20} />
          </div>
        </div>
        
        <div 
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => navigate('/admin/games')}
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Game History
          </h3>
          <p className="text-blue-100 mb-4">
            View past games, results, and betting patterns.
          </p>
          <div className="flex justify-end">
            <ArrowRight className="text-white" size={20} />
          </div>
        </div>
        
        <div 
          className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 shadow-lg cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => navigate('/admin/wallets')}
        >
          <h3 className="text-xl font-bold text-white mb-3">
            Wallet Management
          </h3>
          <p className="text-green-100 mb-4">
            Manage user wallet balances and transaction history.
          </p>
          <div className="flex justify-end">
            <ArrowRight className="text-white" size={20} />
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            Revenue Overview
          </h2>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-violet-500 rounded-full mr-1"></span>
            <span className="text-sm text-gray-400 mr-4">Volume</span>
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span className="text-sm text-gray-400">Profit</span>
          </div>
        </div>
        
        {/* Simplified Chart Representation */}
        <div className="h-64 w-full">
          <div className="h-full flex items-end">
            {[65, 40, 75, 50, 85, 90, 55].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-violet-500/30 rounded-t-sm relative"
                  style={{ height: `${height}%` }}
                >
                  <div 
                    className="absolute bottom-0 left-0 w-full bg-green-500/50 rounded-t-sm"
                    style={{ height: `${height * 0.3}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-2">
                  Day {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Recent Activity
          </h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'registered', time: '10 minutes ago' },
              { user: 'Alice Smith', action: 'placed a bet of $50 on Red', time: '15 minutes ago' },
              { user: 'Bob Johnson', action: 'won $100', time: '30 minutes ago' },
              { user: 'Emma Wilson', action: 'requested a withdrawal of $200', time: '1 hour ago' },
              { user: 'Mike Brown', action: 'made a deposit of $150', time: '2 hours ago' }
            ].map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between border-b border-gray-700 pb-3"
              >
                <div>
                  <p className="text-white font-medium">
                    {activity.user}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {activity.action}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-violet-400 hover:text-violet-300 transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;