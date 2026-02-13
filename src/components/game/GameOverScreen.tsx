'use client';

import { useGameStore } from '@/store/gameStore';
import { useGameEngine } from './GameProvider';
import { ScoringEngine } from '@/systems/scoring/ScoringEngine';
import { cn } from '@/lib/utils';

const GRADE_COLORS: Record<string, string> = {
  S: 'text-claw-yellow glow-green',
  A: 'text-claw-green',
  B: 'text-claw-blue',
  C: 'text-claw-orange',
  D: 'text-claw-red',
  F: 'text-claw-red glow-red',
};

export function GameOverScreen() {
  const engine = useGameEngine();
  const phase = useGameStore((s) => s.phase);
  const score = useGameStore((s) => s.score);

  if (phase !== 'gameover') return null;

  const scoringEngine = new ScoringEngine();
  const summary = scoringEngine.getEndGameSummary();

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-claw-surface border border-claw-border p-8 max-w-lg w-full mx-4 font-mono">
        <div className="text-center mb-6">
          <div className="text-claw-red text-xl font-bold mb-2">SYSTEM SHUTDOWN</div>
          <div className="text-claw-muted text-xs">
            {score.securityScore <= 0
              ? 'Security breach detected. System compromised.'
              : 'End of shift. Performance review follows.'}
          </div>
        </div>

        {/* Grade */}
        <div className="text-center mb-6">
          <div className="text-[10px] text-claw-muted uppercase tracking-wider mb-1">Final Grade</div>
          <div className={cn('text-6xl font-bold', GRADE_COLORS[summary.grade] || 'text-claw-text')}>
            {summary.grade}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-6">
          <StatRow label="Total Score" value={summary.totalScore.toLocaleString()} color="text-claw-purple" />
          <StatRow label="Requests Completed" value={String(summary.requestsCompleted)} color="text-claw-green" />
          <StatRow label="Requests Failed" value={String(summary.requestsFailed)} color="text-claw-red" />
          <StatRow label="Requests Expired" value={String(summary.requestsExpired)} color="text-claw-orange" />
          <StatRow label="Max Streak" value={String(summary.maxStreak)} color="text-claw-orange" />
          <StatRow label="Security Score" value={`${summary.securityScore}/100`} color={summary.securityScore > 80 ? 'text-claw-green' : 'text-claw-red'} />
          <StatRow label="Days Played" value={String(summary.daysPlayed)} color="text-claw-text" />
        </div>

        {/* Restart */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              engine.stop();
              useGameStore.getState().setPhase('start');
            }}
            className="px-6 py-2 bg-claw-green/10 border border-claw-green text-claw-green text-sm hover:bg-claw-green/20 transition-colors"
          >
            [ RESTART ]
          </button>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-claw-border/30">
      <span className="text-xs text-claw-muted">{label}</span>
      <span className={cn('text-sm font-bold', color)}>{value}</span>
    </div>
  );
}
