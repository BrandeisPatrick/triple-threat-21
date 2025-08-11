


import React from 'react';
import type { GameStatsData } from '../types';

interface GameStatsProps {
  stats: GameStatsData;
}

const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="py-1">
        <div className="flex justify-between items-center text-sm mb-0.5">
            <span className="text-green-300/80">{label}</span>
            <span className="font-bold text-white">{value.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-green-900/50 rounded-full h-1.5">
            <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

const StatItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm py-1.5 border-b border-green-800/40 last:border-b-0">
    <span className="text-green-300/80">{label}</span>
    <span className="font-bold text-white">{value}</span>
  </div>
);


export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  return (
    <div className="bg-green-950/60 rounded-lg p-3 text-xs mb-2">
        <h4 className="font-bold text-center text-green-200/90 mb-2 uppercase tracking-widest text-[10px]">Table Statistics</h4>
        <div className="space-y-1">
            <ProgressBar label="Chance to Bust" value={stats.bust} />
            <ProgressBar label="Chance to Improve" value={stats.improve} />
            <ProgressBar label="Chance to get 21" value={stats.to21} />
            <StatItem label="Avg. Card Value in Deck" value={stats.avgValue.toFixed(2)} />
            <div className="text-center pt-2 grid grid-cols-3 gap-2">
                <div>
                    <div className="font-bold text-lg text-white">{stats.distribution.aces}</div>
                    <div className="text-green-300/80 text-[10px] uppercase">Aces</div>
                </div>
                <div>
                    <div className="font-bold text-lg text-white">{stats.distribution.faces}</div>
                    <div className="text-green-300/80 text-[10px] uppercase">10-K</div>
                </div>
                <div>
                    <div className="font-bold text-lg text-white">{stats.distribution.numbers}</div>
                    <div className="text-green-300/80 text-[10px] uppercase">2-9</div>
                </div>
            </div>
        </div>
    </div>
  );
};