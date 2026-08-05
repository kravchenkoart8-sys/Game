import { Monster, BiomeType } from '../types';

export interface MonsterTemplate {
  name: string;
  symbol: string;
  color: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  expReward: number;
  goldReward: number;
  aiType: 'aggressive' | 'ranged' | 'ambush' | 'boss' | 'healer';
  biome: BiomeType;
}

export const MONSTER_TEMPLATES: MonsterTemplate[] = [
  // --- CATACOMBS (Floors 1-3) ---
  {
    name: 'Goblin Scout',
    symbol: 'g',
    color: '#84cc16',
    baseHp: 22,
    baseAttack: 6,
    baseDefense: 1,
    expReward: 15,
    goldReward: 8,
    aiType: 'aggressive',
    biome: 'Catacombs'
  },
  {
    name: 'Skeletal Warrior',
    symbol: 's',
    color: '#e2e8f0',
    baseHp: 32,
    baseAttack: 9,
    baseDefense: 3,
    expReward: 25,
    goldReward: 12,
    aiType: 'aggressive',
    biome: 'Catacombs'
  },
  {
    name: 'Cave Bat',
    symbol: 'b',
    color: '#a855f7',
    baseHp: 16,
    baseAttack: 7,
    baseDefense: 0,
    expReward: 12,
    goldReward: 5,
    aiType: 'ambush',
    biome: 'Catacombs'
  },

  // --- SUNKEN RUINS (Floors 4-6) ---
  {
    name: 'Acidic Slime',
    symbol: 'o',
    color: '#22c55e',
    baseHp: 48,
    baseAttack: 12,
    baseDefense: 4,
    expReward: 40,
    goldReward: 18,
    aiType: 'aggressive',
    biome: 'SunkenRuins'
  },
  {
    name: 'Deep Sea Naga',
    symbol: 'N',
    color: '#06b6d4',
    baseHp: 55,
    baseAttack: 15,
    baseDefense: 5,
    expReward: 55,
    goldReward: 25,
    aiType: 'ranged',
    biome: 'SunkenRuins'
  },
  {
    name: 'Coral Abomination',
    symbol: 'C',
    color: '#ec4899',
    baseHp: 75,
    baseAttack: 18,
    baseDefense: 8,
    expReward: 70,
    goldReward: 32,
    aiType: 'aggressive',
    biome: 'SunkenRuins'
  },

  // --- INFERNAL DEPTHS (Floors 7-9) ---
  {
    name: 'Hellhound',
    symbol: 'd',
    color: '#f97316',
    baseHp: 85,
    baseAttack: 22,
    baseDefense: 6,
    expReward: 90,
    goldReward: 42,
    aiType: 'aggressive',
    biome: 'InfernalDepths'
  },
  {
    name: 'Magma Elemental',
    symbol: 'E',
    color: '#ef4444',
    baseHp: 110,
    baseAttack: 26,
    baseDefense: 12,
    expReward: 120,
    goldReward: 55,
    aiType: 'aggressive',
    biome: 'InfernalDepths'
  },
  {
    name: 'Demon Warlock',
    symbol: 'W',
    color: '#d946ef',
    baseHp: 90,
    baseAttack: 28,
    baseDefense: 5,
    expReward: 130,
    goldReward: 65,
    aiType: 'ranged',
    biome: 'InfernalDepths'
  },

  // --- VOID SANCTUM (Floors 10+) ---
  {
    name: 'Void Stalker',
    symbol: 'V',
    color: '#a855f7',
    baseHp: 140,
    baseAttack: 32,
    baseDefense: 10,
    expReward: 180,
    goldReward: 90,
    aiType: 'ambush',
    biome: 'VoidSanctum'
  },
  {
    name: 'Shadow Lich',
    symbol: 'L',
    color: '#6366f1',
    baseHp: 160,
    baseAttack: 38,
    baseDefense: 12,
    expReward: 220,
    goldReward: 120,
    aiType: 'healer',
    biome: 'VoidSanctum'
  }
];

export const BOSS_TEMPLATES: Record<number, MonsterTemplate> = {
  3: {
    name: 'Garthor the Goblin King',
    symbol: 'K',
    color: '#84cc16',
    baseHp: 180,
    baseAttack: 20,
    baseDefense: 8,
    expReward: 300,
    goldReward: 150,
    aiType: 'boss',
    biome: 'Catacombs'
  },
  6: {
    name: 'Kraken Sentinel',
    symbol: 'S',
    color: '#06b6d4',
    baseHp: 380,
    baseAttack: 35,
    baseDefense: 15,
    expReward: 600,
    goldReward: 300,
    aiType: 'boss',
    biome: 'SunkenRuins'
  },
  9: {
    name: 'Archdemon Ignis',
    symbol: 'A',
    color: '#ef4444',
    baseHp: 650,
    baseAttack: 52,
    baseDefense: 22,
    expReward: 1200,
    goldReward: 600,
    aiType: 'boss',
    biome: 'InfernalDepths'
  },
  12: {
    name: 'Malakor the Void Archlich',
    symbol: 'M',
    color: '#d946ef',
    baseHp: 1200,
    baseAttack: 70,
    baseDefense: 30,
    expReward: 2500,
    goldReward: 1500,
    aiType: 'boss',
    biome: 'VoidSanctum'
  }
};

export function createMonster(
  template: MonsterTemplate,
  x: number,
  y: number,
  depth: number,
  isBoss: boolean = false
): Monster {
  const scale = 1 + (depth - 1) * 0.22;
  const hp = Math.round(template.baseHp * scale);
  
  return {
    id: `m_${depth}_${Math.random().toString(36).substring(2, 7)}`,
    name: template.name,
    x,
    y,
    hp,
    maxHp: hp,
    attack: Math.round(template.baseAttack * scale),
    defense: Math.round(template.baseDefense * scale),
    expReward: Math.round(template.expReward * scale),
    goldReward: Math.round(template.goldReward * scale),
    color: template.color,
    symbol: template.symbol,
    aiType: template.aiType,
    isBoss,
    statusEffects: {}
  };
}
