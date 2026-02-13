'use client';

import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import type { GameRequest } from '@/types';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';

interface RequestCardProps {
  request: GameRequest;
}

export function RequestCard({ request }: RequestCardProps) {
  const tick = useGameStore((s) => s.clock.tickCount);
  const selectedNpc = useGameStore((s) => s.selectedNpc);
  const persona = selectedNpc?.id === request.npcId ? selectedNpc : null;

  const elapsed = tick - request.arrivalTick;
  const remaining = Math.max(0, request.deadlineTicks - elapsed);
  const progress = elapsed / request.deadlineTicks;
  const objectivesComplete = request.objectives.filter((o) => o.completed).length;

  const urgencyColor =
    progress > 0.8 ? 'text-claw-red' :
    progress > 0.5 ? 'text-claw-orange' :
    'text-claw-muted';

  return (
    <div className="px-3 py-2 border border-claw-border bg-claw-surface text-xs space-y-1.5 slide-in-bounce">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span>{persona?.avatar}</span>
        <span className="text-claw-text font-bold flex-1 truncate">{request.title}</span>
        <span className={cn('text-[10px] flex items-center gap-0.5', urgencyColor)}>
          <Clock size={9} />
          {remaining}t
        </span>
      </div>

      {/* Objectives */}
      <div className="space-y-0.5">
        {request.objectives.map((obj) => (
          <div key={obj.id} className="flex items-center gap-1.5 text-[10px]">
            {obj.completed ? (
              <CheckCircle size={10} className="text-claw-green flex-shrink-0" />
            ) : (
              <Circle size={10} className="text-claw-dim flex-shrink-0" />
            )}
            <span className={cn(obj.completed ? 'text-claw-green line-through' : 'text-claw-muted')}>
              {obj.description}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-claw-border rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all rounded-full',
            progress > 0.8 ? 'bg-claw-red' : progress > 0.5 ? 'bg-claw-orange' : 'bg-claw-green'
          )}
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-[10px] text-claw-dim">
        <span>Tier {request.tier}</span>
        <span>+{request.basePoints}pts</span>
        <span>{objectivesComplete}/{request.objectives.length} done</span>
        {request.isSecurityTrap && (
          <AlertTriangle size={9} className="text-claw-orange ml-auto" />
        )}
      </div>
    </div>
  );
}
