import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-violet-400">
          ColorPredict
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-violet-400 transition-colors">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/game" className="hover:text-violet-400 transition-colors">
                Play Game
              </Link>
              
              <Link to="/transactions" className="hover:text-violet-400 transition-colors">
                Transactions
              </Link>
              
              <Link to="/referrals" className="hover:text-violet-400 transition-colors">
                Referrals
              </Link>
              
              {user?.isAdmin && (
                <Link to="/admin" className="hover:text-violet-400 transition-colors">
                  Admin
                </Link>
              )}
              
              <div className="flex items-center bg-gray-800 px-3 py-1 rounded-lg">
                <Wallet size={16} className="text-green-400 mr-2" />
                <span className="text-green-400 font-medium">
                  ${user?.walletBalance.toFixed(2)}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="hover:text-violet-400 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-4 py-3 space-y-3">
            <Link 
              to="/" 
              className="block hover:text-violet-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/game" 
                  className="block hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Play Game
                </Link>
                
                <Link 
                  to="/transactions" 
                  className="block hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Transactions
                </Link>
                
                <Link 
                  to="/referrals" 
                  className="block hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Referrals
                </Link>
                
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block hover:text-violet-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center bg-gray-700 px-3 py-2 rounded-lg w-fit">
                  <Wallet size={16} className="text-green-400 mr-2" />
                  <span className="text-green-400 font-medium">
                    ${user?.walletBalance.toFixed(2)}
                  </span>
                </div>
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block hover:text-violet-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors w-fit"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;