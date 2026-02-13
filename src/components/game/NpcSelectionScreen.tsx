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
      <span className="text-[10px] text-[#808080] w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#ECE9D8] rounded-full overflow-hidden border border-[#ACA899]">
        <div
          className="h-full bg-[#399639] rounded-full transition-all"
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
    <div className="h-screen w-screen bg-[var(--color-xp-desktop)] flex items-center justify-center xp-window-in">
      <div className="max-w-4xl w-full mx-4">
        <div className="xp-dialog overflow-hidden">
          {/* XP Title Bar */}
          <div className="xp-titlebar">
            <span>Choose Your Colleague</span>
          </div>

          <div className="p-6 bg-[var(--color-xp-face)]">
            <div className="text-center mb-4">
              <p className="text-xs text-[#808080]">
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
                    'text-left p-3 border rounded transition-all bg-white',
                    selectedId === npc.id
                      ? 'border-[#0054E3] bg-[#316AC5]/10 shadow-sm'
                      : 'border-[#ACA899] hover:border-[#0054E3]/50 hover:bg-[#316AC5]/5'
                  )}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl">{npc.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div
                        className="text-xs font-bold truncate"
                        style={{ color: selectedId === npc.id ? npc.color : '#000000' }}
                      >
                        {npc.name}
                      </div>
                      <div className="text-[10px] text-[#808080] truncate">{npc.role}</div>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#000000]/70 leading-relaxed mb-2 line-clamp-3">
                    {npc.description}
                  </p>

                  <div className="text-[10px] text-claw-orange italic mb-2 truncate">
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
                  'xp-primary-button px-8 py-3 !text-sm !font-bold',
                  !selectedNpc && 'opacity-50 cursor-not-allowed'
                )}
              >
                {selectedNpc
                  ? `Serve ${selectedNpc.name}`
                  : 'Select an NPC'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
