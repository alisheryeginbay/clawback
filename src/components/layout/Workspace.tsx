'use client';

import { PanelContainer } from './PanelContainer';
import { HUDBar } from './HUDBar';
import { NotificationTray } from './NotificationTray';
import { WindowControls, useDragWindow } from './WindowControls';

export function Workspace() {
  const handleDrag = useDragWindow();

  return (
    <div id="game-root" className="h-screen w-screen flex flex-col bg-[var(--color-xp-desktop)] overflow-hidden">
      {/* XP Title Bar */}
      <div
        className="xp-titlebar"
        onMouseDown={handleDrag}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <span className="text-[13px]">Clawback</span>
        </div>

        <div className="flex-1" />

        <WindowControls />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <PanelContainer />
      </div>

      {/* XP Taskbar */}
      <HUDBar />

      {/* Notifications */}
      <NotificationTray />
    </div>
  );
}
