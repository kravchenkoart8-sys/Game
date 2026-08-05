import React, { useState, useEffect, useCallback } from 'react';
import { 
  GameState, HeroState, CharacterClassId, Skill, Artifact, 
  EquipmentSlot, DungeonFloor, GameLog, MetaUpgrades, Position, Monster 
} from './types';
import { CHARACTER_CLASSES } from './data/classes';
import { ALL_SKILLS } from './data/skills';
import { BASE_ARTIFACTS, generateRandomArtifact } from './data/artifacts';
import { generateFloor, updateFOV } from './utils/dungeonGen';
import { soundFX } from './utils/audio';

import { HUD } from './components/HUD';
import { DungeonCanvas } from './components/DungeonCanvas';
import { CombatLog } from './components/CombatLog';
import { InventoryModal } from './components/InventoryModal';
import { ArtifactCodexModal } from './components/ArtifactCodexModal';
import { MetaUpgradesModal } from './components/MetaUpgradesModal';
import { MerchantModal } from './components/MerchantModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ClassSelectModal } from './components/ClassSelectModal';
import { GameOverModal } from './components/GameOverModal';

import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pause, 
  Sparkles, Backpack, BookOpen, Trophy, Shield, Flame, Heart, Zap
} from 'lucide-react';

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export default function App() {
  // --- LOCAL PERSISTENCE ---
  const [soulShards, setSoulShards] = useState<number>(() => {
    return Number(localStorage.getItem('dungeon_soul_shards') || 0);
  });

  const [metaUpgrades, setMetaUpgrades] = useState<MetaUpgrades>(() => {
    const saved = localStorage.getItem('dungeon_meta_upgrades');
    return saved ? JSON.parse(saved) : {
      healthLevel: 0,
      manaLevel: 0,
      attackLevel: 0,
      startingGoldLevel: 0,
      luckLevel: 0
    };
  });

  const [unlockedCodexIds, setUnlockedCodexIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('dungeon_codex_unlocked');
    return saved ? JSON.parse(saved) : ['art_sword_rusty', 'art_shield_wooden'];
  });

  // Save Meta Progress
  useEffect(() => {
    localStorage.setItem('dungeon_soul_shards', soulShards.toString());
    localStorage.setItem('dungeon_meta_upgrades', JSON.stringify(metaUpgrades));
    localStorage.setItem('dungeon_codex_unlocked', JSON.stringify(unlockedCodexIds));
  }, [soulShards, metaUpgrades, unlockedCodexIds]);

  // --- GAME STATE ---
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Modals
  const [activeModal, setActiveModal] = useState<
    'inventory' | 'codex' | 'meta' | 'merchant' | 'leaderboard' | null
  >(null);

  // Floating text decay effect
  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const interval = setInterval(() => {
      setFloatingTexts((prev) =>
        prev
          .map((ft) => ({ ...ft, life: ft.life - 0.2 }))
          .filter((ft) => ft.life > 0)
      );
    }, 100);
    return () => clearInterval(interval);
  }, [floatingTexts]);

  const addLog = useCallback((message: string, type: GameLog['type'] = 'info') => {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: GameLog = {
      id: `log_${Date.now()}_${Math.random()}`,
      message,
      type,
      timestamp: timeStr,
    };
    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        logs: [...prev.logs.slice(-60), newLog],
      };
    });
  }, []);

  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    const id = `ft_${Date.now()}_${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, x, y, text, color, life: 1 }]);
  };

  // --- START NEW RUN ---
  const handleStartGame = (classId: CharacterClassId, name: string) => {
    const cls = CHARACTER_CLASSES[classId];
    const initialFloor = generateFloor(1);

    const startingSkillObj = ALL_SKILLS[cls.startingSkill] || ALL_SKILLS.shield_bash;

    const initialHero: HeroState = {
      classId,
      name,
      level: 1,
      exp: 0,
      maxExp: 100,
      hp: cls.baseHp + metaUpgrades.healthLevel * 15,
      maxHp: cls.baseHp + metaUpgrades.healthLevel * 15,
      mp: cls.baseMp + metaUpgrades.manaLevel * 10,
      maxMp: cls.baseMp + metaUpgrades.manaLevel * 10,
      attack: cls.baseAttack + metaUpgrades.attackLevel * 2,
      defense: cls.baseDefense,
      speed: cls.baseSpeed,
      critChance: cls.baseCrit,
      gold: metaUpgrades.startingGoldLevel * 25,
      soulShards: 0,
      x: initialFloor.stairsUp.x,
      y: initialFloor.stairsUp.y,
      equipment: {
        weapon: null,
        shield: null,
        armor: null,
        helm: null,
        ring: null,
        amulet: null,
        relic: null,
      },
      inventory: [],
      inventorySize: 12,
      skills: [startingSkillObj, ALL_SKILLS.teleport],
      artifactCodexUnlocked: unlockedCodexIds,
      statusEffects: {},
    };

    updateFOV(initialFloor, initialHero.x, initialHero.y, 7);

    setGameState({
      currentDepth: 1,
      hero: initialHero,
      floor: initialFloor,
      logs: [
        {
          id: 'log_init',
          message: `${name} the ${cls.name} enters the perilous Catacombs. Collect rare artifacts and purge the evil!`,
          type: 'info',
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      turnCount: 1,
      isGameOver: false,
      gameWon: false,
      stats: {
        monstersKilled: 0,
        artifactsFound: 0,
        goldCollected: 0,
        damageDealt: 0,
        damageTaken: 0,
        floorsCleared: 0,
      },
    });

    setIsPlaying(true);
    soundFX.playStep();
  };

  // Compute Total Hero Attack and Defense with Equipment Bonuses
  const getHeroTotalStats = (hero: HeroState) => {
    let atk = hero.attack;
    let def = hero.defense;
    let crit = hero.critChance;
    let vamp = 0;

    Object.values(hero.equipment).forEach((item) => {
      if (item && item.stats) {
        if (item.stats.attackBonus) atk += item.stats.attackBonus;
        if (item.stats.defenseBonus) def += item.stats.defenseBonus;
        if (item.stats.critBonus) crit += item.stats.critBonus;
        if (item.stats.vampirism) vamp += item.stats.vampirism;
      }
    });

    return { atk, def, crit, vamp };
  };

  // --- TURN EXECUTION & MONSTER AI ---
  const processTurn = (nextHeroState: HeroState, floorState: DungeonFloor) => {
    if (!gameState) return;

    let updatedHero = { ...nextHeroState };
    let updatedMonsters = [...floorState.monsters];
    let newLogs: GameLog[] = [];

    const heroStats = getHeroTotalStats(updatedHero);

    // Process Monster Actions
    updatedMonsters = updatedMonsters.map((monster) => {
      if (monster.hp <= 0) return monster;

      // Check distance to hero
      const dx = updatedHero.x - monster.x;
      const dy = updatedHero.y - monster.y;
      const dist = Math.abs(dx) + Math.abs(dy);

      // Only act if visible or close
      const isMonsterVisible = floorState.visible[monster.y]?.[monster.x];
      if (!isMonsterVisible && dist > 5) return monster;

      if (dist === 1) {
        // Attack Hero!
        soundFX.playDamage();
        const rawDmg = monster.attack;
        const actualDmg = Math.max(1, rawDmg - Math.floor(heroStats.def * 0.4));

        updatedHero.hp = Math.max(0, updatedHero.hp - actualDmg);
        addFloatingText(updatedHero.x, updatedHero.y, `-${actualDmg}`, '#ef4444');

        newLogs.push({
          id: `m_atk_${Date.now()}_${Math.random()}`,
          message: `${monster.name} hits you for ${actualDmg} damage!`,
          type: 'combat',
          timestamp: new Date().toLocaleTimeString(),
        });
      } else if (dist <= 6 && Math.random() < 0.8) {
        // Move towards hero
        const stepX = Math.sign(dx);
        const stepY = Math.sign(dy);

        let targetX = monster.x;
        let targetY = monster.y;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (floorState.tiles[monster.y][monster.x + stepX] === 'floor') targetX += stepX;
        } else {
          if (floorState.tiles[monster.y + stepY][monster.x] === 'floor') targetY += stepY;
        }

        // Avoid stepping on other monsters
        const occupied = updatedMonsters.some(m => m.id !== monster.id && m.x === targetX && m.y === targetY && m.hp > 0);
        if (!occupied) {
          return { ...monster, x: targetX, y: targetY };
        }
      }

      return monster;
    });

    // Check Hero Death
    let isGameOver = false;
    if (updatedHero.hp <= 0) {
      isGameOver = true;
      soundFX.playDamage();

      const score = gameState.currentDepth * 1000 + gameState.stats.monstersKilled * 150;
      const earnedShards = Math.floor(score / 500) + gameState.stats.artifactsFound * 2;
      setSoulShards((prev) => prev + earnedShards);

      newLogs.push({
        id: `die_${Date.now()}`,
        message: `You perishing at depth ${gameState.currentDepth}! Earned +${earnedShards} Soul Shards.`,
        type: 'danger',
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // Update FOV
    updateFOV(floorState, updatedHero.x, updatedHero.y, 7);

    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hero: updatedHero,
        floor: {
          ...floorState,
          monsters: updatedMonsters.filter((m) => m.hp > 0),
        },
        logs: [...prev.logs, ...newLogs],
        turnCount: prev.turnCount + 1,
        isGameOver,
      };
    });
  };

  // --- HERO MOVEMENT & TILE INTERACTION ---
  const moveHero = (dx: number, dy: number) => {
    if (!gameState || gameState.isGameOver) return;

    const { hero, floor } = gameState;
    const targetX = hero.x + dx;
    const targetY = hero.y + dy;

    if (targetX < 0 || targetX >= floor.width || targetY < 0 || targetY >= floor.height) return;

    const tile = floor.tiles[targetY][targetX];

    // Check if target tile has a monster
    const monsterTarget = floor.monsters.find((m) => m.x === targetX && m.y === targetY && m.hp > 0);

    if (monsterTarget) {
      // Melee Attack Monster
      executeHeroAttack(monsterTarget);
      return;
    }

    if (tile === 'wall') return;

    soundFX.playStep();

    let updatedHero = { ...hero, x: targetX, y: targetY };
    let updatedFloor = { ...floor };

    // Tile Interactions
    if (tile === 'door_closed') {
      updatedFloor.tiles[targetY][targetX] = 'door_open';
      addLog('Opened dungeon door.', 'info');
    } else if (tile === 'chest') {
      const chestItem = updatedFloor.chests.find((c) => c.x === targetX && c.y === targetY && !c.opened);
      if (chestItem) {
        chestItem.opened = true;
        updatedFloor.tiles[targetY][targetX] = 'chest_opened';

        soundFX.playChestOpen();
        const foundArt = chestItem.artifact;

        if (updatedHero.inventory.length < updatedHero.inventorySize) {
          updatedHero.inventory.push(foundArt);
          addLog(`Opened chest and unearthed ${foundArt.rarity.toUpperCase()} ${foundArt.name}!`, 'loot');

          // Register in Codex
          if (!unlockedCodexIds.includes(foundArt.id)) {
            setUnlockedCodexIds((prev) => [...prev, foundArt.id]);
            fetch('/api/artifacts/discover', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ artifactId: foundArt.id }),
            }).catch(console.error);
          }

          setGameState((prev) => prev ? ({ ...prev, stats: { ...prev.stats, artifactsFound: prev.stats.artifactsFound + 1 } }) : prev);
        } else {
          addLog('Backpack is full! Unequip or drop items in Inventory.', 'danger');
        }
      }
    } else if (tile === 'shrine') {
      const shrineItem = updatedFloor.shrines.find((s) => s.x === targetX && s.y === targetY && !s.used);
      if (shrineItem) {
        shrineItem.used = true;
        soundFX.playShrine();

        if (shrineItem.buffType === 'heal') {
          updatedHero.hp = Math.min(updatedHero.maxHp, updatedHero.hp + Math.floor(updatedHero.maxHp * 0.5));
          updatedHero.mp = Math.min(updatedHero.maxMp, updatedHero.mp + Math.floor(updatedHero.maxMp * 0.5));
          addLog('Shrine restored 50% HP & MP!', 'shrine');
        } else if (shrineItem.buffType === 'attack') {
          updatedHero.attack += 3;
          addLog('Shrine permanently granted +3 Base Attack!', 'shrine');
        } else if (shrineItem.buffType === 'exp') {
          updatedHero.exp += 100;
          addLog('Shrine granted +100 EXP!', 'shrine');
        }
      }
    } else if (tile === 'merchant') {
      setActiveModal('merchant');
    } else if (tile === 'stairs_down' || tile === 'boss_portal') {
      descendFloor();
      return;
    }

    processTurn(updatedHero, updatedFloor);
  };

  // --- ATTACK LOGIC ---
  const executeHeroAttack = (monster: Monster) => {
    if (!gameState) return;
    const { hero, floor } = gameState;

    soundFX.playAttack();
    const heroStats = getHeroTotalStats(hero);

    const isCrit = Math.random() * 100 < heroStats.crit;
    let damage = Math.max(1, heroStats.atk - monster.defense);
    if (isCrit) damage = Math.round(damage * 1.8);

    const updatedMonsterHp = Math.max(0, monster.hp - damage);
    addFloatingText(monster.x, monster.y, `${damage}${isCrit ? '!' : ''}`, isCrit ? '#f59e0b' : '#ffffff');

    // Life Steal Vampirism
    let hpBonus = 0;
    if (heroStats.vamp > 0) {
      hpBonus = Math.round(damage * (heroStats.vamp / 100));
    }

    addLog(
      `Attacked ${monster.name} for ${damage} damage!${isCrit ? ' (CRITICAL STRIKE)' : ''}`,
      'combat'
    );

    let updatedHero = {
      ...hero,
      hp: Math.min(hero.maxHp, hero.hp + hpBonus),
    };

    let updatedFloor = {
      ...floor,
      monsters: floor.monsters.map((m) => (m.id === monster.id ? { ...m, hp: updatedMonsterHp } : m)),
    };

    // If monster killed
    if (updatedMonsterHp <= 0) {
      addLog(`Defeated ${monster.name}! Earned +${monster.expReward} EXP & +${monster.goldReward} gold.`, 'loot');

      updatedHero.gold += monster.goldReward;
      updatedHero.exp += monster.expReward;

      // Check Level Up
      if (updatedHero.exp >= updatedHero.maxExp) {
        soundFX.playLevelUp();
        updatedHero.level += 1;
        updatedHero.exp -= updatedHero.maxExp;
        updatedHero.maxExp = Math.round(updatedHero.maxExp * 1.4);
        updatedHero.maxHp += 15;
        updatedHero.hp = updatedHero.maxHp;
        updatedHero.maxMp += 10;
        updatedHero.mp = updatedHero.maxMp;
        updatedHero.attack += 2;

        addLog(`LEVEL UP! Advanced to Level ${updatedHero.level}! HP & MP fully restored.`, 'level');
      }

      setGameState((prev) =>
        prev
          ? {
              ...prev,
              stats: {
                ...prev.stats,
                monstersKilled: prev.stats.monstersKilled + 1,
                goldCollected: prev.stats.goldCollected + monster.goldReward,
              },
            }
          : prev
      );
    }

    processTurn(updatedHero, updatedFloor);
  };

  // --- SKILL EXECUTION ---
  const handleUseSkill = (skill: Skill) => {
    if (!gameState || gameState.isGameOver) return;
    const { hero, floor } = gameState;

    if (hero.mp < skill.mpCost) {
      addLog(`Not enough MP to cast ${skill.name}!`, 'danger');
      return;
    }

    soundFX.playSpell();

    let updatedHero = { ...hero, mp: hero.mp - skill.mpCost };
    let updatedFloor = { ...floor };

    if (skill.targetType === 'single_enemy' || skill.targetType === 'area_enemy') {
      // Find adjacent monsters
      const adjacentMonsters = floor.monsters.filter((m) => {
        const dist = Math.abs(m.x - hero.x) + Math.abs(m.y - hero.y);
        return dist <= skill.range && m.hp > 0;
      });

      if (adjacentMonsters.length > 0) {
        adjacentMonsters.forEach((m) => {
          const dmg = Math.round((hero.attack + 10) * skill.damageMultiplier);
          addFloatingText(m.x, m.y, `${dmg}`, '#c084fc');
          m.hp = Math.max(0, m.hp - dmg);
          addLog(`Cast ${skill.name} on ${m.name} dealing ${dmg} magic damage!`, 'combat');
        });
      } else {
        addLog(`Cast ${skill.name}, but no targets were in range.`, 'info');
      }
    } else if (skill.effectType === 'teleport') {
      // Teleport forward in open tile
      const openTiles: Position[] = [];
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const tx = hero.x + dx;
          const ty = hero.y + dy;
          if (tx >= 0 && tx < floor.width && ty >= 0 && ty < floor.height && floor.tiles[ty][tx] === 'floor') {
            openTiles.push({ x: tx, y: ty });
          }
        }
      }

      if (openTiles.length > 0) {
        const chosen = openTiles[Math.floor(Math.random() * openTiles.length)];
        updatedHero.x = chosen.x;
        updatedHero.y = chosen.y;
        addLog('Shifted through space via Arcane Shift!', 'shrine');
      }
    }

    processTurn(updatedHero, updatedFloor);
  };

  // --- DESCEND TO NEXT FLOOR ---
  const descendFloor = () => {
    if (!gameState) return;
    const nextDepth = gameState.currentDepth + 1;
    const newFloor = generateFloor(nextDepth);

    soundFX.playStep();

    const updatedHero: HeroState = {
      ...gameState.hero,
      x: newFloor.stairsUp.x,
      y: newFloor.stairsUp.y,
      hp: Math.min(gameState.hero.maxHp, gameState.hero.hp + Math.floor(gameState.hero.maxHp * 0.25)),
      mp: Math.min(gameState.hero.maxMp, gameState.hero.mp + Math.floor(gameState.hero.maxMp * 0.25)),
    };

    updateFOV(newFloor, updatedHero.x, updatedHero.y, 7);

    addLog(`Descended deeper to Floor ${nextDepth} [${newFloor.biome}].`, 'level');

    setGameState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentDepth: nextDepth,
        hero: updatedHero,
        floor: newFloor,
      };
    });
  };

  // --- INVENTORY MANAGEMENT ---
  const handleEquipItem = (artifact: Artifact) => {
    if (!gameState) return;
    const { hero } = gameState;

    const currentEquipped = hero.equipment[artifact.slot];
    let newInventory = hero.inventory.filter((item) => item.id !== artifact.id);

    if (currentEquipped) {
      newInventory.push(currentEquipped);
    }

    const updatedHero: HeroState = {
      ...hero,
      equipment: {
        ...hero.equipment,
        [artifact.slot]: artifact,
      },
      inventory: newInventory,
    };

    setGameState((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
    addLog(`Equipped ${artifact.name}.`, 'loot');
  };

  const handleUnequipSlot = (slot: EquipmentSlot) => {
    if (!gameState) return;
    const { hero } = gameState;

    const currentEquipped = hero.equipment[slot];
    if (!currentEquipped) return;

    if (hero.inventory.length >= hero.inventorySize) {
      addLog('Backpack is full! Cannot unequip.', 'danger');
      return;
    }

    const updatedHero: HeroState = {
      ...hero,
      equipment: {
        ...hero.equipment,
        [slot]: null,
      },
      inventory: [...hero.inventory, currentEquipped],
    };

    setGameState((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
    addLog(`Unequipped ${currentEquipped.name}.`, 'info');
  };

  const handleDropItem = (artifactId: string) => {
    if (!gameState) return;
    const updatedInventory = gameState.hero.inventory.filter((i) => i.id !== artifactId);
    setGameState((prev) =>
      prev ? { ...prev, hero: { ...prev.hero, inventory: updatedInventory } } : prev
    );
    addLog('Discarded item from inventory.', 'info');
  };

  // Merchant Buy
  const handleBuyMerchantItem = (index: number) => {
    if (!gameState) return;
    const { hero, floor } = gameState;
    const currentMerchant = floor.merchants[0];
    if (!currentMerchant) return;

    const item = currentMerchant.items[index];
    if (!item || item.purchased || hero.gold < item.price) return;

    if (hero.inventory.length >= hero.inventorySize) {
      addLog('Backpack full! Make space before purchasing.', 'danger');
      return;
    }

    item.purchased = true;
    const updatedHero = {
      ...hero,
      gold: hero.gold - item.price,
      inventory: [...hero.inventory, item.artifact],
    };

    soundFX.playChestOpen();
    addLog(`Purchased ${item.artifact.name} for ${item.price} gold!`, 'loot');

    setGameState((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  };

  const handleBuyPotion = (type: 'hp' | 'mp', price: number) => {
    if (!gameState || gameState.hero.gold < price) return;
    const { hero } = gameState;

    const updatedHero = {
      ...hero,
      gold: hero.gold - price,
      hp: type === 'hp' ? Math.min(hero.maxHp, hero.hp + 50) : hero.hp,
      mp: type === 'mp' ? Math.min(hero.maxMp, hero.mp + 40) : hero.mp,
    };

    soundFX.playChestOpen();
    addLog(`Drank ${type === 'hp' ? 'Healing Elixir (+50 HP)' : 'Mana Potion (+40 MP)'}!`, 'shrine');

    setGameState((prev) => (prev ? { ...prev, hero: updatedHero } : prev));
  };

  // Meta Upgrade Purchase
  const handleMetaUpgrade = (type: keyof MetaUpgrades, cost: number) => {
    if (soulShards < cost) return;
    setSoulShards((prev) => prev - cost);
    setMetaUpgrades((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  // Keyboard Navigation Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || !gameState || gameState.isGameOver || activeModal !== null) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          moveHero(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          moveHero(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          moveHero(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          moveHero(1, 0);
          break;
        case ' ':
          // Wait turn
          processTurn(gameState.hero, gameState.floor);
          break;
        case 'i':
        case 'I':
          setActiveModal('inventory');
          break;
        case 'c':
        case 'C':
          setActiveModal('codex');
          break;
        case 'u':
        case 'U':
          setActiveModal('meta');
          break;
        case 'l':
        case 'L':
          setActiveModal('leaderboard');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameState, activeModal]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {!isPlaying || !gameState ? (
        <ClassSelectModal
          onStartGame={handleStartGame}
          onOpenLeaderboard={() => setActiveModal('leaderboard')}
          onOpenMetaUpgrades={() => setActiveModal('meta')}
          metaUpgrades={metaUpgrades}
          soulShards={soulShards}
        />
      ) : (
        <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-2 sm:p-4 gap-3">
          {/* Top HUD Bar */}
          <HUD
            hero={gameState.hero}
            currentDepth={gameState.currentDepth}
            biome={gameState.floor.biome}
            onOpenInventory={() => setActiveModal('inventory')}
            onOpenCodex={() => setActiveModal('codex')}
            onOpenLeaderboard={() => setActiveModal('leaderboard')}
            onOpenMetaUpgrades={() => setActiveModal('meta')}
            onUseSkill={handleUseSkill}
            selectedSkill={selectedSkill}
            turnCount={gameState.turnCount}
          />

          {/* Main Play Viewport Area */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
            {/* Dungeon Viewport Canvas */}
            <div className="lg:col-span-9 flex flex-col items-center justify-center">
              <DungeonCanvas
                floor={gameState.floor}
                hero={gameState.hero}
                onTileClick={(x, y) => {
                  const dx = x - gameState.hero.x;
                  const dy = y - gameState.hero.y;
                  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                    moveHero(dx, dy);
                  }
                }}
                floatingTexts={floatingTexts}
              />
            </div>

            {/* Side Skills & Onscreen Movement Control Panel */}
            <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Active Hero Skills
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {gameState.hero.skills.map((sk) => (
                    <button
                      key={sk.id}
                      onClick={() => handleUseSkill(sk)}
                      disabled={gameState.hero.mp < sk.mpCost}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        gameState.hero.mp >= sk.mpCost
                          ? 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-100'
                          : 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xs font-bold text-amber-300">{sk.name}</div>
                      <div className="text-[10px] text-blue-400 font-semibold mt-1">
                        {sk.mpCost} MP
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* On-Screen Touch / D-Pad Movement Buttons */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
                  Directional Movement Controls
                </h3>
                <div className="grid grid-cols-3 gap-1.5 max-w-[180px] mx-auto">
                  <div />
                  <button
                    onClick={() => moveHero(0, -1)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 rounded-xl border border-slate-700 flex items-center justify-center transition"
                  >
                    <ChevronUp className="w-5 h-5 text-amber-400" />
                  </button>
                  <div />

                  <button
                    onClick={() => moveHero(-1, 0)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 rounded-xl border border-slate-700 flex items-center justify-center transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => processTurn(gameState.hero, gameState.floor)}
                    className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-amber-900/50 flex items-center justify-center text-xs font-extrabold text-amber-400"
                    title="Wait / Rest Turn"
                  >
                    WAIT
                  </button>

                  <button
                    onClick={() => moveHero(1, 0)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 rounded-xl border border-slate-700 flex items-center justify-center transition"
                  >
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </button>

                  <div />
                  <button
                    onClick={() => moveHero(0, 1)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 rounded-xl border border-slate-700 flex items-center justify-center transition"
                  >
                    <ChevronDown className="w-5 h-5 text-amber-400" />
                  </button>
                  <div />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Combat Chronicles Log */}
          <CombatLog logs={gameState.logs} />
        </div>
      )}

      {/* MODALS */}
      {activeModal === 'inventory' && gameState && (
        <InventoryModal
          hero={gameState.hero}
          onClose={() => setActiveModal(null)}
          onEquipItem={handleEquipItem}
          onUnequipSlot={handleUnequipSlot}
          onDropItem={handleDropItem}
        />
      )}

      {activeModal === 'codex' && (
        <ArtifactCodexModal
          unlockedArtifactIds={unlockedCodexIds}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'meta' && (
        <MetaUpgradesModal
          soulShards={soulShards}
          upgrades={metaUpgrades}
          onUpgrade={handleMetaUpgrade}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'merchant' && gameState && gameState.floor.merchants.length > 0 && (
        <MerchantModal
          merchant={gameState.floor.merchants[0]}
          hero={gameState.hero}
          onBuyItem={handleBuyMerchantItem}
          onBuyPotion={handleBuyPotion}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'leaderboard' && (
        <LeaderboardModal onClose={() => setActiveModal(null)} />
      )}

      {gameState && gameState.isGameOver && (
        <GameOverModal
          gameState={gameState}
          onRestart={() => {
            setIsPlaying(false);
            setGameState(null);
          }}
          onOpenLeaderboard={() => setActiveModal('leaderboard')}
        />
      )}
    </div>
  );
}
