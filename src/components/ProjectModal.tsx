import React, { useState } from 'react';
import {
  X,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Bug,
  Play,
  FileCode,
  HardDrive,
  MessageSquare,
  Share2,
  Edit3,
  Trash2,
  ImageIcon,
} from 'lucide-react';
import { Project, ProjectFile } from '../types.ts';
import { StarRating } from './StarRating.tsx';
import { ProjectDescriptionView } from './ProjectDescriptionView.tsx';
import { DeleteConfirmModal } from './DeleteConfirmModal.tsx';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onRate: (projectId: string, star: number) => void;
  onDownloadFile: (file: ProjectFile, project: Project) => void;
  onDownloadProject: (project: Project) => void;
  onWatchTrailer?: (url: string) => void;
  userRating?: number;
  theme?: 'emerald' | 'wood';
  isAdmin?: boolean;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onPermissionDenied?: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onRate,
  onDownloadFile,
  onDownloadProject,
  onWatchTrailer,
  userRating,
  theme = 'emerald',
  isAdmin = false,
  onEditProject,
  onDeleteProject,
  onPermissionDenied,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'downloads' | 'screenshots' | 'profiles' | 'reviews'>('description');
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!project) return null;

  const isWood = theme === 'wood';

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const filesCount = project.files?.length || (project.fileName ? 1 : 0);
  const screenshotsCount = project.screenshots?.length || 0;

  const handleEditClick = () => {
    if (isAdmin && onEditProject) {
      onEditProject(project);
    } else if (onPermissionDenied) {
      onPermissionDenied();
    }
  };

  const handleDeleteClick = () => {
    if (isAdmin && onDeleteProject) {
      setShowDeleteModal(true);
    } else if (onPermissionDenied) {
      onPermissionDenied();
    }
  };

  const handleConfirmDelete = () => {
    if (onDeleteProject) {
      onDeleteProject(project.id);
      setShowDeleteModal(false);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border shadow-2xl transition-colors duration-200 ${
          isWood
            ? 'border-[#7a4624] bg-[#fbf6ee] text-[#2b180d]'
            : 'border-emerald-500/30 bg-[#09140d] text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* BANNER / HEADER HERO */}
        <div className="relative shrink-0 overflow-hidden border-b border-black/10 dark:border-white/10">
          {project.bannerUrl ? (
            <div className="h-44 sm:h-52 w-full relative">
              <img
                src={project.bannerUrl}
                alt={project.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isWood ? 'from-[#fbf6ee] via-[#fbf6ee]/60 to-transparent' : 'from-[#09140d] via-[#09140d]/70 to-transparent'
              }`} />
            </div>
          ) : project.thumbnail ? (
            <div className="h-32 sm:h-40 w-full relative">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover opacity-40 blur-sm"
                referrerPolicy="no-referrer"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isWood ? 'from-[#fbf6ee] to-transparent' : 'from-[#09140d] to-transparent'
              }`} />
            </div>
          ) : (
            <div className={`h-24 w-full ${isWood ? 'bg-[#ebdcc6]' : 'bg-emerald-950/30'}`} />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 p-2 rounded-2xl border transition hover:scale-105 active:scale-95 ${
              isWood
                ? 'border-[#7a4624]/40 bg-white/80 text-[#7a4624] hover:bg-white'
                : 'border-white/10 bg-black/60 text-zinc-300 hover:text-white hover:bg-black/80'
            }`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Rating lockup inside hero */}
          <div className="relative px-6 pb-4 -mt-12 sm:-mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isWood
                    ? 'border-[#7a4624]/30 bg-[#ebdcc6] text-[#7a4624]'
                    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                }`}>
                  {project.type}
                </span>

                <span className={`text-xs ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                  • Release {project.releaseDate}
                </span>

                {project.tags?.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                      isWood ? 'bg-black/5 text-[#5a361e]' : 'bg-white/5 text-zinc-400'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h2 id="project-modal-title" className="text-2xl sm:text-3xl font-black pixel-font tracking-tight leading-tight text-white">
                {project.title}
              </h2>

              {/* Star Rating row: starts at 0.0, updates on click */}
              <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                <StarRating
                  rating={project.rating || 0}
                  ratingCount={project.ratingCount || 0}
                  userRating={userRating}
                  onRate={(star) => onRate(project.id, star)}
                  size="md"
                  showDetails={true}
                  interactive={true}
                  isWood={isWood}
                />
              </div>
            </div>

            {/* Quick Actions in header */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-bold transition flex items-center gap-1.5"
                    title="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={handleShare}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isWood
                    ? 'border-[#7a4624]/30 bg-white/70 text-[#7a4624] hover:bg-white'
                    : 'border-white/10 bg-black/40 text-zinc-300 hover:text-white hover:bg-black/60'
                }`}
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={() => onDownloadProject(project)}
                className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase pixel-font tracking-tight flex items-center gap-2 shadow-lg transition hover:scale-[1.02] active:scale-95 ${
                  isWood
                    ? 'bg-[#7a4624] text-white hover:bg-[#683b1f]'
                    : 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-emerald-950/60'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Direct Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* QUICK SPECS BAR */}
        <div className={`px-6 py-2.5 border-b text-xs flex items-center gap-4 overflow-x-auto scrollbar-none font-medium ${
          isWood
            ? 'border-[#7a4624]/15 bg-[#ebdcc6]/40 text-[#5a361e]'
            : 'border-white/5 bg-black/40 text-zinc-400'
        }`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{project.minecraftVersionText || 'Minecraft 1.16 - 26.3'}</span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Iris, Sodium & Fabric Verified</span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
            <span>{project.downloads || 0} Downloads</span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Direct Web Download</span>
          </div>
        </div>

        {/* CROWNLIGHT SHADER DOWNLY DISCORD BUG NOTICE (Image 3 requirement) */}
        <div className="px-6 py-2 bg-indigo-950/40 border-b border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Bug className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>&quot;is any bug find please join our discord server and fix them&quot;</span>
          </div>
          <a
            href="https://discord.gg/GtgvcCxXXU"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold underline hover:text-white flex items-center gap-1 shrink-0"
          >
            <span>discord.gg/GtgvcCxXXU</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* SECTION TABS */}
        <div className={`px-6 pt-3 border-b flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-bold ${
          isWood ? 'border-[#7a4624]/20' : 'border-white/5 bg-black/20'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`pb-3 px-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'description'
                ? isWood
                  ? 'border-[#7a4624] text-[#7a4624]'
                  : 'border-emerald-400 text-emerald-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Description & Features</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('downloads')}
            className={`pb-3 px-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'downloads'
                ? isWood
                  ? 'border-[#7a4624] text-[#7a4624]'
                  : 'border-emerald-400 text-emerald-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Releases & Files ({filesCount})</span>
          </button>

          {screenshotsCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('screenshots')}
              className={`pb-3 px-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'screenshots'
                  ? isWood
                    ? 'border-[#7a4624] text-[#7a4624]'
                    : 'border-emerald-400 text-emerald-400'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Screenshots ({screenshotsCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`pb-3 px-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profiles'
                ? isWood
                  ? 'border-[#7a4624] text-[#7a4624]'
                  : 'border-emerald-400 text-emerald-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <span>Profiles & FPS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 px-2 border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reviews'
                ? isWood
                  ? 'border-[#7a4624] text-[#7a4624]'
                  : 'border-emerald-400 text-emerald-400'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ratings & Reviews ({project.ratingCount || 0})</span>
          </button>
        </div>

        {/* SCROLLABLE MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'description' && (
            <div>
              <ProjectDescriptionView
                description={project.description}
                isWood={isWood}
              />
            </div>
          )}

          {/* TAB 2: RELEASES & DIRECT WEB DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <h4 className="text-sm font-black uppercase pixel-font text-emerald-400">
                    Project Releases & Direct Web Download
                  </h4>
                  <p className={`text-xs mt-1 ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                    Click Direct Download to save the .zip, .jar, or .mrpack file directly into your Minecraft folder.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {filesCount} {filesCount === 1 ? 'Release File' : 'Release Files'}
                </span>
              </div>

              {/* Files List */}
              {project.files && project.files.length > 0 ? (
                <div className="space-y-3">
                  {project.files.map((file, idx) => (
                    <div
                      key={file.id || idx}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isWood
                          ? 'border-[#7a4624]/20 bg-white/70 hover:border-[#7a4624]/50'
                          : 'border-white/10 bg-black/40 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">
                            {file.title || file.fileName}
                          </span>
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300 uppercase font-black">
                            .{file.fileName.split('.').pop() || 'zip'}
                          </span>
                          <span className="rounded bg-blue-500/10 border border-blue-500/30 px-1.5 py-0.5 text-[10px] text-blue-300">
                            {file.workingEnvironment || 'Both'}
                          </span>
                          {file.isPremium ? (
                            <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.5 text-[10px] text-amber-300 font-bold">
                              VIP ${file.price?.toFixed(2) || '4.99'}
                            </span>
                          ) : (
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400 font-semibold">
                              Free Download
                            </span>
                          )}
                        </div>

                        <div className={`text-xs ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                          File: <span className="font-mono">{file.fileName}</span>
                          {file.fileSize && (
                            <span> • {(file.fileSize / 1048576).toFixed(2)} MB</span>
                          )}
                          {file.versions && file.versions.length > 0 && (
                            <span> • Versions: {file.versions.join(', ')}</span>
                          )}
                          {file.uploadDate && <span> • {file.uploadDate}</span>}
                        </div>

                        {file.description && (
                          <p className={`text-xs italic pt-1 ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
                            {file.description}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {file.bugReportUrl && (
                          <a
                            href={file.bugReportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                            title="Report Bug / Issue"
                          >
                            <Bug className="w-4 h-4" />
                          </a>
                        )}

                        {file.youtubeUrl && onWatchTrailer && (
                          <button
                            type="button"
                            onClick={() => onWatchTrailer(file.youtubeUrl!)}
                            className="p-2 rounded-xl border border-red-500/30 bg-red-600/20 text-red-300 hover:bg-red-600/30 transition"
                            title="Watch Showcase Video"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDownloadFile(file, project)}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase pixel-font tracking-tight flex items-center gap-1.5 transition ${
                            isWood
                              ? 'bg-[#7a4624] text-white hover:bg-[#683b1f]'
                              : 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-md shadow-emerald-950/40'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Direct Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : project.fileName ? (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between ${
                    isWood ? 'bg-white/80 border-[#7a4624]/20' : 'bg-black/40 border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="font-bold text-sm">{project.fileName}</span>
                      <div className={`text-xs ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                        {project.minecraftVersionText || 'Minecraft 1.16 - 26.3'}
                        {project.fileSize && ` • ${(project.fileSize / 1048576).toFixed(2)} MB`}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDownloadProject(project)}
                    className="px-4 py-2 rounded-xl text-xs font-black uppercase pixel-font tracking-tight bg-emerald-400 text-black hover:bg-emerald-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-dashed border-zinc-700 text-center text-xs text-zinc-400">
                  No downloadable files uploaded yet for this project.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCREENSHOTS GALLERY */}
          {activeTab === 'screenshots' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase pixel-font text-emerald-400">
                Project Screenshots Gallery ({screenshotsCount})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.screenshots?.map((shot, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 cursor-pointer group bg-black/40"
                    onClick={() => setPreviewImage(shot)}
                  >
                    <img
                      src={shot}
                      alt={`Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-xl bg-black/70 text-white text-xs font-bold">
                        Click to Expand
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILES & PERFORMANCE */}
          {activeTab === 'profiles' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-black uppercase pixel-font text-emerald-400 mb-1">
                  Preset Quality Profiles
                </h4>
                <p className={`text-xs ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                  Choose the profile that matches your hardware for optimum visual fidelity and framerate:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className={`p-4 rounded-2xl border ${
                  isWood ? 'bg-white/80 border-green-700/30' : 'bg-black/40 border-green-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="font-black text-xs uppercase text-green-400">🟢 Low Profile</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
                    Best for older PCs, laptops, and integrated graphics. Delivers 100+ FPS while retaining real water and sky colors.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isWood ? 'bg-white/80 border-amber-700/30' : 'bg-black/40 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="font-black text-xs uppercase text-amber-400">🟡 Medium Profile</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
                    Balanced looks and speed. Beautiful soft shadows, waving water ripples, and glowing ores at 75-120 FPS.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isWood ? 'bg-white/80 border-blue-700/30' : 'bg-black/40 border-blue-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-blue-400" />
                    <span className="font-black text-xs uppercase text-blue-400">🔵 High Profile</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
                    Recommended for most modern gaming GPUs (RTX 2060 / RX 6600+). Full godrays and atmospheric depth.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isWood ? 'bg-white/80 border-purple-700/30' : 'bg-black/40 border-purple-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                    <span className="font-black text-xs uppercase text-purple-400">🟣 Ultra Profile</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
                    For high-end gaming rigs and cinematic photography. Maximum shadow distance, volumetric fog, and PBR water reflections.
                  </p>
                </div>
              </div>

              {/* Lag Fixes Card */}
              <div className={`p-5 rounded-2xl border ${
                isWood ? 'border-amber-600/30 bg-amber-50' : 'border-amber-500/30 bg-amber-950/20'
              }`}>
                <h5 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5 mb-2">
                  <span>⚡ Quick Fixes If You Experience Framerate Drops</span>
                </h5>
                <ul className={`space-y-1.5 text-xs ${isWood ? 'text-amber-900' : 'text-amber-200'}`}>
                  <li>• Switch shader profile to Medium or Low</li>
                  <li>• Lower Shadow Quality in Shader Settings (biggest FPS booster)</li>
                  <li>• Lower render distance to 12-16 chunks in Video Settings</li>
                  <li>• Ensure Sodium and Iris are updated to the latest builds</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: RATINGS & REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-black/30">
                <div>
                  <h4 className="text-sm font-black uppercase pixel-font text-emerald-400 mb-1">
                    Community Star Rating
                  </h4>
                  <p className={`text-xs ${isWood ? 'text-[#874b24]' : 'text-zinc-400'}`}>
                    Click any star below to update your rating. Your vote calculates into the live score!
                  </p>
                </div>

                <div className="flex flex-col items-start sm:items-end">
                  <StarRating
                    rating={project.rating || 0}
                    ratingCount={project.ratingCount || 0}
                    userRating={userRating}
                    onRate={(star) => onRate(project.id, star)}
                    size="lg"
                    showDetails={true}
                    interactive={true}
                    isWood={isWood}
                  />
                  <span className="text-[11px] text-zinc-400 mt-1">
                    {project.ratingCount === 0
                      ? 'No ratings yet — be the first to rate!'
                      : `${project.rating.toFixed(1)} out of 5 based on ${project.ratingCount} vote${project.ratingCount === 1 ? '' : 's'}`}
                  </span>
                </div>
              </div>

              {/* Discord Bug Notice */}
              <div className={`p-4 rounded-2xl border text-xs ${
                isWood ? 'border-[#7a4624]/20 bg-[#ebdcc6]/30 text-[#5a361e]' : 'border-white/5 bg-black/20 text-zinc-400'
              }`}>
                <p>
                  💬 &quot;is any bug find please join our discord server and fix them&quot;
                </p>
                <div className="mt-3">
                  <a
                    href="https://discord.gg/GtgvcCxXXU"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Official Discord Server</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL BOTTOM BAR */}
        <div className={`px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          isWood
            ? 'border-[#7a4624]/20 bg-[#ebdcc6]/30 text-[#5a361e]'
            : 'border-white/10 bg-black/50 text-zinc-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-mono text-emerald-400">King&apos;s Studio Projects</span>
            <span>•</span>
            <span>All rights reserved © 2026</span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                isWood ? 'hover:bg-black/5 text-[#7a4624]' : 'hover:bg-white/10 text-zinc-300'
              }`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onDownloadProject(project)}
              className="px-5 py-2.5 rounded-xl font-black uppercase pixel-font tracking-tight bg-emerald-400 text-black hover:bg-emerald-300 transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Screenshot Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img src={previewImage} alt="Expanded Screenshot" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-red-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        project={project}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        theme={theme}
      />
    </div>
  );
};
