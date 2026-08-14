import type { Map as MapLibreMap } from 'maplibre-gl';
import type { LayerConfig } from '../../config/layers';
import type { IndicatorTable } from '../../lib/data';
import { stepColorExpression, stretchColorExpression, isStretchedLayer, sqrtRadiusExpression } from '../../lib/colorScale';
import { loadStandaloneGeometry } from '../../lib/data';

export function mapLayerId(layerId: string): string {
  return `layer-${layerId}`;
}

function pushFeatureState(map: MapLibreMap, source: string, layerId: string, indicators: IndicatorTable) {
  for (const [bpcode, values] of Object.entries(indicators)) {
    const value = values[layerId];
    if (value === undefined) continue;
    map.setFeatureState({ source, id: bpcode }, { [layerId]: value });
  }
}

function addChoroplethLayer(map: MapLibreMap, config: LayerConfig, indicators: IndicatorTable, opacity: number) {
  pushFeatureState(map, 'blocks', config.id, indicators);
  map.addLayer({
    id: mapLayerId(config.id),
    type: 'fill',
    source: 'blocks',
    paint: {
      'fill-color': isStretchedLayer(config) ? stretchColorExpression(config) : stepColorExpression(config),
      'fill-opacity': opacity,
      'fill-outline-color': 'rgba(0,0,0,0.15)',
    },
  });
}

function addProportionalDotLayer(map: MapLibreMap, config: LayerConfig, indicators: IndicatorTable, opacity: number) {
  pushFeatureState(map, 'centroids', config.id, indicators);
  map.addLayer({
    id: mapLayerId(config.id),
    type: 'circle',
    source: 'centroids',
    paint: {
      'circle-radius': sqrtRadiusExpression(config.id),
      'circle-color': stepColorExpression(config),
      'circle-opacity': opacity,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
    },
  });
}

async function addFlatExtentLayer(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const sourceId = `source-${config.id}`;
  if (!map.getSource(sourceId)) {
    const data = await loadStandaloneGeometry(config.geometryFile!);
    if (map.getSource(sourceId)) return; // guard against race if toggled twice quickly
    map.addSource(sourceId, { type: 'geojson', data });
  }
  if (map.getLayer(mapLayerId(config.id))) return;
  map.addLayer({
    id: mapLayerId(config.id),
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': config.colorRamp[0],
      'fill-opacity': opacity,
      'fill-outline-color': config.colorRamp[0],
    },
  });
}

// Raw Infrastructure & Assets geometry — literal locations/lines/patches, not
// a graded indicator, so no feature-state/color-ramp classification here.
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

async function addRawLinesLayer(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const sourceId = `source-${config.id}`;
  if (!map.getSource(sourceId)) {
    const data = await loadStandaloneGeometry(config.geometryFile!);
    if (map.getSource(sourceId)) return;
    map.addSource(sourceId, { type: 'geojson', data });
  }
  if (map.getLayer(mapLayerId(config.id))) return;
  map.addLayer({
    id: mapLayerId(config.id),
    type: 'line',
    source: sourceId,
    paint: { 'line-color': config.colorRamp[0], 'line-opacity': opacity, 'line-width': 1.5 },
  });
}

async function addRawPolygonsLayer(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const sourceId = `source-${config.id}`;
  if (!map.getSource(sourceId)) {
    const data = await loadStandaloneGeometry(config.geometryFile!);
    if (map.getSource(sourceId)) return;
    map.addSource(sourceId, { type: 'geojson', data });
  }
  if (map.getLayer(mapLayerId(config.id))) return;
  map.addLayer({
    id: mapLayerId(config.id),
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': config.colorRamp[0],
      'fill-opacity': opacity,
      'fill-outline-color': config.colorRamp[0],
    },
  });
}

export function addLayerToMap(map: MapLibreMap, config: LayerConfig, indicators: IndicatorTable, opacity: number) {
  switch (config.renderType) {
    case 'choropleth':
      addChoroplethLayer(map, config, indicators, opacity);
      return;
    case 'proportional-dot':
      addProportionalDotLayer(map, config, indicators, opacity);
      return;
    case 'flat-extent':
      void addFlatExtentLayer(map, config, opacity);
      return;
    case 'raw-points':
      void addRawPointsLayer(map, config, opacity);
      return;
    case 'raw-lines':
      void addRawLinesLayer(map, config, opacity);
      return;
    case 'raw-polygons':
      void addRawPolygonsLayer(map, config, opacity);
      return;
  }
}

export function removeLayerFromMap(map: MapLibreMap, layerId: string) {
  const id = mapLayerId(layerId);
  for (const suffix of ['', '-cluster-count', '-unclustered']) {
    if (map.getLayer(id + suffix)) map.removeLayer(id + suffix);
  }
}

export function setLayerOpacity(map: MapLibreMap, config: LayerConfig, opacity: number) {
  const id = mapLayerId(config.id);
  const propByRenderType: Record<LayerConfig['renderType'], string> = {
    choropleth: 'fill-opacity',
    'flat-extent': 'fill-opacity',
    'raw-polygons': 'fill-opacity',
    'proportional-dot': 'circle-opacity',
    'raw-points': 'circle-opacity',
    'raw-lines': 'line-opacity',
  };
  const prop = propByRenderType[config.renderType];
  if (map.getLayer(id)) map.setPaintProperty(id, prop, opacity);
  if (config.renderType === 'raw-points') {
    if (map.getLayer(`${id}-unclustered`)) map.setPaintProperty(`${id}-unclustered`, prop, opacity);
  }
}
