import { Artifact, ItemRarity, EquipmentSlot } from '../types';

export const BASE_ARTIFACTS: Artifact[] = [
  // --- WEAPONS ---
  {
    id: 'art_sword_rusty',
    name: 'Rusty Iron Broadsword',
    rarity: 'common',
    slot: 'weapon',
    stats: { attackBonus: 5 },
    lore: 'A chipped blade retrieved from a fallen dungeon explorer.',
    icon: 'Sword',
    value: 15
  },
  {
    id: 'art_sword_sunfire',
    name: 'Sunfire Blade of Dawn',
    rarity: 'legendary',
    slot: 'weapon',
    stats: { attackBonus: 28, critBonus: 15, vampirism: 10 },
    lore: 'Forged in holy flames before the cataclysm. Smite evil with blinding light.',
    icon: 'Flame',
    effectDescription: '10% Life Steal & +15% Critical Strike Chance',
    value: 450
  },
  {
    id: 'art_staff_arcane',
    name: 'Staff of the Archmage',
    rarity: 'epic',
    slot: 'weapon',
    stats: { magicBonus: 22, mpBonus: 40, attackBonus: 8 },
    lore: 'Pulsing with raw ethereal magic extracted from the Void Leylines.',
    icon: 'Wand2',
    effectDescription: '+22 Magic Power & +40 Max MP',
    value: 320
  },
  {
    id: 'art_dagger_shadow',
    name: 'Shadowfury Venom Dagger',
    rarity: 'rare',
    slot: 'weapon',
    stats: { attackBonus: 14, speedBonus: 4, critBonus: 12 },
    lore: 'Dipped in the venom of subterranean cave spiders.',
    icon: 'Dagger',
    value: 180
  },
  {
    id: 'art_hammer_titan',
    name: 'Titanbreaker Warhammer',
    rarity: 'mythic',
    slot: 'weapon',
    stats: { attackBonus: 42, hpBonus: 50, defenseBonus: 10 },
    lore: 'A colossal weapon that shatters dungeon stone with every swing.',
    icon: 'Hammer',
    effectDescription: 'Enormous crushing power & +50 Max HP',
    value: 900
  },

  // --- SHIELDS ---
  {
    id: 'art_shield_wooden',
    name: 'Oak Buckler',
    rarity: 'common',
    slot: 'shield',
    stats: { defenseBonus: 3, hpBonus: 10 },
    lore: 'Simple banded oak capable of deflecting weak arrows.',
    icon: 'Shield',
    value: 12
  },
  {
    id: 'art_shield_dragon',
    name: 'Aegis of the Dragon Lord',
    rarity: 'mythic',
    slot: 'shield',
    stats: { defenseBonus: 25, hpBonus: 80, attackBonus: 10 },
    lore: 'Crafted from the scaled hide of the Ancient Red Dragon. Immune to lava heat.',
    icon: 'ShieldAlert',
    effectDescription: '+25 Armor & +80 Max HP',
    value: 850
  },

  // --- ARMOR ---
  {
    id: 'art_armor_leather',
    name: 'Hardened Leather Vest',
    rarity: 'common',
    slot: 'armor',
    stats: { defenseBonus: 4, speedBonus: 1 },
    lore: 'Flexible armor allowing comfortable dungeon navigation.',
    icon: 'Shirt',
    value: 20
  },
  {
    id: 'art_armor_cataclysm',
    name: 'Cataclysmic Cuirass',
    rarity: 'legendary',
    slot: 'armor',
    stats: { defenseBonus: 22, hpBonus: 60, mpBonus: 20 },
    lore: 'Infused with hardened obsidian plates that absorb dark magic.',
    icon: 'ShieldCheck',
    value: 500
  },

  // --- HELMS ---
  {
    id: 'art_helm_iron',
    name: 'Iron Guard Helmet',
    rarity: 'common',
    slot: 'helm',
    stats: { defenseBonus: 3 },
    lore: 'Standard issue helm protecting against falling cavern stalactites.',
    icon: 'HardHat',
    value: 15
  },
  {
    id: 'art_crown_dragon',
    name: 'Crown of the Undead King',
    rarity: 'legendary',
    slot: 'helm',
    stats: { defenseBonus: 12, magicBonus: 18, critBonus: 10 },
    lore: 'Adorned with glowing dark amethysts. Commands fear in dark crypts.',
    icon: 'Crown',
    effectDescription: '+18 Magic Power & +10% Crit Chance',
    value: 520
  },

  // --- RINGS ---
  {
    id: 'art_ring_vampire',
    name: 'Vampiric Ruby Ring',
    rarity: 'epic',
    slot: 'ring',
    stats: { vampirism: 12, attackBonus: 6 },
    lore: 'Whispers bloodthirsty thoughts into the wearer\'s ears during battle.',
    icon: 'CircleDot',
    effectDescription: '12% Life Steal on physical and skill attacks',
    value: 380
  },
  {
    id: 'art_ring_mercurial',
    name: 'Ring of Mercurial Speed',
    rarity: 'rare',
    slot: 'ring',
    stats: { speedBonus: 6, critBonus: 8 },
    lore: 'Lightweight silver ring accelerating your reflexes.',
    icon: 'Zap',
    value: 210
  },

  // --- AMULETS ---
  {
    id: 'art_amulet_life',
    name: 'Heart of Yggdrasil',
    rarity: 'epic',
    slot: 'amulet',
    stats: { hpBonus: 75, mpBonus: 35 },
    lore: 'A verdant stone radiating the revitalizing essence of ancient forests.',
    icon: 'Heart',
    effectDescription: '+75 Max HP & +35 Max MP',
    value: 400
  },
  {
    id: 'art_orb_void',
    name: 'Orb of the Void Stalker',
    rarity: 'mythic',
    slot: 'relic',
    stats: { attackBonus: 15, magicBonus: 25, expBoost: 25, speedBonus: 4 },
    lore: 'An ancient relic holding concentrated darkness. Increases EXP gained by 25%.',
    icon: 'Sparkles',
    effectDescription: '+25% EXP Bonus & +25 Magic Power',
    value: 950
  }
];

