import React from 'react';
import { HeroState, Artifact, EquipmentSlot } from '../types';
import { RARITY_COLORS } from '../data/artifacts';
import { 
  X, Shield, Sword, Shirt, HardHat, CircleDot, Heart, Sparkles, Trash2, Coins
} from 'lucide-react';

interface InventoryModalProps {
  hero: HeroState;
  onClose: () => void;
  onEquipItem: (artifact: Artifact) => void;
  onUnequipSlot: (slot: EquipmentSlot) => void;
  onDropItem: (artifactId: string) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  hero,
  onClose,
  onEquipItem,
  onUnequipSlot,
  onDropItem
}) => {
  const [selectedArtifact, setSelectedArtifact] = React.useState<Artifact | null>(null);

  const slots: { slot: EquipmentSlot; label: string; icon: React.ReactNode }[] = [
    { slot: 'weapon', label: 'Weapon', icon: <Sword className="w-5 h-5 text-amber-400" /> },
    { slot: 'shield', label: 'Offhand Shield', icon: <Shield className="w-5 h-5 text-blue-400" /> },
    { slot: 'armor', label: 'Chest Armor', icon: <Shirt className="w-5 h-5 text-emerald-400" /> },
    { slot: 'helm', label: 'Headgear', icon: <HardHat className="w-5 h-5 text-purple-400" /> },
    { slot: 'ring', label: 'Ring', icon: <CircleDot className="w-5 h-5 text-cyan-400" /> },
    { slot: 'amulet', label: 'Amulet', icon: <Heart className="w-5 h-5 text-rose-400" /> },
    { slot: 'relic', label: 'Ancient Relic', icon: <Sparkles className="w-5 h-5 text-yellow-400" /> },
  ];

  const renderStatsList = (stats: Artifact['stats']) => {
    return (
      <div className="flex flex-wrap gap-2 text-xs my-2">
        {stats.attackBonus && <span className="bg-red-950/80 text-red-300 border border-red-800 px-2 py-0.5 rounded-md">+{stats.attackBonus} Attack</span>}
        {stats.defenseBonus && <span className="bg-blue-950/80 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-md">+{stats.defenseBonus} Armor</span>}
        {stats.hpBonus && <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md">+{stats.hpBonus} Max HP</span>}
        {stats.mpBonus && <span className="bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-md">+{stats.mpBonus} Max MP</span>}
        {stats.critBonus && <span className="bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-md">+{stats.critBonus}% Crit</span>}
        {stats.magicBonus && <span className="bg-purple-950/80 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-md">+{stats.magicBonus} Magic</span>}
        {stats.vampirism && <span className="bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-md">+{stats.vampirism}% Life Steal</span>}
        {stats.expBoost && <span className="bg-yellow-950/80 text-yellow-300 border border-yellow-800 px-2 py-0.5 rounded-md">+{stats.expBoost}% EXP</span>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <BackpackIcon className="w-5 h-5 text-amber-500" />
            Equipment & Inventory Management
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Equipment Slots */}
          <div className="md:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Equipped Gear
            </h3>

            <div className="space-y-2">
              {slots.map(({ slot, label, icon }) => {
                const item = hero.equipment[slot];
                const rarityStyle = item ? RARITY_COLORS[item.rarity] : null;

                return (
                  <div 
                    key={slot}
                    onClick={() => item && setSelectedArtifact(item)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      item 
                        ? `${rarityStyle?.bg} ${rarityStyle?.border}` 
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                        {icon}
                      </div>
                      <div className="truncate">
                        <div className="text-[10px] text-slate-500 uppercase">{label}</div>
                        <div className={`text-xs font-bold truncate ${item ? rarityStyle?.text : 'text-slate-600'}`}>
                          {item ? item.name : 'Empty Slot'}
                        </div>
                      </div>
                    </div>

                    {item && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnequipSlot(slot);
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md border border-slate-700 shrink-0"
                      >
                        Unequip
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Inventory Backpack & Item Detail Inspector */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Backpack Grid */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex-1">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Backpack ({hero.inventory.length} / {hero.inventorySize})
                </h3>
              </div>

              {hero.inventory.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs italic">
                  Your backpack is empty. Defeat monsters and open chests to collect rare artifacts!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {hero.inventory.map((art) => {
                    const rarityStyle = RARITY_COLORS[art.rarity];
                    return (
                      <div
                        key={art.id}
                        onClick={() => setSelectedArtifact(art)}
                        className={`p-2 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          rarityStyle.bg
                        } ${
                          selectedArtifact?.id === art.id
                            ? 'ring-2 ring-amber-400 border-amber-400'
                            : rarityStyle.border
                        }`}
                      >
                        <div className={`text-xs font-bold truncate ${rarityStyle.text}`}>
                          {art.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                          <span className="capitalize">{art.slot}</span>
                          <span className="text-amber-400 font-bold">{art.value}g</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Artifact Inspector */}
            {selectedArtifact && (
              <div className={`p-4 rounded-xl border bg-slate-950 ${RARITY_COLORS[selectedArtifact.rarity].border}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs uppercase font-extrabold px-2 py-0.5 rounded-md border ${RARITY_COLORS[selectedArtifact.rarity].bg} ${RARITY_COLORS[selectedArtifact.rarity].text}`}>
                    {selectedArtifact.rarity} {selectedArtifact.slot}
                  </span>
                  <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> Value: {selectedArtifact.value} gold
                  </span>
                </div>

                <h4 className={`text-sm font-bold mt-2 ${RARITY_COLORS[selectedArtifact.rarity].text}`}>
                  {selectedArtifact.name}
                </h4>

                <p className="text-xs text-slate-400 italic my-2">
                  "{selectedArtifact.lore}"
                </p>

                {renderStatsList(selectedArtifact.stats)}

                {selectedArtifact.effectDescription && (
                  <div className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50 my-2">
                    ⚡ Special Effect: {selectedArtifact.effectDescription}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onDropItem(selectedArtifact.id);
                      setSelectedArtifact(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Drop
                  </button>

                  <button
                    onClick={() => {
                      onEquipItem(selectedArtifact);
                      setSelectedArtifact(null);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition"
                  >
                    Equip Item
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BackpackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
  </svg>
);
