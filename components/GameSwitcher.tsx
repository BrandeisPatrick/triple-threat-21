
import React from 'react';
import type { GameState } from '../types';
import { GameStatus } from '../types';

interface GameSwitcherProps {
  gameStates: GameState[];
  focusedGameId: number;
  onFocusChange: (id: number) => void;
}

const getStatusColor = (status: GameStatus) => {
    if ([GameStatus.PlayerWins, GameStatus.Blackjack, GameStatus.AIBust].includes(status)) return 'bg-green-500';
    if ([GameStatus.AIWins, GameStatus.PlayerBust].includes(status)) return 'bg-red-500';
    if (status === GameStatus.Push) return 'bg-amber-500';
    if (status === GameStatus.PlayerTurn) return 'bg-cyan-500 animate-pulse';
    if (status === GameStatus.AITurn) return 'bg-fuchsia-500 animate-pulse';
    return 'bg-slate-500';
}

export const GameSwitcher: React.FC<GameSwitcherProps> = ({ gameStates, focusedGameId, onFocusChange }) => {
  return (
    <div className="lg:hidden flex justify-center gap-2 mb-4" aria-label="Game Table Selector">
      {gameStates.map((gs) => {
        const isFocused = gs.id === focusedGameId;
        const showAiScore = [GameStatus.PlayerWins, GameStatus.AIWins, GameStatus.Push, GameStatus.PlayerBust, GameStatus.AIBust, GameStatus.Blackjack, GameStatus.AITurn, GameStatus.Waiting].includes(gs.status);

        return (
          <button
            key={gs.id}
            onClick={() => onFocusChange(gs.id)}
            aria-pressed={isFocused}
            className={`flex-1 p-3 rounded-xl transition-all duration-200 text-white border ${isFocused ? 'bg-slate-800/60 border-slate-600/80 scale-105 shadow-lg' : 'bg-slate-900/40 border-slate-700/50'}`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold tracking-wider">Table {gs.id}</span>
              <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(gs.status)}`} title={`Status: ${gs.status}`}></div>
            </div>
            <div className="text-center">
              <div className={`font-bold text-3xl leading-tight ${gs.hasPlayerSpecialCard ? 'animate-text-glow-orange text-amber-400' : 'text-white'}`} aria-label={`Your score: ${gs.playerScore}`}>
                {gs.playerScore}
              </div>
              <div className="text-xs text-slate-400 mt-0.5" aria-label={`AI score: ${showAiScore ? gs.aiScore : 'Unknown'}`}>
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
