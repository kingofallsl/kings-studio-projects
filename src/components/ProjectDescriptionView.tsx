import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Sliders,
  Layers,
  HelpCircle,
  Download,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Play,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  X,
  Share2,
} from 'lucide-react';

interface ProjectDescriptionViewProps {
  description: string;
  isWood?: boolean;
}

// Extract YouTube ID from standard youtube.com or youtu.be URLs
function getYouTubeEmbedId(url: string): string | null {
  try {
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[1].length === 11) {
      return match[1];
    }
  } catch {}
  return null;
}

export const ProjectDescriptionView: React.FC<ProjectDescriptionViewProps> = ({
  description,
  isWood = false,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'highlights' | 'settings' | 'performance' | 'install'>('all');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!description) {
    return (
      <div className={`p-8 rounded-3xl border text-center text-xs ${
        isWood ? 'border-[#7a4624]/20 bg-[#f7eedf]/60 text-[#7a4624]' : 'border-emerald-500/20 bg-zinc-950/40 text-zinc-400'
      }`}>
        No description provided yet for this project.
      </div>
    );
  }

  // Parse lines and group into structured blocks (including embed blocks)
  const rawLines = description.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  type Block = {
    type:
      | 'youtube'
      | 'discord'
      | 'image'
      | 'embed_info'
      | 'embed_warning'
      | 'embed_tip'
      | 'embed_feature'
      | 'embed_specs'
      | 'embed_button'
      | 'divider'
      | 'header'
      | 'subheader'
      | 'profile'
      | 'callout'
      | 'bullet'
      | 'paragraph';
    title?: string;
    content?: string[];
    url?: string;
    caption?: string;
  };

  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  let inCalloutType: string | null = null;
  let calloutBuffer: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];

    // Check for multiline container end: :::
    if (line === ':::' && inCalloutType) {
      const typeMap: Record<string, Block['type']> = {
        info: 'embed_info',
        warning: 'embed_warning',
        tip: 'embed_tip',
        feature: 'embed_feature',
        specs: 'embed_specs',
      };
      const titleLine = calloutBuffer[0] || '';
      const bodyLines = calloutBuffer.slice(1);

      blocks.push({
        type: typeMap[inCalloutType] || 'embed_info',
        title: titleLine.replace(/^[*_#]+\s*/, '').replace(/[*_#]+$/, ''),
        content: bodyLines.length > 0 ? bodyLines : [titleLine],
      });

      inCalloutType = null;
      calloutBuffer = [];
      continue;
    }

    // Check for multiline container start: :::info, :::warning, :::tip, :::feature, :::specs
    const calloutStartMatch = line.match(/^:::(info|warning|tip|feature|specs)(?:\s+(.*))?$/i);
    if (calloutStartMatch) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      inCalloutType = calloutStartMatch[1].toLowerCase();
      calloutBuffer = calloutStartMatch[2] ? [calloutStartMatch[2]] : [];
      continue;
    }

    if (inCalloutType) {
      calloutBuffer.push(line);
      continue;
    }

    // 1. YouTube Embed tag: [embed:youtube:URL] or raw YouTube URL on its own line
    const ytMatch = line.match(/^\[embed:youtube:(https?:\/\/[^\]]+)\]$/i) ||
      line.match(/^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}(?:[^\s]*)?)$/i);
    if (ytMatch) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({
        type: 'youtube',
        url: ytMatch[1],
        title: 'Project Video Showcase',
      });
      continue;
    }

    // 2. Discord Embed tag: [embed:discord:URL] or raw discord.gg URL on its own line
    const discordMatch = line.match(/^\[embed:discord:(https?:\/\/[^\]]+)\]$/i) ||
      line.match(/^(https?:\/\/(?:www\.)?discord\.gg\/[\w-]+)$/i);
    if (discordMatch) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({
        type: 'discord',
        url: discordMatch[1],
        title: "King's Studio Official Discord Community",
      });
      continue;
    }

    // 3. Image Embed tag: [embed:image:URL|Caption] or markdown image ![caption](url)
    const imgMatch = line.match(/^\[embed:image:([^|\]]+)(?:\|([^\]]+))?\]$/i) ||
      line.match(/^!\[([^\]]*)\]\((https?:\/\/[^\)]+)\)$/i);
    if (imgMatch) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      const url = imgMatch[2] ? (imgMatch[0].startsWith('![') ? imgMatch[2] : imgMatch[1]) : imgMatch[1];
      const caption = imgMatch[2] ? (imgMatch[0].startsWith('![') ? imgMatch[1] : imgMatch[2]) : '';
      blocks.push({
        type: 'image',
        url: url.trim(),
        caption: caption?.trim(),
      });
      continue;
    }

    // 4. Action Button Embed: [embed:button:Label|URL]
    const btnMatch = line.match(/^\[embed:button:([^|\]]+)\|([^\]]+)\]$/i);
    if (btnMatch) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({
        type: 'embed_button',
        title: btnMatch[1].trim(),
        url: btnMatch[2].trim(),
      });
      continue;
    }

    // 5. Single-line embed info/warning/tip/feature/specs: [embed:type:content]
    const singleEmbedMatch = line.match(/^\[embed:(info|warning|tip|feature|specs):(.*)\]$/i);
    if (singleEmbedMatch) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      const type = `embed_${singleEmbedMatch[1].toLowerCase()}` as Block['type'];
      blocks.push({
        type,
        title: singleEmbedMatch[1].toUpperCase(),
        content: [singleEmbedMatch[2].trim()],
      });
      continue;
    }

    // 6. Dividers: ---, ***, ___
    if (/^[-*_]{3,}$/.test(line) || line === '---' || line === '***') {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = null;
      blocks.push({ type: 'divider' });
      continue;
    }

    // 7. Headers & Sections
    const isMajorHeader =
      line.startsWith('👑') ||
      line.startsWith('🌟 Why Crownlight') ||
      line.startsWith('🔥 Highlights') ||
      line.startsWith('🎛️ My Own Shader') ||
      line.startsWith('🧭 Best Way to Play') ||
      line.startsWith('🎯 Best Way to Play') ||
      line.startsWith('⭐ Recommended setup') ||
      line.startsWith('⚡ If You Lag') ||
      line.startsWith('📥 Installation') ||
      line.startsWith('✅ Compatibility') ||
      line.startsWith('🛠️ Troubleshooting') ||
      line.startsWith('💬 Feedback and Bugs') ||
      line.startsWith('📜 Project License') ||
      line.startsWith('## ') ||
      line.startsWith('# ');

    if (isMajorHeader) {
      if (currentBlock) blocks.push(currentBlock);
      const isCallout = line.startsWith('⚡') || line.startsWith('⭐');
      currentBlock = {
        type: isCallout ? 'callout' : 'header',
        title: line.replace(/^#+\s*/, ''),
        content: [],
      };
      continue;
    }

    const isSubheader =
      line.startsWith('🌅 Sky and Atmosphere') ||
      line.startsWith('🌊 Water') ||
      line.startsWith('🌧️ Rain and Weather') ||
      line.startsWith('💎 Ores, Metals and Lights') ||
      line.startsWith('🔴 Nether') ||
      line.startsWith('🟣 The End') ||
      line.startsWith('🚀 Motion') ||
      line.startsWith('🎨 Look and Feel') ||
      line.startsWith('### ');

    if (isSubheader) {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        type: 'subheader',
        title: line.replace(/^#+\s*/, ''),
        content: [],
      };
      continue;
    }

    const isProfileLine =
      line.includes('🟢 Low') ||
      line.includes('🟡 Medium') ||
      line.includes('🔵 High') ||
      line.includes('🟣 Ultra');

    if (isProfileLine) {
      if (currentBlock && currentBlock.type !== 'profile') {
        blocks.push(currentBlock);
        currentBlock = {
          type: 'profile',
          title: 'Quality Profiles & FPS Target',
          content: [line],
        };
      } else if (currentBlock && currentBlock.type === 'profile') {
        currentBlock.content?.push(line);
      } else {
        currentBlock = {
          type: 'profile',
          title: 'Quality Profiles & FPS Target',
          content: [line],
        };
      }
      continue;
    }

    // Regular paragraphs or bullets
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('·');

    if (currentBlock) {
      currentBlock.content = currentBlock.content || [];
      currentBlock.content.push(line);
    } else {
      currentBlock = {
        type: isBullet ? 'bullet' : 'paragraph',
        content: [line],
      };
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return (
    <div className="space-y-6">
      {/* Quick Navigation Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors pixel-font text-[9px] ${
            activeTab === 'all'
              ? isWood
                ? 'bg-[#7a4624] text-white shadow-sm'
                : 'bg-emerald-400 text-black shadow-md shadow-emerald-950/40'
              : isWood
              ? 'bg-[#ebdcc6]/60 text-[#7a4624] hover:bg-[#ebdcc6]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          All Sections
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('highlights')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'highlights'
              ? isWood
                ? 'bg-[#7a4624] text-white'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : isWood
              ? 'bg-[#ebdcc6]/60 text-[#7a4624] hover:bg-[#ebdcc6]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          🔥 Highlights & Visuals
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'settings'
              ? isWood
                ? 'bg-[#7a4624] text-white'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : isWood
              ? 'bg-[#ebdcc6]/60 text-[#7a4624] hover:bg-[#ebdcc6]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          🎛️ My Own Shader
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('performance')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'performance'
              ? isWood
                ? 'bg-[#7a4624] text-white'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : isWood
              ? 'bg-[#ebdcc6]/60 text-[#7a4624] hover:bg-[#ebdcc6]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          ⚡ Performance & Profiles
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('install')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
            activeTab === 'install'
              ? isWood
                ? 'bg-[#7a4624] text-white'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : isWood
              ? 'bg-[#ebdcc6]/60 text-[#7a4624] hover:bg-[#ebdcc6]'
              : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/5'
          }`}
        >
          📥 Installation & Setup
        </button>
      </div>

      {/* Render Blocks */}
      <div className="space-y-6 text-sm leading-relaxed">
        {blocks.map((block, idx) => {
          // Tab filtering
          if (activeTab === 'highlights') {
            const isHighlight =
              block.title?.includes('Highlight') ||
              block.title?.includes('Atmosphere') ||
              block.title?.includes('Water') ||
              block.title?.includes('Ores') ||
              block.title?.includes('Rain') ||
              block.title?.includes('Nether') ||
              block.title?.includes('Motion') ||
              block.title?.includes('Look and Feel') ||
              block.type === 'embed_feature' ||
              block.type === 'image';
            if (!isHighlight && block.type !== 'divider') return null;
          } else if (activeTab === 'settings') {
            const isSetting = block.title?.includes('My Own Shader') || block.title?.includes('Setting');
            if (!isSetting && block.type !== 'divider') return null;
          } else if (activeTab === 'performance') {
            const isPerf =
              block.type === 'profile' ||
              block.type === 'embed_tip' ||
              block.type === 'embed_specs' ||
              block.title?.includes('Best Way') ||
              block.title?.includes('Lag') ||
              block.title?.includes('Recommended setup') ||
              block.title?.includes('Troubleshooting');
            if (!isPerf && block.type !== 'divider') return null;
          } else if (activeTab === 'install') {
            const isInstall =
              block.title?.includes('Installation') ||
              block.title?.includes('Compatibility') ||
              block.title?.includes('License') ||
              block.title?.includes('Feedback') ||
              block.type === 'discord' ||
              block.type === 'youtube';
            if (!isInstall && block.type !== 'divider') return null;
          }

          // EMBED: YOUTUBE VIDEO PLAYER
          if (block.type === 'youtube' && block.url) {
            const ytId = getYouTubeEmbedId(block.url);
            return (
              <div
                key={idx}
                className={`overflow-hidden rounded-3xl border-2 transition-all shadow-2xl ${
                  isWood
                    ? 'border-[#7a4624]/40 bg-[#2b180d] text-[#fbebd8]'
                    : 'border-emerald-500/30 bg-[#09150d] text-white shadow-emerald-950/40'
                }`}
              >
                <div className="p-3.5 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-600/20 text-red-400">
                      <Play className="w-4 h-4 fill-red-400" />
                    </span>
                    <span className="text-xs font-black uppercase pixel-font text-white">
                      {block.title || 'Official Video Showcase'}
                    </span>
                  </div>
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative aspect-video w-full bg-black">
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                      <p className="text-xs text-zinc-400">Video Link: {block.url}</p>
                      <a
                        href={block.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
                      >
                        Open on YouTube
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // EMBED: DISCORD SERVER COMMUNITY CARD
          if (block.type === 'discord' && block.url) {
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-3xl border-2 border-[#5865F2]/40 bg-[#121426] p-5 text-white shadow-2xl transition hover:border-[#5865F2]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#5865F2]/40">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase pixel-font px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-[#8ea1e1] border border-[#5865F2]/30">
                          OFFICIAL COMMUNITY
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Online Now</span>
                        </span>
                      </div>
                      <h4 className="text-sm font-black pixel-font text-white mt-1">
                        {block.title || "King's Studio Discord Community"}
                      </h4>
                      <p className="text-xs text-zinc-300 mt-0.5">
                        &quot;is any bug find please join our discord server and fix them&quot;
                      </p>
                    </div>
                  </div>

                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-black text-xs uppercase pixel-font tracking-tight transition shadow-lg shadow-[#5865F2]/40 flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    <span>Join Server</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          }

          // EMBED: IMAGE / SCREENSHOT
          if (block.type === 'image' && block.url) {
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-xl cursor-pointer"
                onClick={() => setLightboxImage(block.url!)}
              >
                <div className="aspect-video w-full overflow-hidden bg-black/40">
                  <img
                    src={block.url}
                    alt={block.caption || 'Project visual screenshot'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {block.caption && (
                  <div className="p-3 bg-black/70 backdrop-blur-sm text-xs text-zinc-300 flex items-center justify-between gap-2 border-t border-white/5">
                    <span className="italic font-medium">{block.caption}</span>
                    <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold">
                      Click to expand
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // EMBED: ACTION BUTTON
          if (block.type === 'embed_button' && block.url) {
            return (
              <div key={idx} className="py-2 text-center">
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase pixel-font tracking-tight bg-emerald-400 text-black hover:bg-emerald-300 transition shadow-xl shadow-emerald-950/60 hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{block.title || 'Download Release'}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            );
          }

          // EMBED: FEATURE SHOWCASE CARD
          if (block.type === 'embed_feature') {
            return (
              <div
                key={idx}
                className={`p-5 rounded-3xl border-2 transition-all shadow-xl ${
                  isWood
                    ? 'border-[#d49b6a]/50 bg-gradient-to-br from-[#3b2012] to-[#251309] text-[#fbebd8]'
                    : 'border-emerald-500/40 bg-gradient-to-br from-[#0c2215] to-[#06120b] text-white shadow-emerald-950/40'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black pixel-font uppercase text-emerald-400">
                    {block.title || 'FEATURE SPOTLIGHT'}
                  </h4>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-200 leading-relaxed font-medium">
                  {block.content?.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            );
          }

          // EMBED: INFO NOTICE CARD
          if (block.type === 'embed_info') {
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isWood
                    ? 'border-blue-700/30 bg-blue-950/20 text-blue-200'
                    : 'border-blue-500/30 bg-blue-950/30 text-blue-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider text-blue-400">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{block.title || 'INFORMATION'}</span>
                </div>
                <div className="space-y-1 text-xs leading-relaxed text-zinc-300">
                  {block.content?.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            );
          }

          // EMBED: WARNING / BUG NOTICE CARD
          if (block.type === 'embed_warning') {
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all ${
                  isWood
                    ? 'border-amber-700/40 bg-amber-950/30 text-amber-100'
                    : 'border-amber-500/40 bg-amber-950/30 text-amber-100 shadow-amber-950/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>{block.title || 'IMPORTANT NOTICE'}</span>
                </div>
                <div className="space-y-1 text-xs leading-relaxed text-zinc-200">
                  {block.content?.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            );
          }

          // EMBED: TIP NOTICE CARD
          if (block.type === 'embed_tip') {
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isWood
                    ? 'border-yellow-700/30 bg-yellow-950/20 text-yellow-100'
                    : 'border-yellow-500/30 bg-yellow-950/20 text-yellow-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider text-yellow-400">
                  <Zap className="w-4 h-4 shrink-0 text-yellow-400" />
                  <span>{block.title || 'PRO TIP & RECOMMENDATION'}</span>
                </div>
                <div className="space-y-1 text-xs leading-relaxed text-zinc-200">
                  {block.content?.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            );
          }

          // EMBED: SPECS & HARDWARE REQUIREMENTS
          if (block.type === 'embed_specs') {
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isWood
                    ? 'border-[#7a4624]/30 bg-[#29170e] text-[#fbebd8]'
                    : 'border-emerald-500/25 bg-black/60 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider text-emerald-400">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>{block.title || 'SYSTEM REQUIREMENTS & COMPATIBILITY'}</span>
                </div>
                <div className="space-y-1 text-xs leading-relaxed font-mono text-zinc-300">
                  {block.content?.map((line, lIdx) => (
                    <p key={lIdx}>{line}</p>
                  ))}
                </div>
              </div>
            );
          }

          // DIVIDER BLOCK
          if (block.type === 'divider') {
            return (
              <div key={idx} className="relative py-2.5">
                <div className={`h-px w-full ${isWood ? 'bg-[#7a4624]/30' : 'bg-emerald-500/25'}`} />
                <div className={`absolute left-1/2 -translate-x-1/2 -top-1 px-3 text-[10px] uppercase font-mono tracking-widest ${
                  isWood ? 'bg-[#24140a] text-amber-400' : 'bg-[#070a08] text-emerald-400'
                }`}>
                  ✦ ✦ ✦
                </div>
              </div>
            );
          }

          // QUALITY PROFILES GRID
          if (block.type === 'profile') {
            return (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all ${
                  isWood
                    ? 'border-[#7a4624]/30 bg-[#fbf6ee] text-[#2b180d]'
                    : 'border-emerald-500/30 bg-[#08120b] text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black uppercase pixel-font tracking-tight text-emerald-400">
                    Quality Profiles & Performance Target
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {block.content?.map((line, pIdx) => {
                    const isLow = line.includes('Low');
                    const isMed = line.includes('Medium');
                    const isHigh = line.includes('High');
                    const isUltra = line.includes('Ultra');

                    let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    let tierName = 'Profile';
                    if (isLow) {
                      badgeColor = 'bg-green-500/10 text-green-400 border-green-500/30';
                      tierName = '🟢 Low (Max FPS)';
                    } else if (isMed) {
                      badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                      tierName = '🟡 Medium (Balanced)';
                    } else if (isHigh) {
                      badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                      tierName = '🔵 High (Recommended)';
                    } else if (isUltra) {
                      badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
                      tierName = '🟣 Ultra (Max Graphics)';
                    }

                    const cleanDesc = line.replace(/^[🟢🟡🔵🟣]\s*(?:Low|Medium|High|Ultra):?\s*/i, '').replace(/^Profile\s*\/.*?:-?/i, '');

                    return (
                      <div
                        key={pIdx}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-1.5 ${
                          isWood
                            ? 'bg-white/80 border-[#7a4624]/20'
                            : 'bg-black/50 border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                            {tierName}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isWood ? 'text-[#5a361e]' : 'text-zinc-300'}`}>
                          {cleanDesc || line}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }

          // CALLOUT BOX (Optimization Tips / Quick Fixes / Setup)
          if (block.type === 'callout') {
            const isLag = block.title?.includes('Lag');
            return (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all ${
                  isLag
                    ? isWood
                      ? 'border-amber-600/30 bg-amber-50 text-amber-900'
                      : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
                    : isWood
                    ? 'border-[#7a4624]/30 bg-[#fbf6ee] text-[#2b180d]'
                    : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wide">
                  {isLag ? (
                    <Zap className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{block.title}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {block.content?.map((cLine, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                      <span>{cLine.replace(/^[•\-*·]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // MAJOR SECTION HEADER
          if (block.type === 'header') {
            return (
              <div key={idx} className="pt-2">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-white/10">
                  <h3 className={`text-sm font-black uppercase pixel-font tracking-tight ${
                    isWood ? 'text-[#7a4624]' : 'text-emerald-400'
                  }`}>
                    {block.title}
                  </h3>
                </div>

                {block.content && block.content.length > 0 && (
                  <div className="space-y-2 text-xs">
                    {block.content.map((cLine, cIdx) => {
                      const isBullet = cLine.startsWith('•') || cLine.startsWith('-') || cLine.startsWith('*') || cLine.startsWith('·');
                      const isStep = /^\d+\.\s*/.test(cLine);

                      if (isStep) {
                        const stepNum = cLine.match(/^(\d+)\.\s*/)?.[1];
                        const stepText = cLine.replace(/^\d+\.\s*/, '');
                        return (
                          <div key={cIdx} className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-black/30 border border-white/5">
                            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                              {stepNum}
                            </span>
                            <span className={isWood ? 'text-[#5a361e]' : 'text-zinc-300'}>{stepText}</span>
                          </div>
                        );
                      }

                      if (isBullet) {
                        return (
                          <div key={cIdx} className="flex items-start gap-2 ml-1">
                            <span className="text-emerald-400 font-bold mt-0.5">•</span>
                            <span className={isWood ? 'text-[#5a361e]' : 'text-zinc-300'}>
                              {cLine.replace(/^[•\-*·]\s*/, '')}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <p key={cIdx} className={isWood ? 'text-[#5a361e]' : 'text-zinc-300'}>
                          {cLine}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // SUB-HEADER FEATURE CARD (Sky, Water, Rain, Ores, etc.)
          if (block.type === 'subheader') {
            return (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isWood
                    ? 'border-[#7a4624]/20 bg-[#f7eedf]/60 text-[#2b180d]'
                    : 'border-white/10 bg-black/40 text-zinc-300'
                }`}
              >
                <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <span>{block.title}</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  {block.content?.map((cLine, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-2">
                      <span className="text-emerald-400/80 font-bold mt-0.5">•</span>
                      <span>{cLine.replace(/^[•\-*·]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // BULLETS / PARAGRAPHS
          return (
            <div key={idx} className="space-y-1.5 text-xs">
              {block.content?.map((cLine, cIdx) => (
                <div key={cIdx} className="flex items-start gap-2">
                  {block.type === 'bullet' && (
                    <span className="text-emerald-400 font-bold mt-0.5">•</span>
                  )}
                  <p className={isWood ? 'text-[#5a361e]' : 'text-zinc-300'}>
                    {cLine.replace(/^[•\-*·]\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Lightbox for Image Embeds */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={lightboxImage}
              alt="Expanded preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-white hover:bg-red-600 transition"
              aria-label="Close image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
