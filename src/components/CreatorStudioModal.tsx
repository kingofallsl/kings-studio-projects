import React, { useState } from 'react';
import {
  X,
  Plus,
  Save,
  Trash2,
  FileCode,
  Sparkles,
  Upload,
  Eye,
  Edit3,
  CheckCircle2,
  Image as ImageIcon,
  Film,
  Bug,
  DollarSign,
  Tag,
  Layers,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Play,
  Zap,
  AlertTriangle,
  Info,
  Cpu,
  Link,
} from 'lucide-react';
import { Project, ProjectFile, JAVA_VERSIONS, BEDROCK_VERSIONS } from '../types.ts';
import { ProjectDescriptionView } from './ProjectDescriptionView.tsx';
import { DeleteConfirmModal } from './DeleteConfirmModal.tsx';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  editingProject: Project | null;
  projects: Project[];
  theme?: 'emerald' | 'wood';
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  onDeleteProject,
  editingProject,
  theme = 'emerald',
}) => {
  const isWood = theme === 'wood';

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [formData, setFormData] = useState<Partial<Project>>(() => {
    if (editingProject) {
      return { ...editingProject };
    }
    return {
      title: '',
      type: 'Shaders',
      description: `👑 Crownlight Shaders

✨ A bright, clean shader pack with a real sky, living water, glowing ores and a menu built around YOU.

---

• 🌅 Custom sky and clouds
• 🌊 Realistic water
• 💎 Glowing ores
• 🔦 Coloured torch light
• 🎛️ Make your own look

---

🌟 Why Crownlight?
Vanilla Minecraft looks flat. Crownlight gives it a real sky, soft light, moving water and glowing details, and it still runs well.

---

🔥 Highlights
🌅 Sky and Atmosphere
Custom blue sky with orange sunrises and sunsets
Soft clouds lit by the sun
Glowing sun, moon and twinkling stars

🌊 Water
Ocean-style waves
Sky reflections
Clear, natural-looking underwater view

💎 Ores, Metals and Lights
⛏️ Ores glow in their own colours, even in total darkness
✨ Shiny gold, diamond, emerald, iron, netherite and copper blocks

---

🧭 Best Way to Play
🟢 Low: Older PCs and laptops, or if you want the highest FPS
🟡 Medium: Balanced looks and speed
🔵 High: Recommended for most gaming PCs
🟣 Ultra: Strong GPUs and screenshots

---

⚡ If You Lag (Quick Fixes)
Switch the profile to Medium or Low
Lower Shadow Quality (the biggest FPS cost)
Lower your render distance to 12-16 chunks`,
      thumbnail: '',
      bannerUrl: '',
      screenshots: [],
      tags: ['Iris', 'Fabric', 'Sodium', 'PBR'],
      minecraftVersionText: 'Minecraft 1.16 - 26.3 Compatible',
      workingEnvironment: 'Both',
      youtubeUrl: '',
      bugReportUrl: 'https://discord.gg/GtgvcCxXXU',
      isPremium: false,
      price: 0,
      downloads: 0,
      rating: 0,
      ratingCount: 0,
      userRatings: {},
      files: [],
      versions: [
        {
          id: 'v1',
          version: 'v1.0',
          loader: 'Iris',
          game: '1.21.4',
          date: new Date().toISOString().slice(0, 10),
        },
      ],
    };
  });

  const [tagsInput, setTagsInput] = useState(() => (formData.tags || []).slice(0, 4).join(', '));
  const [tagError, setTagError] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Description Embed Helper Modal state
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [selectedEmbedType, setSelectedEmbedType] = useState<
    'youtube' | 'discord' | 'image' | 'feature' | 'info' | 'warning' | 'tip' | 'specs' | 'button'
  >('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedTitle, setEmbedTitle] = useState('');
  const [embedBody, setEmbedBody] = useState('');

  if (!isOpen) return null;

  const insertText = (snippet: string) => {
    const current = formData.description || '';
    setFormData({
      ...formData,
      description: current + (current.endsWith('\n') ? '' : '\n\n') + snippet + '\n',
    });
  };

  const handleInsertEmbed = () => {
    let snippet = '';
    if (selectedEmbedType === 'youtube') {
      const url = embedUrl.trim() || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      snippet = `[embed:youtube:${url}]`;
    } else if (selectedEmbedType === 'discord') {
      const url = embedUrl.trim() || 'https://discord.gg/GtgvcCxXXU';
      snippet = `[embed:discord:${url}]`;
    } else if (selectedEmbedType === 'image') {
      const url = embedUrl.trim() || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23';
      const caption = embedTitle.trim() || 'Cinematic ray traced visual showcase';
      snippet = `[embed:image:${url}|${caption}]`;
    } else if (selectedEmbedType === 'feature') {
      const title = embedTitle.trim() || '💎 Glowing Ores & Dynamic Lighting';
      const body = embedBody.trim() || 'Every ore block glows with custom ambient bounce and specular reflections in total darkness.';
      snippet = `:::feature\n**${title}**\n${body}\n:::`;
    } else if (selectedEmbedType === 'info') {
      const title = embedTitle.trim() || 'ℹ️ Important Installation Notice';
      const body = embedBody.trim() || 'Put the downloaded .zip into .minecraft/shaderpacks. Works on Minecraft 1.16 through 26.3.';
      snippet = `:::info\n**${title}**\n${body}\n:::`;
    } else if (selectedEmbedType === 'warning') {
      const title = embedTitle.trim() || '⚠️ Bug Reports & Community Support';
      const body = embedBody.trim() || '"is any bug find please join our discord server and fix them"';
      snippet = `:::warning\n**${title}**\n${body}\n:::`;
    } else if (selectedEmbedType === 'tip') {
      const title = embedTitle.trim() || '⚡ Maximum Performance Tip';
      const body = embedBody.trim() || 'Lower Shadow Quality to Medium and render distance to 12 chunks for an instant +40 FPS boost!';
      snippet = `:::tip\n**${title}**\n${body}\n:::`;
    } else if (selectedEmbedType === 'specs') {
      const title = embedTitle.trim() || '📋 System Requirements';
      const body = embedBody.trim() || 'RAM: 4GB+ • GPU: GTX 1060 / RX 580 or better • Modloader: Fabric / Iris';
      snippet = `:::specs\n**${title}**\n${body}\n:::`;
    } else if (selectedEmbedType === 'button') {
      const label = embedTitle.trim() || 'Join Official Discord Server';
      const url = embedUrl.trim() || 'https://discord.gg/GtgvcCxXXU';
      snippet = `[embed:button:${label}|${url}]`;
    }

    insertText(snippet);
    setEmbedModalOpen(false);
    setEmbedUrl('');
    setEmbedTitle('');
    setEmbedBody('');
  };

  // Upload Banner (png, jpg, jpeg, gif)
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, bannerUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Upload Screenshots (multiple files, unlimited, png, jpg, jpeg, gif)
  const handleScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          screenshots: [...(prev.screenshots || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove Screenshot
  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots?.filter((_, i) => i !== index),
    }));
  };

  // Upload files for versions: supports .zip, .jar, .mrpack, .mcpack, .mcaddon, .mcworld
  const handleVersionFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1] || (reader.result as string);
        const newFile: ProjectFile = {
          id: 'file_' + Math.random().toString(36).substring(2, 9),
          fileName: file.name,
          title: file.name.replace(/\.[^/.]+$/, ''),
          fileSize: file.size,
          fileData: base64Data,
          versions: ['1.21.4'],
          description: 'Stable release compatible with Iris & Sodium.',
          youtubeUrl: formData.youtubeUrl || '',
          bugReportUrl: formData.bugReportUrl || 'https://discord.gg/GtgvcCxXXU',
          isPremium: false,
          price: 0,
          workingEnvironment: formData.workingEnvironment || 'Both',
          versionName: 'v1.0',
          uploadDate: new Date().toISOString().slice(0, 10),
        };

        setFormData((prev) => ({
          ...prev,
          files: [...(prev.files || []), newFile],
          fileName: prev.fileName || file.name,
          fileData: prev.fileData || base64Data,
          fileSize: prev.fileSize || file.size,
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Manual Version Box
  const handleAddVersion = () => {
    const newVersionBox: ProjectFile = {
      id: 'file_' + Math.random().toString(36).substring(2, 9),
      fileName: `${formData.title ? formData.title.replace(/\s+/g, '_') : 'Release'}_v${(formData.files?.length || 0) + 1}.zip`,
      title: `${formData.title || 'Version'} Release`,
      fileSize: 1048576,
      versions: ['1.21.4'],
      description: 'Public release build.',
      youtubeUrl: formData.youtubeUrl || '',
      bugReportUrl: formData.bugReportUrl || 'https://discord.gg/GtgvcCxXXU',
      isPremium: false,
      price: 0,
      workingEnvironment: formData.workingEnvironment || 'Both',
      versionName: `v${(formData.files?.length || 0) + 1}.0`,
      uploadDate: new Date().toISOString().slice(0, 10),
    };

    setFormData((prev) => ({
      ...prev,
      files: [...(prev.files || []), newVersionBox],
    }));
  };

  // Update a specific version in files array
  const handleUpdateFileVersion = (index: number, updated: Partial<ProjectFile>) => {
    setFormData((prev) => {
      const files = [...(prev.files || [])];
      files[index] = { ...files[index], ...updated };
      return { ...prev, files };
    });
  };

  // Remove Version Box
  const handleRemoveVersion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index),
    }));
  };

  const handleTagsChange = (val: string) => {
    const list = val.split(',').map((t) => t.trim()).filter(Boolean);
    if (list.length > 4) {
      setTagError('Maximum 4 tags allowed for search!');
    } else {
      setTagError('');
    }
    setTagsInput(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .slice(0, 4); // strict max 4 limit

    onSaveProject({
      ...formData,
      tags: parsedTags,
      rating: typeof formData.rating === 'number' ? formData.rating : 0,
      ratingCount: typeof formData.ratingCount === 'number' ? formData.ratingCount : 0,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-studio-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
          isWood
            ? 'border-[#7a4624] bg-[#fbf6ee] text-[#2b180d]'
            : 'border-emerald-500/30 bg-[#0c1811] text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isWood ? 'bg-[#7a4624] text-white' : 'bg-emerald-400 text-black shadow-lg shadow-emerald-950/40'
            }`}>
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="creator-studio-title" className="text-base font-black uppercase pixel-font tracking-tight text-emerald-400">
                {editingProject ? 'EDIT PROJECT' : 'UPLOAD NEW PROJECT'}
              </h3>
              <p className={`text-xs ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                Add title, description, versions (.zip, .jar, .mrpack), screenshots & banner
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl border border-white/10 hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Discord Bug Notice at top of dashboard */}
        <div className="px-6 py-2.5 bg-indigo-950/40 border-b border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">
              &quot;is any bug find please join our discord server and fix them&quot;
            </span>
          </div>
          <a
            href="https://discord.gg/GtgvcCxXXU"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition inline-flex items-center gap-1.5 shrink-0"
          >
            <span>Join Discord</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-2 border-b border-black/10 dark:border-white/10 flex items-center gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'edit'
                ? isWood
                  ? 'border-[#7a4624] text-[#7a4624]'
                  : 'border-emerald-400 text-emerald-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Project Details & Versions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'preview'
                ? isWood
                  ? 'border-[#7a4624] text-[#7a4624]'
                  : 'border-emerald-400 text-emerald-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Description & Divider Preview</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'edit' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* TITLE & CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Crownlight Shaders 2026 or King's RPG"
                    className={`w-full rounded-2xl border p-3 text-sm outline-none transition font-medium ${
                      isWood
                        ? 'border-[#7a4624]/30 bg-white text-[#2b180d] focus:border-[#7a4624]'
                        : 'border-white/10 bg-black/50 text-white focus:border-emerald-400'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                    Category Type
                  </label>
                  <select
                    value={formData.type || 'Shaders'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className={`w-full rounded-2xl border p-3 text-sm outline-none transition font-medium ${
                      isWood
                        ? 'border-[#7a4624]/30 bg-white text-[#2b180d]'
                        : 'border-white/10 bg-black/50 text-white'
                    }`}
                  >
                    <option value="Shaders">Shaders</option>
                    <option value="Mods">Mods</option>
                    <option value="Modpacks">Modpacks</option>
                    <option value="Resource Packs">Resource Packs</option>
                    <option value="Addons">Addons</option>
                  </select>
                </div>
              </div>

              {/* UPLOADING BANNER */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-90 flex items-center justify-between">
                  <span>Uploading Banner (support file PNG, JPEG, GIF):</span>
                  <span className="text-[11px] font-normal opacity-60">High-res header banner</span>
                </label>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    id="banner-file-input"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="banner-file-input"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition border border-emerald-500/30 shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Banner File (PNG, JPG, GIF)</span>
                  </label>

                  <input
                    type="text"
                    value={formData.bannerUrl || ''}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    placeholder="or paste image URL: https://..."
                    className={`flex-1 rounded-xl border p-2.5 text-xs outline-none ${
                      isWood ? 'bg-white/70 border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                </div>

                {formData.bannerUrl && (
                  <div className="relative aspect-video max-h-36 rounded-2xl overflow-hidden border border-white/10 mt-2">
                    <img src={formData.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, bannerUrl: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white hover:bg-red-600 transition"
                      title="Remove banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* UPLOADING SCREENSHOTS (NO LIMIT) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                    Uploading Screenshots (support PNG, JPEG, GIF - multiple picture files, no limit):
                  </label>
                  <span className="text-[11px] font-mono opacity-60">
                    {formData.screenshots?.length || 0} pictures added
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    id="screenshots-file-input"
                    onChange={handleScreenshotsUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="screenshots-file-input"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-xs hover:bg-blue-500/30 transition border border-blue-500/30 shrink-0"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Add Screenshots (Multiple Files)</span>
                  </label>
                </div>

                {/* Screenshots Gallery Preview */}
                {formData.screenshots && formData.screenshots.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.screenshots.map((shot, sIdx) => (
                      <div key={sIdx} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                        <img src={shot} alt={`Screenshot ${sIdx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(sIdx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-red-400 hover:bg-red-600 hover:text-white transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DESCRIPTION & FORMATTING WITH RICH EMBEDS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Description & Rich Embeds :</span>
                  </label>
                  <span className="text-[11px] opacity-60">
                    Use embeds &amp; <code>---</code> dividers for clean presentation
                  </span>
                </div>

                {/* Helper Embed & Insert Buttons Bar */}
                <div className={`p-2.5 rounded-2xl border space-y-2 text-xs ${
                  isWood ? 'bg-[#ebdcc6]/40 border-[#7a4624]/20' : 'bg-black/40 border-white/10'
                }`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-black pixel-font text-emerald-400">
                      🎨 EMBED PRESETS &amp; OPTIONS:
                    </span>
                    <button
                      type="button"
                      onClick={() => setEmbedModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-400 text-black font-black text-[10px] uppercase pixel-font hover:bg-emerald-300 transition flex items-center gap-1 shadow"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>+ Custom Embed Builder</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* YouTube Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmbedType('youtube');
                        setEmbedModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 text-[11px] font-bold flex items-center gap-1.5 transition"
                      title="Embed playable YouTube Video"
                    >
                      <Film className="w-3.5 h-3.5 text-red-400" />
                      <span>🎬 YouTube Embed</span>
                    </button>

                    {/* Discord Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        insertText('[embed:discord:https://discord.gg/GtgvcCxXXU]');
                      }}
                      className="px-2.5 py-1 rounded-xl bg-[#5865F2]/20 text-[#8ea1e1] hover:bg-[#5865F2]/30 border border-[#5865F2]/30 text-[11px] font-bold flex items-center gap-1.5 transition"
                      title="Embed Discord Community Card"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#5865F2]" />
                      <span>💬 Discord Embed</span>
                    </button>

                    {/* Image / GIF Embed */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmbedType('image');
                        setEmbedModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1.5 transition"
                      title="Embed Image or GIF with caption"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>🖼️ Image/GIF</span>
                    </button>

                    {/* Feature Card */}
                    <button
                      type="button"
                      onClick={() => insertText(':::feature\n💎 **Glowing Ores & Dynamic Lighting**\nEvery ore block glows with custom ambient bounce and specular reflections in total darkness.\n:::')}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>💎 Feature Card</span>
                    </button>

                    {/* Info Card */}
                    <button
                      type="button"
                      onClick={() => insertText(':::info\nℹ️ **Important Compatibility Info**\nTested with Iris 1.11+ and Sodium on Minecraft 1.16 through 26.3.\n:::')}
                      className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>ℹ️ Info Card</span>
                    </button>

                    {/* Warning Card */}
                    <button
                      type="button"
                      onClick={() => insertText(':::warning\n⚠️ **Bug Reports Notice**\n"is any bug find please join our discord server and fix them"\n:::')}
                      className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>⚠️ Warning Card</span>
                    </button>

                    {/* Pro Tip Card */}
                    <button
                      type="button"
                      onClick={() => insertText(':::tip\n⚡ **High FPS Boost Tip**\nLower Shadow Quality to Medium and render distance to 12-16 chunks for an instant +40 FPS boost!\n:::')}
                      className="px-2.5 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>⚡ Pro Tip</span>
                    </button>

                    {/* Specs Card */}
                    <button
                      type="button"
                      onClick={() => insertText(':::specs\nRAM: 4GB+ • GPU: GTX 1060 / RX 580+ • Modloader: Iris / Fabric\n:::')}
                      className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>📋 Specs Card</span>
                    </button>

                    {/* Button Embed */}
                    <button
                      type="button"
                      onClick={() => insertText('[embed:button:Download Latest Release|https://discord.gg/GtgvcCxXXU]')}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Link className="w-3.5 h-3.5 text-emerald-400" />
                      <span>🔘 Action Button</span>
                    </button>

                    {/* Divider */}
                    <button
                      type="button"
                      onClick={() => insertText('---')}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold transition"
                    >
                      + Divider (---)
                    </button>
                  </div>
                </div>

                <textarea
                  rows={9}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description here... Use embed buttons above to embed YouTube videos, Discord cards, images, and notice boxes!"
                  className={`w-full rounded-2xl border p-3.5 text-xs font-mono leading-relaxed outline-none transition ${
                    isWood
                      ? 'border-[#7a4624]/30 bg-white text-[#2b180d] focus:border-[#7a4624]'
                      : 'border-white/10 bg-black/40 text-white focus:border-emerald-400'
                  }`}
                />
              </div>

              {/* VERSIONS (UPLOAD FILES: ZIP, JAR, MRPACK, MCPACK, MCADDON, MCWORLD) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>Versions & Release Files</span>
                    </h4>
                    <p className={`text-xs mt-0.5 ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                      Upload multiple files (.zip, .jar, .mrpack, .mcpack, .mcaddon, .mcworld). Each file pops out an individual version box!
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      multiple
                      accept=".zip,.jar,.mrpack,.mcpack,.mcaddon,.mcworld"
                      id="version-files-input"
                      onChange={handleVersionFilesUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="version-files-input"
                      className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-400 text-black font-black text-xs uppercase hover:bg-emerald-300 transition shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Files</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleAddVersion}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                        isWood
                          ? 'border-[#7a4624]/40 bg-white text-[#7a4624]'
                          : 'border-white/10 bg-black/40 text-zinc-300 hover:text-white'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>add version</span>
                    </button>
                  </div>
                </div>

                {/* Individual Version Boxes */}
                {formData.files && formData.files.length > 0 ? (
                  <div className="space-y-4">
                    {formData.files.map((vFile, fIdx) => (
                      <div
                        key={vFile.id || fIdx}
                        className={`p-5 rounded-2xl border transition space-y-4 ${
                          isWood
                            ? 'border-[#7a4624]/30 bg-white/80'
                            : 'border-emerald-500/25 bg-black/50'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 font-mono">
                              Version #{fIdx + 1}
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-300 truncate max-w-xs">
                              {vFile.fileName}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveVersion(fIdx)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
                            title="Delete this version box"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title of this version */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold opacity-80">
                            title :
                          </label>
                          <input
                            type="text"
                            value={vFile.title || ''}
                            onChange={(e) => handleUpdateFileVersion(fIdx, { title: e.target.value })}
                            placeholder="e.g. Crownlight Shaders v1.2 Release"
                            className={`w-full rounded-xl border p-2 text-xs outline-none ${
                              isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                            }`}
                          />
                        </div>

                        {/* Java and Bedrock Versions Selectors */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Java Versions */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-emerald-400">
                              versions : (Select JAVA VERSIONS)
                            </label>
                            <select
                              value={vFile.versions?.[0] || '1.21.4'}
                              onChange={(e) => handleUpdateFileVersion(fIdx, { versions: [e.target.value] })}
                              className={`w-full rounded-xl border p-2 text-xs outline-none ${
                                isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                              }`}
                            >
                              {JAVA_VERSIONS.map((v) => (
                                <option key={v} value={v}>
                                  Java {v}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Bedrock Versions */}
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-blue-400">
                              BEDROCK VERSIONS :
                            </label>
                            <select
                              onChange={(e) => {
                                const current = vFile.versions || [];
                                handleUpdateFileVersion(fIdx, { versions: [...current, `Bedrock ${e.target.value}`] });
                              }}
                              className={`w-full rounded-xl border p-2 text-xs outline-none ${
                                isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                              }`}
                            >
                              <option value="">Select Bedrock Version (Optional)...</option>
                              {BEDROCK_VERSIONS.map((v) => (
                                <option key={v} value={v}>
                                  Bedrock {v}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Version Description / Notes */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold opacity-80">
                            description :
                          </label>
                          <input
                            type="text"
                            value={vFile.description || ''}
                            onChange={(e) => handleUpdateFileVersion(fIdx, { description: e.target.value })}
                            placeholder="Version notes, changelog details, or requirements"
                            className={`w-full rounded-xl border p-2 text-xs outline-none ${
                              isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                            }`}
                          />
                        </div>

                        {/* Version YouTube & Bug Reports */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold opacity-80 flex items-center gap-1.5">
                              <Film className="w-3.5 h-3.5 text-red-400" />
                              <span>Youtube video triler :</span>
                            </label>
                            <input
                              type="text"
                              value={vFile.youtubeUrl || ''}
                              onChange={(e) => handleUpdateFileVersion(fIdx, { youtubeUrl: e.target.value })}
                              placeholder="https://youtube.com/watch?v=..."
                              className={`w-full rounded-xl border p-2 text-xs outline-none ${
                                isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                              }`}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold opacity-80 flex items-center gap-1.5">
                              <Bug className="w-3.5 h-3.5 text-red-400" />
                              <span>bugs reports :</span>
                            </label>
                            <input
                              type="text"
                              value={vFile.bugReportUrl || ''}
                              onChange={(e) => handleUpdateFileVersion(fIdx, { bugReportUrl: e.target.value })}
                              placeholder="https://discord.gg/GtgvcCxXXU"
                              className={`w-full rounded-xl border p-2 text-xs outline-none ${
                                isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Paid or Free & Works */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold opacity-80">
                              Paid or free :
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleUpdateFileVersion(fIdx, { isPremium: false, price: 0 })}
                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                  !vFile.isPremium
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                    : 'border-white/10 opacity-60'
                                }`}
                              >
                                Free
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateFileVersion(fIdx, { isPremium: true, price: 4.99 })}
                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                  vFile.isPremium
                                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                    : 'border-white/10 opacity-60'
                                }`}
                              >
                                VIP Paid
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-xs font-bold opacity-80">
                              Works :
                            </label>
                            <select
                              value={vFile.workingEnvironment || 'Both'}
                              onChange={(e) => handleUpdateFileVersion(fIdx, { workingEnvironment: e.target.value as any })}
                              className={`w-full rounded-xl border p-2 text-xs outline-none ${
                                isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                              }`}
                            >
                              <option value="Both">Both (Client & Server)</option>
                              <option value="Client side only">Client side only</option>
                              <option value="Server only">Server only</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-dashed border-zinc-700 text-center space-y-2">
                    <p className="text-xs text-zinc-400">
                      No versions added yet. Click &quot;Upload Files&quot; or &quot;add version&quot; above to create version boxes.
                    </p>
                  </div>
                )}
              </div>

              {/* PROJECT LEVEL EXTRA FIELDS */}
              <div className="space-y-4 pt-2 border-t border-white/10">
                {/* Youtube trailer videos link */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-90 flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-red-400" />
                    <span>Youtube triler videos link :</span>
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeUrl || ''}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full rounded-xl border p-2.5 text-xs outline-none ${
                      isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                </div>

                {/* BUGS REPORTS (clickable working link) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Bug className="w-4 h-4 text-emerald-400" />
                    <span>BUGS REPORTS (make space to add clickable working link) :</span>
                  </label>
                  <input
                    type="text"
                    value={formData.bugReportUrl || ''}
                    onChange={(e) => setFormData({ ...formData, bugReportUrl: e.target.value })}
                    placeholder="https://discord.gg/GtgvcCxXXU"
                    className={`w-full rounded-xl border p-2.5 text-xs outline-none ${
                      isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                </div>

                {/* Works (Client side only | Server only | Both) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                    Works :
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Client side only', 'Server only', 'Both'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setFormData({ ...formData, workingEnvironment: opt as any })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                          formData.workingEnvironment === opt
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'border-white/10 opacity-60'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags for search (limit 4) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider opacity-90 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tags for search (must limit add tags is 4) :</span>
                    </label>
                    <span className="text-[11px] font-mono text-zinc-400">Max 4 tags</span>
                  </div>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="Iris, Fabric, Sodium, PBR"
                    className={`w-full rounded-xl border p-2.5 text-xs outline-none ${
                      isWood ? 'bg-white border-[#7a4624]/30' : 'bg-black/40 border-white/10 text-white'
                    }`}
                  />
                  {tagError && <p className="text-[11px] text-red-400 font-bold">{tagError}</p>}
                </div>

                {/* is this project paid or free? */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider opacity-90 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    <span>is this project paid or free?</span>
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isPremium: false, price: 0 })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                        !formData.isPremium
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'border-white/10 opacity-60'
                      }`}
                    >
                      100% Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isPremium: true, price: 4.99 })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                        formData.isPremium
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'border-white/10 opacity-60'
                      }`}
                    >
                      VIP Premium ($4.99)
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Publish Button */}
              <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                {editingProject && (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Project</span>
                  </button>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase pixel-font tracking-tight bg-emerald-400 text-black hover:bg-emerald-300 transition flex items-center gap-2 shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Publish</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  This live preview shows exactly how dividers (<code>---</code>), highlight sections, and profile tiers appear to your visitors!
                </span>
              </div>

              <div className={`p-6 rounded-3xl border ${
                isWood ? 'bg-[#fbf6ee] border-[#7a4624]/20' : 'bg-[#09140d] border-emerald-500/20'
              }`}>
                <ProjectDescriptionView
                  description={formData.description || ''}
                  isWood={isWood}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {editingProject && (
        <DeleteConfirmModal
          isOpen={confirmDelete}
          project={editingProject}
          onConfirm={() => {
            onDeleteProject(editingProject.id);
            setConfirmDelete(false);
            onClose();
          }}
          onCancel={() => setConfirmDelete(false)}
          theme={theme}
        />
      )}

      {/* CUSTOM EMBED BUILDER MODAL */}
      {embedModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setEmbedModalOpen(false)}
        >
          <div
            className={`relative w-full max-w-lg rounded-3xl border-2 p-6 shadow-2xl transition-all ${
              isWood
                ? 'border-[#7a4624] bg-[#2b160c] text-[#fbebd8]'
                : 'border-emerald-500/40 bg-[#0a1810] text-white shadow-emerald-950/60'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xs font-black pixel-font uppercase text-emerald-400">
                  CUSTOM EMBED BUILDER
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEmbedModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embed Type Selector Chips */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider opacity-80 mb-2">
                  Select Embed Type :
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                  {[
                    { id: 'youtube', label: '🎬 YouTube', color: 'text-red-400' },
                    { id: 'discord', label: '💬 Discord', color: 'text-[#8ea1e1]' },
                    { id: 'image', label: '🖼️ Image/GIF', color: 'text-blue-400' },
                    { id: 'feature', label: '💎 Feature', color: 'text-emerald-400' },
                    { id: 'info', label: 'ℹ️ Info Box', color: 'text-blue-300' },
                    { id: 'warning', label: '⚠️ Warning', color: 'text-amber-400' },
                    { id: 'tip', label: '⚡ Pro Tip', color: 'text-yellow-400' },
                    { id: 'specs', label: '📋 Specs', color: 'text-purple-400' },
                    { id: 'button', label: '🔘 Button', color: 'text-emerald-300' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedEmbedType(t.id as any)}
                      className={`p-2 rounded-xl border text-center transition ${
                        selectedEmbedType === t.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm'
                          : 'border-white/10 bg-black/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={t.color}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL or Main Input */}
              {(selectedEmbedType === 'youtube' ||
                selectedEmbedType === 'discord' ||
                selectedEmbedType === 'image' ||
                selectedEmbedType === 'button') && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold opacity-90">
                    {selectedEmbedType === 'youtube'
                      ? 'YouTube Video Link :'
                      : selectedEmbedType === 'discord'
                      ? 'Discord Invite Link :'
                      : selectedEmbedType === 'image'
                      ? 'Image or GIF URL :'
                      : 'Button Target Link :'}
                  </label>
                  <input
                    type="text"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder={
                      selectedEmbedType === 'youtube'
                        ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                        : selectedEmbedType === 'discord'
                        ? 'https://discord.gg/GtgvcCxXXU'
                        : selectedEmbedType === 'image'
                        ? 'https://example.com/screenshot.png'
                        : 'https://...'
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              )}

              {/* Title / Caption / Label Input */}
              {(selectedEmbedType === 'image' ||
                selectedEmbedType === 'feature' ||
                selectedEmbedType === 'info' ||
                selectedEmbedType === 'warning' ||
                selectedEmbedType === 'tip' ||
                selectedEmbedType === 'specs' ||
                selectedEmbedType === 'button') && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold opacity-90">
                    {selectedEmbedType === 'image'
                      ? 'Image Caption (Optional) :'
                      : selectedEmbedType === 'button'
                      ? 'Button Label :'
                      : 'Embed Card Title :'}
                  </label>
                  <input
                    type="text"
                    value={embedTitle}
                    onChange={(e) => setEmbedTitle(e.target.value)}
                    placeholder={
                      selectedEmbedType === 'image'
                        ? 'Cinematic ray traced sky at sunset'
                        : selectedEmbedType === 'button'
                        ? 'Download Latest Release'
                        : 'Custom Title...'
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              {/* Body Text for cards */}
              {(selectedEmbedType === 'feature' ||
                selectedEmbedType === 'info' ||
                selectedEmbedType === 'warning' ||
                selectedEmbedType === 'tip' ||
                selectedEmbedType === 'specs') && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold opacity-90">
                    Content / Message Details :
                  </label>
                  <textarea
                    rows={3}
                    value={embedBody}
                    onChange={(e) => setEmbedBody(e.target.value)}
                    placeholder="Enter details text..."
                    className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white outline-none focus:border-emerald-400 leading-relaxed font-sans"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEmbedModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-white/10 text-zinc-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertEmbed}
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 text-black font-black uppercase text-xs pixel-font tracking-tight hover:bg-emerald-300 transition shadow-lg shadow-emerald-950/60 flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Insert Embed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
