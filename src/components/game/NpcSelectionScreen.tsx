'use client';

import type { NpcPersona } from '@/types';

interface NpcSelectionScreenProps {
  candidates: NpcPersona[];
  isGenerated: boolean;
  onSelect: (npc: NpcPersona) => void;
}

function WelcomeLogo({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-[56px] leading-none">🦞</span>

      <div className="text-center">
        <div className="flex items-baseline justify-center gap-1.5">
          <span
            className="text-white text-[22px] font-bold tracking-wide"
            style={{ fontFamily: "'Franklin Gothic Medium', 'Tahoma', sans-serif" }}
          >
            Claw
          </span>
          <span
            className="text-white text-[14px] font-light italic tracking-wider"
            style={{ fontFamily: "'Franklin Gothic Medium', 'Tahoma', sans-serif" }}
          >
            OS
          </span>
        </div>
      </div>

      <p className="text-white/80 text-[13px] text-center leading-relaxed mt-2">
        {subtitle}
      </p>
    </div>
  );
}

export function NpcSelectionScreen({ candidates, isGenerated, onSelect }: NpcSelectionScreenProps) {
  return (
    <div className="h-screen w-screen xp-welcome-bg flex flex-col select-none xp-login-fade-in">
      {/* Top bar */}
      <div className="xp-welcome-bar h-8 shrink-0" />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="flex items-center gap-12 max-w-3xl w-full">
          {/* Left panel — logo + instruction */}
          <div className="flex-shrink-0 w-[200px]">
            <WelcomeLogo subtitle="To begin, click your colleague" />
            {!isGenerated && (
              <p className="text-amber-400/70 text-[10px] text-center mt-3">(Classic Mode)</p>
            )}
          </div>

          {/* Separator */}
          <div className="xp-welcome-separator self-stretch min-h-[280px]" />

          {/* Right panel — NPC accounts */}
          <div className="flex-1 space-y-1 max-h-[70vh] overflow-y-auto">
            {candidates.map((npc) => (
              <button
                key={npc.id}
                onClick={() => onSelect(npc)}
                className="xp-welcome-row w-full flex items-center gap-4 rounded-sm"
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-md flex items-center justify-center text-2xl shrink-0 border border-white/20"
                  style={{ backgroundColor: `${npc.color}20` }}
                >
                  {npc.avatar}
                </div>

                {/* Info */}
                <div className="text-left min-w-0 flex-1">
                  <div className="text-white font-bold text-sm truncate">{npc.name}</div>
                  <div className="text-white/50 text-xs mt-0.5 truncate">{npc.role}</div>
                  <div className="text-white/30 text-[10px] mt-0.5 italic truncate">
                    &ldquo;{npc.quirk}&rdquo;
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="xp-welcome-bar h-10 shrink-0 flex items-center justify-between px-6">
        <div className="text-white/40 text-[11px]">
          Handle requests. Use tools. Survive security traps.
        </div>
        <div className="text-white/30 text-[10px]">
          Click a colleague to begin your shift.
        </div>
      </div>
    </div>
  );
}
