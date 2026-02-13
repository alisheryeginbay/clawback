import { NextRequest, NextResponse } from 'next/server';

interface GenerateNpcsBody {
  difficulty: string;
  count?: number;
}

interface RawNpc {
  name?: unknown;
  role?: unknown;
  description?: unknown;
  avatarEmoji?: unknown;
  patience?: unknown;
  techSavvy?: unknown;
  politeness?: unknown;
  quirk?: unknown;
  color?: unknown;
}

function clamp01(val: unknown): number {
  const n = Number(val);
  if (isNaN(n)) return 0.5;
  return Math.max(0, Math.min(1, n));
}

function validateNpc(raw: RawNpc, index: number) {
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const role = typeof raw.role === 'string' ? raw.role.trim() : '';
  if (!name || !role) return null;

  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30) + `-${index}`,
    name,
    role,
    avatar: typeof raw.avatarEmoji === 'string' ? raw.avatarEmoji : '🧑‍💼',
    patience: clamp01(raw.patience),
    techSavvy: clamp01(raw.techSavvy),
    politeness: clamp01(raw.politeness),
    color: typeof raw.color === 'string' && raw.color.startsWith('#') ? raw.color : '#00b4d8',
    description: typeof raw.description === 'string' ? raw.description.trim() : `${name} works as ${role}.`,
    quirk: typeof raw.quirk === 'string' ? raw.quirk.trim() : 'Has no particular quirks',
  };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-chat-v3-0324';

  if (!apiKey || apiKey === 'sk-or-v1-xxxxxxxxxxxxx') {
    return NextResponse.json(
      { error: 'no_api_key', message: 'OpenRouter API key not configured' },
      { status: 503 }
    );
  }

  let body: GenerateNpcsBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_body', message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const count = body.count || 6;
  const difficulty = body.difficulty || 'normal';

  const systemPrompt = `You are a comedy writer for "Clawback", a corporate office simulator game where the player is an AI assistant serving demanding coworkers.
Generate ${count} unique, funny NPC coworkers. Think "The Office" meets "Silicon Valley".
Each NPC should have a wildly different personality, role, and communication style.
${difficulty === 'hard' ? 'Make them more demanding, impatient, and chaotic.' : difficulty === 'easy' ? 'Make them more patient and friendly, but still funny.' : ''}

Respond with JSON: { "npcs": [{ "name": string, "role": string, "description": string (2-3 funny sentences), "avatarEmoji": string (single emoji), "patience": number (0-1), "techSavvy": number (0-1), "politeness": number (0-1), "quirk": string (one sentence behavioral quirk), "color": string (hex color for chat) }] }`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://clawback.dev',
        'X-Title': 'Clawback',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${count} NPCs for ${difficulty} difficulty.` },
        ],
        max_tokens: 2000,
        temperature: 0.95,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      clearTimeout(timeout);
      const errorText = await res.text().catch(() => 'Unknown error');
      return NextResponse.json(
        { error: 'api_error', message: errorText },
        { status: 502 }
      );
    }

    const data = await res.json();
    clearTimeout(timeout);
    const rawText = data.choices?.[0]?.message?.content?.trim();

    if (!rawText) {
      return NextResponse.json(
        { error: 'api_error', message: 'Empty response from model' },
        { status: 502 }
      );
    }

    let parsed: { npcs?: RawNpc[] };
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'parse_error', message: 'Failed to parse LLM JSON response' },
        { status: 502 }
      );
    }

    if (!Array.isArray(parsed.npcs) || parsed.npcs.length === 0) {
      return NextResponse.json(
        { error: 'validation_error', message: 'No valid NPCs in response' },
        { status: 502 }
      );
    }

    const validNpcs = parsed.npcs
      .map((raw, i) => validateNpc(raw, i))
      .filter(Boolean);

    if (validNpcs.length < 3) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Too few valid NPCs generated' },
        { status: 502 }
      );
    }

    return NextResponse.json({ npcs: validNpcs });
  } catch (err: unknown) {
    clearTimeout(timeout);

    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'timeout', message: 'NPC generation timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'api_error', message: 'Failed to reach OpenRouter' },
      { status: 502 }
    );
  }
}
