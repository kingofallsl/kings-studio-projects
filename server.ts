import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { DEFAULT_PROJECTS } from './src/data/defaultProjects.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Persistence file path
const DATA_DIR = path.join(__dirname, '.data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TRAILER_FILE = path.join(DATA_DIR, 'trailer.json');
const CREATOR_FILE = path.join(DATA_DIR, 'creator.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory state initialized from file or defaults (with 0.0 initial rating)
let projects = (() => {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.error('Error loading projects file:', e);
  }
  // Initialize with DEFAULT_PROJECTS with 0.0 rating and 0 count
  return DEFAULT_PROJECTS.map(p => ({
    ...p,
    rating: p.userRatings && Object.keys(p.userRatings).length > 0
      ? p.rating
      : 0,
    ratingCount: p.userRatings && Object.keys(p.userRatings).length > 0
      ? p.ratingCount
      : 0,
    userRatings: p.userRatings || {},
  }));
})();

let trailer = (() => {
  try {
    if (fs.existsSync(TRAILER_FILE)) {
      return JSON.parse(fs.readFileSync(TRAILER_FILE, 'utf-8'));
    }
  } catch {}
  return {
    title: "King's Studio Official Trailer",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Official cinematic Minecraft showcase for Crownlight Shaders, high-framerate optimization, and custom game mechanics.",
    channelUrl: "https://www.youtube.com/channel/UC8FicKy0NWHPDrOcYX7F2Bg"
  };
})();

let creatorProfile = (() => {
  try {
    if (fs.existsSync(CREATOR_FILE)) {
      return JSON.parse(fs.readFileSync(CREATOR_FILE, 'utf-8'));
    }
  } catch {}
  return {
    name: "kingofall",
    gamerTag: "officialcamage",
    title: "Founder & Lead Technical Artist • King's Studio",
    bio: "Passionate Minecraft technical artist and software developer behind Crownlight Shaders, custom RPG mechanics, and high-performance server architecture. Dedicated to bringing cinematic visual fidelity to the worldwide sandbox community.",
    avatarUrl: "",
    youtubeUrl: "https://www.youtube.com/channel/UC8FicKy0NWHPDrOcYX7F2Bg",
    discordUrl: "https://discord.gg/bUX52N2BYV",
    twitterUrl: "https://x.com/KingofallSL",
    facebookUrl: "https://web.facebook.com/profile.php?id=61590860332122",
    redditUrl: "https://www.reddit.com/user/ElegantLet2894/"
  };
})();

function persistProjects() {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error('Error saving projects:', err);
  }
}

function persistTrailer() {
  try {
    fs.writeFileSync(TRAILER_FILE, JSON.stringify(trailer, null, 2));
  } catch (err) {
    console.error('Error saving trailer:', err);
  }
}

function persistCreator() {
  try {
    fs.writeFileSync(CREATOR_FILE, JSON.stringify(creatorProfile, null, 2));
  } catch (err) {
    console.error('Error saving creator profile:', err);
  }
}

// SSE Clients for real-time updates
const sseClients = new Set<express.Response>();

function broadcastSSE(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Heartbeat ping every 15s to keep SSE connection alive
setInterval(() => {
  broadcastSSE({ type: 'HEARTBEAT', timestamp: Date.now(), onlineCount: Math.max(1, sseClients.size) });
}, 15000);

const ADMIN_SECRET = 'kingsadmin';

function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const code = req.headers['x-admin-key'] || req.body?.adminCode || req.query?.adminCode;
  if (code === ADMIN_SECRET) {
    return next();
  }
  return res.status(403).json({ error: "YOU DON'T HAVE PERMISSION TO DO THIS" });
}

// Verify secret code endpoint
app.post('/api/admin/verify', (req, res) => {
  const { code } = req.body;
  if (code === ADMIN_SECRET) {
    return res.json({ success: true, authorized: true });
  }
  return res.status(403).json({ success: false, error: "YOU DON'T HAVE PERMISSION TO DO THIS" });
});

// SSE live stream
app.get('/api/live/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Initial welcome and live viewer count
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', connectedClients: Math.max(1, sseClients.size) })}\n\n`);
  broadcastSSE({ type: 'VIEWER_COUNT', onlineCount: Math.max(1, sseClients.size) });

  req.on('close', () => {
    sseClients.delete(res);
    broadcastSSE({ type: 'VIEWER_COUNT', onlineCount: Math.max(1, sseClients.size) });
  });
});

