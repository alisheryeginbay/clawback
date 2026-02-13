'use client';

import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import type { NpcMood } from '@/types';

const MOOD_RING: Record<NpcMood, string> = {
  neutral: 'ring-claw-muted',
  waiting: 'ring-claw-blue',
  frustrated: 'ring-claw-orange',
  angry: 'ring-claw-red animate-pulse',
  gone: 'ring-claw-dim opacity-50',
  happy: 'ring-claw-green',
};

interface NpcAvatarProps {
  npcId: string;
  size?: 'sm' | 'md' | 'lg';
  showMood?: boolean;
}

export function NpcAvatar({ npcId, size = 'md', showMood = true }: NpcAvatarProps) {
  const selectedNpc = useGameStore((s) => s.selectedNpc);
  const mood = useGameStore((s) => s.npcs[npcId]?.mood || 'neutral');

  // Use selected NPC persona if it matches
  const persona = selectedNpc?.id === npcId ? selectedNpc : null;

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center ring-2',
        sizeClasses[size],
        showMood ? MOOD_RING[mood] : 'ring-claw-border'
      )}
      title={`${persona?.name || npcId} - ${mood}`}
    >
      {persona?.avatar || '?'}
    </div>
  );
}
