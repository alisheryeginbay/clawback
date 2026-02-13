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
  'Loading ClawOS v6.1.0...',
  'Initializing kernel modules...',
  'Starting network services... OK',
  'Mounting virtual filesystem... OK',
  'Loading AI core... OK',
  '',
  '▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄',
  '█  CLAWBACK v0.1                      █',
  '█  "You are the AI now"               █',
  '▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀',
  '',
  'System ready. Awaiting operator input...',
];

const DIFFICULTIES: { id: Difficulty; label: string; description: string }[] = [
  { id: 'easy', label: 'EASY', description: 'Slow pace, fewer requests, generous deadlines' },
  { id: 'normal', label: 'NORMAL', description: 'Balanced challenge, moderate deadlines' },
  { id: 'hard', label: 'HARD', description: 'Fast pace, tight deadlines, more traps' },
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

  // Generating phase — loading spinner
  if (phase === 'generating') {
    return (
      <div className="h-screen w-screen bg-claw-bg flex items-center justify-center crt-on">
        <div className="text-center">
          <div className="text-claw-green text-sm font-bold uppercase tracking-widest mb-4">
            Generating Colleagues...
          </div>
          <div className="flex justify-center gap-1.5 mb-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-claw-green animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <p className="text-claw-muted text-[10px]">
            Contacting HR department...
          </p>
        </div>
      </div>
    );
  }

  // Selecting phase — NPC selection screen
  if (phase === 'selecting') {
    return (
      <NpcSelectionScreen
        candidates={npcCandidates}
        isGenerated={isGeneratedNpcs}
        onSelect={handleNpcSelected}
      />
    );
  }

  // Start phase — boot sequence + difficulty selection
  return (
    <div className="h-screen w-screen bg-claw-bg flex items-center justify-center crt-on">
      <div className="max-w-2xl w-full mx-4">
        {/* Boot sequence */}
        <div className="bg-claw-surface border border-claw-border p-6 font-mono text-sm mb-4 max-h-[400px] overflow-y-auto">
          {bootLines.map((line, i) => (
            <div
              key={i}
              className={cn(
                'leading-relaxed',
                (line ?? '').startsWith('█') || (line ?? '').startsWith('▄') || (line ?? '').startsWith('▀')
                  ? 'text-claw-green glow-green'
                  : (line ?? '').includes('OK')
                    ? 'text-claw-green'
                    : (line ?? '').includes('...')
                      ? 'text-claw-muted'
                      : 'text-claw-text'
              )}
            >
              {line || '\u00A0'}
            </div>
          ))}
          {!bootComplete && (
            <span className="inline-block w-2 h-4 bg-claw-green cursor-blink" />
          )}
        </div>

        {/* Difficulty selection */}
        {bootComplete && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center">
              <p className="text-claw-muted text-xs mb-1">
                You are an AI assistant. Your users depend on you.
              </p>
              <p className="text-claw-green text-xs font-bold">
                Don&apos;t let them down.
              </p>
            </div>

            <div className="text-center text-claw-muted text-[10px] uppercase tracking-widest mb-2">
              Select Difficulty
            </div>

            <div className="flex gap-3 justify-center">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={cn(
                    'flex-1 max-w-[180px] p-3 border transition-all',
                    selectedDifficulty === diff.id
                      ? 'border-claw-green bg-claw-green/10 text-claw-green'
                      : 'border-claw-border bg-claw-surface text-claw-muted hover:border-claw-green/30 hover:text-claw-text'
                  )}
                >
                  <div className="text-sm font-bold">{diff.label}</div>
                  <div className="text-[10px] mt-1 opacity-70">{diff.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleStartGeneration}
                className="px-8 py-3 bg-claw-green/10 border-2 border-claw-green text-claw-green font-bold text-sm hover:bg-claw-green/20 transition-all glow-green"
              >
                [ START SYSTEM ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
