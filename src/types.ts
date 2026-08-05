export type TileType = 
  | 'wall' 
  | 'floor' 
  | 'door_closed' 
  | 'door_open' 
  | 'stairs_down' 
  | 'stairs_up' 
  | 'chest' 
  | 'chest_opened'
  | 'shrine' 
  | 'trap' 
  | 'merchant'
  | 'boss_portal';

export type BiomeType = 'Catacombs' | 'SunkenRuins' | 'InfernalDepths' | 'VoidSanctum';

export type CharacterClassId = 'warrior' | 'mage' | 'rogue' | 'paladin';

export interface CharacterClass {
  id: CharacterClassId;
  name: string;
  description: string;
  baseHp: number;
  baseMp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  baseCrit: number;
  icon: string;
  primaryColor: string;
  startingSkill: string;
}

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

export type EquipmentSlot = 'weapon' | 'shield' | 'armor' | 'helm' | 'ring' | 'amulet' | 'relic';

export interface ItemStats {
  hpBonus?: number;
  mpBonus?: number;
  attackBonus?: number;
  defenseBonus?: number;
  speedBonus?: number;
  critBonus?: number;
  magicBonus?: number;
  vampirism?: number; // % life steal
  expBoost?: number;  // % bonus EXP
}

export interface Artifact {
  id: string;
  name: string;
  rarity: ItemRarity;
  slot: EquipmentSlot;
  stats: ItemStats;
  lore: string;
  icon: string;
  effectDescription?: string;
  isSetItem?: boolean;
  setBonusName?: string;
  value: number;
}

export interface Equipment {
  weapon: Artifact | null;
  shield: Artifact | null;
  armor: Artifact | null;
  helm: Artifact | null;
  ring: Artifact | null;
  amulet: Artifact | null;
  relic: Artifact | null;
}

export interface Skill {
  id: string;
  name: string;
  mpCost: number;
  cooldown: number;
  currentCooldown: number;
  range: number;
  targetType: 'self' | 'single_enemy' | 'area_enemy' | 'line';
  damageMultiplier: number;
  healAmount?: number;
  effectType?: 'stun' | 'poison' | 'burn' | 'shield' | 'dash' | 'teleport';
  description: string;
  icon: string;
}

export interface Position {
  x: number;
  y: number;
}

export type MonsterAIType = 'aggressive' | 'ranged' | 'ambush' | 'boss' | 'healer';

export interface Monster {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  goldReward: number;
  color: string;
  symbol: string;
  aiType: MonsterAIType;
  isBoss?: boolean;
  statusEffects?: {
    poison?: number;
    burn?: number;
    stun?: number;
  };
}

export interface Shrine {
  x: number;
  y: number;
  name: string;
  buffType: 'heal' | 'attack' | 'exp' | 'curse_risk';
  used: boolean;
  description: string;
}

export interface ChestItem {
  x: number;
  y: number;
  artifact: Artifact;
  opened: boolean;
}

export interface MerchantItem {
  artifact: Artifact;
  price: number;
  purchased: boolean;
}

export interface Merchant {
  x: number;
  y: number;
  items: MerchantItem[];
}

export interface DungeonFloor {
  depth: number;
  biome: BiomeType;
  width: number;
  height: number;
  tiles: TileType[][];
  visited: boolean[][];
  visible: boolean[][];
  monsters: Monster[];
  chests: ChestItem[];
  shrines: Shrine[];
  merchants: Merchant[];
  stairsDown: Position;
  stairsUp: Position;
  bossPortal?: Position;
}

export interface HeroState {
  classId: CharacterClassId;
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  critChance: number;
  gold: number;
  soulShards: number;
  x: number;
  y: number;
  equipment: Equipment;
  inventory: Artifact[];
  inventorySize: number;
  skills: Skill[];
  artifactCodexUnlocked: string[]; // artifact IDs unlocked permanently
  statusEffects: {
    shield?: number;
    poison?: number;
  };
}

export interface GameLog {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'loot' | 'danger' | 'level' | 'shrine';
  timestamp: string;
}

export interface MetaUpgrades {
  healthLevel: number;
  manaLevel: number;
  attackLevel: number;
  startingGoldLevel: number;
  luckLevel: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  heroClass: string;
  depthReached: number;
  score: number;
  artifactsCount: number;
  killedBy: string;
  createdAt: string;
}

export interface GameState {
  currentDepth: number;
  hero: HeroState;
  floor: DungeonFloor;
  logs: GameLog[];
  turnCount: number;
  isGameOver: boolean;
  gameWon: boolean;
  stats: {
    monstersKilled: number;
    artifactsFound: number;
    goldCollected: number;
    damageDealt: number;
    damageTaken: number;
    floorsCleared: number;
  };
}
