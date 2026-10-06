import React from 'react';
import { Sparkles, Shield, ExternalLink } from 'lucide-react';
import { StudioLogo } from './StudioLogo.tsx';

interface FooterProps {
  theme?: 'emerald' | 'wood';
}

export const Footer: React.FC<FooterProps> = ({ theme = 'emerald' }) => {
  const isWood = theme === 'wood';

  const channels = [
    { name: 'Main YouTube', url: 'https://www.youtube.com/channel/UC8FicKy0NWHPDrOcYX7F2Bg' },
    { name: 'Tutorials YouTube', url: 'https://www.youtube.com/@ManujaNethsara-xl4cm' },
    { name: 'Discord Community', url: 'https://discord.gg/bUX52N2BYV' },
    { name: 'Facebook Page', url: 'https://web.facebook.com/profile.php?id=61590860332122' },
    { name: '𝕏 / Twitter', url: 'https://x.com/KingofallSL' },
    { name: 'Reddit Hub', url: 'https://www.reddit.com/user/ElegantLet2894/' },
  ];

  return (
    <footer className={`border-t py-14 transition-colors ${
      isWood
        ? 'border-[#7a4624]/20 bg-[#ebdcc6]/60 text-[#341d0e]'
        : 'border-emerald-500/20 bg-[#050b07] text-zinc-300'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-black/10 dark:border-white/10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <StudioLogo size="sm" theme={theme} />
              <div className={`text-base font-black pixel-font ${isWood ? 'text-[#7a4624]' : 'text-emerald-400'}`}>
                KING&apos;S STUDIO
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${isWood ? 'text-[#5a361e]' : 'text-zinc-400'}`}>
              High-performance Minecraft shaders, custom Fabric and NeoForge mods, and Bedrock utility addons engineered by Manuja Nethsara. Built for maximum visual fidelity and smooth framerates.
            </p>
            <div className="text-[11px] font-mono opacity-80">
              Domain: <strong className="font-bold">kings-studio-projects.ai.studio</strong>
            </div>
          </div>

          {/* Releases Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider">Studio Releases</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#projects-section" className="hover:underline opacity-80 hover:opacity-100">Crownlight Shaders (4K PBR)</a></li>
              <li><a href="#projects-section" className="hover:underline opacity-80 hover:opacity-100">King&apos;s RPG Adventure Mod</a></li>
              <li><a href="#projects-section" className="hover:underline opacity-80 hover:opacity-100">Dimensional Backpacks</a></li>
              <li><a href="#projects-section" className="hover:underline opacity-80 hover:opacity-100">Crownlight RTX Deluxe Pack</a></li>
            </ul>
          </div>

          {/* Official Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider">Official Channels</h4>
            <ul className="space-y-2 text-xs">
              {channels.map((c) => (
                <li key={c.name}>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center justify-between group opacity-80 hover:opacity-100"
                  >
                    <span>{c.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Downloads & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider">Safe & Direct</h4>
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              isWood ? 'border-[#7a4624]/20 bg-white/60' : 'border-emerald-500/20 bg-emerald-950/20 text-emerald-300'
            }`}>
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>100% Virus-Free Downloads</span>
              </div>
              <p className="opacity-80">
                All shader packs and mod archives are packaged directly by King&apos;s Studio without ad-links or installer wrappers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-70">
          <div>
            © {new Date().getFullYear()} King&apos;s Studio (King of All SL). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://discord.gg/bUX52N2BYV" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Support Discord
            </a>
            <span>•</span>
            <a href="#projects-section" className="hover:underline">
              Shader Releases
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
