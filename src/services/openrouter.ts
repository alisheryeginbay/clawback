interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  jsonMode?: boolean;
  timeoutMs?: number;
}

interface OpenRouterResponse {
  text: string;
}

let apiAvailableCache = true;

export function isOpenRouterAvailable(): boolean {
  return apiAvailableCache;
}

export async function callOpenRouter(options: OpenRouterOptions): Promise<OpenRouterResponse> {
  if (!apiAvailableCache) {
    throw new Error('no_api_key');
  }

  const { messages, maxTokens = 80, temperature = 0.9, jsonMode = false, timeoutMs = 10000 } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, maxTokens, temperature, jsonMode }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'unknown' }));
      if (data.error === 'no_api_key') {
        apiAvailableCache = false;
        throw new Error('no_api_key');
      }
      throw new Error(`api_error: ${res.status} ${data.message || ''}`);
    }

    const data = await res.json();
    const text = data.text;

    if (!text) {
      throw new Error('empty_response');
    }

    return { text };
  } finally {
    clearTimeout(timeout);
  }
}

export function resetOpenRouterCache(): void {
  apiAvailableCache = true;
}
