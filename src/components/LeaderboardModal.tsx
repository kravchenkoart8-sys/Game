import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../types';
import { X, Trophy, Flame, Backpack, Skull, Server, ShieldCheck } from 'lucide-react';

interface LeaderboardModalProps {
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bunRuntime, setBunRuntime] = useState<string>('Bun Runtime');

  useEffect(() => {
    // Check Bun backend health and fetch leaderboard
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.runtime) setBunRuntime(data.runtime);
      })
      .catch((err) => console.error('Error fetching Bun health:', err));

    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
      })
      .catch((err) => console.error('Error fetching leaderboard from Bun server:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/60 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-amber-300">
                Dungeon Champions Leaderboard
              </h2>
              <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
                <Server className="w-3 h-3 text-cyan-400" /> Backend persistence served via {bunRuntime}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm animate-pulse">
              Contacting Bun backend server...
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              No champions recorded yet. Be the first adventurer to brave the crypts!
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => {
                const isTop3 = index < 3;
                const medalColor = index === 0 ? 'text-amber-400 border-amber-500 bg-amber-950/40' : index === 1 ? 'text-slate-300 border-slate-400 bg-slate-900' : index === 2 ? 'text-amber-600 border-amber-700 bg-amber-950/20' : 'text-slate-500 border-slate-800 bg-slate-950/60';

                return (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition ${medalColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 font-black text-xs flex items-center justify-center shrink-0 border border-slate-800">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          {entry.playerName}
                          <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
                            {entry.heroClass}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-500" /> Floor {entry.depthReached}
                          </span>
                          <span className="flex items-center gap-1">
                            <Backpack className="w-3 h-3 text-purple-400" /> {entry.artifactsCount} Artifacts
                          </span>
                          <span className="flex items-center gap-1 text-rose-400">
                            <Skull className="w-3 h-3" /> {entry.killedBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-extrabold text-amber-400 font-mono">
                        {entry.score.toLocaleString()} pts
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
