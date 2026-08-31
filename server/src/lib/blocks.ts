import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config';

export interface BlockIdentity {
  bpcode: string;
  bpname: string;
  dtname: string;
}

// Names/districts/bpcodes are not sensitive — /api/data/blocks.geojson already serves all of
// them in bulk to the frontend. Only indicator *values* (indicators.ts) need per-block gating.
let blocksCache: BlockIdentity[] | null = null;

function loadBlocks(): BlockIdentity[] {
  if (!blocksCache) {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(config.dataDir, 'blocks.geojson'), 'utf8'),
    ) as { features: { properties: Record<string, unknown> }[] };
    blocksCache = geojson.features.map((f) => ({
      bpcode: String(f.properties.bpcode),
      bpname: String(f.properties.bpname),
      dtname: String(f.properties.dtname),
    }));
  }
  return blocksCache;
}

export function getAllBlocks(): BlockIdentity[] {
  return loadBlocks();
}

// Case-insensitive substring match against block/district name, or exact match if query looks
// like a bpcode. Used by the chat tool to resolve a natural-language place name.
export function resolveBlocksByName(query: string): BlockIdentity[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const blocks = loadBlocks();
  if (/^\d+$/.test(q)) {
    const exact = blocks.filter((b) => b.bpcode === q);
    if (exact.length > 0) return exact;
  }
  return blocks.filter(
    (b) => b.bpname.toLowerCase().includes(q) || b.dtname.toLowerCase().includes(q),
  );
}

export function getBlocksInDistrict(district: string): BlockIdentity[] {
  const q = district.trim().toLowerCase();
  return loadBlocks().filter((b) => b.dtname.toLowerCase().includes(q));
}
