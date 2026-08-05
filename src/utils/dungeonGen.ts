import { 
  DungeonFloor, TileType, BiomeType, Position, 
  Monster, ChestItem, Shrine, Merchant 
} from '../types';
import { MONSTER_TEMPLATES, BOSS_TEMPLATES, createMonster } from '../data/monsters';
import { generateRandomArtifact } from '../data/artifacts';

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function generateFloor(depth: number): DungeonFloor {
  // Select Biome based on depth
  let biome: BiomeType = 'Catacombs';
  if (depth >= 10) biome = 'VoidSanctum';
  else if (depth >= 7) biome = 'InfernalDepths';
  else if (depth >= 4) biome = 'SunkenRuins';

  const mapWidth = 36;
  const mapHeight = 26;

  // Initialize all tiles as walls
  const tiles: TileType[][] = Array.from({ length: mapHeight }, () => 
    Array.from({ length: mapWidth }, () => 'wall')
  );

  const visited: boolean[][] = Array.from({ length: mapHeight }, () => 
    Array.from({ length: mapWidth }, () => false)
  );

  const visible: boolean[][] = Array.from({ length: mapHeight }, () => 
    Array.from({ length: mapWidth }, () => false)
  );

  // Generate Rooms
  const rooms: Room[] = [];
  const minRoomSize = 5;
  const maxRoomSize = 9;
  const maxRooms = 8 + Math.min(depth, 4);

  for (let i = 0; i < maxRooms * 3; i++) {
    if (rooms.length >= maxRooms) break;

    const w = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
    const h = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
    const x = Math.floor(Math.random() * (mapWidth - w - 2)) + 1;
    const y = Math.floor(Math.random() * (mapHeight - h - 2)) + 1;

    const newRoom: Room = { x, y, width: w, height: h };

    // Check overlap with padding
    const intersects = rooms.some(r => 
      x <= r.x + r.width + 1 &&
      x + w + 1 >= r.x &&
      y <= r.y + r.height + 1 &&
      y + h + 1 >= r.y
    );

    if (!intersects) {
      rooms.push(newRoom);

      // Carve out floor
      for (let ry = y; ry < y + h; ry++) {
        for (let rx = x; rx < x + w; rx++) {
          tiles[ry][rx] = 'floor';
        }
      }
    }
  }

  // Connect Rooms with Corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i];
    const roomB = rooms[i + 1];

    const centerA = { x: Math.floor(roomA.x + roomA.width / 2), y: Math.floor(roomA.y + roomA.height / 2) };
    const centerB = { x: Math.floor(roomB.x + roomB.width / 2), y: Math.floor(roomB.y + roomB.height / 2) };

    // L-shaped corridor
    if (Math.random() < 0.5) {
      carveHorizontalCorridor(tiles, centerA.x, centerB.x, centerA.y);
      carveVerticalCorridor(tiles, centerA.y, centerB.y, centerB.x);
    } else {
      carveVerticalCorridor(tiles, centerA.y, centerB.y, centerA.x);
      carveHorizontalCorridor(tiles, centerA.x, centerB.x, centerB.y);
    }
  }

  // Add Doors at corridor-room junctions
  for (let y = 1; y < mapHeight - 1; y++) {
    for (let x = 1; x < mapWidth - 1; x++) {
      if (tiles[y][x] === 'floor' && Math.random() < 0.15) {
        // Horizontal doorway check
        if (tiles[y][x - 1] === 'wall' && tiles[y][x + 1] === 'wall' && tiles[y - 1][x] === 'floor' && tiles[y + 1][x] === 'floor') {
          tiles[y][x] = 'door_closed';
        } 
        // Vertical doorway check
        else if (tiles[y - 1][x] === 'wall' && tiles[y + 1][x] === 'wall' && tiles[y][x - 1] === 'floor' && tiles[y][x + 1] === 'floor') {
          tiles[y][x] = 'door_closed';
        }
      }
    }
  }

  // Set Stairs Up (Room 0) and Stairs Down (Last Room)
  const startRoom = rooms[0];
  const endRoom = rooms[rooms.length - 1];

  const stairsUp: Position = {
    x: Math.floor(startRoom.x + startRoom.width / 2),
    y: Math.floor(startRoom.y + startRoom.height / 2)
  };
  tiles[stairsUp.y][stairsUp.x] = 'stairs_up';

  const stairsDown: Position = {
    x: Math.floor(endRoom.x + endRoom.width / 2),
    y: Math.floor(endRoom.y + endRoom.height / 2)
  };

  const isBossLevel = BOSS_TEMPLATES[depth] !== undefined;
  if (isBossLevel) {
    tiles[stairsDown.y][stairsDown.x] = 'boss_portal';
  } else {
    tiles[stairsDown.y][stairsDown.x] = 'stairs_down';
  }

  // Spawn Monsters
  const monsters: Monster[] = [];
  const bossTemplate = BOSS_TEMPLATES[depth];

  if (isBossLevel && bossTemplate) {
    // Spawn Boss in end room
    const boss = createMonster(bossTemplate, stairsDown.x, stairsDown.y - 1, depth, true);
    monsters.push(boss);
  }

  // Spawn Regular Monsters in non-starting rooms
  const matchingTemplates = MONSTER_TEMPLATES.filter(m => m.biome === biome);

  rooms.slice(1).forEach(room => {
    const numMonsters = Math.floor(Math.random() * 3) + 1;
    for (let m = 0; m < numMonsters; m++) {
      const mx = Math.floor(Math.random() * (room.width - 2)) + room.x + 1;
      const my = Math.floor(Math.random() * (room.height - 2)) + room.y + 1;

      if (tiles[my][mx] === 'floor' && !(mx === stairsDown.x && my === stairsDown.y)) {
        const template = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)] 
          || MONSTER_TEMPLATES[0];
        monsters.push(createMonster(template, mx, my, depth));
      }
    }
  });

  // Spawn Chests with Artifacts
  const chests: ChestItem[] = [];
  rooms.slice(1).forEach(room => {
    if (Math.random() < 0.65) {
      const cx = room.x + 1;
      const cy = room.y + 1;
      if (tiles[cy][cx] === 'floor') {
        tiles[cy][cx] = 'chest';
        chests.push({
          x: cx,
          y: cy,
          artifact: generateRandomArtifact(depth),
          opened: false
        });
      }
    }
  });

  // Spawn Shrines
  const shrines: Shrine[] = [];
  rooms.slice(1, -1).forEach(room => {
    if (Math.random() < 0.4) {
      const sx = room.x + room.width - 2;
      const sy = room.y + room.height - 2;
      if (tiles[sy][sx] === 'floor') {
        tiles[sy][sx] = 'shrine';
        const types: ('heal' | 'attack' | 'exp' | 'curse_risk')[] = ['heal', 'attack', 'exp', 'curse_risk'];
        const chosenType = types[Math.floor(Math.random() * types.length)];
        let desc = 'Restores 50% HP & MP.';
        if (chosenType === 'attack') desc = 'Permanently grants +3 Base Attack.';
        else if (chosenType === 'exp') desc = 'Grants +100 EXP immediately.';
        else if (chosenType === 'curse_risk') desc = '70% chance +5 Attack & Defense, 30% cursed (-20 HP).';

        shrines.push({
          x: sx,
          y: sy,
          name: `${biome} Altar of ${chosenType.toUpperCase()}`,
          buffType: chosenType,
          used: false,
          description: desc
        });
      }
    }
  });

  // Spawn Merchant on specific floor depths
  const merchants: Merchant[] = [];
  if (depth % 2 === 0 || depth === 1) {
    const mRoom = rooms[Math.min(2, rooms.length - 1)];
    const mx = Math.floor(mRoom.x + mRoom.width / 2);
    const my = Math.floor(mRoom.y + mRoom.height / 2);
    if (tiles[my][mx] === 'floor') {
      tiles[my][mx] = 'merchant';
      merchants.push({
        x: mx,
        y: my,
        items: [
          { artifact: generateRandomArtifact(depth + 1), price: 60 + depth * 25, purchased: false },
          { artifact: generateRandomArtifact(depth + 2), price: 120 + depth * 40, purchased: false },
          { artifact: generateRandomArtifact(depth + 3), price: 200 + depth * 60, purchased: false }
        ]
      });
    }
  }

  return {
    depth,
    biome,
    width: mapWidth,
    height: mapHeight,
    tiles,
    visited,
    visible,
    monsters,
    chests,
    shrines,
    merchants,
    stairsUp,
    stairsDown,
    bossPortal: isBossLevel ? stairsDown : undefined
  };
}

