// Run manually with `npm run ingest` whenever a document is added to or changed in
// knowledge/ — not part of the deployed server. Talks directly to the hosted Upstash Vector
// index, so re-running this against production credentials updates the live chatbot's
// knowledge without a redeploy.
import fs from 'node:fs';
import path from 'node:path';
import mammoth from 'mammoth';
import { config } from '../src/config';
import { upsertVectors } from '../src/lib/vectorStore';

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

async function extractText(filePath: string): Promise<string> {
  if (path.extname(filePath).toLowerCase() === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function splitLong(text: string, size: number, overlap: number): string[] {
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    parts.push(text.slice(i, i + size));
  }
  return parts;
}

// Paragraph-based: groups paragraphs up to ~CHUNK_SIZE chars, carrying a small overlap
// into the next chunk so context isn't lost at a boundary. Falls back to a hard split for
// any single paragraph longer than CHUNK_SIZE — fine for these short conceptual reports.
function chunkText(text: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';
  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;
    if (candidate.length <= CHUNK_SIZE) {
      current = candidate;
      continue;
    }
    if (current) {
      chunks.push(current);
      current = current.slice(-CHUNK_OVERLAP);
    }
    if (para.length > CHUNK_SIZE) {
      chunks.push(...splitLong(para, CHUNK_SIZE, CHUNK_OVERLAP));
      current = '';
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function main() {
  if (!fs.existsSync(config.knowledgeDir)) {
    console.log(`No knowledge directory found at ${config.knowledgeDir}`);
    return;
  }
  const files = fs.readdirSync(config.knowledgeDir).filter((f) => /\.(docx|txt|md)$/i.test(f));
  if (files.length === 0) {
    console.log(`No documents found in ${config.knowledgeDir}`);
    return;
  }

  for (const file of files) {
    const filePath = path.join(config.knowledgeDir, file);
    const text = await extractText(filePath);
    const chunks = chunkText(text);

    const items = chunks.map((chunk, i) => ({
      id: `${file}-${i}`,
      data: chunk,
      metadata: { text: chunk, source: file },
    }));
    await upsertVectors(items);
    console.log(`Ingested ${chunks.length} chunk(s) from ${file}`);
  }
}

main().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
