import { useState } from 'react';
import { useMapStore } from '../../state/mapStore';
import { apiPost } from '../../lib/apiClient';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWidget() {
  const selectedBlock = useMapStore((s) => s.selectedBlock);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    const content = input.trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await apiPost('/api/chat', {
        messages: nextMessages,
        selectedBpcode: selectedBlock ?? undefined,
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { reply: string };
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch {
      setError("Sorry, something went wrong reaching the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-xl text-white shadow-xl hover:bg-slate-700"
        aria-label="Open chat assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div className="flex h-[28rem] w-80 max-w-[calc(100vw-2rem)] flex-col rounded-lg border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold text-slate-800">Atlas Assistant</p>
          {selectedBlock && <p className="text-xs text-slate-400">Asking about block {selectedBlock}</p>}
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-xs text-slate-400">
            Ask about climate risk, hazards, or the data for a selected block.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === 'user'
                ? 'ml-auto max-w-[85%] whitespace-pre-wrap rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-white'
                : 'mr-auto max-w-[85%] whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-800'
            }
          >
            {m.content}
          </div>
        ))}
        {loading && <p className="text-xs text-slate-400">Thinking…</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void handleSend();
          }}
          placeholder="Ask a question…"
          className="min-w-0 flex-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-slate-400"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={loading || !input.trim()}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
