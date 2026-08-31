import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config';

export const BPCODE_PATTERN = /^[A-Za-z0-9_-]+$/;

type IndicatorTable = Record<string, Record<string, number>>;

// Loaded once at startup, not re-read per request — this is the equivalent of WMS's
// GetFeatureInfo: the full table never leaves the server, only one block's slice does.
let indicatorsCache: IndicatorTable | null = null;

function loadIndicators(): IndicatorTable {
  indicatorsCache ??= JSON.parse(
    fs.readFileSync(path.join(config.dataDir, 'indicators.json'), 'utf8'),
  ) as IndicatorTable;
  return indicatorsCache;
}

export function getBlockIndicators(bpcode: string): Record<string, number> | undefined {
  return loadIndicators()[bpcode];
}
