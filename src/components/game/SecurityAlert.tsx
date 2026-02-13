'use client';

import { useState, useEffect } from 'react';
import { EventBus } from '@/engine/EventBus';

export function SecurityAlert() {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    const unsub = EventBus.on('security_alert', () => {
      setIsFlashing(true);

      // Add screen shake to the root element
      const root = document.getElementById('game-root');
      if (root) {
        root.classList.add('screen-shake');
        const onEnd = () => {
          root.classList.remove('screen-shake');
          root.removeEventListener('animationend', onEnd);
        };
        root.addEventListener('animationend', onEnd);
      }

      setTimeout(() => setIsFlashing(false), 1000);
    });

    return unsub;
  }, []);

  if (!isFlashing) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 security-flash bg-claw-red/30" />
  );
}
