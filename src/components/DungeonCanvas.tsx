import React, { useRef, useEffect } from 'react';
import { DungeonFloor, HeroState, Monster, Position } from '../types';

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface DungeonCanvasProps {
  floor: DungeonFloor;
  hero: HeroState;
  onTileClick: (x: number, y: number) => void;
  floatingTexts: FloatingText[];
}

const TILE_SIZE = 28;

export const DungeonCanvas: React.FC<DungeonCanvasProps> = ({
  floor,
  hero,
  onTileClick,
  floatingTexts
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render main canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const { tiles, visited, visible, monsters, chests, shrines, merchants } = floor;

    // Render Tiles
    for (let y = 0; y < floor.height; y++) {
      for (let x = 0; x < floor.width; x++) {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        const isVisited = visited[y]?.[x];
        const isVisible = visible[y]?.[x];

        if (!isVisited && !isVisible) {
          // Unexplored
          ctx.fillStyle = '#020617';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          continue;
        }

        const tile = tiles[y][x];

        // Biome base colors
        let floorColor = '#0f172a';
        let wallColor = '#1e293b';

        if (floor.biome === 'SunkenRuins') {
          floorColor = '#082f49';
          wallColor = '#0c4a6e';
        } else if (floor.biome === 'InfernalDepths') {
          floorColor = '#451a03';
          wallColor = '#7c2d12';
        } else if (floor.biome === 'VoidSanctum') {
          floorColor = '#3b0764';
          wallColor = '#581c87';
        }

        // Draw Base Tile
        if (tile === 'wall') {
          ctx.fillStyle = wallColor;
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#020617';
          ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
        } else {
          ctx.fillStyle = floorColor;
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#00000022';
          ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
        }

        // Render Special Objects on Tile
        if (isVisible) {
          if (tile === 'door_closed') {
            ctx.fillStyle = '#b45309';
            ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(px + TILE_SIZE / 2 - 2, py + TILE_SIZE / 2 - 2, 4, 4);
          } else if (tile === 'door_open') {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(px + 2, py + 2, 4, TILE_SIZE - 4);
          } else if (tile === 'stairs_down') {
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('▼', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
          } else if (tile === 'stairs_up') {
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('▲', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
          } else if (tile === 'boss_portal') {
            ctx.fillStyle = '#e11d48';
            ctx.shadowColor = '#f43f5e';
            ctx.shadowBlur = 10;
            ctx.font = 'bold 18px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🌀', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
            ctx.shadowBlur = 0;
          } else if (tile === 'chest') {
            ctx.fillStyle = '#eab308';
            ctx.fillRect(px + 6, py + 8, TILE_SIZE - 12, TILE_SIZE - 12);
            ctx.fillStyle = '#713f12';
            ctx.fillRect(px + 8, py + 12, TILE_SIZE - 16, 3);
          } else if (tile === 'shrine') {
            ctx.fillStyle = '#a855f7';
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 8;
            ctx.fillRect(px + 8, py + 4, TILE_SIZE - 16, TILE_SIZE - 8);
            ctx.shadowBlur = 0;
          } else if (tile === 'merchant') {
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🧙‍♂️', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
          }
        }

        // Fog of War Overlay (Visited but not currently visible)
        if (isVisited && !isVisible) {
          ctx.fillStyle = 'rgba(2, 6, 23, 0.65)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // Render Visible Monsters
    monsters.forEach(m => {
      if (!visible[m.y]?.[m.x]) return;

      const px = m.x * TILE_SIZE;
      const py = m.y * TILE_SIZE;

      // Draw Monster Circle / Avatar
      ctx.fillStyle = m.color;
      ctx.beginPath();
      ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (m.isBoss) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Draw Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = m.isBoss ? 'bold 15px monospace' : 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(m.symbol, px + TILE_SIZE / 2, py + TILE_SIZE / 2);

      // Draw HP Bar for Monsters
      const hpRatio = Math.max(0, m.hp / m.maxHp);
      ctx.fillStyle = '#000000';
      ctx.fillRect(px + 2, py + 1, TILE_SIZE - 4, 3);
      ctx.fillStyle = m.isBoss ? '#ef4444' : '#22c55e';
      ctx.fillRect(px + 2, py + 1, (TILE_SIZE - 4) * hpRatio, 3);
    });

    // Render Hero Avatar
    const hx = hero.x * TILE_SIZE;
    const hy = hero.y * TILE_SIZE;

    // Glowing aura behind hero
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(hx + TILE_SIZE / 2, hy + TILE_SIZE / 2, TILE_SIZE / 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚔️', hx + TILE_SIZE / 2, hy + TILE_SIZE / 2);

    // Render Floating Damage / Heal Numbers
    floatingTexts.forEach(ft => {
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 14px sans-serif';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x * TILE_SIZE + TILE_SIZE / 2, ft.y * TILE_SIZE - ft.life * 6);
      ctx.shadowBlur = 0;
    });

  }, [floor, hero, floatingTexts]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (x >= 0 && x < floor.width && y >= 0 && y < floor.height) {
      onTileClick(x, y);
    }
  };

  return (
    <div className="relative overflow-auto max-w-full max-h-[75vh] flex justify-center items-center bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-2xl">
      <canvas
        ref={canvasRef}
        width={floor.width * TILE_SIZE}
        height={floor.height * TILE_SIZE}
        onClick={handleCanvasClick}
        className="cursor-pointer rounded-xl touch-none"
      />
    </div>
  );
};
