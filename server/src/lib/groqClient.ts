import { config } from '../config';

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

export interface ToolSchema {
  type: 'function';
  function: { name: string; description: string; parameters: Record<string, unknown> };
}

export async function chatCompletion(
  messages: ChatMessage[],
  tools?: ToolSchema[],
): Promise<ChatMessage> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.groqApiKey}`,
    },
    body: JSON.stringify({
      model: config.chatModel,
      messages,
      ...(tools && tools.length > 0 ? { tools, tool_choice: 'auto' } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Groq chat completion failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { choices: { message: ChatMessage }[] };
  return data.choices[0].message;
}
