import type { LayerConfig } from '../config/layers';

// Layers whose map fill uses a smooth continuous gradient rather than
// discrete stepped bands. Two flavors: "classed" layers (vulnerability, risk,
// exposure) still show a 5-label Very Low..Very High legend; "gradient"
// layers (climate, extreme rainfall/temperature) show a plain color bar.
//
// The actual fill-color/circle-radius math that used to live here (and used to
// determine step vs. stretch coloring for the live map) now runs once, server-side,
// in data-pipeline/scripts/09-render-raster-tiles.mjs, which bakes it into
// pre-rendered raster tiles instead — see the raster-tiles plan doc. This function
// stays because Legend.tsx still needs it to pick which legend style to render.
export function isStretchedLayer(layer: LayerConfig): boolean {
  if (layer.renderType !== 'choropleth') return false;
  if (layer.category === 'exposure' || layer.category === 'risk_scores' || layer.category === 'vulnerability_scores') return true;
  if (layer.category === 'climate') return true;
  if (layer.category === 'hazards' && (layer.subgroup === 'extreme_rainfall' || layer.subgroup === 'extreme_temperature')) return true;
  return false;
}

export function isClassedLegend(layer: LayerConfig): boolean {
  return isStretchedLayer(layer) && (layer.category === 'exposure' || layer.category === 'risk_scores' || layer.category === 'vulnerability_scores');
}

export const CLASSED_LEGEND_LABELS = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
