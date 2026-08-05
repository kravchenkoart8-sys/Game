import React, { useEffect, useState } from 'react';
import { GameState } from '../types';
import { CHARACTER_CLASSES } from '../data/classes';
import { Skull, Trophy, Sparkles, RefreshCw, Flame, Backpack, Coins, Gem } from 'lucide-react';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameState,
  onRestart,
  onOpenLeaderboard
}) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const hero = gameState.hero;
  const stats = gameState.stats;
  const heroClass = CHARACTER_CLASSES[hero.classId];

  // Calculate final score
  const score = 
    gameState.currentDepth * 1000 +
    stats.monstersKilled * 150 +
    stats.artifactsFound * 300 +
    stats.goldCollected * 2 +
    hero.level * 500;

  // Calculate Soul Shards earned
  const soulShardsEarned = Math.floor(score / 500) + stats.artifactsFound * 2;

  useEffect(() => {
    if (!submitted) {
      // Post score to Bun backend server
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: hero.name,
          heroClass: heroClass.name,
          depthReached: gameState.currentDepth,
          score,
          artifactsCount: stats.artifactsFound,
          killedBy: gameState.gameWon ? 'VICTORIOUS HERO' : 'Dungeon Evils',
        }),
      })
        .then((res) => res.json())
        .then(() => setSubmitted(true))
        .catch((err) => console.error('Failed submitting score to Bun backend:', err));
    }
  }, [submitted, hero, heroClass, gameState, score, stats]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/60 rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col items-center text-center gap-5">
        {/* Banner */}
        <div className="flex flex-col items-center">
          {gameState.gameWon ? (
            <div className="p-4 rounded-full bg-amber-950 border border-amber-500 text-amber-400 mb-2">
              <Trophy className="w-10 h-10" />
            </div>
          ) : (
            <div className="p-4 rounded-full bg-red-950 border border-red-800 text-red-500 mb-2">
              <Skull className="w-10 h-10" />
            </div>
          )}

          <h2 className={`text-2xl font-extrabold ${gameState.gameWon ? 'text-amber-300' : 'text-red-400'}`}>
            {gameState.gameWon ? 'VICTORY OVER THE VOID!' : 'HERO HAS FALLEN'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {hero.name} the {heroClass.name} perishes at Dungeon Floor {gameState.currentDepth}.
          </p>
        </div>

        {/* Score & Shards Earned */}
        <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Final Run Score</div>
            <div className="text-xl font-black text-amber-400 font-mono">{score.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Soul Shards Earned</div>
            <div className="text-xl font-black text-cyan-400 font-mono flex items-center justify-center gap-1">
              <Gem className="w-4 h-4" /> +{soulShardsEarned}
            </div>
          </div>
        </div>

        {/* Detailed Statistics Grid */}
        <div className="w-full space-y-2 text-xs font-mono text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-500">Deepest Floor Reached:</span>
            <span className="font-bold text-amber-400">Floor {gameState.currentDepth}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-500">Monsters Defeated:</span>
            <span className="font-bold text-slate-200">{stats.monstersKilled} monsters</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-500">Artifacts Discovered:</span>
            <span className="font-bold text-purple-400">{stats.artifactsFound} relics</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Gold Looted:</span>
            <span className="font-bold text-yellow-400">{stats.goldCollected} gold</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={onOpenLeaderboard}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Trophy className="w-4 h-4" /> View Leaderboard
          </button>

          <button
            onClick={onRestart}
            className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/50"
          >
            <RefreshCw className="w-4 h-4" /> Start New Run
          </button>
        </div>
      </div>
    </div>
  );
};