export const RARITY_COLORS: Record<ItemRarity, { border: string; bg: string; text: string; glow: string }> = {
  common: {
    border: 'border-slate-500',
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    glow: 'shadow-slate-500/20'
  },
  uncommon: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-400',
    glow: 'shadow-emerald-500/30'
  },
  rare: {
    border: 'border-blue-500',
    bg: 'bg-blue-950/80',
    text: 'text-blue-400',
    glow: 'shadow-blue-500/40'
  },
  epic: {
    border: 'border-purple-500',
    bg: 'bg-purple-950/80',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/50'
  },
  legendary: {
    border: 'border-amber-500',
    bg: 'bg-amber-950/80',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/60'
  },
  mythic: {
    border: 'border-rose-500',
    bg: 'bg-rose-950/80',
    text: 'text-rose-300',
    glow: 'shadow-rose-500/70'
  }
};

export function generateRandomArtifact(depth: number): Artifact {
  // Determine rarity based on dungeon floor depth
  const rand = Math.random() * 100 + depth * 2.5;
  let rarity: ItemRarity = 'common';
  if (rand > 115) rarity = 'mythic';
  else if (rand > 95) rarity = 'legendary';
  else if (rand > 75) rarity = 'epic';
  else if (rand > 50) rarity = 'rare';
  else if (rand > 25) rarity = 'uncommon';

  // Filter or scale matching rarity base artifacts or create procedurally named item
  const matching = BASE_ARTIFACTS.filter(a => a.rarity === rarity);
  let baseItem = matching.length > 0 
    ? matching[Math.floor(Math.random() * matching.length)]
    : BASE_ARTIFACTS[Math.floor(Math.random() * BASE_ARTIFACTS.length)];

  // Create unique clone with depth stat scaling
  const scale = 1 + depth * 0.15;
  const scaledStats = { ...baseItem.stats };
  if (scaledStats.attackBonus) scaledStats.attackBonus = Math.round(scaledStats.attackBonus * scale);
  if (scaledStats.defenseBonus) scaledStats.defenseBonus = Math.round(scaledStats.defenseBonus * scale);
  if (scaledStats.hpBonus) scaledStats.hpBonus = Math.round(scaledStats.hpBonus * scale);
  if (scaledStats.mpBonus) scaledStats.mpBonus = Math.round(scaledStats.mpBonus * scale);

  return {
    ...baseItem,
    id: `${baseItem.id}_d${depth}_${Math.random().toString(36).substring(2, 6)}`,
    stats: scaledStats,
    value: Math.round(baseItem.value * scale)
  };
}
