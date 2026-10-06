import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  Search,
  Filter,
  CheckCircle2,
  HardDrive,
  Cpu,
  Layers,
  ShieldCheck,
  Star,
  ExternalLink,
  ChevronDown,
  MessageSquare,
  Bug,
  AlertTriangle,
  Eye,
  Bell,
  Lock,
} from 'lucide-react';
import { Project, ProjectFile, TrailerConfig, CreatorProfile } from './types.ts';
import { DEFAULT_PROJECTS } from './data/defaultProjects.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProjectCard } from './components/ProjectCard.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { CreatorStudioModal } from './components/CreatorStudioModal.tsx';
import { EditProfileModal } from './components/EditProfileModal.tsx';
import { TrailerShowcase } from './components/TrailerShowcase.tsx';
import { CreatorProfileSection } from './components/CreatorProfileSection.tsx';
import { AmbientParticles } from './components/AmbientParticles.tsx';
import { NewProjectBroadcastBanner } from './components/NewProjectBroadcastBanner.tsx';

// Audio Context chime for rating, download, and owner unlock
function playSoundEffect(type: 'rate' | 'download' | 'owner_unlock' | 'alert') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.connect(ctx.destination);

    if (type === 'owner_unlock') {
      // Royal fanfare sequence for owner secret code unlock
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        noteGain.gain.setValueAtTime(0.2, now + i * 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.35);
      });
    } else if (type === 'rate') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        noteGain.gain.setValueAtTime(0.15, now + i * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } else if (type === 'alert') {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {}
}

