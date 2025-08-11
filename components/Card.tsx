import React from 'react';
import type { Card as CardType } from '../types';
import { SuitIcon } from './Icon';

interface CardProps {
  card: CardType;
  hidden?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, hidden }) => {
  if (hidden) {
    return (
      <div className="w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 border-2 border-blue-500/50 rounded-lg shadow-lg flex items-center justify-center p-2">
        <div className="w-full h-full border-2 border-blue-500/50 rounded-md flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500/30"></div>
        </div>
      </div>
    );
  }

  const color = (card.suit === 'Heart' || card.suit === 'Diamond') ? 'text-red-600' : 'text-black';
  const specialClass = card.isSpecial
    ? 'animate-pulse-orange'
    : 'transition-transform transform hover:scale-105 hover:shadow-xl';

  return (
    <div className={`w-20 h-28 sm:w-24 sm:h-36 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col justify-between relative ${specialClass}`}>
      <div className={`text-2xl font-bold ${color}`}>
        {card.rank}
        <SuitIcon suit={card.suit} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <SuitIcon suit={card.suit} className="text-4xl opacity-90" />
      </div>
      <div className={`text-2xl font-bold self-end rotate-180 ${color}`}>
        {card.rank}
        <SuitIcon suit={card.suit} />
      </div>
    </div>
  );
};