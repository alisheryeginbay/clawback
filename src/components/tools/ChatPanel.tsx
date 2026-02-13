'use client';

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import type { NpcMood } from '@/types';
import { Send, ChevronRight, Circle } from 'lucide-react';

const MOOD_COLORS: Record<NpcMood, string> = {
  neutral: 'text-[#808080]',
  waiting: 'text-[#0066CC]',
  frustrated: 'text-claw-orange',
  angry: 'text-claw-red',
  gone: 'text-[#A0A0A0]',
  happy: 'text-[#399639]',
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

  useEffect(() => {
    if (npcId && activeConv && activeConv.unreadCount > 0) {
      markConversationRead(npcId);
    }
  }, [npcId, activeConv, markConversationRead]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [activeConv]);

  const handleSendReply = () => {
    if (!replyText.trim() || !npcId) return;
    addMessage(npcId, replyText.trim(), true, tick);
    setReplyText('');
  };

  const activeReqs = requests.filter(
    (r) => r.status === 'active' || r.status === 'in_progress' || r.status === 'incoming'
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* NPC Header */}
      <div className="h-8 bg-[var(--color-xp-face)] border-b border-[#ACA899] flex items-center px-3 gap-2">
        {selectedNpc ? (
          <>
            <span className="text-sm">{selectedNpc.avatar}</span>
            <span className="text-xs font-bold" style={{ color: selectedNpc.color }}>
              {selectedNpc.name}
            </span>
            <span className="text-[10px] text-[#808080]">{selectedNpc.role}</span>
            {activeNpcState && activeNpcState.mood !== 'neutral' && (
              <span className={cn('ml-auto flex items-center gap-1 text-[10px]', MOOD_COLORS[activeNpcState.mood])}>
                <Circle size={5} className="fill-current" />
                {MOOD_LABELS[activeNpcState.mood]}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs text-[#808080]">Messages</span>
        )}
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
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
                <div className="text-center text-[#808080] text-[10px] italic">
                  {msg.text}
                </div>
              ) : (
                <div
                  className={cn(
                    'px-3 py-2 text-xs rounded',
                    msg.isFromPlayer
                      ? 'bg-[#D5E8FF] border border-[#7FB0E0] text-[#000000]'
                      : 'bg-[var(--color-xp-face)] border border-[#ACA899] text-[#000000]'
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
          <div className="text-center text-[#808080] text-xs mt-8">
            {selectedNpc
              ? 'No messages yet. Requests will appear here soon!'
              : 'Start the game to receive requests!'}
          </div>
        )}

        {/* NPC typing indicator */}
        {npcId && activeNpcState?.isTyping && (
          <div className="mr-auto max-w-[85%]">
            <div className="px-3 py-2 text-xs rounded bg-[var(--color-xp-face)] border border-[#ACA899]">
              {selectedNpc && (
                <div className="text-[10px] font-bold mb-1" style={{ color: selectedNpc.color }}>
                  {selectedNpc.avatar} {selectedNpc.name}
                </div>
              )}
              <div className="flex gap-1 items-center h-4">
                <span className="typing-bounce-1 w-1.5 h-1.5 rounded-full bg-[#808080] inline-block" />
                <span className="typing-bounce-2 w-1.5 h-1.5 rounded-full bg-[#808080] inline-block" />
                <span className="typing-bounce-3 w-1.5 h-1.5 rounded-full bg-[#808080] inline-block" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reply input */}
      {npcId && activeNpcState?.mood !== 'gone' && (
        <div className="border-t border-[#ACA899] p-2 bg-[var(--color-xp-face)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Type a reply..."
              className="flex-1 xp-input px-2 py-1 text-xs"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              className="xp-button !px-2 !py-1 text-[#0054E3] disabled:opacity-30 transition-colors"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Active Requests */}
      {activeReqs.length > 0 && (
        <div className="border-t border-[#ACA899]">
          <div className="px-3 py-1.5 text-[10px] text-[#808080] uppercase tracking-wider bg-[var(--color-xp-face)]">
            Active Requests ({activeReqs.length})
          </div>
          <div className="max-h-32 overflow-y-auto bg-white">
            {activeReqs.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-[#ECE9D8] hover:bg-[#316AC5]/10 cursor-pointer"
              >
                <ChevronRight size={10} className="text-[#808080]" />
                <span className="text-[#000000] truncate flex-1">{req.title}</span>
                <span className={cn(
                  'text-[10px]',
                  req.status === 'incoming' ? 'text-[#399639]' :
                  req.status === 'in_progress' ? 'text-claw-orange' :
                  'text-[#808080]'
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
