import React from 'react';
import { ColorOption } from '../../types';
import { useGame } from '../../contexts/GameContext';

interface ColorSelectorProps {
  selectedColor: ColorOption | null;
  setSelectedColor: (color: ColorOption) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, setSelectedColor }) => {
  const { currentRound } = useGame();
  const isGameActive = currentRound?.status === 'active';
  
  const colors: { value: ColorOption; label: string; bgClass: string; borderClass: string }[] = [
    { 
      value: 'red', 
      label: 'Red', 
      bgClass: 'bg-red-600 hover:bg-red-700', 
      borderClass: 'border-red-400'
    },
    { 
      value: 'green', 
      label: 'Green', 
      bgClass: 'bg-green-600 hover:bg-green-700', 
      borderClass: 'border-green-400'
    },
    { 
      value: 'violet', 
      label: 'Violet', 
      bgClass: 'bg-violet-600 hover:bg-violet-700', 
      borderClass: 'border-violet-400'
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-white text-xl font-semibold mb-4">Select a Color</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {colors.map((color) => (
          <button
            key={color.value}
            className={`
              ${color.bgClass} 
              rounded-lg p-4 text-white font-bold transition-all transform
              ${selectedColor === color.value ? 
                `border-2 ${color.borderClass} scale-105` : 
                'border-2 border-transparent'
              }
              ${!isGameActive ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
            onClick={() => isGameActive && setSelectedColor(color.value)}
            disabled={!isGameActive}
          >
            {color.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;