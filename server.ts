import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent database for Leaderboard & Artifact Codex
interface LeaderboardRecord {
  id: string;
  playerName: string;
  heroClass: string;
  depthReached: number;
  score: number;
  artifactsCount: number;
  killedBy: string;
  createdAt: string;
}

const leaderboard: LeaderboardRecord[] = [
  {
    id: "run-1",
    playerName: "Valerius the Brave",
    heroClass: "Paladin",
    depthReached: 12,
    score: 18500,
    artifactsCount: 14,
    killedBy: "Archlich Malakor",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "run-2",
    playerName: "Shadowblade Nix",
    heroClass: "Rogue",
    depthReached: 9,
    score: 12400,
    artifactsCount: 9,
    killedBy: "Infernal Golem",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: "run-3",
    playerName: "Ignis Elemental",
    heroClass: "Mage",
    depthReached: 7,
    score: 8900,
    artifactsCount: 6,
    killedBy: "Acidic Slime Queen",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

const globalDiscoveredArtifacts = new Set<string>([
  "art_sword_sunfire",
  "art_orb_void",
  "art_ring_vampire",
  "art_crown_dragon"
]);

// --- API ROUTES ---

// Health & Runtime check
app.get("/api/health", (req, res) => {
  // @ts-ignore - Check if running inside Bun
  const isBun = typeof Bun !== "undefined" || !!process.versions.bun;
  // @ts-ignore
  const bunVersion = isBun ? (typeof Bun !== "undefined" ? Bun.version : process.versions.bun) : null;

  res.json({
    status: "ok",
    runtime: isBun ? `Bun v${bunVersion}` : `Node.js ${process.version}`,
    isBun,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// Get Leaderboard
app.get("/api/leaderboard", (req, res) => {
  const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 50);
  res.json(sorted);
});

// Post Leaderboard entry
app.post("/api/leaderboard", (req, res) => {
  const { playerName, heroClass, depthReached, score, artifactsCount, killedBy } = req.body;
  
  if (!playerName || typeof score !== "number") {
    res.status(400).json({ error: "Invalid leaderboard submission payload" });
    return;
  }

  const newEntry: LeaderboardRecord = {
    id: `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    playerName: String(playerName).substring(0, 30),
    heroClass: String(heroClass || "Adventurer"),
    depthReached: Number(depthReached || 1),
    score: Number(score || 0),
    artifactsCount: Number(artifactsCount || 0),
    killedBy: String(killedBy || "Unknown Dangers"),
    createdAt: new Date().toISOString(),
  };

  leaderboard.push(newEntry);
  res.json({ success: true, entry: newEntry });
});

// Artifact Codex Stats
app.get("/api/artifacts/codex", (req, res) => {
  res.json({
    unlockedCount: globalDiscoveredArtifacts.size,
    unlockedIds: Array.from(globalDiscoveredArtifacts),
  });
});

// Register newly discovered artifact
app.post("/api/artifacts/discover", (req, res) => {
  const { artifactId } = req.body;
  if (artifactId && typeof artifactId === "string") {
    globalDiscoveredArtifacts.add(artifactId);
    res.json({ success: true, totalUnlocked: globalDiscoveredArtifacts.size });
    return;
  }
  res.status(400).json({ error: "Missing artifactId" });
});

// --- VITE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    // @ts-ignore
    const isBun = typeof Bun !== "undefined" || !!process.versions.bun;
    console.log(`[Backend Server] Running on http://0.0.0.0:${PORT} using ${isBun ? "BUN" : "Node.js"}`);
  });
}

startServer();
