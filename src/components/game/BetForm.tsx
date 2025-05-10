import React, { useState } from 'react';
import { ColorOption } from '../../types';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';

interface BetFormProps {
  selectedColor: ColorOption | null;
}

const BetForm: React.FC<BetFormProps> = ({ selectedColor }) => {
  const { placeBet, currentRound } = useGame();
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const isGameActive = currentRound?.status === 'active';
  const walletBalance = user?.walletBalance || 0;

  const quickAmounts = [10, 50, 100, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedColor) {
      setError('Please select a color first');
      return;
    }
    
    if (amount <= 0) {
      setError('Bet amount must be greater than 0');
      return;
    }
    
    if (walletBalance < amount) {
      setError('Insufficient wallet balance');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      await placeBet(selectedColor, amount);
      // Reset amount after successful bet
      setAmount(10);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to place bet');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-gray-800 rounded-lg p-4 shadow-lg">
      <h3 className="text-white text-xl font-semibold mb-4">Place Your Bet</h3>
      
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="betAmount" className="block text-gray-300 mb-2">
            Bet Amount
          </label>
          <input
            type="number"
            id="betAmount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
            step="1"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
            disabled={!isGameActive || isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-white py-1 rounded-lg transition-colors"
              onClick={() => setAmount(quickAmount)}
              disabled={!isGameActive || isSubmitting}
            >
              ${quickAmount}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300">Selected Color:</span>
          <span className={`font-semibold ${
            selectedColor === 'red' ? 'text-red-500' :
            selectedColor === 'green' ? 'text-green-500' :
            selectedColor === 'violet' ? 'text-violet-500' :
            'text-gray-400'
          }`}>
            {selectedColor ? selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1) : 'None'}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300">Potential Win:</span>
          <span className="text-green-500 font-semibold">
            ${amount * 2}
          </span>
        </div>
        
        <button
          type="submit"
          className={`
            w-full py-3 rounded-lg font-semibold text-white
            ${!selectedColor || !isGameActive || isSubmitting 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-violet-600 hover:bg-violet-700 transition-colors'
            }
          `}
          disabled={!selectedColor || !isGameActive || isSubmitting}
        >
          {isSubmitting ? 'Placing Bet...' : 'Place Bet'}
        </button>
      </form>
    </div>
  );
};

export default BetForm;