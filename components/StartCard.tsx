import React, { useState } from 'react';
import { SuitIcon } from './Icon';

interface StartCardProps {
  onClick: () => void;
}

export const StartCard: React.FC<StartCardProps> = ({ onClick }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isClicked) return;
    
    setIsClicked(true);
    
    // Trigger haptic feedback for mobile
    if (window.navigator && (window.navigator as any).vibrate) {
      (window.navigator as any).vibrate(30);
    }
    
    // Wait for animation to complete before transitioning
    setTimeout(() => {
      onClick();
    }, 700);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isClicked}
      className={`
        group relative w-32 h-44 sm:w-40 sm:h-56 bg-white border border-gray-200 rounded-2xl shadow-2xl 
        ${!isClicked ? 'hover:shadow-3xl hover:scale-110 hover:rotate-3 active:scale-95' : ''}
        transform transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-cyan-400/50
        ${isClicked ? 'card-click' : ''}
      `}
        >
          {/* Card Front */}
          <div className="w-full h-full p-3 sm:p-4 flex flex-col justify-between relative rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100">
            {/* Top left corner */}
            <div className="text-red-600 font-bold text-xl sm:text-2xl flex flex-col items-center leading-none">
              A
              <SuitIcon suit="Heart" className="text-lg sm:text-xl -mt-1" />
            </div>
            
            {/* Center suit icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <SuitIcon suit="Heart" className={`text-5xl sm:text-6xl text-red-600 opacity-90 ${!isClicked ? 'group-hover:scale-110' : ''} transition-transform duration-300`} />
            </div>
            
            {/* Bottom right corner (rotated) */}
            <div className="text-red-600 font-bold text-xl sm:text-2xl self-end rotate-180 flex flex-col items-center leading-none">
              A
              <SuitIcon suit="Heart" className="text-lg sm:text-xl -mt-1" />
            </div>
          </div>
          
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 ${!isClicked ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} transition-opacity duration-300 pointer-events-none`}></div>
          
          {/* Tap hint */}
          <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium ${!isClicked ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            Tap to Start
          </div>
        </button>
  );
};