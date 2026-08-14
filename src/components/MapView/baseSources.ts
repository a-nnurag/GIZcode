import type { Map as MapLibreMap } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { loadBlocks, loadCentroids, loadDistricts } from '../../lib/data';

export interface BaseSourceData {
  blocks: FeatureCollection;
  districts: FeatureCollection;
  centroidFeatures: FeatureCollection;
}

let cachedData: Promise<BaseSourceData> | null = null;

export function loadBaseSourceData(): Promise<BaseSourceData> {
  cachedData ??= Promise.all([loadBlocks(), loadDistricts(), loadCentroids()]).then(
    ([blocks, districts, centroidTable]) => ({
      blocks,
      districts,
      centroidFeatures: {
        type: 'FeatureCollection',
        features: Object.entries(centroidTable).map(([bpcode, coords]) => ({
          type: 'Feature',
          properties: { bpcode },
          geometry: { type: 'Point', coordinates: coords },
        })),
      } satisfies FeatureCollection,
    }),
  );
  return cachedData;
}

// Adds the shared blocks/centroids/districts sources + the district outline
// layer to a MapLibre instance. Every map (main view, and each half of the
// compare view) needs its own copy since sources can't be shared across
// separate Map instances.
export function addBaseSources(map: MapLibreMap, data: BaseSourceData) {
  if (map.getSource('blocks')) return; // already set up (e.g. effect re-run)

  map.addSource('blocks', { type: 'geojson', data: data.blocks, promoteId: 'bpcode' });
  map.addSource('centroids', { type: 'geojson', data: data.centroidFeatures, promoteId: 'bpcode' });
  map.addSource('districts', { type: 'geojson', data: data.districts });

  map.addLayer({
    id: 'districts-outline',
    type: 'line',
    source: 'districts',
    paint: { 'line-color': '#1F2937', 'line-width': 1, 'line-opacity': 0.4 },
  });
}
