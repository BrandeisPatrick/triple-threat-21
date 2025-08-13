
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Gameboard } from './components/Gameboard';
import { DeckStatus } from './components/DeckStatus';
import { getAIDecision } from './services/geminiService';
import type { Card, GameState, RoundWinner, GameStatsData, HistoryEntry, HistoryEntryPayload } from './types';
import { GameStatus } from './types';
import { createDeck, shuffleDeck, calculateScore, calculateStatsForHand } from './utils/deck';
import { RoundResultBanner } from './components/RoundResultBanner';
import { Scoreboard } from './components/Scoreboard';
import { GameOver } from './components/GameOver';
import { InfoTabs } from './components/InfoTabs';
import { InfoIcon, HistoryIcon } from './components/Icon';
import { GameSwitcher } from './components/GameSwitcher';
import { DesktopHandSummary } from './components/DesktopHandSummary';
import { TurnHistorySidebar } from './components/TurnHistorySidebar';
import { TurnIndicator } from './components/TurnIndicator';
import { OverbustIntro } from './components/OverbustIntro';
import StartScreen from './components/StartScreen';

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

const defaultStats: GameStatsData = {
  bust: 0,
  improve: 0,
  to21: 0,
  avgValue: 0,
  distribution: { aces: 0, faces: 0, numbers: 0 },
};

const MAX_HITS_PER_TURN = 2;

