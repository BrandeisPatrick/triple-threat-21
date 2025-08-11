import React from 'react';
import type { GameState } from '../types';
import { GameStatus } from '../types';

interface DesktopHandSummaryProps {
  gameStates: GameState[];
  focusedGameId: number;
  onFocusChange: (id: number) => void;
}

const getStatusColor = (status: GameStatus) => {
    if ([GameStatus.PlayerWins, GameStatus.Blackjack, GameStatus.AIBust].includes(status)) return 'bg-green-500';
    if ([GameStatus.AIWins, GameStatus.PlayerBust].includes(status)) return 'bg-red-500';
    if (status === GameStatus.Push) return 'bg-amber-500';
    if (status === GameStatus.PlayerTurn) return 'bg-cyan-400 animate-pulse';
    if (status === GameStatus.AITurn) return 'bg-fuchsia-500 animate-pulse';
    return 'bg-slate-600'; // For 'Waiting' status
}

export const DesktopHandSummary: React.FC<DesktopHandSummaryProps> = ({ gameStates, focusedGameId, onFocusChange }) => {
  return (
    <div className="hidden lg:grid lg:grid-cols-3 gap-6 lg:gap-8 mb-4 items-start" aria-label="Game Table Summary">
      {gameStates.map((gs) => {
        const showAiScore = [GameStatus.PlayerWins, GameStatus.AIWins, GameStatus.Push, GameStatus.PlayerBust, GameStatus.AIBust, GameStatus.Blackjack, GameStatus.AITurn, GameStatus.Waiting].includes(gs.status);
        const statusColor = getStatusColor(gs.status);
        const isFocused = gs.id === focusedGameId;

        return (
          <button
            key={gs.id}
            onClick={() => onFocusChange(gs.id)}
            aria-pressed={isFocused}
            className={`p-4 rounded-xl transition-all duration-300 text-white text-center border shadow-lg w-full
              ${isFocused 
                ? 'bg-slate-700/80 border-cyan-500 scale-105' 
                : 'bg-slate-800/80 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600'
              }`
            }
          >
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold tracking-wider">Table {gs.id}</span>
              <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} title={`Status: ${gs.status}`}></div>
            </div>
            <div>
              <div className={`font-bold text-4xl leading-tight ${gs.hasPlayerSpecialCard ? 'animate-text-glow-orange text-amber-400' : 'text-white'}`} aria-label={`Your score: ${gs.playerScore}`}>
                {gs.playerScore}
              </div>
              <div className="text-sm text-slate-400 mt-1" aria-label={`AI score: ${showAiScore ? gs.aiScore : 'Unknown'}`}>
                vs{' '}
                <span className={gs.hasAiSpecialCard && showAiScore ? 'animate-text-glow-orange text-amber-400' : ''}>
                  {showAiScore ? gs.aiScore : '?'}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};