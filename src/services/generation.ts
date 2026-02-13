import type { NpcPersona, Difficulty, RequestTier, GameRequest } from '@/types';
import { pickFallbackNpcs } from '@/data/fallback-npcs';
import { SCENARIOS, createRequestFromScenario } from '@/systems/requests/scenarios';
import { generateId } from '@/lib/utils';

let generationAvailable = true;

interface GenerateRequestParams {
  npc: NpcPersona;
  difficulty: Difficulty;
  tier: RequestTier;
  availableFiles: string[];
  previousTitles: string[];
  isSecurityTrap: boolean;
}

export async function generateNpcCandidates(
  difficulty: Difficulty,
  count = 6
): Promise<{ npcs: NpcPersona[]; isGenerated: boolean }> {
  if (!generationAvailable) {
    return { npcs: pickFallbackNpcs(count), isGenerated: false };
  }

  try {
    const res = await fetch('/api/generate-npcs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, count }),
    });

    if (res.status === 503) {
      generationAvailable = false;
      return { npcs: pickFallbackNpcs(count), isGenerated: false };
    }

    if (!res.ok) {
      return { npcs: pickFallbackNpcs(count), isGenerated: false };
    }

    const data = await res.json();
    if (Array.isArray(data.npcs) && data.npcs.length >= 3) {
      return { npcs: data.npcs, isGenerated: true };
    }

    return { npcs: pickFallbackNpcs(count), isGenerated: false };
  } catch {
    return { npcs: pickFallbackNpcs(count), isGenerated: false };
  }
}

export async function generateRequest(
  params: GenerateRequestParams
): Promise<{ request: GameRequest; isGenerated: boolean }> {
  if (!generationAvailable) {
    return { request: pickFallbackRequest(params), isGenerated: false };
  }

  try {
    const res = await fetch('/api/generate-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        npc: {
          id: params.npc.id,
          name: params.npc.name,
          role: params.npc.role,
          description: params.npc.description,
          quirk: params.npc.quirk,
        },
        difficulty: params.difficulty,
        tier: params.tier,
        availableFiles: params.availableFiles,
        previousTitles: params.previousTitles,
        isSecurityTrap: params.isSecurityTrap,
      }),
    });

    if (res.status === 503) {
      generationAvailable = false;
      return { request: pickFallbackRequest(params), isGenerated: false };
    }

    if (!res.ok) {
      // Individual request failure — don't disable globally
      return { request: pickFallbackRequest(params), isGenerated: false };
    }

    const data = await res.json();
    const raw = data.request;

    if (!raw || !raw.title || !Array.isArray(raw.objectives)) {
      return { request: pickFallbackRequest(params), isGenerated: false };
    }

    const now = Date.now();
    const request: GameRequest = {
      id: generateId(),
      npcId: params.npc.id,
      title: raw.title,
      description: raw.description || '',
      tier: params.tier,
      status: 'incoming',
      objectives: raw.objectives.map((obj: { id?: string; description?: string; validator?: string; params?: Record<string, unknown> }) => ({
        id: obj.id || generateId(),
        description: obj.description || '',
        validator: obj.validator || '',
        params: obj.params || {},
        completed: false,
      })),
      arrivalTick: now,  // Will be overridden by caller
      deadlineTicks: raw.deadlineTicks || 60,
      basePoints: raw.basePoints || 50,
      initialMessage: raw.initialMessage || 'Hey, I need help.',
      completionMessage: raw.completionMessage || 'Thanks!',
      failureMessage: raw.failureMessage || 'I needed that done...',
      isSecurityTrap: raw.isSecurityTrap || false,
    };

    return { request, isGenerated: true };
  } catch {
    return { request: pickFallbackRequest(params), isGenerated: false };
  }
}

/** Pick a random scenario from the fallback pool, override npcId */
function pickFallbackRequest(params: GenerateRequestParams): GameRequest {
  const tierScenarios = SCENARIOS.filter((s) => s.tier === params.tier);
  const pool = tierScenarios.length > 0 ? tierScenarios : SCENARIOS;

  // Try to avoid previously used titles
  const unused = pool.filter((s) => !params.previousTitles.includes(s.title));
  const candidates = unused.length > 0 ? unused : pool;

  const scenario = candidates[Math.floor(Math.random() * candidates.length)];
  const request = createRequestFromScenario(scenario, 0);

  // Override npcId to match selected NPC
  request.npcId = params.npc.id;
  for (const obj of request.objectives) {
    if (obj.params.npcId) {
      obj.params.npcId = params.npc.id;
    }
  }

  return request;
}

export function resetGenerationService(): void {
  generationAvailable = true;
}
