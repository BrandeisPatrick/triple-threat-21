
import React from 'react';

interface ScoreboardProps {
  scores: {
    player: number;
    ai: number;
    draws: number;
  };
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ scores }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl shadow-lg mb-8">
      <div className="grid grid-cols-3 text-center divide-x divide-slate-600/50">
        <div>
          <p className="text-sm text-cyan-400 uppercase tracking-wider">Player</p>
          <p className="text-3xl font-bold text-white">{scores.player}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400 uppercase tracking-wider">Draws</p>
          <p className="text-3xl font-bold text-white">{scores.draws}</p>
        </div>
        <div>
          <p className="text-sm text-red-400 uppercase tracking-wider">AI</p>
          <p className="text-3xl font-bold text-white">{scores.ai}</p>
        </div>
      </div>
    </div>
  );
};
