import React, { useState } from 'react';
import { Sparkles, Plus, Key, Lock, Unlock, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StudioLogo } from './StudioLogo.tsx';

interface NavbarProps {
  theme: 'emerald' | 'wood';
  onToggleTheme: () => void;
  onlineCount: number;
  onOpenCreatorStudio: () => void;
  isAdmin: boolean;
  onAdminLogin: (code: string) => boolean;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onlineCount,
  onOpenCreatorStudio,
  isAdmin,
  onAdminLogin,
  onAdminLogout,
}) => {
  const isWood = theme === 'wood';

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onAdminLogin(passcodeInput.trim());
    if (success) {
      setErrorMessage('');
      setPasscodeInput('');
      setIsPasscodeModalOpen(false);
    } else {
      setErrorMessage("YOU DON'T HAVE PERMISSION TO DO THIS");
    }
  };

  const handleAddProjectClick = () => {
    if (isAdmin) {
      onOpenCreatorStudio();
    } else {
      setErrorMessage("YOU DON'T HAVE PERMISSION TO DO THIS");
      setIsPasscodeModalOpen(true);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
      isWood
        ? 'border-[#7a4624]/30 bg-[#fbf6ee]/90 text-[#2b180d]'
        : 'border-emerald-500/20 bg-[#070e0a]/90 text-white'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Web Logo & Brand Name with Emoji and Minecraft font */}
        <a
          href="#"
          className="flex items-center gap-3 transition hover:opacity-95 shrink-0 group"
          title="King's Studio Projects - Home"
        >
          <StudioLogo size="md" theme={theme} />
          <div className="flex flex-col">
            <span
              className={`font-black tracking-tight text-xs sm:text-sm pixel-font transition-colors ${
                isWood ? 'text-[#7a4624] group-hover:text-[#a05a2c]' : 'text-emerald-400 group-hover:text-emerald-300'
              }`}
            >
              KING&apos;S STUDIO PROJECTS
            </span>
            <span className="text-[9px] font-mono tracking-wider opacity-60 hidden sm:inline">
              OFFICIAL HUB • MINECRAFT
            </span>
          </div>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <a
            href="#projects-section"
            className="hover:underline transition underline-offset-4 opacity-80 hover:opacity-100"
          >
            Releases
          </a>
          <a
            href="#trailer-section"
            className="hover:underline transition underline-offset-4 opacity-80 hover:opacity-100"
          >
            Showcase
          </a>
          <a
            href="#creator-section"
            className="hover:underline transition underline-offset-4 opacity-80 hover:opacity-100"
          >
            Creator
          </a>
          <a
            href="https://discord.gg/GtgvcCxXXU"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition underline-offset-4 opacity-80 hover:opacity-100 text-indigo-400"
          >
            Discord Support
          </a>
        </nav>

        {/* Zone 3: Actions & Admin Secret System */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live indicator */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
              isWood
                ? 'border-[#7a4624]/20 bg-[#ebdcc6] text-[#7a4624]'
                : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
            }`}
            title="Connected Members Live"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{onlineCount} Online</span>
          </div>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              isWood
                ? 'border-[#7a4624]/30 bg-white text-[#7a4624] hover:bg-[#ebdcc6]'
                : 'border-white/10 bg-black/40 text-zinc-300 hover:text-white hover:border-emerald-500/40'
            }`}
            title={isWood ? 'Switch to Emerald Theme' : 'Switch to Wood Theme'}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="capitalize hidden sm:inline">{isWood ? 'Wood' : 'Emerald'}</span>
          </button>

          {/* Admin Status / Key Button */}
          {isAdmin ? (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase pixel-font">
                OWNER
              </span>
              <button
                type="button"
                onClick={onAdminLogout}
                className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                title="Lock / Logout Owner Mode"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setErrorMessage('');
                setIsPasscodeModalOpen(true);
              }}
              className="p-1.5 rounded-xl border border-white/10 hover:border-emerald-500/40 text-zinc-400 hover:text-white transition"
              title="Owner Login (Secret Code)"
            >
              <Key className="w-4 h-4" />
            </button>
          )}

          {/* Add Project button */}
          <button
            type="button"
            onClick={handleAddProjectClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase pixel-font tracking-tight flex items-center gap-1.5 transition shadow ${
              isWood
                ? 'bg-[#7a4624] text-white hover:bg-[#683b1f]'
                : 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-emerald-950/40'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>

      {/* Secret Passcode Modal ("kingsadmin") */}
      {isPasscodeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsPasscodeModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-[#0c1811] p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Lock className="w-5 h-5" />
                <h3 className="text-xs font-black pixel-font uppercase">OWNER ACCESS</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPasscodeModalOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-4">
              Enter owner secret code to edit projects, upload releases, and manage YouTube trailers:
            </p>

            <form onSubmit={handlePasscodeSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="Enter secret code..."
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/50 p-2.5 text-xs text-white outline-none focus:border-emerald-400"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-black uppercase text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasscodeModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-400 text-black font-black uppercase text-xs pixel-font tracking-tight hover:bg-emerald-300 transition"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
