'use client';

import { Minus, Square, X } from 'lucide-react';

export function WindowControls({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[2px] ${className}`}>
      <button className="xp-control-btn" title="Minimize">
        <Minus size={9} strokeWidth={2.5} className="text-white" />
      </button>
      <button className="xp-control-btn" title="Maximize">
        <Square size={8} strokeWidth={2.5} className="text-white" />
      </button>
      <button className="xp-control-btn xp-control-btn-close" title="Close">
        <X size={9} strokeWidth={2.5} className="text-white" />
      </button>
    </div>
  );
}

export function useDragWindow() {
  // No-op without Tauri
  return (_e: React.MouseEvent) => {};
}
