
import React from 'react';
import type { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  highlightStreak?: number;
  isCompact?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores, highlightStreak, isCompact = false }) => {
  if (!scores || scores.length === 0) {
    return <p className="text-slate-400 text-center py-4">The leaderboard is empty. Be the first!</p>;
  }

  const rankIcons = ['🏆', '🥈', '🥉'];

  return (
    <div className={`space-y-2 ${isCompact ? 'text-sm' : ''}`}>
      {scores.map((score, index) => {
        const isHighlighted = score.streak === highlightStreak;
        return (
          <div
            key={`${score.name}-${index}`}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              isHighlighted ? 'bg-amber-500/20 ring-2 ring-amber-400' : 'bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`font-bold text-lg w-6 text-center ${isCompact ? 'text-base' : ''}`}>
                {index < 3 ? rankIcons[index] : index + 1}
              </span>
              <span className={`font-semibold ${isHighlighted ? 'text-amber-300' : 'text-white'}`}>
                {score.name}
              </span>
            </div>
            <div className="font-bold text-xl text-white">
              <span className={` ${isHighlighted ? 'text-amber-300' : 'text-white'} ${isCompact ? 'text-lg' : ''}`}>{score.streak}</span>
              <span className={`text-slate-400 text-sm ml-1 ${isCompact ? 'text-xs' : ''}`}>wins</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
