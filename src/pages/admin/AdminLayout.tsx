import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  DollarSign, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <BarChart3 size={20} /> },
    { path: '/admin/users', label: 'User Management', icon: <Users size={20} /> },
    { path: '/admin/games', label: 'Game History', icon: <Clock size={20} /> },
    { path: '/admin/wallets', label: 'Wallet Management', icon: <DollarSign size={20} /> }
  ];
  
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 bg-gray-800 flex-col fixed h-full">
        <div className="p-4 bg-gray-900 flex items-center">
          <h1 className="text-xl font-bold text-violet-400">
            Admin Panel
          </h1>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path) 
                      ? 'bg-violet-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <Link 
            to="/game"
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Home size={20} className="mr-3" />
            <span>Back to Game</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mt-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-800 z-50">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-violet-400">
            Admin Panel
          </h1>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="bg-gray-800 p-4">
            <nav>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors
                        ${isActive(item.path) 
                          ? 'bg-violet-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'}
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                
                <li>
                  <Link 
                    to="/game"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Home size={20} className="mr-3" />
                    <span>Back to Game</span>
                  </Link>
                </li>
                
                <li>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <LogOut size={20} className="mr-3" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-4 md:pt-0">
        <div className="mt-16 md:mt-0 p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;