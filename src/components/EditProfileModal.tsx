import React, { useState } from 'react';
import { X, Save, Upload, User, Youtube, MessageSquare, Twitter, Facebook, Image as ImageIcon } from 'lucide-react';
import { CreatorProfile } from '../types.ts';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CreatorProfile;
  onSaveProfile: (profile: CreatorProfile) => void;
  theme?: 'emerald' | 'wood';
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  theme = 'emerald',
}) => {
  const isWood = theme === 'wood';

  const [formData, setFormData] = useState<CreatorProfile>({ ...profile });

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
          isWood
            ? 'border-[#7a4624] bg-[#fbf6ee] text-[#2b180d]'
            : 'border-emerald-500/30 bg-[#0c1811] text-zinc-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-400" />
            <h3 id="edit-profile-title" className="text-sm font-black uppercase pixel-font tracking-tight text-emerald-400">
              EDIT CREATOR PROFILE
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-white/10 hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Avatar / Profile Icon */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-400/50 bg-black/40 shrink-0">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold font-mono text-emerald-400">
                  KS
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <label className="block text-xs font-bold uppercase opacity-80">
                Profile Icon:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-file-input"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-file-input"
                  className="cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition border border-emerald-500/30"
                >
                  Upload Icon
                </label>
                <input
                  type="text"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="or image URL"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 p-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Name & Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold opacity-80">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold opacity-80">Gamer Tag (@)</label>
              <input
                type="text"
                required
                value={formData.gamerTag}
                onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-bold opacity-80">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="block text-xs font-bold opacity-80">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none leading-relaxed"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-xs font-bold opacity-80 uppercase tracking-wider text-emerald-400">
              Social Links
            </label>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                <input
                  type="text"
                  value={formData.youtubeUrl || ''}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="YouTube URL"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                <input
                  type="text"
                  value={formData.discordUrl || ''}
                  onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                  placeholder="Discord URL"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-blue-400 shrink-0" />
                <input
                  type="text"
                  value={formData.twitterUrl || ''}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="𝕏 / Twitter URL"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                <input
                  type="text"
                  value={formData.facebookUrl || ''}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="Facebook URL"
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 p-2 text-xs text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black uppercase pixel-font tracking-tight bg-emerald-400 text-black hover:bg-emerald-300 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
