import type { ExpressionSpecification } from 'maplibre-gl';
import type { LayerConfig } from '../config/layers';

// Builds a MapLibre 'step' color expression from a layer's precomputed breaks.
//
// The 'blocks' and 'centroids' sources are shared across many layers, so each
// layer's value is pushed into feature-state under its OWN key (the layer id)
// rather than a single shared 'val' key — feature-state merges keys per
// setFeatureState call, so distinct keys let many layers coexist on one
// source without clobbering each other's values.
export function stepColorExpression(layer: LayerConfig): ExpressionSpecification {
  const { breaks, colorRamp, id } = layer;
  const input: ExpressionSpecification = ['feature-state', id] as unknown as ExpressionSpecification;

  if (breaks.length === 0) {
    return ['case', ['==', input, null], 'transparent', colorRamp[0]] as unknown as ExpressionSpecification;
  }

  const stepArgs: unknown[] = ['step', input, colorRamp[0]];
  breaks.forEach((brk, i) => {
    stepArgs.push(brk, colorRamp[i + 1]);
  });

  return ['case', ['==', input, null], 'transparent', stepArgs] as unknown as ExpressionSpecification;
}

// Builds a smooth MapLibre 'interpolate' color expression from a layer's
// precomputed quantile breaks — same break/color anchoring as the step
// version, but blends continuously between them instead of banding.
export function stretchColorExpression(layer: LayerConfig): ExpressionSpecification {
  const { breaks, colorRamp, id } = layer;
  const input: ExpressionSpecification = ['feature-state', id] as unknown as ExpressionSpecification;

  if (breaks.length === 0) {
    return ['case', ['==', input, null], 'transparent', colorRamp[0]] as unknown as ExpressionSpecification;
  }

  const stops: unknown[] = [];
  breaks.forEach((brk, i) => stops.push(brk, colorRamp[i]));
  // Extrapolate one class-width past the last break so the final color in the
  // ramp is actually reachable (breaks only mark N-1 boundaries for N colors).
  const lastStep = breaks.length > 1 ? breaks[breaks.length - 1] - breaks[breaks.length - 2] : breaks[0];
  stops.push(breaks[breaks.length - 1] + lastStep, colorRamp[colorRamp.length - 1]);

  return [
    'case',
    ['==', input, null],
    'transparent',
    ['interpolate', ['linear'], input, ...stops],
  ] as unknown as ExpressionSpecification;
}

// Layers whose map fill uses a smooth continuous gradient rather than
// discrete stepped bands. Two flavors: "classed" layers (vulnerability, risk,
// exposure) still show a 5-label Very Low..Very High legend; "gradient"
// layers (climate, extreme rainfall/temperature) show a plain color bar.
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

// sqrt-scaled radius so circle AREA (not radius) is proportional to value,
// matching true proportional-symbol cartographic convention. All proportional-
// dot layers in this dataset are percentages (0-100), so maxValue is fixed.
export function sqrtRadiusExpression(stateKey: string, maxValue = 100, minRadius = 4, maxRadius = 22): ExpressionSpecification {
  const input: ExpressionSpecification = ['feature-state', stateKey] as unknown as ExpressionSpecification;
  return [
    'case',
    ['==', input, null],
    0,
    [
      'interpolate',
      ['linear'],
      ['sqrt', ['max', input, 0]],
      0,
      minRadius,
      Math.sqrt(maxValue),
      maxRadius,
    ],
  ] as unknown as ExpressionSpecification;
}