// GET all projects
app.get('/api/projects', (_req, res) => {
  if (!projects || projects.length === 0) {
    projects = DEFAULT_PROJECTS.map(p => ({
      ...p,
      rating: p.userRatings && Object.keys(p.userRatings).length > 0 ? p.rating : 0,
      ratingCount: p.userRatings && Object.keys(p.userRatings).length > 0 ? p.ratingCount : 0,
      userRatings: p.userRatings || {},
    }));
    persistProjects();
  }
  res.json({
    projects,
    onlineCount: Math.max(1, sseClients.size)
  });
});

// CREATE a project
app.post('/api/projects', checkAdminAuth, (req, res) => {
  const newProject = {
    ...req.body,
    id: req.body.id || 'proj_' + Math.random().toString(36).substring(2, 9),
    rating: typeof req.body.rating === 'number' ? req.body.rating : 0,
    ratingCount: typeof req.body.ratingCount === 'number' ? req.body.ratingCount : 0,
    userRatings: req.body.userRatings || {},
    downloads: req.body.downloads || 0,
    releaseDate: req.body.releaseDate || new Date().toISOString().slice(0, 10),
  };

  projects.unshift(newProject);
  persistProjects();

  broadcastSSE({ type: 'PROJECT_ADDED', project: newProject });
  res.status(201).json({ success: true, project: newProject });
});

// UPDATE a project
app.put('/api/projects/:id', checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects[index] = {
    ...projects[index],
    ...req.body,
    id // keep original id
  };
  persistProjects();

  broadcastSSE({ type: 'PROJECT_UPDATED', project: projects[index] });
  res.json({ success: true, project: projects[index] });
});

// RATE a project (Star rating logic - public for visitors/members)
app.post('/api/projects/:id/rate', (req, res) => {
  const { id } = req.params;
  const { star, userId } = req.body;
  const numStar = Number(star);

  if (isNaN(numStar) || numStar < 1 || numStar > 5) {
    return res.status(400).json({ error: 'Invalid star rating. Must be between 1 and 5.' });
  }

  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = projects[index];
  const userKey = userId || 'visitor_' + (req.ip || 'local');
  const userRatings = { ...(project.userRatings || {}) };

  userRatings[userKey] = numStar;

  const ratingsArray = Object.values(userRatings) as number[];
  const sum = ratingsArray.reduce((acc, val) => acc + val, 0);
  const average = ratingsArray.length > 0 ? Number((sum / ratingsArray.length).toFixed(1)) : 0;

  projects[index] = {
    ...project,
    rating: average,
    ratingCount: ratingsArray.length,
    userRatings
  };
  persistProjects();

  broadcastSSE({ type: 'PROJECT_UPDATED', project: projects[index] });
  res.json({
    success: true,
    rating: average,
    ratingCount: ratingsArray.length,
    userRating: numStar,
    project: projects[index]
  });
});

// DELETE a project
app.delete('/api/projects/:id', checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.splice(index, 1);
  persistProjects();

  broadcastSSE({ type: 'PROJECT_DELETED', projectId: id });
  res.json({ success: true });
});

// Trailer settings
app.get('/api/settings/trailer', (_req, res) => {
  res.json({ trailer });
});

app.post('/api/settings/trailer', checkAdminAuth, (req, res) => {
  trailer = { ...trailer, ...req.body };
  persistTrailer();
  broadcastSSE({ type: 'TRAILER_UPDATED', trailer });
  res.json({ success: true, trailer });
});

// Creator profile
app.get('/api/settings/creator-profile', (_req, res) => {
  res.json({ creatorProfile });
});

app.post('/api/settings/creator-profile', checkAdminAuth, (req, res) => {
  creatorProfile = { ...creatorProfile, ...req.body };
  persistCreator();
  broadcastSSE({ type: 'CREATOR_PROFILE_UPDATED', creatorProfile });
  res.json({ success: true, creatorProfile });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`King's Studio Projects server listening on port ${PORT}`);
  });
}

startServer();
