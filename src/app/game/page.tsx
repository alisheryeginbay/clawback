'use client';

import { useGameStore } from '@/store/gameStore';
import { GameProvider } from '@/components/game/GameProvider';
import { StartScreen } from '@/components/game/StartScreen';
import { Workspace } from '@/components/layout/Workspace';
import { ScorePopup } from '@/components/game/ScorePopup';
import { SecurityAlert } from '@/components/game/SecurityAlert';
import { GameOverScreen } from '@/components/game/GameOverScreen';

function GameContent() {
  const phase = useGameStore((s) => s.phase);

  if (phase === 'start' || phase === 'generating' || phase === 'selecting') {
    return <StartScreen />;
  }

  return (
    <>
      <Workspace />
      <ScorePopup />
      <SecurityAlert />
      <GameOverScreen />
    </>
  );
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
