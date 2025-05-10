import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Copy, Check, Users } from 'lucide-react';

const ReferralPage: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  // Mock referral data
  const referrals = [
    { id: 'ref1', username: 'user123', joinDate: '2023-05-10', earnings: 25 },
    { id: 'ref2', username: 'gamer456', joinDate: '2023-06-15', earnings: 18 },
    { id: 'ref3', username: 'player789', joinDate: '2023-07-22', earnings: 32 }
  ];
  
  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;
  
  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          Referral Program
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Link Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Your Referral Link
              </h2>
              
              <p className="text-gray-400 mb-4">
                Share this link with your friends and earn 10% commission on their bets!
              </p>
              
              <div className="flex items-center bg-gray-700 rounded-lg overflow-hidden mb-6">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-grow bg-transparent border-none text-white px-4 py-3 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 transition-colors"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              
              <div className="bg-violet-900/30 border border-violet-500 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-violet-600 p-2 rounded-lg mr-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">
                      Your Referral Code: <span className="text-violet-400">{user?.referralCode}</span>
                    </h3>
                    <p className="text-gray-400">
                      Friends can also enter this code during registration to become your referral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Referral Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-violet-500">
                <h3 className="text-lg font-medium text-gray-400 mb-1">Total Referrals</h3>
                <p className="text-3xl font-bold text-white">{referrals.length}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-green-500">
                <h3 className="text-lg font-medium text-gray-400 mb-1">Total Earnings</h3>
                <p className="text-3xl font-bold text-green-400">${totalEarnings}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border-l-4 border-yellow-500">
                <h3 className="text-lg font-medium text-gray-400 mb-1">Commission Rate</h3>
                <p className="text-3xl font-bold text-white">10%</p>
              </div>
            </div>
          </div>
          
          {/* How It Works */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-xl font-semibold text-white mb-4">
              How It Works
            </h2>
            
            <ol className="space-y-4">
              <li className="flex">
                <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  1
                </div>
                <p className="text-gray-300">
                  Share your unique referral link with friends
                </p>
              </li>
              
              <li className="flex">
                <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  2
                </div>
                <p className="text-gray-300">
                  When they sign up using your link, they're added as your referral
                </p>
              </li>
              
              <li className="flex">
                <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  3
                </div>
                <p className="text-gray-300">
                  You earn 10% commission on every bet they place
                </p>
              </li>
              
              <li className="flex">
                <div className="bg-violet-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  4
                </div>
                <p className="text-gray-300">
                  Commissions are instantly credited to your wallet
                </p>
              </li>
            </ol>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-400">
                <strong className="text-white">Note:</strong> The referral program is for direct referrals only. Multi-level marketing is not supported.
              </p>
            </div>
          </div>
        </div>
        
        {/* Referral List */}
        <div className="mt-8 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-700">
            <h2 className="text-xl font-semibold text-white">
              Your Referrals
            </h2>
          </div>
          
          {referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-white">Username</th>
                    <th className="py-3 px-4 text-left text-white">Join Date</th>
                    <th className="py-3 px-4 text-left text-white">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-300">
                        {referral.username}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {new Date(referral.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-green-400 font-medium">
                        ${referral.earnings}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              You don't have any referrals yet. Share your link to start earning!
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferralPage;