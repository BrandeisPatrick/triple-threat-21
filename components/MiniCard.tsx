
import React from 'react';
import type { Card as CardType } from '../types';
import { SuitIcon } from './Icon';

interface MiniCardProps {
  card?: CardType;
  hidden?: boolean;
}

export const MiniCard: React.FC<MiniCardProps> = ({ card, hidden }) => {
  if (hidden) {
    return (
      <div className="w-14 h-20 bg-blue-800 border border-blue-500/50 rounded-md shadow-sm flex items-center justify-center p-1 flex-shrink-0">
        <div className="w-full h-full border border-blue-500/50 rounded-sm flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500/30"></div>
        </div>
      </div>
    );
  }

  if (!card) return null;

  const color = (card.suit === 'Heart' || card.suit === 'Diamond') ? 'text-red-500' : 'text-black';
  const specialClass = card.isSpecial
    ? 'shadow-[0_0_8px_2px_rgba(251,191,36,0.6)] border-amber-400 ring-1 ring-amber-300/70'
    : 'border-gray-300';

  return (
    <div className={`w-14 h-20 bg-white rounded-md shadow-md p-1 flex flex-col justify-between relative flex-shrink-0 transition-all border ${specialClass}`}>
      <div className={`text-xl font-bold ${color}`}>
        {card.rank}
        <SuitIcon suit={card.suit} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <SuitIcon suit={card.suit} className="text-3xl opacity-90" />
      </div>
      <div className={`text-xl font-bold self-end rotate-180 ${color}`}>
        {card.rank}
        <SuitIcon suit={card.suit} />
      </div>
    </div>
  );
};
