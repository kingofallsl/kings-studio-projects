import React, { useEffect, useState } from 'react';
import { Eye, Bell, X, Sparkles, ExternalLink } from 'lucide-react';
import { Project } from '../types.ts';

interface NewProjectBroadcastBannerProps {
  project: Project | null;
  onViewProject: (project: Project) => void;
  onDismiss: () => void;
  theme?: 'emerald' | 'wood';
}

export const NewProjectBroadcastBanner: React.FC<NewProjectBroadcastBannerProps> = ({
  project,
  onViewProject,
  onDismiss,
  theme = 'emerald',
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!project) return;
    setProgress(100);

    const totalMs = 14000;
    const intervalMs = 100;
    const step = (intervalMs / totalMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return Math.max(0, prev - step);
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [project, onDismiss]);

  if (!project) return null;

  const isWood = theme === 'wood';

  return (
    <aside
      aria-label="New project alert"
      className="fixed top-18 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-xl animate-bounce-gentle shadow-2xl"
    >
      <div
        className={`relative overflow-hidden rounded-3xl border-2 p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 shadow-[0_12px_40px_rgba(0,0,0,0.8)] ${
          isWood
            ? 'bg-[#331c10]/95 border-[#d49b6a] text-[#fbebd8]'
            : 'bg-[#08180e]/95 border-emerald-400 text-white shadow-emerald-950/80'
        }`}
      >
        {/* Glow backdrop pulse */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 ${
            isWood ? 'bg-amber-500' : 'bg-emerald-400'
          }`}
        />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase pixel-font tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              👑 LIVE BROADCAST
            </span>
            <span className="text-xs text-zinc-400 hidden sm:inline">• Just published</span>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Message Title */}
        <div className="space-y-1 mb-3">
          <h4 className="text-sm sm:text-base font-black pixel-font leading-snug tracking-tight text-white flex items-center gap-1.5 flex-wrap">
            <span className="text-emerald-400">New project added:</span>
            <span className="underline decoration-emerald-400/50 underline-offset-4">
              {project.title}
            </span>
          </h4>
          <p className="text-xs text-zinc-300 line-clamp-1 leading-relaxed">
            {project.description.replace(/[#*•]/g, '').slice(0, 100)}...
          </p>
        </div>

        {/* Action Button: View Project */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="px-1.5 py-0.5 rounded bg-white/5 uppercase font-bold text-emerald-400">
              {project.type}
            </span>
            <span>{project.minecraftVersionText || '1.16 - 26.3'}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onViewProject(project);
              onDismiss();
            }}
            className={`px-4 py-2 rounded-2xl font-black text-xs uppercase pixel-font tracking-tight transition-all duration-200 flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer ${
              isWood
                ? 'bg-[#d49b6a] text-[#24140a] hover:bg-[#ebdcc6]'
                : 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-emerald-950/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>View Project</span>
          </button>
        </div>

        {/* Progress Bar timer */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isWood ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
