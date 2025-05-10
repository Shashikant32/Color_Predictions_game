import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { User } from '../../types';
import { Search, Edit, Ban, Check } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Mock users data
  const users: User[] = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      walletBalance: 850,
      referralCode: 'JOHN123',
      isAdmin: false,
      createdAt: '2023-01-15T10:30:00Z'
    },
    {
      id: '2',
      username: 'alice_smith',
      email: 'alice@example.com',
      walletBalance: 1250,
      referralCode: 'ALICE456',
      isAdmin: false,
      createdAt: '2023-02-20T14:45:00Z'
    },
    {
      id: '3',
      username: 'bob_johnson',
      email: 'bob@example.com',
      walletBalance: 500,
      referralCode: 'BOB789',
      isAdmin: false,
      createdAt: '2023-03-10T09:15:00Z'
    },
    {
      id: '4',
      username: 'emma_wilson',
      email: 'emma@example.com',
      walletBalance: 2000,
      referralCode: 'EMMA321',
      isAdmin: false,
      createdAt: '2023-04-05T16:20:00Z'
    },
    {
      id: '5',
      username: 'admin',
      email: 'admin@example.com',
      walletBalance: 5000,
      referralCode: 'ADMIN999',
      isAdmin: true,
      createdAt: '2023-01-01T08:00:00Z'
    }
  ];
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-white mb-6">
        User Management
      </h1>
      
      {/* Search & Filter Bar */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-violet-500"
              placeholder="Search by username or email..."
            />
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-white">User</th>
                <th className="py-3 px-4 text-left text-white">Email</th>
                <th className="py-3 px-4 text-left text-white">Wallet Balance</th>
                <th className="py-3 px-4 text-left text-white">Referral Code</th>
                <th className="py-3 px-4 text-left text-white">Status</th>
                <th className="py-3 px-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold mr-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 font-medium text-green-400">
                    ${user.walletBalance}
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {user.referralCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isAdmin 
                        ? 'bg-violet-900/50 text-violet-400 border border-violet-500' 
                        : 'bg-green-900/50 text-green-400 border border-green-500'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        onClick={() => setEditingUser(user)}
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Ban User"
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-400">
                    No users found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Edit User: {editingUser.username}
              </h3>
              
              <form>
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser.username}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={editingUser.email}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">
                    Wallet Balance
                  </label>
                  <input
                    type="number"
                    defaultValue={editingUser.walletBalance}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingUser.isAdmin}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Admin Privileges</span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center"
                  >
                    <Check size={16} className="mr-1" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;