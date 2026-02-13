'use client';

import { useGameStore } from '@/store/gameStore';
import {
  Terminal,
  FolderOpen,
  MessageSquare,
  Mail,
  Search,
  Calendar,
} from 'lucide-react';
import type { ToolId } from '@/types';

const ICONS: { toolId: ToolId; label: string; icon: typeof Terminal }[] = [
  { toolId: 'terminal', label: 'Command\nPrompt', icon: Terminal },
  { toolId: 'files', label: 'My Computer', icon: FolderOpen },
  { toolId: 'chat', label: 'MSN\nMessenger', icon: MessageSquare },
  { toolId: 'email', label: 'Outlook\nExpress', icon: Mail },
  { toolId: 'search', label: 'Internet\nExplorer', icon: Search },
  { toolId: 'calendar', label: 'Calendar', icon: Calendar },
];

export function DesktopIcons() {
  const openWindow = useGameStore((s) => s.openWindow);

  return (
    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
      {ICONS.map(({ toolId, label, icon: Icon }) => (
        <button
          key={toolId}
          className="xp-desktop-icon group flex flex-col items-center w-[75px] p-2 rounded-sm"
          onDoubleClick={() => openWindow(toolId)}
        >
          <div className="w-8 h-8 flex items-center justify-center mb-1">
            <Icon size={28} className="text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]" />
          </div>
          <span className="text-[11px] text-white text-center leading-tight whitespace-pre-line drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
