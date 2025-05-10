import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  updateWalletBalance: (newBalance: number) => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (userData) {
          const user = JSON.parse(userData) as User;
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setState({
            ...initialState,
            isLoading: false
          });
        }
      } catch (error) {
        setState({
          ...initialState,
          isLoading: false,
          error: 'Failed to load user data'
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Mock login function (would be replaced with actual API call)
  const login = async (email: string, password: string) => {
    try {
      setState({
        ...state,
        isLoading: true,
        error: null
      });

      // Mock user data (replace with API call)
      const user: User = {
        id: '1',
        username: 'testuser',
        email: email,
        walletBalance: 1000,
        referralCode: 'TEST123',
        isAdmin: email === 'admin@example.com',
        createdAt: new Date().toISOString(),
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Invalid email or password'
      });
    }
  };

  // Mock register function (would be replaced with actual API call)
  const register = async (username: string, email: string, password: string, referralCode?: string) => {
    try {
      setState({
        ...state,
        isLoading: true,
        error: null
      });

      // Mock user data (replace with API call)
      const user: User = {
        id: '1',
        username,
        email,
        walletBalance: 100, // Starting balance
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referredBy: referralCode,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        error: 'Registration failed'
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateWalletBalance = (newBalance: number) => {
    if (state.user) {
      const updatedUser = {
        ...state.user,
        walletBalance: newBalance
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setState({
        ...state,
        user: updatedUser
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateWalletBalance
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};