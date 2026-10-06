import React from 'react';
import { ExternalLink, Youtube, MessageSquare, Twitter, Facebook, Edit3 } from 'lucide-react';
import { CreatorProfile } from '../types.ts';

interface CreatorProfileSectionProps {
  profile: CreatorProfile;
  theme?: 'emerald' | 'wood';
  isAdmin?: boolean;
  onEditProfile?: () => void;
}

export const CreatorProfileSection: React.FC<CreatorProfileSectionProps> = ({
  profile,
  theme = 'emerald',
  isAdmin = false,
  onEditProfile,
}) => {
  const isWood = theme === 'wood';

  const defaultAvatar = `data:image/svg+xml;utf8,
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" rx="24" fill="%230e1f14"/>
  <rect x="32" y="36" width="64" height="64" fill="%23d89569"/>
  <rect x="32" y="32" width="64" height="18" fill="%23382212"/>
  <rect x="42" y="58" width="12" height="10" fill="%23ffffff"/>
  <rect x="48" y="58" width="6" height="10" fill="%231a4731"/>
  <rect x="74" y="58" width="12" height="10" fill="%23ffffff"/>
  <rect x="74" y="58" width="6" height="10" fill="%231a4731"/>
  <rect x="52" y="80" width="24" height="6" fill="%23683b1f"/>
</svg>`;

  return (
    <section id="creator-section" className={`border-t py-14 transition-colors ${
      isWood ? 'border-[#7a4624]/20 bg-[#fbf6ee]' : 'border-emerald-500/15 bg-[#08120b]'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className={`relative p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 ${
          isWood
            ? 'border-[#7a4624]/30 bg-white/70 text-[#2b180d]'
            : 'border-emerald-500/25 bg-[#0a1810]/80 text-zinc-100'
        }`}>
          {/* Avatar Container with CREATOR badge matching image 2 */}
          <div className="relative shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-2 border-emerald-400/40 overflow-hidden shadow-xl bg-black/50">
              <img
                src={profile.avatarUrl || defaultAvatar}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-400 text-black text-[9px] font-black uppercase tracking-wider pixel-font shadow-md">
              CREATOR
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left space-y-2.5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                  <h3 className="text-2xl font-black pixel-font tracking-tight text-white">
                    {profile.name}
                  </h3>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    isWood ? 'bg-[#ebdcc6] text-[#7a4624]' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    @{profile.gamerTag}
                  </span>
                </div>
                <p className={`text-xs font-semibold mt-1 ${isWood ? 'text-[#874b24]' : 'text-emerald-400'}`}>
                  {profile.title}
                </p>
              </div>

              {isAdmin && onEditProfile && (
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-bold hover:bg-emerald-500/20 transition flex items-center gap-1.5 self-center md:self-start"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <p className={`text-xs leading-relaxed max-w-2xl ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
              {profile.bio}
            </p>

            {/* Social Links matching Image 2 */}
            <div className="pt-2 flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
              {profile.youtubeUrl && (
                <a
                  href={profile.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
              )}

              {profile.discordUrl && (
                <a
                  href={profile.discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/60 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Discord</span>
                </a>
              )}

              {profile.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 text-zinc-300 hover:bg-white/10 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span>𝕏 / Twitter</span>
                </a>
              )}

              {profile.facebookUrl && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
