
import React from 'react';
import { MiniCard } from './MiniCard';
import { Suit } from '../types';
import { CloseIcon } from './Icon';

interface OverbustIntroProps {
  onClose: () => void;
}

export const OverbustIntro: React.FC<OverbustIntroProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in-scale">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-cyan-500/30">
        <div className="relative p-6 sm:p-8 text-center">
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white transition-colors"
            >
                <CloseIcon />
            </button>

            <div className="text-amber-400 animate-pulse text-5xl mb-4">✨</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-wide">
                Overbust Power Unlocked!
            </h2>
            <p className="text-slate-300 mb-6">
                Starting this round, 5 random cards in the deck are now <b className="text-amber-400 font-bold">Special</b>.
                If you have a special card, your hand cannot bust!
            </p>

            <div className="flex items-center justify-center gap-4 mb-6">
                <MiniCard card={{rank: "7", suit: Suit.Club, key: '7-c-intro'}} />
                <div className="text-2xl font-bold text-slate-400">+</div>
                <MiniCard card={{rank: "K", suit: Suit.Spade, key: 'k-s-intro', isSpecial: true}} />
                <div className="text-2xl font-bold text-slate-400">=</div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-2xl text-amber-400 animate-text-glow-orange">17</span>
                    <span className="text-xs text-slate-400">(Safe!)</span>
                </div>
            </div>
             <div className="flex items-center justify-center gap-4 mb-8">
                <MiniCard card={{rank: "J", suit: Suit.Diamond, key: 'j-d-intro'}} />
                 <MiniCard card={{rank: "5", suit: Suit.Heart, key: '5-h-intro'}} />
                <div className="text-2xl font-bold text-slate-400">+</div>
                <MiniCard card={{rank: "Q", suit: Suit.Heart, isSpecial: true, key: 'q-h-intro'}} />
                <div className="text-2xl font-bold text-slate-400">=</div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-2xl text-amber-400 animate-text-glow-orange">25</span>
                    <span className="text-xs text-slate-400">(Overbust!)</span>
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full px-8 py-3 bg-gradient-to-br from-teal-500 to-cyan-600 font-bold text-lg rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
                Let's Go!
            </button>
        </div>
      </div>
    </div>
  );
};
