import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GameTimer from '../components/game/GameTimer';
import ColorSelector from '../components/game/ColorSelector';
import BetForm from '../components/game/BetForm';
import GameResult from '../components/game/GameResult';
import BetHistory from '../components/user/BetHistory';
import { ColorOption } from '../types';

const GamePage: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          ColorPredict Game
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Section - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <GameTimer />
            
            <GameResult />
            
            <ColorSelector 
              selectedColor={selectedColor} 
              setSelectedColor={setSelectedColor as (color: ColorOption) => void} 
            />
          </div>
          
          {/* Bet Form Section - 1/3 width on desktop */}
          <div>
            <BetForm selectedColor={selectedColor} />
          </div>
        </div>
        
        {/* Bet History Section - Full width */}
        <BetHistory />
      </main>
      
      <Footer />
    </div>
  );
};

export default GamePage;