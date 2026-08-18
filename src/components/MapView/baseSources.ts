import type { Map as MapLibreMap } from 'maplibre-gl';
import { pmtilesUrl } from '../../lib/pmtilesProtocol';

// Adds the shared blocks/districts sources to a MapLibre instance, plus the district
// outline layer. These are boundary-only vector tiles — shape + bpcode/dtname, no
// indicator values (those are baked server-side into the per-layer raster tiles
// instead, see layerSync.ts) — so their only remaining job is feeding the invisible
// hit-area layer (click/hover -> bpcode, see MapView.tsx) and this outline.
//
// Every map (main view, and each half of the compare view) needs its own copy since
// sources can't be shared across separate Map instances.
export function addBaseSources(map: MapLibreMap) {
  if (map.getSource('blocks')) return; // already set up (e.g. effect re-run)

  map.addSource('blocks', { type: 'vector', url: pmtilesUrl('blocks.pmtiles'), promoteId: 'bpcode' });
  map.addSource('districts', { type: 'vector', url: pmtilesUrl('districts.pmtiles') });

  map.addLayer({
    id: 'districts-outline',
    type: 'line',
    source: 'districts',
    'source-layer': 'districts',
    paint: { 'line-color': '#1F2937', 'line-width': 1, 'line-opacity': 0.4 },
  });
}
