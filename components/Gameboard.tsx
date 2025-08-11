

import React, { useState } from 'react';
import type { GameState } from '../types';
import { GameStatus } from '../types';
import { Card } from './Card';
import { GameStats } from './GameStats';
import { StatsIcon } from './Icon';

interface GameboardProps {
  gameState: GameState;
  onHit: (gameId: number) => void;
  onStand: (gameId: number) => void;
  remainingHits: number;
  turnPhase: 'PLAYER' | 'AI' | 'ROUND_OVER' | 'PREPARING';
}

const isTerminalStatus = (status: GameStatus) => {
    return [
        GameStatus.PlayerWins,
        GameStatus.AIWins,
        GameStatus.Push,
        GameStatus.PlayerBust,
        GameStatus.AIBust,
        GameStatus.Blackjack,
    ].includes(status);
};


const StatusIndicator: React.FC<{ status: GameStatus, isLoadingAI?: boolean }> = ({ status, isLoadingAI }) => {
  const baseClasses = "px-4 py-1 text-sm font-bold rounded-full shadow-lg text-white tracking-wide";
  let color = 'bg-slate-600';
  let animation = '';
  let text: string = status;

  if (isLoadingAI) {
    text = "Thinking...";
    color = 'bg-purple-600';
    animation = 'animate-pulse';
  } else {
    if (status.includes('Win') || status.includes('Blackjack') || status === GameStatus.AIBust) color = 'bg-green-600';
    if (status.includes('Bust') || status.includes('AI Wins')) color = 'bg-red-700';
    if (status === GameStatus.Push) color = 'bg-amber-500 text-black';
    if (status === GameStatus.PlayerTurn) {
        color = 'bg-cyan-500';
        animation = 'animate-pulse';
    }
    if (status === GameStatus.Waiting) color = 'bg-gray-500';
  }

  return (
    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${baseClasses} ${color} ${animation}`}>
      {text}
    </div>
  );
};

export const Gameboard: React.FC<GameboardProps> = ({ gameState, onHit, onStand, remainingHits, turnPhase }) => {
  const [showStats, setShowStats] = useState(false);
  const { id, playerHand, aiHand, playerScore, aiScore, status, isLoadingAI, stats, hasPlayerSpecialCard, hasAiSpecialCard } = gameState;
  
  const isPlayerHandTurn = status === GameStatus.PlayerTurn;
  const isPlayerGlobalTurn = turnPhase === 'PLAYER';
  const canPlayerAct = isPlayerGlobalTurn && isPlayerHandTurn && !isLoadingAI;

  const isGameEnded = isTerminalStatus(status);
  const showAISecondCard = isGameEnded || turnPhase === 'AI' || turnPhase === 'ROUND_OVER';

  return (
    <div className="bg-green-900/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 w-full flex flex-col gap-4 shadow-2xl relative shadow-black/30">
      <StatusIndicator status={status} isLoadingAI={isLoadingAI} />
      
      <div>
        <div className="text-center mb-2">
            <h3 className="text-sm font-semibold text-green-300/80 uppercase tracking-wider">AI's Hand</h3>
            <p className={`font-bold text-3xl lg:hidden ${hasAiSpecialCard && showAISecondCard ? 'animate-text-glow-orange text-amber-400' : 'text-white'}`}>
              {showAISecondCard ? aiScore : '?'}
            </p>
        </div>
        <div className="flex justify-center items-center h-28 sm:h-36 space-x-2">
          {aiHand.map((card, index) => (
            <Card key={card.key} card={card} hidden={index === 1 && !showAISecondCard} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-center mb-2">
            <h3 className="text-sm font-semibold text-green-300/80 uppercase tracking-wider">Your Hand</h3>
            <p className={`font-bold text-3xl lg:hidden ${hasPlayerSpecialCard ? 'animate-text-glow-orange text-amber-400' : 'text-white'}`}>
              {playerScore}
            </p>
        </div>
        <div className="flex justify-center items-center h-28 sm:h-36 space-x-2">
          {playerHand.map(card => (
            <Card key={card.key} card={card} />
          ))}
        </div>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showStats && isPlayerHandTurn && isPlayerGlobalTurn ? 'max-h-96' : 'max-h-0'}`}>
        {isPlayerHandTurn && <GameStats stats={stats} />}
      </div>

      <div className="flex justify-center space-x-2 sm:space-x-4 h-12 items-center pt-2 border-t border-green-600/20">
        {!isGameEnded && status !== GameStatus.Waiting ? (
          <>
            <button
              onClick={() => onHit(id)}
              disabled={!canPlayerAct || remainingHits <= 0}
              className="px-6 sm:px-8 py-3 bg-gradient-to-b from-yellow-400 to-yellow-600 border border-yellow-700 text-black font-bold rounded-lg shadow-md hover:from-yellow-300 active:from-yellow-500 active:to-yellow-700 disabled:from-slate-500 disabled:to-slate-600 disabled:border-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              Hit {canPlayerAct && remainingHits > 0 && `(${remainingHits})`}
            </button>
            <button
              onClick={() => onStand(id)}
              disabled={!canPlayerAct}
              className="px-6 sm:px-8 py-3 bg-gradient-to-b from-red-600 to-red-800 border border-red-900 text-white font-bold rounded-lg shadow-md hover:from-red-500 active:from-red-700 active:to-red-900 disabled:from-slate-500 disabled:to-slate-600 disabled:border-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              Stand
            </button>
            <button
              onClick={() => setShowStats(s => !s)}
              disabled={!canPlayerAct}
              aria-label="Toggle Statistics"
              className={`p-3 border rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 ${showStats && canPlayerAct ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-green-800/50 border-green-600/50 text-green-200'} disabled:from-slate-500 disabled:to-slate-600 disabled:border-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed`}
            >
              <StatsIcon />
            </button>
          </>
        ) : <div className="h-full w-full"/>}
      </div>
    </div>
  );
};