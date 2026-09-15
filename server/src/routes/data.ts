import { Router } from 'express';
import path from 'node:path';
import { config } from '../config';

// Fixed allowlist — never express.static(dataDir) directly, so arbitrary path
// segments (traversal attempts) never reach fs and there's no directory listing.
//
// indicators.json is intentionally NOT here: it's the actual analytical payload, so
// it's served one block at a time via routes/blockInfo.ts instead — the raster-tile
// pipeline (data-pipeline/scripts/09-render-raster-tiles.mjs) bakes layer coloring
// into pre-rendered tiles server-side, so the bulk table never has to reach the
// browser. centroids.json/classifications.json aren't here either: the former is
// only needed by that same build-time pipeline (not the live client), and nothing in
// the frontend fetches the latter. hazard-extents/* and the raw-lines/raw-polygons
// infra files (roads, forest-patches, transmission-distribution-lines) are also gone
// from here — those render as raster tiles now too (see server/tiles/); only the
// three raw-points layers below still need their geometry as bulk JSON, since
// MapLibre's client-side clustering only works on geojson sources.
const ALLOWED_FILES = new Set([
  'blocks.geojson',
  'districts.geojson',
  'infrastructure-assets/power-stations.geojson',
  'infrastructure-assets/soil-health-points.geojson',
  'infrastructure-assets/spring-locations.geojson',
  'infrastructure-assets/schools.geojson',
  'infrastructure-assets/irrigation-sources.geojson',
  'infrastructure-assets/distribution-transformers.geojson',
  'infrastructure-assets/power-transformers.geojson',
  'infrastructure-assets/sub-stations.geojson',
  'infrastructure-assets/transmission-towers.geojson',
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