function carveHorizontalCorridor(tiles: TileType[][], x1: number, x2: number, y: number) {
  for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
    if (tiles[y][x] === 'wall') tiles[y][x] = 'floor';
  }
}

function carveVerticalCorridor(tiles: TileType[][], y1: number, y2: number, x: number) {
  for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
    if (tiles[y][x] === 'wall') tiles[y][x] = 'floor';
  }
}

// Line of Sight Raycasting Field of View
export function updateFOV(floor: DungeonFloor, heroX: number, heroY: number, radius: number = 7) {
  // Clear visible array
  for (let y = 0; y < floor.height; y++) {
    for (let x = 0; x < floor.width; x++) {
      floor.visible[y][x] = false;
    }
  }

  // Raycast 360 degrees around hero
  const raySteps = 120;
  for (let i = 0; i < raySteps; i++) {
    const angle = (i * 2 * Math.PI) / raySteps;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let currX = heroX + 0.5;
    let currY = heroY + 0.5;

    for (let step = 0; step < radius; step++) {
      const tileX = Math.floor(currX);
      const tileY = Math.floor(currY);

      if (tileX < 0 || tileX >= floor.width || tileY < 0 || tileY >= floor.height) break;

      floor.visible[tileY][tileX] = true;
      floor.visited[tileY][tileX] = true;

      // Stop ray if blocked by wall or closed door
      const t = floor.tiles[tileY][tileX];
      if (t === 'wall' || t === 'door_closed') break;

      currX += dx * 0.6;
      currY += dy * 0.6;
    }
  }
}
