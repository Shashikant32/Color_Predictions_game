import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Transaction, TransactionType } from '../types';
import { ArrowDown, ArrowUp, DollarSign, Users } from 'lucide-react';

const TransactionHistory: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  
  // Generate mock transaction data
  useEffect(() => {
    if (!user) return;
    
    const mockTransactions: Transaction[] = [
      {
        id: 'txn-1',
        userId: user.id,
        amount: 100,
        type: 'deposit',
        status: 'completed',
        description: 'Initial deposit',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString() // 7 days ago
      },
      {
        id: 'txn-2',
        userId: user.id,
        amount: 20,
        type: 'bet',
        status: 'completed',
        description: 'Bet on Red',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
      },
      {
        id: 'txn-3',
        userId: user.id,
        amount: 40,
        type: 'win',
        status: 'completed',
        description: 'Won bet on Red',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
      },
      {
        id: 'txn-4',
        userId: user.id,
        amount: 30,
        type: 'bet',
        status: 'completed',
        description: 'Bet on Green',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
      },
      {
        id: 'txn-5',
        userId: user.id,
        amount: 15,
        type: 'referral',
        status: 'completed',
        description: 'Referral commission from user123',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
      },
      {
        id: 'txn-6',
        userId: user.id,
        amount: 50,
        type: 'withdrawal',
        status: 'pending',
        description: 'Withdrawal request',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ];
    
    setTransactions(mockTransactions);
  }, [user]);
  
  // Filter transactions based on selected type
  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(txn => txn.type === filter);
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get transaction icon based on type
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="text-green-500" size={20} />;
      case 'withdrawal':
        return <ArrowUp className="text-red-500" size={20} />;
      case 'bet':
        return <DollarSign className="text-yellow-500" size={20} />;
      case 'win':
        return <DollarSign className="text-green-500" size={20} />;
      case 'referral':
        return <Users className="text-violet-500" size={20} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Transaction History
        </h1>
        
        {/* Filter Controls */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'deposit' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('deposit')}
          >
            Deposits
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'withdrawal' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('withdrawal')}
          >
            Withdrawals
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'bet' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('bet')}
          >
            Bets
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'win' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('win')}
          >
            Winnings
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'referral' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            onClick={() => setFilter('referral')}
          >
            Referrals
          </button>
        </div>
        
        {/* Transactions Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {sortedTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-white">Date</th>
                    <th className="py-3 px-4 text-left text-white">Type</th>
                    <th className="py-3 px-4 text-left text-white">Description</th>
                    <th className="py-3 px-4 text-left text-white">Amount</th>
                    <th className="py-3 px-4 text-left text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {getTransactionIcon(transaction.type)}
                          <span className="ml-2 text-gray-300 capitalize">
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {transaction.description}
                      </td>
                      <td className={`py-3 px-4 font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'win' || transaction.type === 'referral'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'win' || transaction.type === 'referral'
                          ? '+'
                          : '-'}
                        ${transaction.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'completed'
                            ? 'bg-green-900/50 text-green-400 border border-green-500'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500'
                            : 'bg-red-900/50 text-red-400 border border-red-500'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No transactions found matching your filter criteria.
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TransactionHistory;