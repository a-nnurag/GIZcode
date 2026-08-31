import { config } from '../config';

export interface ChunkMetadata {
  text: string;
  source: string;
  [key: string]: unknown;
}

interface UpsertItem {
  id: string;
  data: string;
  metadata: ChunkMetadata;
}

async function upstashRequest<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${config.upstashVectorUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.upstashVectorToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Upstash Vector ${endpoint} failed: ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

// Used only by the ingest script (scripts/ingest-docs.ts) — never called from a request path.
// The index has an embedding model attached (Dense, text-embedding-3-small), so we upsert raw
// text via the dedicated /upsert-data endpoint and let Upstash embed it server-side — the plain
// /upsert endpoint is vector-only and rejects a `data` field outright.
export async function upsertVectors(items: UpsertItem[]): Promise<void> {
  await upstashRequest('upsert-data', items);
}

export interface RetrievedChunk {
  text: string;
  source: string;
  score: number;
}

export async function queryVectors(queryText: string, topK = 4): Promise<RetrievedChunk[]> {
  const { result } = await upstashRequest<{
    result: { score: number; metadata: ChunkMetadata }[];
  }>('query-data', { data: queryText, topK, includeMetadata: true });
  return result.map((r) => ({ text: r.metadata.text, source: r.metadata.source, score: r.score }));
}
