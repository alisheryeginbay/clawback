'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import type { NpcMood } from '@/types';
import { Send, ChevronRight, Circle } from 'lucide-react';

const MOOD_COLORS: Record<NpcMood, string> = {
  neutral: 'text-claw-muted',
  waiting: 'text-claw-blue',
  frustrated: 'text-claw-orange',
  angry: 'text-claw-red',
  gone: 'text-claw-dim',
  happy: 'text-claw-green',
};

const MOOD_LABELS: Record<NpcMood, string> = {
  neutral: 'idle',
  waiting: 'waiting...',
  frustrated: 'frustrated',
  angry: 'ANGRY',
  gone: 'left',
  happy: 'happy',
};

export function ChatPanel() {
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedNpc = useGameStore((s) => s.selectedNpc);
  const conversations = useGameStore((s) => s.conversations);
  const npcs = useGameStore((s) => s.npcs);
  const addMessage = useGameStore((s) => s.addMessage);
  const markConversationRead = useGameStore((s) => s.markConversationRead);
  const tick = useGameStore((s) => s.clock.tickCount);
  const requests = useGameStore((s) => s.requests);

  const npcId = selectedNpc?.id;
  const activeConv = npcId ? conversations[npcId] : null;
  const activeNpcState = npcId ? npcs[npcId] : null;

  // Mark as read when viewing
  useEffect(() => {
    if (npcId && activeConv && activeConv.unreadCount > 0) {
      markConversationRead(npcId);
    }
  }, [npcId, activeConv, markConversationRead]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [activeConv]);

  const handleSendReply = () => {
    if (!replyText.trim() || !npcId) return;
    addMessage(npcId, replyText.trim(), true, tick);
    setReplyText('');
  };

  // Active requests panel
  const activeReqs = requests.filter(
    (r) => r.status === 'active' || r.status === 'in_progress' || r.status === 'incoming'
  );

  return (
    <div className="h-full flex flex-col">
      {/* NPC Header */}
      <div className="h-8 bg-claw-surface border-b border-claw-border flex items-center px-3 gap-2">
        {selectedNpc ? (
          <>
            <span className="text-sm">{selectedNpc.avatar}</span>
            <span className="text-xs font-bold" style={{ color: selectedNpc.color }}>
              {selectedNpc.name}
            </span>
            <span className="text-[10px] text-claw-muted">{selectedNpc.role}</span>
            {activeNpcState && activeNpcState.mood !== 'neutral' && (
              <span className={cn('ml-auto flex items-center gap-1 text-[10px]', MOOD_COLORS[activeNpcState.mood])}>
                <Circle size={5} className="fill-current" />
                {MOOD_LABELS[activeNpcState.mood]}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs text-claw-muted uppercase tracking-wider">Messages</span>
        )}
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {activeConv && activeConv.messages.length > 0 ? (
          activeConv.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[85%]',
                msg.isFromPlayer ? 'ml-auto' : 'mr-auto'
              )}
            >
              {msg.isSystem ? (
                <div className="text-center text-claw-muted text-[10px] italic">
                  {msg.text}
                </div>
              ) : (
                <div
                  className={cn(
                    'px-3 py-2 text-xs rounded-sm',
                    msg.isFromPlayer
                      ? 'bg-claw-green/10 border border-claw-green/20 text-claw-text'
                      : 'bg-claw-surface border border-claw-border text-claw-text'
                  )}
                >
                  {!msg.isFromPlayer && selectedNpc && (
                    <div className="text-[10px] font-bold mb-1" style={{ color: selectedNpc.color }}>
                      {selectedNpc.avatar} {selectedNpc.name}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-claw-muted text-xs mt-8">
            {selectedNpc
              ? 'No messages yet. Requests will appear here soon!'
              : 'Start the game to receive requests!'}
          </div>
        )}

        {/* NPC typing indicator */}
        {npcId && activeNpcState?.isTyping && (
          <div className="mr-auto max-w-[85%]">
            <div className="px-3 py-2 text-xs rounded-sm bg-claw-surface border border-claw-border">
              {selectedNpc && (
                <div className="text-[10px] font-bold mb-1" style={{ color: selectedNpc.color }}>
                  {selectedNpc.avatar} {selectedNpc.name}
                </div>
              )}
              <div className="flex gap-1 items-center h-4">
                <span className="typing-bounce-1 w-1.5 h-1.5 rounded-full bg-claw-muted inline-block" />
                <span className="typing-bounce-2 w-1.5 h-1.5 rounded-full bg-claw-muted inline-block" />
                <span className="typing-bounce-3 w-1.5 h-1.5 rounded-full bg-claw-muted inline-block" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply input */}
      {npcId && activeNpcState?.mood !== 'gone' && (
        <div className="border-t border-claw-border p-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Type a reply..."
              className="flex-1 bg-claw-surface border border-claw-border px-2 py-1 text-xs text-claw-text font-mono focus:outline-none focus:border-claw-green/50"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="px-2 py-1 bg-claw-green/10 border border-claw-green/30 text-claw-green hover:bg-claw-green/20 disabled:opacity-30 transition-colors"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Active Requests */}
      {activeReqs.length > 0 && (
        <div className="border-t border-claw-border">
          <div className="px-3 py-1.5 text-[10px] text-claw-muted uppercase tracking-wider bg-claw-surface">
            Active Requests ({activeReqs.length})
          </div>
          <div className="max-h-32 overflow-y-auto">
            {activeReqs.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-claw-border/50 hover:bg-claw-surface-alt cursor-pointer"
              >
                <ChevronRight size={10} className="text-claw-muted" />
                <span className="text-claw-text truncate flex-1">{req.title}</span>
                <span className={cn(
                  'text-[10px]',
                  req.status === 'incoming' ? 'text-claw-blue' :
                  req.status === 'in_progress' ? 'text-claw-orange' :
                  'text-claw-muted'
                )}>
                  {req.status === 'incoming' ? 'NEW' : req.status === 'in_progress' ? 'WIP' : 'TODO'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
