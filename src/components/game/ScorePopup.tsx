'use client';

import { useState, useEffect } from 'react';
import { EventBus } from '@/engine/EventBus';

interface ScorePopupData {
  id: string;
  points: number;
  x: number;
  y: number;
}

const SPARKLE_COUNT = 6;

export function ScorePopup() {
  const [popups, setPopups] = useState<ScorePopupData[]>([]);

  useEffect(() => {
    const unsub = EventBus.on('request_completed', (data) => {
      const { points } = data as { points: number };
      const popup: ScorePopupData = {
        id: Math.random().toString(36).slice(2),
        points,
        x: 50 + Math.random() * 200,
        y: window.innerHeight - 80,
      };
      setPopups((prev) => [...prev, popup]);
      setTimeout(() => {
        setPopups((prev) => prev.filter((p) => p.id !== popup.id));
      }, 1500);
    });

    return unsub;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9800]">
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute score-float text-claw-green font-bold font-mono text-lg glow-green"
          style={{ left: popup.x, top: popup.y }}
        >
          +{popup.points}
          {/* Sparkle particles */}
          {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
            <span
              key={i}
              className="sparkle absolute w-1 h-1 rounded-full bg-claw-green"
              style={{ top: '50%', left: '50%' }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
