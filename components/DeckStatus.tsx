
import React from 'react';
import type { Card as CardType } from '../types';
import { Suit, RANKS } from '../types';
import { SuitIcon } from './Icon';

interface DeckStatusProps {
  deck: CardType[];
  discardPile: CardType[]; // Keep this prop in case we want to differentiate later
}

interface SuitSectionProps {
  suit: Suit;
  availableCardKeys: Set<string>;
  specialCardKeys: Set<string>;
}

const SuitSection: React.FC<SuitSectionProps> = ({ suit, availableCardKeys, specialCardKeys }) => {
  return (
    <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-slate-900/40">
       <div className="flex items-center gap-2 mb-1">
         <SuitIcon suit={suit} className="text-xl" />
         <span className="font-bold text-slate-300">{suit}s</span>
       </div>
       <div className="grid grid-cols-7 gap-1">
          {RANKS.map(rank => {
            const key = `${rank}-${suit}`;
            const isAvailable = availableCardKeys.has(key);
            const isSpecial = specialCardKeys.has(key);
            const opacity = isAvailable ? 'opacity-100' : 'opacity-20';
            const baseColor = (suit === 'Heart' || suit === 'Diamond') ? 'text-red-400' : 'text-slate-300';
            const bgColor = isAvailable ? 'bg-slate-700/50' : 'bg-slate-800/50';
            
            const rankClasses = isAvailable && isSpecial
              ? 'animate-text-glow-orange text-amber-400'
              : baseColor;

            return (
              <div key={key} className={`flex items-center justify-center w-7 h-7 rounded-md transition-all duration-300 ${opacity} ${bgColor}`}>
                <span className={`font-bold text-sm ${rankClasses}`}>{rank}</span>
              </div>
            );
          })}
       </div>
    </div>
  );
};


export const DeckStatus: React.FC<DeckStatusProps> = ({ deck }) => {
  const availableCardKeys = new Set(deck.map(c => c.key));
  const specialCardKeys = new Set(deck.filter(c => c.isSpecial).map(c => c.key));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-2xl mt-10">
      <h3 className="text-xl font-bold text-white mb-4 text-center tracking-wider">Deck Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(Suit).map(suit => (
            <SuitSection key={suit} suit={suit} availableCardKeys={availableCardKeys} specialCardKeys={specialCardKeys} />
        ))}
      </div>
      <div className="text-center text-slate-400 mt-5 text-sm">
        <p>Cards left in deck: <span className="font-bold text-slate-200">{deck.length}</span></p>
      </div>
    </div>
  );
};