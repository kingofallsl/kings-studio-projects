import React from 'react';

interface StudioLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  theme?: 'emerald' | 'wood';
  className?: string;
}

export const StudioLogo: React.FC<StudioLogoProps> = ({
  size = 'md',
  showText = false,
  theme = 'emerald',
  className = '',
}) => {
  const isWood = theme === 'wood';

  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-2xl',
    lg: 'w-12 h-12 text-3xl',
    xl: 'w-16 h-16 text-4xl',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Pixel Minecraft Block with Crown Emoji Badge */}
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 shadow-xl ${
          isWood
            ? 'bg-gradient-to-br from-[#8a4a25] via-[#5c3016] to-[#3a1d0d] border-2 border-[#d49b6a] shadow-[#24140a]/80'
            : 'bg-gradient-to-br from-[#10b981] via-[#047857] to-[#064e3b] border-2 border-[#6ee7b7] shadow-emerald-950/80 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
        }`}
        style={{
          boxShadow: isWood
            ? 'inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 4px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)'
            : 'inset 0 2px 5px rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.6), 0 0 20px rgba(16,185,129,0.4)',
        }}
      >
        {/* Crown Emoji */}
        <span
          role="img"
          aria-label="King's Crown"
          className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] animate-float transform hover:scale-110 transition-transform duration-200"
        >
          👑
        </span>

        {/* Corner Pixel Gem Highlights */}
        <div
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
            isWood ? 'bg-amber-300' : 'bg-emerald-300'
          } animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]`}
        />
        <div
          className={`absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 rounded-sm ${
            isWood ? 'bg-amber-600' : 'bg-emerald-700'
          }`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black pixel-font tracking-tight ${textSizeClasses[size]} ${
              isWood ? 'text-[#e6c8a7]' : 'text-emerald-400'
            } drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}
          >
            KING&apos;S STUDIO
          </span>
          <span
            className={`text-[9px] font-mono tracking-widest uppercase font-bold ${
              isWood ? 'text-[#a36940]' : 'text-emerald-500/80'
            }`}
          >
            PROJECTS • MINECRAFT
          </span>
        </div>
      )}
    </div>
  );
};