export default function App() {
  const [theme, setTheme] = useState<'emerald' | 'wood'>(() => {
    try {
      const saved = localStorage.getItem('kings_studio_theme');
      if (saved === 'wood' || saved === 'emerald') return saved;
    } catch {}
    return 'emerald';
  });

  // Owner Secret Code Authorization ("kingsadmin")
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kings_owner_auth') === 'kingsadmin';
    } catch {}
    return false;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('kings_studio_projects_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PROJECTS;
  });

  const [userRatings, setUserRatings] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('kings_user_ratings_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'newest'>('newest');

  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'broadcast'>('success');

  // Live broadcast notification when a new project is uploaded
  const [newProjectBroadcast, setNewProjectBroadcast] = useState<Project | null>(null);

  const [trailer, setTrailer] = useState<TrailerConfig>({
    title: "King's Studio Official Showcase",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Official cinematic Minecraft showcase for Crownlight Shaders with 4K ray traced PBR lighting, realistic water, and high-FPS optimization.",
    channelUrl: "https://www.youtube.com/channel/UC8FicKy0NWHPDrOcYX7F2Bg"
  });

  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile>({
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
  });

  const showToast = (msg: string, type: 'success' | 'error' | 'broadcast' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handlePermissionDenied = () => {
    playSoundEffect('alert');
    showToast("YOU DON'T HAVE PERMISSION TO DO THIS", 'error');
  };

  // Background typing listener: User can type "kingsadmin" anywhere to unlock owner powers!
  const keyBufferRef = useRef<string>('');
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-10);
        if (keyBufferRef.current === 'kingsadmin') {
          keyBufferRef.current = '';
          setIsAdmin(true);
          try {
            localStorage.setItem('kings_owner_auth', 'kingsadmin');
          } catch {}
          playSoundEffect('owner_unlock');
          showToast('👑 Owner Access Granted: Welcome King! Secret code kingsadmin activated.', 'success');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminLogin = (code: string): boolean => {
    if (code === 'kingsadmin') {
      setIsAdmin(true);
      try {
        localStorage.setItem('kings_owner_auth', 'kingsadmin');
      } catch {}
      playSoundEffect('owner_unlock');
      showToast('👑 Owner Access Granted: Welcome King!', 'success');
      return true;
    } else {
      playSoundEffect('alert');
      showToast("YOU DON'T HAVE PERMISSION TO DO THIS", 'error');
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem('kings_owner_auth');
    } catch {}
    showToast('🔒 Owner Mode Locked.', 'success');
  };

  // Sync theme
  useEffect(() => {
    try {
      localStorage.setItem('kings_studio_theme', theme);
      if (theme === 'wood') {
        document.body.classList.add('theme-wood');
        document.documentElement.classList.remove('dark');
      } else {
        document.body.classList.remove('theme-wood');
        document.documentElement.classList.add('dark');
      }
    } catch {}
  }, [theme]);

  // Persist projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kings_studio_projects_v5', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  // Persist user votes
  useEffect(() => {
    try {
      localStorage.setItem('kings_user_ratings_v1', JSON.stringify(userRatings));
    } catch {}
  }, [userRatings]);

  // Server API fetch & Live SSE auto-updating stream
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
        if (typeof data.onlineCount === 'number') {
          setOnlineCount(data.onlineCount);
        }
      })
      .catch(() => {});

    fetch('/api/settings/trailer')
      .then((res) => res.json())
      .then((data) => {
        if (data?.trailer) setTrailer(data.trailer);
      })
      .catch(() => {});

    fetch('/api/settings/creator-profile')
      .then((res) => res.json())
      .then((data) => {
        if (data?.creatorProfile) setCreatorProfile(data.creatorProfile);
      })
      .catch(() => {});

    // SSE auto live updating system & multi-tab BroadcastChannel
    let eventSource: EventSource | null = null;
    let broadcastChannel: BroadcastChannel | null = null;

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel('kings_studio_bus');
        broadcastChannel.onmessage = (e) => {
          try {
            const payload = e.data;
            if (payload?.type === 'PROJECT_ADDED' && payload.project) {
              const newProj = payload.project;
              setProjects((prev) => [newProj, ...prev.filter((p) => p.id !== newProj.id)]);
              setNewProjectBroadcast(newProj);
              playSoundEffect('rate');
            } else if (payload?.type === 'PROJECT_DELETED' && payload.projectId) {
              const delId = payload.projectId;
              setProjects((prev) => prev.filter((p) => p.id !== delId));
              setSelectedProject((curr) => (curr?.id === delId ? null : curr));
            }
          } catch {}
        };
      }
    } catch {}

    try {
      eventSource = new EventSource('/api/live/stream');
      eventSource.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (payload.type === 'VIEWER_COUNT' || payload.type === 'CONNECTED') {
            if (payload.onlineCount) setOnlineCount(payload.onlineCount);
            if (payload.connectedClients) setOnlineCount(payload.connectedClients);
          } else if (payload.type === 'PROJECT_UPDATED') {
            const updated = payload.project;
            setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setSelectedProject((curr) => (curr?.id === updated.id ? updated : curr));
          } else if (payload.type === 'PROJECT_ADDED') {
            const newProj: Project = payload.project;
            setProjects((prev) => [newProj, ...prev.filter((p) => p.id !== newProj.id)]);

            // Trigger live message for all online members: "New project added" with button "View Project"
            setNewProjectBroadcast(newProj);
            playSoundEffect('rate');
          } else if (payload.type === 'PROJECT_DELETED') {
            const delId = payload.projectId;
            setProjects((prev) => prev.filter((p) => p.id !== delId));
            setSelectedProject((curr) => (curr?.id === delId ? null : curr));
            showToast('A project was removed live by the owner.', 'success');
          } else if (payload.type === 'TRAILER_UPDATED') {
            setTrailer(payload.trailer);
          } else if (payload.type === 'CREATOR_PROFILE_UPDATED') {
            setCreatorProfile(payload.creatorProfile);
          }
        } catch {}
      };
    } catch {}

    return () => {
      eventSource?.close();
      broadcastChannel?.close();
    };
  }, []);

  // Star rating logic (public for members)
  const handleRateProject = async (projectId: string, star: number) => {
    playSoundEffect('rate');

    const visitorId = 'member_' + (Math.floor(Math.random() * 100000));
    setUserRatings((prev) => ({ ...prev, [projectId]: star }));

    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== projectId) return p;

        const currentRatings = { ...(p.userRatings || {}) };
        currentRatings[visitorId] = star;

        const ratingValues = Object.values(currentRatings);
        const sum = ratingValues.reduce((acc, val) => acc + val, 0);
        const average = ratingValues.length > 0 ? Number((sum / ratingValues.length).toFixed(1)) : star;

        const updatedProj: Project = {
          ...p,
          rating: average,
          ratingCount: ratingValues.length,
          userRatings: currentRatings,
        };

        if (selectedProject?.id === projectId) {
          setSelectedProject(updatedProj);
        }

        showToast(`⭐ Rated ${star} Stars! Rating updated to ${average.toFixed(1)} / 5.0`);
        return updatedProj;
      })
    );

    try {
      await fetch(`/api/projects/${projectId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ star, userId: visitorId }),
      });
    } catch {}
  };

  // Direct web download handler
  const handleDownloadFile = (file: ProjectFile, proj: Project) => {
    playSoundEffect('download');

    setProjects((prev) =>
      prev.map((p) => (p.id === proj.id ? { ...p, downloads: (p.downloads || 0) + 1 } : p))
    );
    if (selectedProject?.id === proj.id) {
      setSelectedProject((prev) => (prev ? { ...prev, downloads: (prev.downloads || 0) + 1 } : null));
    }

    const fileName = file.fileName || `${proj.title.replace(/\s+/g, '_')}.zip`;

    if (file.fileData) {
      try {
        const byteCharacters = atob(file.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/zip' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast(`✅ Direct Download started: "${fileName}"`);
        return;
      } catch (err) {
        console.error('Error decoding file:', err);
      }
    }

    const placeholderContent = `King's Studio Project Release: ${fileName}\nProject: ${proj.title}\nVersion: ${file.versionName || '1.0'}\nTarget: .minecraft/shaderpacks or .minecraft/mods\nPackaged by King's Studio (Manuja Nethsara)\nVisit: https://kings-studio-projects.ai.studio\n`;
    const blob = new Blob([placeholderContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✅ Direct Download started: "${fileName}"`);
  };

  const handleDownloadProject = (proj: Project) => {
    if (proj.files && proj.files.length > 0) {
      handleDownloadFile(proj.files[0], proj);
    } else {
      const fallbackFile: ProjectFile = {
        id: 'f_default',
        fileName: proj.fileName || `${proj.title.replace(/\s+/g, '_')}.zip`,
        fileData: proj.fileData,
        title: proj.title,
      };
      handleDownloadFile(fallbackFile, proj);
    }
  };

  // Owner Project Save / Publish
  const handleSaveProject = async (projData: Partial<Project>) => {
    if (!isAdmin) {
      handlePermissionDenied();
      return;
    }

    if (editingProject) {
      const updated: Project = {
        ...editingProject,
        ...projData,
        id: editingProject.id,
      };
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      if (selectedProject?.id === updated.id) {
        setSelectedProject(updated);
      }
      showToast(`💾 "${updated.title}" successfully updated!`);

      try {
        await fetch(`/api/projects/${updated.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': 'kingsadmin',
          },
          body: JSON.stringify(updated),
        });
      } catch {}
    } else {
      const newProj: Project = {
        id: 'proj_' + Math.random().toString(36).substring(2, 9),
        title: projData.title || 'Untitled Project',
        type: projData.type || 'Shaders',
        description: projData.description || '',
        thumbnail: projData.thumbnail || projData.bannerUrl || '',
        bannerUrl: projData.bannerUrl || '',
        screenshots: projData.screenshots || [],
        releaseDate: new Date().toISOString().slice(0, 10),
        tags: (projData.tags || ['Minecraft']).slice(0, 4),
        versions: projData.versions || [],
        files: projData.files || [],
        downloads: 0,
        rating: 0,
        ratingCount: 0,
        userRatings: {},
        minecraftVersionText: projData.minecraftVersionText || '1.16 - 26.3',
        workingEnvironment: projData.workingEnvironment || 'Both',
        youtubeUrl: projData.youtubeUrl || '',
        bugReportUrl: projData.bugReportUrl || 'https://discord.gg/GtgvcCxXXU',
        isPremium: projData.isPremium || false,
        price: projData.price || 0,
      };

      setProjects((prev) => [newProj, ...prev]);
      setNewProjectBroadcast(newProj);
      playSoundEffect('rate');
      showToast(`🎉 "${newProj.title}" published successfully!`);

      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('kings_studio_bus');
          bc.postMessage({ type: 'PROJECT_ADDED', project: newProj });
          bc.close();
        }
      } catch {}

      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': 'kingsadmin',
          },
          body: JSON.stringify(newProj),
        });
      } catch {}
    }
  };

  // Owner Project Delete
  const handleDeleteProject = async (id: string) => {
    if (!isAdmin) {
      handlePermissionDenied();
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
    showToast(`🗑️ Project deleted successfully.`);

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('kings_studio_bus');
        bc.postMessage({ type: 'PROJECT_DELETED', projectId: id });
        bc.close();
      }
    } catch {}

    try {
      await fetch(`/api/projects/${id}?adminCode=kingsadmin`, {
        method: 'DELETE',
        headers: { 'x-admin-key': 'kingsadmin' },
      });
    } catch {}
  };

  // Owner Update Trailer
  const handleUpdateTrailer = async (updatedTrailer: TrailerConfig) => {
    if (!isAdmin) {
      handlePermissionDenied();
      return;
    }
    setTrailer(updatedTrailer);
    showToast('🎬 Showcase trailer updated live!');
    try {
      await fetch('/api/settings/trailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'kingsadmin',
        },
        body: JSON.stringify(updatedTrailer),
      });
    } catch {}
  };

  // Owner Update Profile
  const handleSaveProfile = async (updatedProfile: CreatorProfile) => {
    if (!isAdmin) {
      handlePermissionDenied();
      return;
    }
    setCreatorProfile(updatedProfile);
    showToast('👑 Creator profile updated live!');
    try {
      await fetch('/api/settings/creator-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'kingsadmin',
        },
        body: JSON.stringify(updatedProfile),
      });
    } catch {}
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'All' || p.type === selectedType;

    return matchesSearch && matchesType;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  const isWood = theme === 'wood';
  const crownlightProject = projects.find((p) => p.title.toLowerCase().includes('crownlight')) || projects[0];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden ${
      isWood ? 'bg-[#24140a] text-[#f6ecdc]' : 'bg-[#070a08] text-[#e9f2eb]'
    }`}>
      {/* Minecraft Floating Pixel Embers Animation */}
      <AmbientParticles theme={theme} />

      {/* Top Bar with Web Logo and Minecraft Font */}
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'wood' ? 'emerald' : 'wood')}
        onlineCount={onlineCount}
        onOpenCreatorStudio={() => {
          if (isAdmin) {
            setEditingProject(null);
            setIsCreatorOpen(true);
          } else {
            handlePermissionDenied();
          }
        }}
        isAdmin={isAdmin}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-5 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2.5 border ${
            toastType === 'error'
              ? 'bg-red-600 text-white border-red-400'
              : 'bg-emerald-400 text-black border-emerald-300'
          }`}>
            {toastType === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span className="font-mono">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* AUTO LIVE BROADCAST ALERT FOR ONLINE MEMBERS & OWNER */}
      <NewProjectBroadcastBanner
        project={newProjectBroadcast}
        onViewProject={(p) => {
          setSelectedProject(p);
          setNewProjectBroadcast(null);
        }}
        onDismiss={() => setNewProjectBroadcast(null)}
        theme={theme}
      />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 border-b border-black/10 dark:border-white/10 pixel-grid">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="pixel-font text-[10px]">NEXT-GEN MINECRAFT VISUAL ENGINE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black pixel-font tracking-tight leading-[1.2] text-white">
                High-Fidelity Shaders & Custom Mods Built Around <span className="text-emerald-400">YOU</span>
              </h1>

              <p className={`text-sm sm:text-base leading-relaxed max-w-xl ${
                isWood ? 'text-[#ebdcc6]' : 'text-zinc-300'
              }`}>
                Crownlight Shaders delivers living water, volumetric godrays, custom skies, and glowing ores at 120+ FPS. Direct web download without third-party redirects or ad wrappers.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                {crownlightProject && (
                  <button
                    type="button"
                    onClick={() => setSelectedProject(crownlightProject)}
                    className="px-6 py-3.5 rounded-2xl font-black text-xs uppercase pixel-font tracking-tight bg-emerald-400 text-black hover:bg-emerald-300 shadow-xl shadow-emerald-950/60 transition hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD CROWNLIGHT SHADER</span>
                  </button>
                )}

                <a
                  href="#projects-section"
                  className={`px-5 py-3.5 rounded-2xl text-xs font-bold transition border ${
                    isWood
                      ? 'border-[#7a4624]/40 bg-white/20 text-[#f6ecdc] hover:bg-white/30'
                      : 'border-white/10 bg-black/40 text-zinc-300 hover:text-white hover:border-emerald-500/40'
                  }`}
                >
                  Browse All Releases ({projects.length})
                </a>
              </div>

              {/* Trust markers */}
              <div className={`pt-4 flex items-center gap-6 text-xs ${
                isWood ? 'text-[#d89569]' : 'text-zinc-400'
              }`}>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Virus-Free & Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>Sodium & Iris Tested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Low & Ultra Profiles</span>
                </div>
              </div>
            </div>

            {/* Right Col: Crownlight Featured Card Spotlight with Image 3 Discord Bug Notice */}
            {crownlightProject && (
              <div className="lg:col-span-5 space-y-3">
                <div
                  onClick={() => setSelectedProject(crownlightProject)}
                  className={`relative p-5 rounded-3xl border shadow-2xl cursor-pointer group transition duration-300 hover:scale-[1.02] ${
                    isWood
                      ? 'border-[#7a4624] bg-[#3a2010]'
                      : 'border-emerald-500/40 bg-[#0c1a11]/90 shadow-emerald-950/50'
                  }`}
                >
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-black/60">
                    <img
                      src={crownlightProject.bannerUrl || crownlightProject.thumbnail}
                      alt={crownlightProject.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase pixel-font bg-emerald-400 text-black">
                      FEATURED PACK
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black pixel-font text-white">{crownlightProject.title}</h3>
                      <div className="flex items-center gap-1 text-xs font-mono text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{crownlightProject.rating > 0 ? crownlightProject.rating.toFixed(1) : '0.0'}</span>
                        <span className="text-[10px] text-zinc-400">({crownlightProject.ratingCount || 0})</span>
                      </div>
                    </div>

                    <p className={`text-xs line-clamp-2 leading-relaxed ${
                      isWood ? 'text-[#ebdcc6]' : 'text-zinc-300'
                    }`}>
                      Real sky, living ocean waves, glowing ores, and custom style sliders.
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                      <span className="text-emerald-400 font-mono text-[11px] font-bold">
                        {crownlightProject.minecraftVersionText || 'Minecraft 1.16 - 26.3'}
                      </span>
                      <span className="font-bold underline underline-offset-4 group-hover:text-emerald-300">
                        View Details & Download →
                      </span>
                    </div>
                  </div>
                </div>

                {/* EXACT NOTICE REQUIRED BY USER (Image 3) */}
                <div className="p-3.5 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 flex items-center justify-between gap-3 text-xs text-indigo-300">
                  <div className="flex items-center gap-2">
                    <Bug className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>&quot;is any bug find please join our discord server and fix them&quot;</span>
                  </div>
                  <a
                    href="https://discord.gg/GtgvcCxXXU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Discord</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MAIN PROJECTS RELEASES SECTION */}
      <main id="projects-section" className="flex-1 py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-black/10 dark:border-white/10">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-1 pixel-font">
                STUDIO LIBRARY
              </div>
              <h2 className="text-2xl sm:text-3xl font-black pixel-font tracking-tight">
                Releases & Direct Web Downloads
              </h2>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search shaders, mods, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full sm:w-64 rounded-xl border pl-9 pr-3 py-2 text-xs outline-none transition ${
                    isWood
                      ? 'border-[#7a4624]/30 bg-white/10 text-white placeholder-white/40 focus:border-[#7a4624]'
                      : 'border-white/10 bg-black/40 text-white placeholder-zinc-500 focus:border-emerald-400'
                  }`}
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold outline-none ${
                  isWood ? 'border-[#7a4624]/30 bg-[#3a2010] text-[#f6ecdc]' : 'border-white/10 bg-black/40 text-zinc-300'
                }`}
              >
                <option value="newest">Sort: Newest First</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="downloads">Sort: Most Downloaded</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 text-xs font-bold">
            {['All', 'Shaders', 'Mods', 'Modpacks', 'Resource Packs', 'Addons'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedType(cat)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition pixel-font text-[10px] ${
                  selectedType === cat
                    ? isWood
                      ? 'bg-[#7a4624] text-white shadow-sm'
                      : 'bg-emerald-400 text-black shadow-md shadow-emerald-950/40'
                    : isWood
                    ? 'bg-white/10 hover:bg-white/20 text-[#ebdcc6]'
                    : 'bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {sortedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={(p) => setSelectedProject(p)}
                  onDownload={(p) => handleDownloadProject(p)}
                  onRate={(id, star) => handleRateProject(id, star)}
                  onWatchTrailer={(url) => {
                    setTrailer((prev) => ({ ...prev, youtubeUrl: url }));
                    const el = document.getElementById('trailer-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  userRating={userRatings[project.id]}
                  theme={theme}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteProject}
                  onEdit={(p) => {
                    setEditingProject(p);
                    setIsCreatorOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl border border-dashed border-zinc-700 text-center space-y-3">
              <p className="text-sm font-bold text-zinc-400">
                No projects found matching your search.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('All');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* VIDEO TRAILER SHOWCASE */}
      <TrailerShowcase
        trailer={trailer}
        isAdmin={isAdmin}
        onUpdateTrailer={handleUpdateTrailer}
        theme={theme}
      />

      {/* CREATOR PROFILE SECTION (with edit modal for owner) */}
      <CreatorProfileSection
        profile={creatorProfile}
        isAdmin={isAdmin}
        onEditProfile={() => setIsEditProfileOpen(true)}
        theme={theme}
      />

      {/* FOOTER */}
      <Footer theme={theme} />

      {/* MODAL: PROJECT DETAILS */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onRate={handleRateProject}
          onDownloadFile={handleDownloadFile}
          onDownloadProject={handleDownloadProject}
          onWatchTrailer={(url) => {
            setTrailer((prev) => ({ ...prev, youtubeUrl: url }));
            setSelectedProject(null);
            const el = document.getElementById('trailer-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          userRating={userRatings[selectedProject.id]}
          theme={theme}
          isAdmin={isAdmin}
          onEditProject={(p) => {
            setEditingProject(p);
            setSelectedProject(null);
            setIsCreatorOpen(true);
          }}
          onDeleteProject={handleDeleteProject}
          onPermissionDenied={handlePermissionDenied}
        />
      )}

      {/* MODAL: CREATOR STUDIO (UPLOAD / EDIT PROJECT) */}
      <CreatorStudioModal
        isOpen={isCreatorOpen}
        onClose={() => {
          setIsCreatorOpen(false);
          setEditingProject(null);
        }}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        editingProject={editingProject}
        projects={projects}
        theme={theme}
      />

      {/* MODAL: EDIT PROFILE */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={creatorProfile}
        onSaveProfile={handleSaveProfile}
        theme={theme}
      />
    </div>
  );
}
