import React, { useState } from 'react';
import { Play, ExternalLink, Film, Edit3, X, Save } from 'lucide-react';
import { TrailerConfig } from '../types.ts';

interface TrailerShowcaseProps {
  trailer: TrailerConfig;
  isAdmin?: boolean;
  onUpdateTrailer?: (trailer: TrailerConfig) => void;
  theme?: 'emerald' | 'wood';
}

export const TrailerShowcase: React.FC<TrailerShowcaseProps> = ({
  trailer,
  isAdmin = false,
  onUpdateTrailer,
  theme = 'emerald',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<TrailerConfig>({ ...trailer });

  const isWood = theme === 'wood';

  // Extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/embed/') || url.includes('youtube-nocookie.com/embed/')) return url;
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1`;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?autoplay=1`;
    return null;
  };

  const embedUrl = getEmbedUrl(trailer.youtubeUrl);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTrailer) {
      onUpdateTrailer(editData);
    }
    setIsEditing(false);
  };

  return (
    <section id="trailer-section" className={`border-t py-16 transition-colors ${
      isWood ? 'border-[#7a4624]/20 bg-[#ebdcc6]/40' : 'border-emerald-500/15 bg-[#061009]/80'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 bg-red-500/10 border border-red-500/20 text-red-400">
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Showcase</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black pixel-font tracking-tight ${
              isWood ? 'text-[#2b180d]' : 'text-white'
            }`}>
              {trailer.title || "Crownlight Shaders Official Showcase"}
            </h2>
            <p className={`text-xs mt-2 max-w-xl leading-relaxed ${
              isWood ? 'text-[#5a361e]' : 'text-zinc-400'
            }`}>
              {trailer.description || "Watch high-framerate gameplay in 4K with ray traced volumetric godrays, realistic water physics, and glowing ores in action."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditData({ ...trailer });
                  setIsEditing(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Trailer</span>
              </button>
            )}

            {trailer.channelUrl && (
              <a
                href={trailer.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                  isWood
                    ? 'border-[#7a4624]/30 bg-white text-[#7a4624] hover:bg-white'
                    : 'border-white/10 bg-black/40 text-zinc-300 hover:text-white hover:border-emerald-500/40'
                }`}
              >
                <span>Visit YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Video Player Card */}
        <div className={`relative aspect-video max-w-4xl mx-auto overflow-hidden rounded-3xl border shadow-2xl ${
          isWood ? 'border-[#7a4624]/40 bg-black' : 'border-emerald-500/30 bg-black'
        }`}>
          {isPlaying && embedUrl ? (
            <iframe
              src={embedUrl}
              title={trailer.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="relative w-full h-full flex items-center justify-center cursor-pointer group bg-gradient-to-br from-zinc-900 to-black"
              onClick={() => setIsPlaying(true)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 transition duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80')` }}
              />
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl transition duration-300 group-hover:scale-110 group-hover:bg-red-500">
                  <Play className="w-7 h-7 ml-1 fill-white" />
                </div>
                <span className="text-xs font-black uppercase pixel-font tracking-tight text-white bg-black/70 px-4 py-2 rounded-xl border border-white/10">
                  CLICK TO WATCH TRAILER
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Trailer Modal */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#0c1811] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-black pixel-font text-emerald-400">EDIT YOUTUBE TRAILER</h3>
              <button type="button" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold opacity-80 mb-1">Showcase Title</label>
                <input
                  type="text"
                  required
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80 mb-1">YouTube URL or Video ID</label>
                <input
                  type="text"
                  required
                  value={editData.youtubeUrl}
                  onChange={(e) => setEditData({ ...editData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block font-bold opacity-80 mb-1">Channel URL</label>
                <input
                  type="text"
                  value={editData.channelUrl}
                  onChange={(e) => setEditData({ ...editData, channelUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-black uppercase text-xs"
                >
                  Save Trailer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
