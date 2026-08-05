import React, { useEffect, useState } from 'react';
import { BASE_ARTIFACTS, RARITY_COLORS } from '../data/artifacts';
import { Artifact } from '../types';
import { X, BookOpen, Lock, Sparkles, Trophy } from 'lucide-react';

interface ArtifactCodexModalProps {
  unlockedArtifactIds: string[];
  onClose: () => void;
}

export const ArtifactCodexModal: React.FC<ArtifactCodexModalProps> = ({
  unlockedArtifactIds,
  onClose
}) => {
  const [globalUnlockedCount, setGlobalUnlockedCount] = useState<number>(0);

  useEffect(() => {
    // Fetch global codex status from Bun backend API
    fetch('/api/artifacts/codex')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.unlockedCount === 'number') {
          setGlobalUnlockedCount(data.unlockedCount);
        }
      })
      .catch((err) => console.error('Error fetching codex from Bun backend:', err));
  }, []);

  const totalArtifacts = BASE_ARTIFACTS.length;
  const personalUnlockedCount = unlockedArtifactIds.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-900/60 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-purple-300">
              Ancient Artifact Codex
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-purple-950/80 border border-purple-800 px-3 py-1 rounded-full text-purple-200">
              Personal Codex: <span className="font-bold text-amber-400">{personalUnlockedCount}/{totalArtifacts}</span>
            </div>
            <div className="bg-cyan-950/80 border border-cyan-800 px-3 py-1 rounded-full text-cyan-200 hidden sm:block">
              Global Discoveries: <span className="font-bold text-cyan-400">{globalUnlockedCount}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Codex Artifacts Catalog */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {BASE_ARTIFACTS.map((artifact) => {
            const isUnlocked = unlockedArtifactIds.some((id) => id.includes(artifact.id) || artifact.id.includes(id));
            const rarityStyle = RARITY_COLORS[artifact.rarity];

            return (
              <div
                key={artifact.id}
                className={`p-3.5 rounded-xl border relative transition ${
                  isUnlocked
                    ? `${rarityStyle.bg} ${rarityStyle.border} shadow-lg`
                    : 'bg-slate-950/50 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg border ${isUnlocked ? 'bg-slate-900 border-slate-700' : 'bg-slate-900/50 border-slate-800'}`}>
                      {isUnlocked ? (
                        <Sparkles className="w-5 h-5 text-amber-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isUnlocked ? rarityStyle.text : 'text-slate-500'}`}>
                        {isUnlocked ? artifact.name : '??? Undiscovered Artifact'}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">
                        {artifact.rarity} {artifact.slot}
                      </div>
                    </div>
                  </div>

                  {isUnlocked && (
                    <span className="text-[10px] bg-amber-950 border border-amber-800 text-amber-300 font-bold px-2 py-0.5 rounded">
                      DISCOVERED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 italic my-2">
                  {isUnlocked ? `"${artifact.lore}"` : 'Explore deeper dungeon floors to unearth this mysterious relic.'}
                </p>

                {isUnlocked && artifact.effectDescription && (
                  <div className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-800/50 mt-2">
                    ✨ Passive Blessing: {artifact.effectDescription}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
