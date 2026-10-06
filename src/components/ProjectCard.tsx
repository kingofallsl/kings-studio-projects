import React, { useState } from 'react';
import { Download, Play, Eye, Sparkles, HardDrive, CheckCircle2, Trash2, Edit3, AlertTriangle } from 'lucide-react';
import { Project } from '../types.ts';
import { StarRating } from './StarRating.tsx';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onDownload: (project: Project) => void;
  onRate: (projectId: string, star: number) => void;
  onWatchTrailer?: (url: string) => void;
  userRating?: number;
  theme?: 'emerald' | 'wood';
  isAdmin?: boolean;
  onDelete?: (projectId: string) => void;
  onEdit?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onDownload,
  onRate,
  onWatchTrailer,
  userRating,
  theme = 'emerald',
  isAdmin = false,
  onDelete,
  onEdit,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const isWood = theme === 'wood';

  // Preview clean description without markdown clutter
  const cleanDescription = project.description
    .replace(/^👑.*?\n/m, '')
    .replace(/[•\-*·#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <div
      onClick={() => onSelect(project)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer hover:-translate-y-1.5 shadow-lg ${
        isWood
          ? 'border-[#7a4624]/30 bg-[#fbf6ee] hover:border-[#7a4624] hover:shadow-2xl hover:shadow-[#7a4624]/20'
          : 'border-white/10 bg-[#0a150e]/90 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-950/50'
      }`}
    >
      {/* Inline Delete Confirmation Overlay on Card */}
      {showConfirmDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center animate-fade-in"
        >
          <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 mb-3 border border-red-500/30">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <h4 className="text-xs font-black pixel-font text-white uppercase mb-2">
            DELETE PROJECT?
          </h4>
          <p className="text-xs text-zinc-300 mb-4 line-clamp-2">
            Permanently remove &quot;{project.title}&quot;?
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirmDelete(false);
                if (onDelete) onDelete(project.id);
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-black uppercase pixel-font bg-red-600 text-white hover:bg-red-500 transition shadow-lg shadow-red-950"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div>
        {/* Card Thumbnail / Header Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
          {project.thumbnail || project.bannerUrl ? (
            <img
              src={project.thumbnail || project.bannerUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`h-full w-full flex items-center justify-center ${
              isWood ? 'bg-[#ebdcc6]' : 'bg-emerald-950/30'
            }`}>
              <Sparkles className="w-10 h-10 text-emerald-400 opacity-40 animate-pulse" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Type Badge & Version */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${
              isWood
                ? 'border-[#7a4624] bg-[#ebdcc6] text-[#7a4624]'
                : 'border-emerald-400/40 bg-emerald-500/20 text-emerald-300'
            }`}>
              {project.type}
            </span>
          </div>

          {/* Owner Quick Action Badges */}
          {isAdmin && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                  }}
                  className="p-1.5 rounded-lg bg-black/70 hover:bg-emerald-500 text-white hover:text-black border border-white/20 transition shadow"
                  title="Edit project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmDelete(true);
                  }}
                  className="p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white border border-white/20 transition shadow"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Quick downloads counter */}
          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            <span>{project.downloads || 0}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Star Rating Bar: starts at 0.0 */}
          <div className="mb-2">
            <StarRating
              rating={project.rating || 0}
              ratingCount={project.ratingCount || 0}
              userRating={userRating}
              onRate={(star) => onRate(project.id, star)}
              size="sm"
              showDetails={true}
              interactive={true}
              isWood={isWood}
            />
          </div>

          <h3 className={`text-base font-black pixel-font leading-snug tracking-tight transition-colors ${
            isWood ? 'text-[#2b180d] group-hover:text-[#7a4624]' : 'text-white group-hover:text-emerald-300'
          }`}>
            {project.title}
          </h3>

          <p className={`mt-2 text-xs line-clamp-3 leading-relaxed ${
            isWood ? 'text-[#5a361e]' : 'text-zinc-400'
          }`}>
            {cleanDescription || 'High performance project release for Minecraft.'}
          </p>

          {/* Specs pills */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px]">
            <span className={`flex items-center gap-1 font-mono ${
              isWood ? 'text-[#874b24]' : 'text-zinc-400'
            }`}>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{project.minecraftVersionText || '1.16 - 26.3'}</span>
            </span>

            {project.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isWood ? 'bg-black/5 text-[#5a361e]' : 'bg-white/5 text-zinc-400'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className={`p-4 pt-0 flex items-center justify-between gap-2 border-t ${
        isWood ? 'border-[#7a4624]/10' : 'border-white/5'
      } mt-2`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(project);
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
            isWood
              ? 'border-[#7a4624]/30 bg-white text-[#7a4624] hover:bg-[#7a4624]/10'
              : 'border-white/10 bg-black/40 text-zinc-300 hover:text-white hover:border-emerald-500/40'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload(project);
          }}
          className={`py-2 px-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow ${
            isWood
              ? 'bg-[#7a4624] text-white hover:bg-[#683b1f]'
              : 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-emerald-950/40'
          }`}
          title="Direct Download .zip"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};
