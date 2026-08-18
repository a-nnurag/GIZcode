import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config';

const BPCODE_PATTERN = /^[A-Za-z0-9_-]+$/;

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

export const blockInfoRouter = Router();

blockInfoRouter.get('/:bpcode', (req, res) => {
  const { bpcode } = req.params;
  if (!BPCODE_PATTERN.test(bpcode)) {
    res.status(400).json({ error: 'Invalid bpcode' });
    return;
  }
  const indicators = loadIndicators();
  res.json({ bpcode, values: indicators[bpcode] ?? {} });
});