const App: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [gameStates, setGameStates] = useState<GameState[]>([]);
  const [gamesInitialized, setGamesInitialized] = useState(false);
  const [turnPhase, setTurnPhase] = useState<'PLAYER' | 'AI' | 'ROUND_OVER' | 'PREPARING'>('PLAYER');
  const [roundWinner, setRoundWinner] = useState<RoundWinner>(null);
  const [roundScores, setRoundScores] = useState({ player: 0, ai: 0, draws: 0 });
  const roundNumberRef = useRef(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [focusedGameId, setFocusedGameId] = useState<number>(1);
  const [turnHistory, setTurnHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [specialCardsAdded, setSpecialCardsAdded] = useState(false);
  const [hitsThisTurn, setHitsThisTurn] = useState(0);
  const [currentWinStreak, setCurrentWinStreak] = useState(0);
  const [maxWinStreak, setMaxWinStreak] = useState(0);
  const [showOverbustIntro, setShowOverbustIntro] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const isAiTurnRunning = useRef(false);

  const logHistory = useCallback((entry: HistoryEntryPayload) => {
    const newEntry: HistoryEntry = { ...entry, key: `${Date.now()}-${Math.random()}` };
    setTurnHistory(prev => [newEntry, ...prev]);
  }, []);

  const dealRound = useCallback((currentDeck: Card[]) => {
    setTurnPhase('PREPARING');
    setRoundWinner(null);
    setHitsThisTurn(0);

    const roundNumber = roundScores.player + roundScores.ai + roundScores.draws + 1;
    roundNumberRef.current = roundNumber;
    
    let deckForRound = [...currentDeck];

    if (roundNumber === 2 && !specialCardsAdded) {
      setShowOverbustIntro(true);
      logHistory({ type: 'special_cards' });
      
      const specialCardKeys = new Set<string>();
      const deckCopyForSelection = [...deckForRound];
      for (let i = 0; i < 5; i++) {
        if (deckCopyForSelection.length === 0) break;
        const randomIndex = Math.floor(Math.random() * deckCopyForSelection.length);
        const specialCard = deckCopyForSelection.splice(randomIndex, 1)[0];
        specialCardKeys.add(specialCard.key);
      }
      
      deckForRound = deckForRound.map(card => ({
          ...card,
          isSpecial: specialCardKeys.has(card.key)
      }));
      setSpecialCardsAdded(true);
    }
    
    let shuffled = shuffleDeck(deckForRound);

    // End game if not enough cards for a full round
    if (shuffled.length < 12) {
      setIsGameOver(true);
      return;
    }

    logHistory({ type: 'round_start', roundNumber });
    
    setTimeout(() => {
        const playerHands: Card[][] = [[], [], []];
        const aiHands: Card[][] = [[], [], []];

        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 3; j++) {
            playerHands[j].push(shuffled.pop()!);
            aiHands[j].push(shuffled.pop()!);
          }
        }

        const newGameStates: GameState[] = playerHands.map((pHand, index) => {
          const playerScore = calculateScore(pHand);
          const aiHand = aiHands[index];
          const aiScore = calculateScore(aiHand);
          let status = GameStatus.PlayerTurn;

          if (playerScore === 21) {
              status = GameStatus.Blackjack;
              logHistory({ type: 'action', actor: 'Player', action: 'BLACKJACK', tableId: index + 1, newScore: 21, hand: pHand });
          }

          return {
            id: index + 1,
            playerHand: pHand,
            aiHand: aiHand,
            playerScore: playerScore,
            aiScore: aiScore,
            status: status,
            isPlayerStood: false,
            isLoadingAI: false,
            stats: defaultStats,
            isPlayerOverbusted: false,
            isAiOverbusted: false,
            hasPlayerSpecialCard: pHand.some(c => c.isSpecial),
            hasAiSpecialCard: aiHand.some(c => c.isSpecial),
          };
        });
        
        newGameStates.forEach((gs, index) => {
            logHistory({ type: 'action', actor: 'Player', action: 'DEALT', tableId: index + 1, hand: gs.playerHand, newScore: gs.playerScore });
            logHistory({ type: 'action', actor: 'AI', action: 'DEALT', tableId: index + 1, hand: gs.aiHand, newScore: gs.aiScore });
        });

        const activePlayerHands = newGameStates.filter(gs => gs.status === GameStatus.PlayerTurn).length;
        if (activePlayerHands === 0) {
            setTurnPhase('AI');
        } else {
            setTurnPhase('PLAYER');
            const firstActive = newGameStates.find(gs => gs.status === GameStatus.PlayerTurn);
            if (firstActive) setFocusedGameId(firstActive.id);
        }

        setDeck(shuffled);
        const dealtCards = [...playerHands.flat(), ...aiHands.flat()];
        setDiscardPile(prev => [...prev, ...dealtCards]);
        setGameStates(newGameStates);
        setGamesInitialized(true);
    }, 500);
  }, [logHistory, roundScores, specialCardsAdded]);

  const handleHit = useCallback((gameId: number) => {
    if (hitsThisTurn >= MAX_HITS_PER_TURN) return;

    setGameStates(prev => {
      const newDeck = [...deck];
      if (newDeck.length === 0) return prev;
      const card = newDeck.pop()!;
      setDeck(newDeck);
      setDiscardPile(d => [...d, card]);
      
      let playerBustedOnHit = false;
      const newStates = prev.map(gs => {
        if (gs.id === gameId) {
          const newHand = [...gs.playerHand, card];
          const newScore = calculateScore(newHand);
          const hasSpecial = newHand.some(c => c.isSpecial);
          let status = gs.status;
          
          logHistory({ type: 'action', actor: 'Player', action: 'HITS', tableId: gameId, card, newScore });

          if (newScore > 21 && !hasSpecial) {
            status = GameStatus.PlayerBust;
            playerBustedOnHit = true;
            logHistory({ type: 'action', actor: 'Player', action: 'BUSTS', tableId: gameId, newScore });
          }
          
          return { ...gs, playerHand: newHand, playerScore: newScore, status, hasPlayerSpecialCard: hasSpecial, isPlayerOverbusted: newScore > 21 && hasSpecial };
        }
        return gs;
      });

      if (playerBustedOnHit) {
        const nextActiveGame = newStates.find(gs => gs.status === GameStatus.PlayerTurn);
        if (nextActiveGame) {
          setFocusedGameId(nextActiveGame.id);
        }
      }

      return newStates;
    });
    setHitsThisTurn(h => h + 1);
  }, [deck, hitsThisTurn, logHistory]);

  const handleStand = useCallback((gameId: number) => {
    logHistory({ type: 'action', actor: 'Player', action: 'STANDS', tableId: gameId });
    setGameStates(prev => {
      const newStates = prev.map(gs => gs.id === gameId ? { ...gs, status: GameStatus.Waiting } : gs)
      
      const nextActiveGame = newStates.find(gs => gs.status === GameStatus.PlayerTurn);
      if (nextActiveGame) {
        setFocusedGameId(nextActiveGame.id);
      }
      
      return newStates;
    });
  }, [logHistory]);

  const determineTableWinner = useCallback((gs: GameState): GameState => {
      if (isTerminalStatus(gs.status)) {
        return gs;
      }

      let status = gs.status;
      const finalPlayerScore = gs.isPlayerOverbusted ? gs.playerScore : (gs.playerScore > 21 ? 0 : gs.playerScore);
      const finalAiScore = gs.isAiOverbusted ? gs.aiScore : (gs.aiScore > 21 ? 0 : gs.aiScore);

      if (gs.aiScore > 21 && !gs.isAiOverbusted) {
          status = GameStatus.AIBust;
      } else if (finalPlayerScore > finalAiScore) {
          status = GameStatus.PlayerWins;
      } else if (finalAiScore > finalPlayerScore) {
          status = GameStatus.AIWins;
      } else {
          status = GameStatus.Push;
      }
      
      logHistory({ type: 'table_result', tableId: gs.id, result: status, playerScore: gs.playerScore, aiScore: gs.aiScore });
      return { ...gs, status };
  }, [logHistory]);

  const checkForRoundEnd = useCallback((statesToCheck: GameState[]) => {
    const allGamesDecided = statesToCheck.every(gs => isTerminalStatus(gs.status) || gs.status === GameStatus.Waiting);

    if (allGamesDecided) {
      const finalStates = statesToCheck.map(determineTableWinner);
      
      let playerWins = finalStates.filter(s => s.status === GameStatus.PlayerWins || s.status === GameStatus.Blackjack || s.status === GameStatus.AIBust).length;
      let aiWins = finalStates.filter(s => s.status === GameStatus.AIWins || s.status === GameStatus.PlayerBust).length;

      let winner: RoundWinner = 'Draw';
      if (playerWins >= 2) winner = 'Player';
      if (aiWins >= 2) winner = 'AI';
      
      logHistory({ type: 'round_end', winner });

      setRoundWinner(winner);
      
      if (winner === 'Player') {
        const newStreak = currentWinStreak + 1;
        setCurrentWinStreak(newStreak);
        setMaxWinStreak(mws => Math.max(mws, newStreak));
      } else {
        setCurrentWinStreak(0);
      }

      setRoundScores(prev => {
        if (winner === 'Player') return { ...prev, player: prev.player + 1 };
        if (winner === 'AI') return { ...prev, ai: prev.ai + 1 };
        return { ...prev, draws: prev.draws + 1 };
      });
      setGameStates(finalStates);
      setTurnPhase('ROUND_OVER');
    }
  }, [gamesInitialized, logHistory, determineTableWinner, currentWinStreak]);

  useEffect(() => {
    if (!gamesInitialized && gameStarted) {
      dealRound(createDeck());
    }
  }, [gamesInitialized, gameStarted, dealRound]);

  // This hook handles the transition from the player's turn to the AI's turn.
  useEffect(() => {
    if (turnPhase !== 'PLAYER' || !gamesInitialized) return;

    const allHandsStillActive = gameStates.some(gs => gs.status === GameStatus.PlayerTurn);
    const maxHitsReached = hitsThisTurn >= MAX_HITS_PER_TURN;

    if (!allHandsStillActive || maxHitsReached) {
      if (maxHitsReached && allHandsStillActive) {
        logHistory({ type: 'message', content: 'Max hits used. Standing on all remaining tables.' });
        setGameStates(currentStates => 
            currentStates.map(gs => 
                gs.status === GameStatus.PlayerTurn ? { ...gs, status: GameStatus.Waiting } : gs
            )
        );
        return; 
      }
      setTurnPhase('AI');
    }
  }, [gameStates, turnPhase, hitsThisTurn, gamesInitialized, logHistory]);

  useEffect(() => {
    if (turnPhase !== 'AI' || isAiTurnRunning.current) return;

    const runAiTurns = async () => {
        isAiTurnRunning.current = true;

        const deckCopy = [...deck];
        let statesCopy = [...gameStates];
        const cardsToDiscard: Card[] = [];

        // Show "Thinking..." on all relevant tables
        const thinkingStates = statesCopy.map(gs =>
            gs.status === GameStatus.Waiting ? { ...gs, isLoadingAI: true } : gs
        );
        setGameStates(thinkingStates);
        
        // Use a traditional for loop to handle async operations sequentially per table
        for (let i = 0; i < statesCopy.length; i++) {
            let gs = statesCopy[i];

            if (gs.status === GameStatus.Waiting) {
                let continueHitting = true;
                while (continueHitting) {
                    const finalPlayerScore = gs.isPlayerOverbusted ? gs.playerScore : (gs.playerScore > 21 ? 0 : gs.playerScore);
                    const decision = await getAIDecision(gs.aiHand, finalPlayerScore, deckCopy, specialCardsAdded);

                    if (decision === 'hit' && deckCopy.length > 0) {
                        const card = deckCopy.pop()!;
                        cardsToDiscard.push(card);

                        const newHand = [...gs.aiHand, card];
                        const newScore = calculateScore(newHand);
                        const hasSpecial = newHand.some(c => c.isSpecial);
                        const isBusted = newScore > 21 && !hasSpecial;
                        
                        logHistory({ type: 'action', actor: 'AI', action: 'HITS', tableId: gs.id, card, newScore });

                        if (isBusted) {
                            logHistory({ type: 'action', actor: 'AI', action: 'BUSTS', tableId: gs.id, newScore });
                            continueHitting = false;
                        }

                        // Update the gs object for the next loop iteration or for the final state
                        gs = {
                            ...gs,
                            aiHand: newHand,
                            aiScore: newScore,
                            hasAiSpecialCard: hasSpecial,
                            isAiOverbusted: newScore > 21 && hasSpecial,
                            status: isBusted ? GameStatus.AIBust : gs.status,
                        };
                    } else {
                        logHistory({ type: 'action', actor: 'AI', action: 'STANDS', tableId: gs.id });
                        continueHitting = false;
                    }
                }
                // Update the array with the final state for this hand
                statesCopy[i] = { ...gs, isLoadingAI: false };
            }
        }
        
        setDeck(deckCopy);
        setDiscardPile(d => [...d, ...cardsToDiscard]);
        
        // After all AI moves are calculated, check for the round end.
        // This function will set the final game states and phase.
        checkForRoundEnd(statesCopy);
        
        isAiTurnRunning.current = false;
    };

    const aiNeedsToPlay = gameStates.some(gs => gs.status === GameStatus.Waiting);
    if (aiNeedsToPlay) {
        runAiTurns();
    } else {
        checkForRoundEnd(gameStates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turnPhase, gamesInitialized]);


  useEffect(() => {
    if (turnPhase === 'PLAYER') {
      const updatedStates = gameStates.map(gs => {
        if (gs.status === GameStatus.PlayerTurn) {
          return { ...gs, stats: calculateStatsForHand(gs.playerHand, deck) };
        }
        return gs;
      });
      setGameStates(updatedStates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, turnPhase, gameStates.find(gs => gs.status === GameStatus.PlayerTurn)?.playerHand.length]);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handlePlayAgain = () => {
    setDeck(shuffleDeck(createDeck()));
    setDiscardPile([]);
    setGameStates([]);
    setGamesInitialized(false);
    setTurnPhase('PLAYER');
    setRoundWinner(null);
    setRoundScores({ player: 0, ai: 0, draws: 0 });
    setIsGameOver(false);
    setFocusedGameId(1);
    setTurnHistory([]);
    setSpecialCardsAdded(false);
    setHitsThisTurn(0);
    setCurrentWinStreak(0);
    setMaxWinStreak(0);
    setGameStarted(false);
    roundNumberRef.current = 1;
  };

  if (!gameStarted) {
    return <StartScreen onStartGame={handleStartGame} />;
  }

  if (isGameOver) {
    return <GameOver scores={roundScores} onPlayAgain={handlePlayAgain} maxWinStreak={maxWinStreak} />;
  }
  
  const focusedGameState = gameStates.find(gs => gs.id === focusedGameId);

  return (
    <>
      {showOverbustIntro && <OverbustIntro onClose={() => setShowOverbustIntro(false)} />}

      <main className="min-h-screen flex flex-col justify-between p-2 sm:p-4 text-white font-sans relative">
        <div className="flex-grow">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">Triple Threat <span className="text-cyan-400">21</span></h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsHistoryVisible(true)} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 transition-colors"><HistoryIcon/></button>
              <button onClick={() => setShowInfoPanel(true)} className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 transition-colors"><InfoIcon/></button>
            </div>
          </header>
          
          <Scoreboard scores={roundScores} />
          <TurnIndicator roundNumber={roundNumberRef.current} turnPhase={turnPhase} />

          <DesktopHandSummary gameStates={gameStates} focusedGameId={focusedGameId} onFocusChange={setFocusedGameId} />
          <GameSwitcher gameStates={gameStates} focusedGameId={focusedGameId} onFocusChange={setFocusedGameId} />

          {focusedGameState && (
            <div className="mt-4 animate-fade-in-scale">
              <Gameboard 
                  gameState={focusedGameState} 
                  onHit={handleHit} 
                  onStand={handleStand}
                  remainingHits={MAX_HITS_PER_TURN - hitsThisTurn}
                  turnPhase={turnPhase}
              />
            </div>
          )}
          
          {turnPhase === 'ROUND_OVER' && !isGameOver && (
              <div className="my-8 text-center animate-fade-in-down">
                  {roundWinner && <RoundResultBanner winner={roundWinner} />}
                  <button
                      onClick={() => dealRound(deck)}
                      className="mt-4 px-8 py-3 bg-gradient-to-br from-teal-500 to-cyan-600 font-bold text-lg rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out"
                  >
                      Next Round
                  </button>
              </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <DeckStatus deck={deck} discardPile={discardPile} />
        </div>
      </main>

      {showInfoPanel && <InfoTabs onClose={() => setShowInfoPanel(false)} />}
      <TurnHistorySidebar history={turnHistory} isOpen={isHistoryVisible} onClose={() => setIsHistoryVisible(false)} />
    </>
  );
};

export default App;
