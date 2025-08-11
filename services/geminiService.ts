import type { Card } from '../types';

// Helper function to simulate a delay, making the AI's turn feel more natural.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAIDecision = async (
  aiHand: Card[],
  playerScore: number,
  remainingDeck: Card[],
  specialCardsInPlay: boolean,
): Promise<'hit' | 'stand'> => {
  const aiScore = calculateScore(aiHand);
  const hasSpecialCard = aiHand.some(c => c.isSpecial);

  // Simulate AI "thinking" time
  await sleep(750);

  // Simple hardcoded logic
  if (hasSpecialCard) {
    // If AI has a special card, it can't bust.
    // It will hit if its score is less than or equal to the player's score,
    // as it's a free chance to improve. A real player might even hit on higher
    // values, but this is a safe, simple strategy.
    const finalPlayerScore = playerScore > 21 ? 0 : playerScore; // Don't try to beat a busted player
    return aiScore <= finalPlayerScore ? 'hit' : 'stand';
  }

  // Standard Blackjack "dealer" logic: hit on 16 or less, stand on 17 or more.
  if (aiScore < 17) {
    return 'hit';
  }
  
  return 'stand';
};

const getCardValue = (card: Card): number => {
    if (['J', 'Q', 'K', '10'].includes(card.rank)) return 10;
    if (card.rank === 'A') return 11;
    return parseInt(card.rank, 10);
};

const calculateScore = (hand: Card[]): number => {
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