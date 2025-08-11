

import React, { useState, useEffect } from 'react';
import { fetchLeaderboard, updateLeaderboard } from '../services/leaderboardService';
import type { LeaderboardEntry } from '../types';
import { Leaderboard } from './Leaderboard';

interface GameOverProps {
  scores: {
    player: number;
    ai: number;
    draws: number;
  };
  onPlayAgain: () => void;
  maxWinStreak: number;
}

const LEADERBOARD_SIZE = 10;

export const GameOver: React.FC<GameOverProps> = ({ scores, onPlayAgain, maxWinStreak }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isQualified, setIsQualified] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      const lbData = await fetchLeaderboard();
      const sortedLb = lbData.sort((a, b) => b.streak - a.streak);
      setLeaderboard(sortedLb);
      
      const lowestScoreOnBoard = sortedLb.length > 0 ? sortedLb[Math.min(sortedLb.length - 1, LEADERBOARD_SIZE - 1)].streak : 0;
      if (maxWinStreak > 0 && (sortedLb.length < LEADERBOARD_SIZE || maxWinStreak > lowestScoreOnBoard)) {
        setIsQualified(true);
      }
      setIsLoading(false);
    };

    loadLeaderboard();
  }, [maxWinStreak]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const newEntry: LeaderboardEntry = { name: playerName.trim(), streak: maxWinStreak };
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.streak - a.streak)
      .slice(0, LEADERBOARD_SIZE);

    await updateLeaderboard(newLeaderboard);
    setLeaderboard(newLeaderboard);
    setHasSubmitted(true);
    setIsSubmitting(false);
  };

  let winnerText = "It's a Tie Game!";
  let winnerGradient = "from-slate-500 to-slate-700";
  let winnerIcon = "🤝";
  
  if (scores.player > scores.ai) {
    winnerText = "You Win The Game!";
    winnerGradient = "from-amber-400 to-yellow-500";
    winnerIcon = "🎉";
  } else if (scores.ai > scores.player) {
    winnerText = "AI Wins The Game";
    winnerGradient = "from-red-600 to-rose-800";
    winnerIcon = "🦾";
  }

  const renderLeaderboardSection = () => {
      if (isLoading) {
          return <div className="text-slate-400 text-center py-4">Loading Leaderboard...</div>;
      }
      if (isQualified && !hasSubmitted) {
          return (
              <form onSubmit={handleSubmit} className="mt-6 animate-fade-in-down">
                  <h3 className="text-xl font-bold text-amber-400">High Score!</h3>
                  <p className="text-slate-300 mb-4">You got a win streak of <b className="text-white">{maxWinStreak}</b>! Enter your name for the leaderboard.</p>
                  <div className="flex gap-2">
                       <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Enter your name"
                          maxLength={15}
                          className="flex-grow bg-slate-900/80 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          required
                      />
                      <button
                          type="submit"
                          disabled={isSubmitting || !playerName.trim()}
                          className="px-6 py-2 bg-gradient-to-br from-cyan-500 to-teal-600 font-bold rounded-lg shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {isSubmitting ? 'Saving...' : 'Submit'}
                      </button>
                  </div>
              </form>
          );
      }
      return (
        <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
            <Leaderboard scores={leaderboard} highlightStreak={hasSubmitted ? maxWinStreak : undefined} />
        </div>
      )
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white text-center p-4 animate-fade-in-scale">
      <div className="bg-slate-800/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl shadow-black/50 border border-slate-700 w-full max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Game Over</h1>
        <div className={`my-6 inline-block px-6 py-3 rounded-xl bg-gradient-to-br ${winnerGradient}`}>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wider">
            <span className="mr-3">{winnerIcon}</span>
            {winnerText}
          </h2>
        </div>
        <div className="text-xl sm:text-2xl font-semibold mb-4">
          <p>Final Score: Player {scores.player} - AI {scores.ai}</p>
          <p className="text-base text-slate-400">({scores.draws} draws)</p>
        </div>
        
        {maxWinStreak > 0 && (
            <p className="text-lg text-amber-400 font-semibold mb-6">
                Your longest win streak was {maxWinStreak} round{maxWinStreak > 1 ? 's' : ''}!
            </p>
        )}

        {renderLeaderboardSection()}

        <button
          onClick={onPlayAgain}
          className="mt-8 w-full max-w-sm mx-auto px-10 py-4 bg-gradient-to-br from-teal-500 to-cyan-600 font-bold text-xl rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-in-out"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};
