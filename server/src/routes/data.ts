import { Router } from 'express';
import path from 'node:path';
import { config } from '../config';

// Fixed allowlist — never express.static(dataDir) directly, so arbitrary path
// segments (traversal attempts) never reach fs and there's no directory listing.
//
// indicators.json is a TEMPORARY interim inclusion: the target design (see the plan
// doc) serves it one block at a time via routes/blockInfo.ts instead, with layer
// coloring baked into pre-rendered raster tiles so the bulk table never has to reach
// the browser. That requires a tippecanoe + mapgl-tile-renderer pipeline this machine
// can't run yet (Docker engine unreachable, tippecanoe not installed). Until that
// pipeline ships, indicators.json stays here — gated (token + rate limit, no longer a
// raw public static file) but still a bulk fetch — so client-side choropleth/dot
// coloring keeps working. Remove this line once Phase B's raster tiles are live.
const ALLOWED_FILES = new Set([
  'blocks.geojson',
  'districts.geojson',
  'centroids.json',
  'classifications.json',
  'indicators.json',
  'hazard-extents/drought.geojson',
  'hazard-extents/extreme-rainfall.geojson',
  'hazard-extents/forest-fire-risk.geojson',
  'hazard-extents/heatwave-susceptibility.geojson',
  'hazard-extents/landslide.geojson',
  'infrastructure-assets/forest-patches.geojson',
  'infrastructure-assets/power-stations.geojson',
  'infrastructure-assets/roads.geojson',
  'infrastructure-assets/soil-health-points.geojson',
  'infrastructure-assets/spring-locations.geojson',
  'infrastructure-assets/transmission-distribution-lines.geojson',
]);

export const dataRouter = Router();

dataRouter.get(/.*/, (req, res) => {
  const requested = req.path.replace(/^\//, '');
  if (!ALLOWED_FILES.has(requested)) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.sendFile(path.join(config.dataDir, requested), (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ error: 'Not found' });
    }
  });
});
