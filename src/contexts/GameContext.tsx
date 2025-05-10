import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameRound, Bet, ColorOption } from '../types';
import { useAuth } from './AuthContext';

interface GameContextType {
  currentRound: GameRound | null;
  timeRemaining: number;
  placeBet: (color: ColorOption, amount: number) => Promise<void>;
  userBets: Bet[];
  gameHistory: GameRound[];
  isLoading: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateWalletBalance } = useAuth();
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize game with a new round
  useEffect(() => {
    const initializeGame = () => {
      try {
        const roundNumber = Math.floor(Math.random() * 10000);
        const now = new Date();
        const endTime = new Date(now.getTime() + 60000); // 60 seconds from now
        
        const newRound: GameRound = {
          id: `round-${roundNumber}`,
          roundNumber,
          startTime: now.toISOString(),
          endTime: endTime.toISOString(),
          winningColor: null,
          status: 'active'
        };
        
        setCurrentRound(newRound);
        setTimeRemaining(60);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to initialize game');
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!currentRound || currentRound.status !== 'active') return;

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endRound();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentRound]);

  // End current round and determine winner
  const endRound = () => {
    if (!currentRound) return;

    const colors: ColorOption[] = ['red', 'green', 'violet'];
    const winningColor = colors[Math.floor(Math.random() * colors.length)];

    const endedRound: GameRound = {
      ...currentRound,
      winningColor,
      status: 'ended'
    };

    // Process bets and update wallet balances
    processBets(endedRound);

    // Add ended round to history
    setGameHistory((prev) => [endedRound, ...prev]);

    // Start a new round after a small delay
    setTimeout(() => {
      const roundNumber = Math.floor(Math.random() * 10000);
      const now = new Date();
      const endTime = new Date(now.getTime() + 60000); // 60 seconds from now
      
      const newRound: GameRound = {
        id: `round-${roundNumber}`,
        roundNumber,
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        winningColor: null,
        status: 'active'
      };
      
      setCurrentRound(newRound);
      setTimeRemaining(60);
    }, 5000); // 5 seconds delay before starting a new round
  };

  // Process bets and determine winners
  const processBets = (round: GameRound) => {
    if (!round.winningColor || !user) return;

    const updatedBets = userBets.map(bet => {
      if (bet.roundId === round.id) {
        const won = bet.colorPrediction === round.winningColor;
        
        // Update user wallet if they won
        if (won && user) {
          // Simple payout logic: 2x for correct color
          const winnings = bet.amount * 2;
          updateWalletBalance(user.walletBalance + winnings);
        }
        
        return {
          ...bet,
          won
        };
      }
      return bet;
    });
    
    setUserBets(updatedBets);
  };

  // Place a bet on the current round
  const placeBet = async (color: ColorOption, amount: number) => {
    try {
      if (!currentRound || !user) {
        throw new Error('Cannot place bet at this time');
      }

      if (amount <= 0) {
        throw new Error('Bet amount must be greater than 0');
      }

      if (user.walletBalance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Create new bet
      const newBet: Bet = {
        id: `bet-${Date.now()}`,
        userId: user.id,
        roundId: currentRound.id,
        colorPrediction: color,
        amount,
        potential: amount * 2, // Simple potential calculation
        won: null,
        createdAt: new Date().toISOString()
      };

      // Deduct the bet amount from user's wallet
      updateWalletBalance(user.walletBalance - amount);

      // Add the bet to user's bets
      setUserBets(prev => [...prev, newBet]);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to place bet');
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentRound,
        timeRemaining,
        placeBet,
        userBets,
        gameHistory,
        isLoading,
        error
      }}
    >
      {children}
    </GameContext.Provider>
  );
};