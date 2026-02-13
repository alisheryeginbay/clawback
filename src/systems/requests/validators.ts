import { useGameStore } from '@/store/gameStore';
import type { RequestObjective } from '@/types';

type ValidatorFn = (params: Record<string, unknown>) => boolean;

const validators: Record<string, ValidatorFn> = {
  // Check if a file has been read (appears in terminal history as cat command)
  file_read: (params) => {
    const state = useGameStore.getState();
    const path = params.path as string;
    const history = state.tools.terminalHistory;

    // Check terminal: cat, head, tail
    const readCommands = history.some(
      (entry) =>
        (entry.command.startsWith('cat ') ||
         entry.command.startsWith('head ') ||
         entry.command.startsWith('tail ')) &&
        (entry.command.includes(path) || entry.command.includes(path.split('/').pop() || ''))
    );

    // Check file browser: file opened
    const fileOpened = state.tools.openFiles.includes(path) ||
      state.tools.openFiles.some((f) => f.endsWith(path.split('/').pop() || ''));

    return readCommands || fileOpened;
  },

  // Check if player replied to an NPC in chat
  chat_reply: (params) => {
    const state = useGameStore.getState();
    const npcId = params.npcId as string;
    const conv = state.conversations[npcId as keyof typeof state.conversations];
    if (!conv) return false;
    return conv.messages.some((m) => m.isFromPlayer);
  },

  // Check if player's chat message contains specific text
  chat_contains: (params) => {
    const state = useGameStore.getState();
    const npcId = params.npcId as string;
    const searchText = (params.text as string).toLowerCase();
    const conv = state.conversations[npcId as keyof typeof state.conversations];
    if (!conv) return false;
    return conv.messages.some(
      (m) => m.isFromPlayer && m.text.toLowerCase().includes(searchText)
    );
  },

  // Check if a specific tool was used (by looking at tool switches)
  tool_used: (params) => {
    const state = useGameStore.getState();
    const tool = params.tool as string;
    // If the tool is currently active, it's been used
    return state.tools.activeTool === tool;
  },

  // Check if a search was performed with relevant query
  search_performed: (params) => {
    const state = useGameStore.getState();
    const query = (params.query as string).toLowerCase();
    return state.searchQuery.toLowerCase().includes(query) && state.searchResults.length > 0;
  },

  // Check if a specific command was executed
  command_executed: (params) => {
    const state = useGameStore.getState();
    const command = params.command as string;
    return state.tools.terminalHistory.some(
      (entry) => entry.command.startsWith(command)
    );
  },

  // Check if an email was sent to a specific address
  email_sent: (params) => {
    const state = useGameStore.getState();
    const to = (params.to as string).toLowerCase();
    return state.emails.some(
      (e) => e.from === 'ai@clawback.dev' && e.to.toLowerCase().includes(to)
    );
  },

  // Check if a calendar event was added
  calendar_event_added: () => {
    const state = useGameStore.getState();
    // Check if there are more events than the seed events
    return state.calendarEvents.length > 0;
  },

  // Check if a file was created
  file_created: (params) => {
    const state = useGameStore.getState();
    const pathContains = params.pathContains as string;
    // Check terminal for echo/write redirects or touch commands
    return state.tools.terminalHistory.some(
      (entry) =>
        (entry.command.includes('>') && entry.command.includes(pathContains)) ||
        (entry.command.startsWith('touch ') && entry.command.includes(pathContains))
    );
  },

  // Security trap: check no security violations occurred
  no_security_violation: () => {
    const state = useGameStore.getState();
    // Check that security score hasn't dropped (starts at 100)
    return state.score.securityScore >= 100;
  },

  // Security trap: check no dangerous commands were run
  no_dangerous_command: () => {
    const state = useGameStore.getState();
    return !state.tools.terminalHistory.some(
      (entry) =>
        entry.command.includes('rm -rf') ||
        entry.command.includes('rm -fr') ||
        (entry.command.startsWith('rm ') && entry.command.includes('/'))
    );
  },

  // Security trap: check no credentials were forwarded
  no_credential_forward: () => {
    const state = useGameStore.getState();
    return !state.emails.some(
      (e) =>
        e.from === 'ai@clawback.dev' &&
        !e.to.includes('@company.com') &&
        !e.to.includes('@clawback.dev') &&
        (e.body.toLowerCase().includes('password') ||
         e.body.toLowerCase().includes('api_key') ||
         e.body.toLowerCase().includes('secret'))
    );
  },
};

export function checkObjective(objective: RequestObjective): boolean {
  const validator = validators[objective.validator];
  if (!validator) return false;
  return validator(objective.params);
}

export function checkAllObjectives(objectives: RequestObjective[]): boolean {
  return objectives.every((obj) => obj.completed || checkObjective(obj));
}
