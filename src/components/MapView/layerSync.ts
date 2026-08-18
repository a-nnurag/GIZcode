import type { Map as MapLibreMap } from 'maplibre-gl';
import type { LayerConfig } from '../../config/layers';
import { pmtilesUrl } from '../../lib/pmtilesProtocol';
import { loadStandaloneGeometry } from '../../lib/data';

export function mapLayerId(layerId: string): string {
  return `layer-${layerId}`;
}

// Every value-bearing render type (choropleth, proportional-dot) plus the flat
// single-color ones (flat-extent, raw-lines, raw-polygons) share one strategy: the
// coloring is baked server-side into a pre-rendered raster PMTiles archive (see
// data-pipeline/scripts/09-render-raster-tiles.mjs), so the client never needs the
// underlying indicator values or a fill/circle/line paint expression — just an image.
// raw-points is the one holdout (see addRawPointsLayer below): it needs MapLibre's
// client-side `cluster: true`, which only exists on geojson sources.
function addRasterLayer(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const sourceId = `source-${config.id}`;
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'raster', url: pmtilesUrl(`${config.id}.pmtiles`), tileSize: 256 });
  }
  if (map.getLayer(mapLayerId(config.id))) return;
  map.addLayer({
    id: mapLayerId(config.id),
    type: 'raster',
    source: sourceId,
    paint: { 'raster-opacity': opacity },
  });
}

// Raw Infrastructure & Assets point locations — literal locations, not a graded
// indicator, so no server-baked coloring; kept on the gated-JSON/vector path because
// MapLibre's client-side clustering only works on geojson sources.
async function addRawPointsLayer(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const sourceId = `source-${config.id}`;
  if (!map.getSource(sourceId)) {
    const data = await loadStandaloneGeometry(config.geometryFile!);
    if (map.getSource(sourceId)) return;
    map.addSource(sourceId, { type: 'geojson', data, cluster: true, clusterMaxZoom: 12, clusterRadius: 50 });
  }
  if (map.getLayer(mapLayerId(config.id))) return;
  const id = mapLayerId(config.id);
  map.addLayer({
    id,
    type: 'circle',
    source: sourceId,
    filter: ['has', 'point_count'],
    paint: {
      'circle-radius': ['step', ['get', 'point_count'], 12, 50, 16, 200, 22],
      'circle-color': config.colorRamp[0],
      'circle-opacity': opacity,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
    },
  });
  map.addLayer({
    id: `${id}-cluster-count`,
    type: 'symbol',
    source: sourceId,
    filter: ['has', 'point_count'],
    layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 11 },
    paint: { 'text-color': '#ffffff' },
  });
  map.addLayer({
    id: `${id}-unclustered`,
    type: 'circle',
    source: sourceId,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 4,
      'circle-color': config.colorRamp[0],
      'circle-opacity': opacity,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
    },
  });
}

export function addLayerToMap(map: MapLibreMap, config: LayerConfig, opacity: number) {
  if (config.renderType === 'raw-points') {
    void addRawPointsLayer(map, config, opacity);
    return;
  }
  addRasterLayer(map, config, opacity);
}

export function removeLayerFromMap(map: MapLibreMap, layerId: string) {
  const id = mapLayerId(layerId);
  for (const suffix of ['', '-cluster-count', '-unclustered']) {
    if (map.getLayer(id + suffix)) map.removeLayer(id + suffix);
  }
}

export function setLayerOpacity(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const id = mapLayerId(config.id);
  if (config.renderType === 'raw-points') {
    if (map.getLayer(id)) map.setPaintProperty(id, 'circle-opacity', opacity);
    if (map.getLayer(`${id}-unclustered`)) map.setPaintProperty(`${id}-unclustered`, 'circle-opacity', opacity);
    return;
  }
  if (map.getLayer(id)) map.setPaintProperty(id, 'raster-opacity', opacity);
}
