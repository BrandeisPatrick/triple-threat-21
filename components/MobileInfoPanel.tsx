import React, { useState, useEffect } from 'react';
import { CloseIcon, HistoryIcon } from './Icon';
import type { Card as CardType, HistoryEntry, GameState } from '../types';
import { Suit, RANKS, GameStatus } from '../types';
import { SuitIcon } from './Icon';
import { MiniCard } from './MiniCard';
import { fetchLeaderboard, LeaderboardEntry } from '../services/leaderboardService';
import { Leaderboard } from './Leaderboard';

interface MobileInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onShowRules: () => void;
  deck: CardType[];
  discardPile: CardType[];
  history: HistoryEntry[];
  roundScores: { player: number; ai: number; draws: number };
  gameStates: GameState[];
  currentWinStreak: number;
  maxWinStreak: number;
}

type ActiveTab = 'deck' | 'history' | 'leaderboard';

const SuitSection: React.FC<{
  suit: Suit;
  availableCardKeys: Set<string>;
  specialCardKeys: Set<string>;
}> = ({ suit, availableCardKeys, specialCardKeys }) => {
  return (
    <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800/40">
      <div className="flex items-center gap-1">
        <SuitIcon suit={suit} className="text-lg" />
        <span className="text-xs font-medium">{suit}</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {RANKS.map(rank => {
          const cardKey = `${rank}_${suit}`;
          const isAvailable = availableCardKeys.has(cardKey);
          const isSpecial = specialCardKeys.has(cardKey);
          
          return (
            <div
              key={cardKey}
              className={`
                w-4 h-5 rounded-sm text-xs flex items-center justify-center font-bold
                ${isAvailable 
                  ? isSpecial 
                    ? 'bg-orange-500/80 text-white animate-pulse'
                    : 'bg-slate-600/80 text-slate-200'
                  : 'bg-slate-800/60 text-slate-500'
                }
              `}
            >
              {rank === '10' ? 'T' : rank}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getResultColorClasses = (result: GameStatus) => {
  switch (result) {
    case GameStatus.PlayerWins:
    case GameStatus.Blackjack:
    case GameStatus.AIBust:
      return 'border-green-500/70 text-green-400';
    case GameStatus.AIWins:
    case GameStatus.PlayerBust:
      return 'border-red-500/70 text-red-400';
    case GameStatus.Draw:
      return 'border-yellow-500/70 text-yellow-400';
    default:
      return 'border-slate-500/70 text-slate-400';
  }
};

export const MobileInfoPanel: React.FC<MobileInfoPanelProps> = ({
  isOpen,
  onClose,
  onShowRules,
  deck,
  discardPile,
  history,
  roundScores,
  gameStates,
  currentWinStreak,
  maxWinStreak
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('deck');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      setLeaderboardLoading(true);
      fetchLeaderboard()
        .then(setLeaderboard)
        .catch(console.error)
        .finally(() => setLeaderboardLoading(false));
    }
  }, [activeTab]);

  if (!isOpen) return null;

  // Calculate deck status
  const availableCardKeys = new Set(deck.map(card => `${card.rank}_${card.suit}`));
  const specialCardKeys = new Set(deck.filter(card => card.isSpecial).map(card => `${card.rank}_${card.suit}`));
  const totalCards = deck.length + discardPile.length;
  const cardsRemaining = deck.length;
  const specialCardsInDeck = deck.filter(card => card.isSpecial).length;

  // Calculate game stats
  const totalGames = roundScores.player + roundScores.ai + roundScores.draws;
  const winRate = totalGames > 0 ? (roundScores.player / totalGames * 100).toFixed(1) : '0.0';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'deck':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-sm text-slate-400">Cards Remaining</div>
                <div className="text-2xl font-bold text-cyan-400">{cardsRemaining}</div>
                <div className="text-xs text-slate-500">of {totalCards}</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-sm text-slate-400">Special Cards</div>
                <div className="text-2xl font-bold text-orange-400">{specialCardsInDeck}</div>
                <div className="text-xs text-slate-500">in deck</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-white">Available Cards</h4>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Suit).map(suit => (
                  <SuitSection
                    key={suit}
                    suit={suit}
                    availableCardKeys={availableCardKeys}
                    specialCardKeys={specialCardKeys}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-900/30 rounded-lg p-2">
                <div className="text-lg font-bold text-green-400">{roundScores.player}</div>
                <div className="text-xs text-slate-400">Wins</div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-2">
                <div className="text-lg font-bold text-red-400">{roundScores.ai}</div>
                <div className="text-xs text-slate-400">Losses</div>
              </div>
              <div className="bg-yellow-900/30 rounded-lg p-2">
                <div className="text-lg font-bold text-yellow-400">{roundScores.draws}</div>
                <div className="text-xs text-slate-400">Draws</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-sm text-slate-400">Win Rate</div>
                <div className="text-xl font-bold text-cyan-400">{winRate}%</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-sm text-slate-400">Max Streak</div>
                <div className="text-xl font-bold text-purple-400">{maxWinStreak}</div>
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="text-lg font-bold text-white sticky top-0 bg-slate-900/90 py-1">Recent Games</h4>
              {history.slice(0, 20).map((entry) => (
                <div key={entry.key} className={`border rounded-lg p-2 ${getResultColorClasses(entry.result)}`}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Table {entry.tableId} - {entry.result}</span>
                    <span className="text-xs opacity-75">Round {entry.roundNumber}</span>
                  </div>
                  {entry.finalHands && (
                    <div className="flex gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">You:</span>
                        <div className="flex gap-0.5">
                          {entry.finalHands.player.map((card, idx) => (
                            <MiniCard key={idx} card={card} />
                          ))}
                        </div>
                        <span className="text-xs">({entry.finalScores?.player})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">AI:</span>
                        <div className="flex gap-0.5">
                          {entry.finalHands.ai.map((card, idx) => (
                            <MiniCard key={idx} card={card} />
                          ))}
                        </div>
                        <span className="text-xs">({entry.finalScores?.ai})</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );


      case 'leaderboard':
        return (
          <div>
            <Leaderboard 
              entries={leaderboard} 
              loading={leaderboardLoading}
              currentWinStreak={currentWinStreak}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="w-full max-w-md max-h-[90vh] bg-slate-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white">Game Info</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50">
          {[
            { id: 'deck', label: 'Deck', icon: '🃏' },
            { id: 'history', label: 'Stats', icon: '📊' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex-1 p-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-cyan-400 bg-slate-800/50 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* View Rules Button */}
        <div className="p-4 border-b border-slate-700/50">
          <button
            onClick={() => {
              onClose();
              onShowRules();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-[1.02]"
          >
            📖 View Game Rules & Guide
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};