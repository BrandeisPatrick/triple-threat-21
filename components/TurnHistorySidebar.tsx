
import React, { useRef, useEffect } from 'react';
import { CloseIcon, HistoryIcon } from './Icon';
import type { HistoryEntry, RoundWinner } from '../types';
import { GameStatus } from '../types';
import { MiniCard } from './MiniCard';

interface TurnHistorySidebarProps {
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
}

const getResultColorClasses = (result: GameStatus) => {
    switch (result) {
        case GameStatus.PlayerWins:
        case GameStatus.Blackjack:
        case GameStatus.AIBust:
            return 'border-green-500/70 text-green-400';
        case GameStatus.AIWins:
        case GameStatus.PlayerBust:
            return 'border-red-500/70 text-red-400';
        case GameStatus.Push:
            return 'border-amber-500/70 text-amber-400';
        default:
            return 'border-slate-600/70 text-slate-300';
    }
}

const HistoryEvent: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
    switch (entry.type) {
        case 'round_start':
            return (
                <div className="text-center py-2 my-2 border-y-2 border-slate-700">
                    <p className="text-slate-400 font-bold tracking-wider">--- Round {entry.roundNumber} ---</p>
                </div>
            );
        
        case 'message':
             return (
                <div className="bg-slate-900/50 rounded-lg p-3 text-center text-slate-300 text-sm">
                    <p>{entry.content}</p>
                </div>
            );
        
        case 'special_cards':
            return (
                <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-lg p-3 text-center text-cyan-200 text-sm border border-cyan-700/50">
                    <p>✨ A strange energy pulses through the deck... Some cards now feel special! ✨</p>
                </div>
            );

        case 'action':
            const actorColor = entry.actor === 'Player' ? 'border-cyan-500/50' : 'border-fuchsia-500/50';
            const actorTextColor = entry.actor === 'Player' ? 'text-cyan-400' : 'text-fuchsia-400';
            const actionText = entry.action.replace('_', ' ').toLowerCase();

            return (
                <div className={`bg-slate-900/50 rounded-lg p-3 border-l-4 ${actorColor}`}>
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold capitalize">
                            <span className={actorTextColor}>{entry.actor}</span> {actionText}
                            {entry.tableId ? ` on Table ${entry.tableId}` : ''}
                        </p>
                        {entry.newScore && <p className="text-xl font-bold text-white">{entry.newScore}</p>}
                    </div>
                    {(entry.card || entry.hand) && (
                        <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
                            {entry.card && <MiniCard card={entry.card} />}
                            {entry.hand && entry.hand.map((c, i) => <MiniCard key={c.key} card={c} hidden={entry.actor === 'AI' && i === 1} />)}
                        </div>
                    )}
                </div>
            );
        
        case 'table_result':
            return (
                 <div className={`bg-slate-900/50 rounded-lg p-3 border-l-4 ${getResultColorClasses(entry.result)}`}>
                    <div className="flex justify-between items-center">
                        <p className="font-bold">Table {entry.tableId}: {entry.result}</p>
                        <p className="text-sm font-semibold text-white">{entry.playerScore} vs {entry.aiScore}</p>
                    </div>
                </div>
            )
        
        case 'round_end':
            const winnerConfig: Record<Exclude<RoundWinner, null>, {text: string, style: string, icon: string}> = {
                Player: { text: "You Win The Round!", style: 'bg-gradient-to-t from-amber-600/50 to-amber-500/20 border-amber-500/70 text-amber-300', icon: '🏆' },
                AI: { text: "AI Wins The Round", style: 'bg-gradient-to-t from-red-600/50 to-red-500/20 border-red-500/70 text-red-300', icon: '🤖' },
                Draw: { text: "Round is a Draw", style: 'bg-gradient-to-t from-slate-600/50 to-slate-500/20 border-slate-500/70 text-slate-300', icon: '🤝' },
            }
            if (!entry.winner) return null;
            const config = winnerConfig[entry.winner];

            return (
                <div className={`text-center py-3 my-2 border-y-2 font-bold text-lg rounded-lg ${config.style}`}>
                    {config.icon} {config.text}
                </div>
            )
        
        default:
            return null;
    }
};

export const TurnHistorySidebar: React.FC<TurnHistorySidebarProps> = ({ history, isOpen, onClose }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [history, isOpen]);


  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-800/95 backdrop-blur-xl border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="log"
        aria-label="Turn History"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <HistoryIcon className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Turn History</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close turn history"
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <CloseIcon />
            </button>
          </header>
          <div ref={scrollContainerRef} className="flex-grow p-4 overflow-y-auto space-y-3">
            {history.length === 0 ? (
              <p className="text-slate-400 text-center mt-4">No actions taken yet.</p>
            ) : (
              history.map((entry) => (
                <div key={entry.key} className="animate-fade-in-down">
                    <HistoryEvent entry={entry} />
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
