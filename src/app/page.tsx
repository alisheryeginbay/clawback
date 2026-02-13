'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-screen bg-claw-bg flex items-center justify-center font-mono">
      <div className="text-center space-y-8 max-w-xl mx-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="text-5xl font-bold text-claw-green glow-green tracking-wider">
            CLAWBACK
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-1">
          <p className="text-claw-text text-sm">You are the AI now.</p>
          <p className="text-claw-muted text-xs">
            Handle requests. Use tools. Survive security traps.
          </p>
        </div>

        {/* ASCII art */}
        <pre className="text-claw-green text-[10px] leading-tight">
{`    ╔══════════════════════════════╗
    ║  > INITIALIZING AI CORE...  ║
    ║  > LOADING PERSONALITY...   ║
    ║  > CONNECTING TO USERS...   ║
    ║  > SYSTEM READY             ║
    ╚══════════════════════════════╝`}
        </pre>

        {/* Start button */}
        {mounted && (
          <button
            onClick={() => router.push('/game')}
            className="px-10 py-4 bg-claw-green/10 border-2 border-claw-green text-claw-green font-bold text-lg hover:bg-claw-green/20 transition-all glow-green tracking-wider"
          >
            [ BOOT SYSTEM ]
          </button>
        )}

        {/* Info */}
        <div className="text-[10px] text-claw-dim space-y-1">
          <p>A freeform sandbox where you play as an AI assistant</p>
          <p>Inspired by Papers, Please meets Claude</p>
        </div>
      </div>
    </div>
  );
}
