'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameEngine } from './GameProvider';
import { useGameStore } from '@/store/gameStore';
import { generateNpcCandidates } from '@/services/generation';
import { NpcSelectionScreen } from './NpcSelectionScreen';
import type { Difficulty, NpcPersona } from '@/types';
import { cn } from '@/lib/utils';

const BOOT_LINES = [
  'BIOS POST... OK',
  'Memory Test... 512MB OK',
  'Loading ClawOS...',
  'Initializing kernel modules...',
  'Starting network services... OK',
  'Mounting virtual filesystem... OK',
  'Loading AI core... OK',
  '',
  '╔════════════════════════════════════════╗',
  '║  CLAWBACK v0.1                        ║',
  '║  "You are the AI now"                 ║',
  '╚════════════════════════════════════════╝',
  '',
  'System ready. Starting initialization...',
];

const DIFFICULTIES: { id: Difficulty; label: string; description: string }[] = [
  { id: 'easy', label: 'Easy', description: 'Slow pace, fewer requests, generous deadlines' },
  { id: 'normal', label: 'Normal', description: 'Balanced challenge, moderate deadlines' },
  { id: 'hard', label: 'Hard', description: 'Fast pace, tight deadlines, more traps' },
];

export function StartScreen() {
  const engine = useGameEngine();
  const phase = useGameStore((s) => s.phase);
  const npcCandidates = useGameStore((s) => s.npcCandidates);
  const setNpcCandidates = useGameStore((s) => s.setNpcCandidates);
  const setPhase = useGameStore((s) => s.setPhase);

  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [isGeneratedNpcs, setIsGeneratedNpcs] = useState(false);

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < BOOT_LINES.length) {
        const line = BOOT_LINES[idx];
        idx++;
        setBootLines((prev) => [...prev, line]);
      } else {
        clearInterval(timer);
        setTimeout(() => setBootComplete(true), 300);
      }
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const handleStartGeneration = useCallback(async () => {
    setPhase('generating');

    const { npcs, isGenerated } = await generateNpcCandidates(selectedDifficulty);
    setNpcCandidates(npcs);
    setIsGeneratedNpcs(isGenerated);
    setPhase('selecting');
  }, [selectedDifficulty, setPhase, setNpcCandidates]);

  const handleNpcSelected = useCallback((npc: NpcPersona) => {
    engine.start({ difficulty: selectedDifficulty, selectedNpc: npc });
  }, [engine, selectedDifficulty]);

  // Generating phase
  if (phase === 'generating') {
    return (
      <div className="h-screen w-screen bg-[var(--color-xp-desktop)] flex items-center justify-center xp-window-in">
        <div className="xp-dialog p-8 text-center space-y-4">
          <div className="text-[#003C74] text-sm font-bold">
            Generating Colleagues...
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full bg-[#0054E3] animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <p className="text-[#808080] text-xs">
            Contacting HR department...
          </p>
        </div>
      </div>
    );
  }

  // Selecting phase
  if (phase === 'selecting') {
    return (
      <NpcSelectionScreen
        candidates={npcCandidates}
        isGenerated={isGeneratedNpcs}
        onSelect={handleNpcSelected}
      />
    );
  }

  // Start phase — boot sequence + setup
  return (
    <div className="h-screen w-screen bg-[var(--color-xp-desktop)] flex items-center justify-center xp-window-in p-8">
      <div className="max-w-2xl w-full">
        <div className="xp-dialog overflow-hidden">
          {/* XP Title Bar */}
          <div className="xp-titlebar">
            <span>Clawback - Initialization</span>
          </div>

          {/* Boot sequence (dark terminal) */}
          <div className="bg-[#000000] p-6 font-mono text-sm max-h-[350px] overflow-y-auto">
            {bootLines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  'leading-relaxed',
                  (line ?? '').startsWith('╔') || (line ?? '').startsWith('╚') || (line ?? '').startsWith('║')
                    ? 'text-[#00FF00]'
                    : (line ?? '').includes('OK')
                      ? 'text-[#00CCFF]'
                      : (line ?? '').includes('...')
                        ? 'text-[#808080]'
                        : 'text-[#C0C0C0]'
                )}
              >
                {line || '\u00A0'}
              </div>
            ))}
            {!bootComplete && (
              <span className="inline-block w-2 h-4 bg-[#00FF00] cursor-blink" />
            )}
          </div>

          {/* Difficulty selection */}
          {bootComplete && (
            <div className="p-6 space-y-5 bg-[var(--color-xp-face)] animate-[fadeIn_0.3s_ease-out]">
              <div className="border-b border-[#ACA899] pb-3">
                <h2 className="text-sm font-bold text-[#000000]">
                  Select Difficulty
                </h2>
                <p className="text-xs text-[#808080] mt-1">
                  You are an AI assistant. Your users depend on you. Don&apos;t let them down.
                </p>
              </div>

              <div className="space-y-2">
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={cn(
                      'w-full p-3 text-left xp-button transition-all flex items-center gap-3',
                      selectedDifficulty === diff.id
                        ? '!border-[#0054E3] !bg-[#316AC5]/10'
                        : ''
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                      selectedDifficulty === diff.id
                        ? 'border-[#0054E3]'
                        : 'border-[#808080]'
                    )}>
                      {selectedDifficulty === diff.id && (
                        <div className="w-2 h-2 rounded-full bg-[#0054E3]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-[#000000]">{diff.label}</div>
                      <div className="text-[11px] text-[#808080] mt-0.5">{diff.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#ACA899]">
                <button
                  onClick={handleStartGeneration}
                  className="xp-primary-button px-8 py-2"
                >
                  Initialize &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
