

import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icon';
import { MiniCard } from './MiniCard';
import { Suit, LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../services/leaderboardService';
import { Leaderboard } from './Leaderboard';


interface InfoTabsProps {
  onClose: () => void;
}

type ActiveTab = 'game' | 'basic' | 'leaderboard';

const RuleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4 last:mb-0">
        <h4 className="text-lg font-bold text-cyan-400 mb-2">{title}</h4>
        <div className="text-slate-300 space-y-3">{children}</div>
    </div>
);

const CardExample: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-slate-900/50 p-3 rounded-lg flex items-center gap-4">
        <div className="flex-shrink-0 flex -space-x-6">
            {children}
        </div>
        <div>
            <h5 className="font-bold text-white">{title}</h5>
            <p className="text-slate-400 text-xs">{description}</p>
        </div>
    </div>
);

const VisualRuleItem: React.FC<{ title?: string; description: string; visual: React.ReactNode }> = ({ title, description, visual }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center bg-slate-900 rounded-md p-3">
            {visual}
        </div>
        <div className="text-center w-full">
            {title && <h5 className="font-bold text-white mb-2">{title}</h5>}
            <p className="text-slate-300 text-sm max-w-md mx-auto">{description}</p>
        </div>
    </div>
);


export const InfoTabs: React.FC<InfoTabsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');
  const [leaderboardScores, setLeaderboardScores] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    if (activeTab === 'leaderboard') {
        setIsLoadingLeaderboard(true);
        fetchLeaderboard().then(scores => {
            const sorted = scores.sort((a, b) => b.streak - a.streak);
            setLeaderboardScores(sorted);
            setIsLoadingLeaderboard(false);
        });
    }
  }, [activeTab]);


  const TabButton: React.FC<{ tabId: ActiveTab; children: React.ReactNode }> = ({ tabId, children }) => {
    const isActive = activeTab === tabId;
    return (
      <button
        onClick={() => setActiveTab(tabId)}
        className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors w-1/3 sm:w-auto ${
          isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700/50'
        }`}
      >
        {children}
      </button>
    );
  };
  
  const GameRules = () => (
    <div className="space-y-4">
        <VisualRuleItem
            title="Overbust Power"
            description="Starting from the second round, 5 random cards become 'special'. If you hold one, you can't bust! Your score can go over 21."
            visual={
                <div className="flex items-center justify-center w-full h-full text-white space-x-2">
                   <MiniCard card={{rank: "K", suit: Suit.Spade, key: 'k-s-info'}} />
                   <MiniCard card={{rank: "Q", suit: Suit.Heart, isSpecial: true, key: 'q-h-info'}} />
                </div>
            }
        />
        <VisualRuleItem
            description="You can 'Hit' up to two times during your turn. After your second hit, your turn will automatically end, and any remaining active hands will stand."
            visual={
                <div className="flex flex-col items-center justify-center w-full max-w-xs text-white space-y-2">
                   <div className="bg-slate-800 rounded-lg px-5 py-2">
                     <p className="text-lg">Total Hits Left: <span className="font-bold text-cyan-400">2</span></p>
                   </div>
                   <div className="text-2xl text-slate-400 py-1">↓</div>
                   <p className="text-slate-300 text-sm">After 2nd hit...</p>
                   <div className="text-2xl text-slate-400 py-1">↓</div>
                   <div className="bg-slate-800 rounded-lg px-5 py-3 text-center">
                      <p className="text-lg">Total Hits Left: <span className="font-bold text-red-500">0</span></p>
                      <div className="mt-2 space-y-1">
                        <p className="font-bold text-amber-400 text-base leading-tight">Turn Automatically Ends</p>
                        <p className="font-bold text-amber-400 text-base leading-tight">Two Hits Per Turn</p>
                      </div>
                   </div>
                </div>
            }
        />
        <VisualRuleItem
            title="Simultaneous Gameplay"
            description="Play three tables against the AI at once. All cards are dealt from a single, shared 52-card deck."
            visual={
                <div className="flex flex-col items-center justify-center w-full h-full text-white">
                    <div className="text-xs font-bold">Deck</div>
                    <div className="relative w-8 h-10 bg-blue-500 border-2 border-blue-400 rounded">
                       <div className="absolute w-8 h-10 bg-blue-600 border-2 border-blue-400 rounded transform -rotate-6 top-0 left-0"></div>
                       <div className="absolute w-8 h-10 bg-blue-700 border-2 border-blue-400 rounded transform rotate-6 top-0 left-0"></div>
                    </div>
                    <div className="text-2xl font-thin leading-none transform -scale-y-100 -translate-y-1">↓ ↓ ↓</div>
                    <div className="flex gap-2 text-[9px] font-bold">
                        <div>P vs AI</div>
                        <div>P vs AI</div>
                        <div>P vs AI</div>
                    </div>
                </div>
            }
        />
         <VisualRuleItem
            title="Winning a Round"
            description="You win a round by winning at least 2 of the 3 tables. If the AI wins 2 or more, it wins the round. Otherwise, it's a draw."
            visual={
                <div className="flex flex-col items-center justify-center w-full h-full text-white space-y-1">
                   <div className="flex gap-2">
                        <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center font-bold text-xs">WIN</div>
                        <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-bold text-xs">LOSE</div>
                        <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center font-bold text-xs">WIN</div>
                   </div>
                   <div className="text-xl">↓</div>
                   <div className="font-bold text-amber-400 text-sm">🏆 Round Win!</div>
                </div>
            }
        />
         <VisualRuleItem
            title="Game End Condition"
            description="The game ends when the deck has fewer than 12 cards left, as a new round cannot be fully dealt."
            visual={
                <div className="flex items-center justify-center w-full h-full text-white space-x-2">
                   <div className="text-center">
                        <div className="relative w-8 h-10 bg-gray-500 border-2 border-gray-400 rounded flex items-center justify-center font-bold text-xs">
                           <div className="absolute w-8 h-10 bg-gray-600 border-2 border-gray-400 rounded transform -rotate-6 top-0 left-0"></div>
                           <span className="relative z-10">&lt;12</span>
                        </div>
                         <div className="text-[10px] mt-1">Deck</div>
                   </div>
                   <div className="text-2xl text-slate-400">→</div>
                    <div className="text-red-500 font-bold text-lg">GAME<br/>OVER</div>
                </div>
            }
        />
        <VisualRuleItem
            title="Ultimate Objective"
            description="The player with the most round wins at the end of the game is declared the ultimate winner."
             visual={
                <div className="flex flex-col items-center justify-center w-full h-full text-white space-y-1">
                   <div className="text-xs font-bold">Final Score</div>
                   <div className="bg-slate-800 px-2 py-1 rounded text-sm">
                        <span className="text-cyan-400">Player: 5</span>
                        <span className="mx-1">|</span>
                        <span className="text-red-400">AI: 2</span>
                   </div>
                   <div className="text-xl">↓</div>
                   <div className="font-bold text-amber-400 text-sm">🎉 Ultimate Winner!</div>
                </div>
            }
        />
    </div>
  );

  const BasicRules = () => (
    <div>
      <RuleSection title="Objective">
          <p className="text-sm">Get a hand value closer to 21 than the dealer (AI) without going over.</p>
      </RuleSection>
      
      <RuleSection title="Card Values">
          <CardExample title="Number Cards (2-9)" description="Are worth their face value.">
              <MiniCard card={{suit: Suit.Club, rank: '7', key: '7-c-info'}} />
          </CardExample>
          <CardExample title="Face Cards (10, J, Q, K)" description="Are each worth 10.">
              <MiniCard card={{suit: Suit.Diamond, rank: 'K', key: 'k-d-info'}} />
          </CardExample>
          <CardExample title="Aces" description="Are worth 1 or 11.">
              <MiniCard card={{suit: Suit.Spade, rank: 'A', key: 'a-s-info'}} />
          </CardExample>
      </RuleSection>

      <RuleSection title="Blackjack">
           <CardExample title="Blackjack!" description="An Ace + a 10-value card on your first two cards is an automatic win.">
               <MiniCard card={{suit: Suit.Heart, rank: 'A', key: 'a-h-info'}} />
               <MiniCard card={{suit: Suit.Spade, rank: 'J', key: 'j-s-info'}} />
          </CardExample>
      </RuleSection>
      
      <RuleSection title="Player Actions">
          <div className="space-y-2 text-sm">
              <p><strong>Hit:</strong> Take another card. If your hand value exceeds 21, you "bust" and lose immediately (unless you have a special "Overbust" card).</p>
              <p><strong>Stand:</strong> Take no more cards and end your turn.</p>
          </div>
      </RuleSection>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 animate-fade-in-down">
        <div className="relative p-6 pt-4">
          <div className="flex border-b border-slate-700 mb-4">
            <TabButton tabId="game">Game Rules</TabButton>
            <TabButton tabId="basic">Basic 21 Rules</TabButton>
            <TabButton tabId="leaderboard">Leaderboard</TabButton>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close rules"
            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <CloseIcon />
          </button>
          
          <div className="text-sm max-h-[70vh] overflow-y-auto pr-2">
            {activeTab === 'game' && <GameRules />}
            {activeTab === 'basic' && <BasicRules />}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white text-center">🏆 Win Streak Leaderboard 🏆</h3>
                {isLoadingLeaderboard 
                  ? <p className="text-center text-slate-400 py-4">Loading...</p>
                  : <Leaderboard scores={leaderboardScores} isCompact />
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
