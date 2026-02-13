import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestBody {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
  temperature?: number;
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

  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_body', message: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { systemPrompt, userMessage, maxTokens = 80, temperature = 0.9 } = body;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

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
          { role: 'user', content: userMessage },
        ],
        max_tokens: maxTokens,
        temperature,
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
    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: 'api_error', message: 'Empty response from model' },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (err: unknown) {
    clearTimeout(timeout);

    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'timeout', message: 'OpenRouter request timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'api_error', message: 'Failed to reach OpenRouter' },
      { status: 502 }
    );
  }
}
