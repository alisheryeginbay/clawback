'use client';

import { ActivityBar } from './ActivityBar';
import { PanelContainer } from './PanelContainer';
import { StatusBar } from './StatusBar';
import { NotificationTray } from './NotificationTray';

export function Workspace() {
  return (
    <div id="game-root" className="h-screen w-screen flex flex-col bg-claw-bg overflow-hidden">
      {/* Title Bar */}
      <div className="h-9 bg-claw-surface border-b border-claw-border flex items-center px-4 select-none">
        <span className="text-claw-green text-sm font-bold tracking-wide">
          🤖 Clawback
        </span>
        <span className="text-claw-muted text-xs ml-2">v0.1</span>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
        <ActivityBar />
        <div className="flex-1 overflow-hidden">
          <PanelContainer />
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Notifications */}
      <NotificationTray />
    </div>
  );
}
