import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Project } from '../types.ts';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  project: Project | null;
  onConfirm: () => void;
  onCancel: () => void;
  theme?: 'emerald' | 'wood';
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  project,
  onConfirm,
  onCancel,
  theme = 'emerald',
}) => {
  if (!isOpen || !project) return null;

  const isWood = theme === 'wood';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onCancel}
    >
      <div
        className={`relative w-full max-w-md rounded-3xl border-2 p-6 shadow-2xl transition-all duration-200 ${
          isWood
            ? 'border-red-800/60 bg-[#2b140d] text-[#fbebd8]'
            : 'border-red-500/50 bg-[#160a0a] text-white shadow-red-950/60'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5 text-red-400">
            <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h3 id="delete-confirm-title" className="text-sm font-black pixel-font uppercase">
              CONFIRM DELETION
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-zinc-200 leading-relaxed font-semibold">
            Are you sure you want to permanently delete this project?
          </p>

          <div className="p-3.5 rounded-2xl bg-black/50 border border-red-500/20 flex items-center gap-3">
            {project.thumbnail || project.bannerUrl ? (
              <img
                src={project.thumbnail || project.bannerUrl}
                alt={project.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-sm font-black pixel-font text-white truncate">
                {project.title}
              </h4>
              <p className="text-[11px] text-zinc-400 font-mono">
                {project.type} • {project.files?.length || 0} release files
              </p>
            </div>
          </div>

          <p className="text-[11px] text-red-300 font-mono">
            ⚠️ This will permanently remove the project and its download files from King&apos;s Studio. This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-white/10 text-zinc-300 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase pixel-font tracking-tight transition flex items-center gap-2 shadow-lg shadow-red-950/80 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Yes, Delete Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
