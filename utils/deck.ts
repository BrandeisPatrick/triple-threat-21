
import { Card, Suit, Rank, RANKS, GameStatsData } from '../types';

export const createDeck = (): Card[] => {
  const suits = Object.values(Suit);
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, key: `${rank}-${suit}` });
    }
  }
  return deck;
};

export const shuffleDeck = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  const newArray = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

export const getCardValue = (card: Card): number => {
  if (['J', 'Q', 'K'].includes(card.rank)) {
    return 10;
  }
  if (card.rank === 'A') {
    return 11;
  }
  return parseInt(card.rank, 10);
};

export const calculateScore = (hand: Card[]): number => {
  let score = 0;
  let aceCount = 0;
  for (const card of hand) {
    score += getCardValue(card);
    if (card.rank === 'A') {
      aceCount++;
    }
  }
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
};

export const calculateStatsForHand = (playerHand: Card[], deck: Card[]): GameStatsData => {
  const playerScore = calculateScore(playerHand);
  const deckSize = deck.length;

  const defaultStats = {
    bust: 0,
    improve: 0,
    to21: 0,
    avgValue: 0,
    distribution: { aces: 0, faces: 0, numbers: 0 },
  };

  if (deckSize === 0 || playerScore >= 21) {
    return defaultStats;
  }

  let bustCards = 0;
  let improveCards = 0;
  let to21Cards = 0;
  let totalValue = 0;
  const distribution = { aces: 0, faces: 0, numbers: 0 };

  for (const card of deck) {
    const newHand = [...playerHand, card];
    const newScore = calculateScore(newHand);
    
    totalValue += getCardValue(card); 

    if (newScore > 21) {
      bustCards++;
    } else if (newScore === 21) {
      to21Cards++;
      improveCards++;
    } else if (newScore > playerScore) {
      improveCards++;
    }

    if (card.rank === 'A') {
      distribution.aces++;
    } else if (['10', 'J', 'Q', 'K'].includes(card.rank)) {
      distribution.faces++;
    } else {
      distribution.numbers++;
    }
  }

  const avgValue = deckSize > 0 ? totalValue / deckSize : 0;

  return {
    bust: (bustCards / deckSize) * 100,
    improve: (improveCards / deckSize) * 100,
    to21: (to21Cards / deckSize) * 100,
    avgValue,
    distribution,
  };
};
