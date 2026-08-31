import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config';

interface LayerCatalogEntry {
  id: string;
  label: string;
  unit: string;
  category: string;
  subgroup: string | null;
}

let catalogCache: LayerCatalogEntry[] | null = null;

function loadCatalog(): LayerCatalogEntry[] {
  catalogCache ??= JSON.parse(
    fs.readFileSync(path.join(config.dataDir, 'layer-catalog.json'), 'utf8'),
  ) as LayerCatalogEntry[];
  return catalogCache;
}

export function isValidLayerId(id: string): boolean {
  return loadCatalog().some((l) => l.id === id);
}

export function getLayerLabel(id: string): string | undefined {
  return loadCatalog().find((l) => l.id === id)?.label;
}

// Compact reference for the system prompt so the model can pick a real layer id without a
// separate tool round-trip just to discover what's available.
export function layerCatalogSummary(): string {
  return loadCatalog()
    .map((l) => `${l.id} — ${l.label} (${l.unit})`)
    .join('\n');
}
