import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import PrivateRoute from './components/routes/PrivateRoute';
import AdminRoute from './components/routes/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GamePage from './pages/GamePage';
import TransactionHistory from './pages/TransactionHistory';
import ReferralPage from './pages/ReferralPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import GameHistory from './pages/admin/GameHistory';
import WalletManagement from './pages/admin/WalletManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/dashboard" 
              element={<PrivateRoute element={<Dashboard />} />} 
            />
            <Route 
              path="/game" 
              element={<PrivateRoute element={<GamePage />} />} 
            />
            <Route 
              path="/transactions" 
              element={<PrivateRoute element={<TransactionHistory />} />} 
            />
            <Route 
              path="/referrals" 
              element={<PrivateRoute element={<ReferralPage />} />} 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={<AdminRoute element={<AdminDashboard />} />} 
            />
            <Route 
              path="/admin/users" 
              element={<AdminRoute element={<UserManagement />} />} 
            />
            <Route 
              path="/admin/games" 
              element={<AdminRoute element={<GameHistory />} />} 
            />
            <Route 
              path="/admin/wallets" 
              element={<AdminRoute element={<WalletManagement />} />} 
            />
          </Routes>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;