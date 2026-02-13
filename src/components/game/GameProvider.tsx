'use client';

import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react';
import { GameEngine } from '@/engine/GameEngine';
import { useGameStore } from '@/store/gameStore';

const GameContext = createContext<GameEngine | null>(null);

export function useGameEngine(): GameEngine {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameEngine must be used within GameProvider');
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const engineRef = useRef<GameEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new GameEngine();
  }

  useEffect(() => {
    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  return (
    <GameContext.Provider value={engineRef.current}>
      {children}
    </GameContext.Provider>
  );
}
