// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  isAdmin: boolean;
  createdAt: string;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Game related types
export type ColorOption = 'red' | 'green' | 'violet';

export interface GameRound {
  id: string;
  roundNumber: number;
  startTime: string;
  endTime: string;
  winningColor: ColorOption | null;
  status: 'waiting' | 'active' | 'ended';
}

export interface Bet {
  id: string;
  userId: string;
  roundId: string;
  colorPrediction: ColorOption;
  amount: number;
  potential: number;
  won: boolean | null;
  createdAt: string;
}

// Transaction related types
export type TransactionType = 'deposit' | 'withdrawal' | 'bet' | 'win' | 'referral';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
}

// Referral related types
export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  commission: number;
  status: 'pending' | 'completed';
  createdAt: string;
}