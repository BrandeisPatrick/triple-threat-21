

export enum Suit {
  Spade = 'Spade',
  Club = 'Club',
  Heart = 'Heart',
  Diamond = 'Diamond',
}

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;
export type Rank = typeof RANKS[number];

export interface Card {
  suit: Suit;
  rank: Rank;
  key: string;
  isSpecial?: boolean;
}

export enum GameStatus {
  PlayerTurn = 'Your Turn',
  AITurn = "AI's Turn",
  Waiting = 'Standing',
  PlayerWins = 'You Win!',
  AIWins = 'AI Wins!',
  Push = 'Push',
  PlayerBust = 'You Busted!',
  AIBust = 'AI Busted!',
  Blackjack = 'Blackjack!',
  Ready = 'Ready to Play'
}

export interface GameStatsData {
  bust: number;
  improve: number;
  to21: number;
  avgValue: number;
  distribution: {
    aces: number;
    faces: number; // 10, J, Q, K
    numbers: number; // 2-9
  };
}

export interface GameState {
  id: number;
  playerHand: Card[];
  aiHand: Card[];
  playerScore: number;
  aiScore: number;
  status: GameStatus;
  isPlayerStood: boolean;
  isLoadingAI: boolean;
  stats: GameStatsData;
  isPlayerOverbusted: boolean;
  isAiOverbusted: boolean;
  hasPlayerSpecialCard: boolean;
  hasAiSpecialCard: boolean;
}

export type RoundWinner = 'Player' | 'AI' | 'Draw' | null;

export type HistoryAction = 'DEALT' | 'HITS' | 'STANDS' | 'BUSTS' | 'BLACKJACK' | 'OVERBUST_STANDS';

export type HistoryEntryPayload =
  | { type: 'message'; content: string }
  | { type: 'round_start'; roundNumber: number }
  | { type: 'round_end'; winner: RoundWinner }
  | { type: 'special_cards' }
  | {
      type: 'action';
      actor: 'Player' | 'AI';
      action: HistoryAction;
      tableId: number;
      card?: Card;
      newScore?: number;
      hand?: Card[];
    }
  | {
      type: 'table_result';
      tableId: number;
      result: GameStatus;
      playerScore: number;
      aiScore: number;
    };

export type HistoryEntry = HistoryEntryPayload & { key: string };

export interface LeaderboardEntry {
  name: string;
  streak: number;
}
