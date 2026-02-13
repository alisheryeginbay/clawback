'use client';

import { useState } from 'react';
import type { NpcPersona } from '@/types';
import { cn } from '@/lib/utils';

interface NpcSelectionScreenProps {
  candidates: NpcPersona[];
  isGenerated: boolean;
  onSelect: (npc: NpcPersona) => void;
}

function TraitBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-claw-muted w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-claw-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-claw-green/60 rounded-full transition-all"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export function NpcSelectionScreen({ candidates, isGenerated, onSelect }: NpcSelectionScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedNpc = candidates.find((n) => n.id === selectedId);

  return (
    <div className="h-screen w-screen bg-claw-bg flex items-center justify-center crt-on">
      <div className="max-w-4xl w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-claw-green text-sm font-bold uppercase tracking-widest mb-1">
            Choose Your Colleague
          </h2>
          <p className="text-claw-muted text-xs">
            Select the NPC you&apos;ll serve for this session
          </p>
          {!isGenerated && (
            <p className="text-claw-orange text-[10px] mt-1">(Classic Mode)</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {candidates.map((npc) => (
            <button
              key={npc.id}
              onClick={() => setSelectedId(npc.id)}
              className={cn(
                'text-left p-3 border transition-all',
                selectedId === npc.id
                  ? 'border-claw-green bg-claw-green/10'
                  : 'border-claw-border bg-claw-surface hover:border-claw-green/30 hover:bg-claw-surface-alt'
              )}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-2xl">{npc.avatar}</span>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-xs font-bold truncate"
                    style={{ color: selectedId === npc.id ? npc.color : undefined }}
                  >
                    {npc.name}
                  </div>
                  <div className="text-[10px] text-claw-muted truncate">{npc.role}</div>
                </div>
              </div>

              <p className="text-[10px] text-claw-text/70 leading-relaxed mb-2 line-clamp-3">
                {npc.description}
              </p>

              <div className="text-[10px] text-claw-orange/80 italic mb-2 truncate">
                &ldquo;{npc.quirk}&rdquo;
              </div>

              <div className="space-y-1">
                <TraitBar label="Patience" value={npc.patience} />
                <TraitBar label="Tech" value={npc.techSavvy} />
                <TraitBar label="Polite" value={npc.politeness} />
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => selectedNpc && onSelect(selectedNpc)}
            disabled={!selectedNpc}
            className={cn(
              'px-8 py-3 border-2 font-bold text-sm transition-all',
              selectedNpc
                ? 'bg-claw-green/10 border-claw-green text-claw-green hover:bg-claw-green/20 glow-green'
                : 'bg-claw-surface border-claw-border text-claw-dim cursor-not-allowed'
            )}
          >
            {selectedNpc
              ? `[ SERVE ${selectedNpc.name.toUpperCase()} ]`
              : '[ SELECT AN NPC ]'}
          </button>
        </div>
      </div>
    </div>
  );
}
