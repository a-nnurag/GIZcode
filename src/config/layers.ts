import { z } from 'zod';
import rawLayers from './layers.config.json';
import type { CategoryId } from './categories';

export const layerConfigSchema = z.object({
  id: z.string(),
  label: z.string(),
  category: z.enum(['climate', 'exposure', 'hazards', 'infrastructure', 'risk_scores', 'vulnerability_scores']),
  subgroup: z.string().nullable(),
  pinned: z.boolean(),
  sourceShapefile: z.string(),
  geometrySource: z.enum(['blocks', 'centroids', 'standalone']),
  geometryFile: z.string().optional(),
  unit: z.enum(['%', 'score', 'count', 'none']),
  renderType: z.enum(['choropleth', 'proportional-dot', 'flat-extent', 'raw-points', 'raw-lines', 'raw-polygons']),
  colorRamp: z.array(z.string()).min(1),
  breaks: z.array(z.number()),
  classification: z.enum(['quantile', 'jenks', 'fixed']),
  defaultOpacity: z.number().min(0).max(1),
  defaultVisible: z.boolean(),
  description: z.string(),
  dataQualityNote: z.string().nullable(),
});

export type LayerConfig = z.infer<typeof layerConfigSchema>;

// Fail fast at dev-server/build start if the generated config doesn't match
// what the frontend expects, rather than silently breaking a layer in prod.
export const LAYERS: LayerConfig[] = z.array(layerConfigSchema).parse(rawLayers);

export const LAYERS_BY_ID: Record<string, LayerConfig> = Object.fromEntries(
  LAYERS.map((layer) => [layer.id, layer]),
);

export function layersByCategory(category: CategoryId): LayerConfig[] {
  return LAYERS.filter((layer) => layer.category === category);
}

export function layersBySubgroup(category: CategoryId, subgroup: string): LayerConfig[] {
  return LAYERS.filter((layer) => layer.category === category && layer.subgroup === subgroup);
}

export const PINNED_LAYER_IDS = LAYERS.filter((l) => l.pinned).map((l) => l.id);
