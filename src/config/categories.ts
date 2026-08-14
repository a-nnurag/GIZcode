// All valid category ids. Order here drives z-order ranking in mapStore
// (later = rendered on top). Infrastructure isn't shown in the nav bar (it's
// a pinned panel instead — see NAV_CATEGORY_ORDER) but still needs a rank.
export const CATEGORY_ORDER = [
  'climate',
  'exposure',
  'hazards',
  'risk_scores',
  'vulnerability_scores',
  'infrastructure',
] as const;

export type CategoryId = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  climate: 'Climate',
  exposure: 'Exposure',
  hazards: 'Hazard',
  risk_scores: 'Risk',
  vulnerability_scores: 'Vulnerability',
  infrastructure: 'Asset',
};

// Categories shown as clickable buttons in the header nav, in display order.
// Infrastructure is deliberately excluded — it's always visible as a pinned
// panel instead of a nav-selectable category.
export const NAV_CATEGORY_ORDER = ['climate', 'hazards', 'exposure', 'vulnerability_scores', 'risk_scores'] as const;

// Categories with a second level of grouping. Order here is display order
// within the category's floating panel.
export const CATEGORY_SUBGROUPS: Partial<Record<CategoryId, readonly string[]>> = {
  climate: ['temperature', 'precipitation'],
  exposure: ['agriculture', 'energy', 'forest', 'healthcare', 'roads', 'tourism', 'water'],
  hazards: ['extreme_rainfall', 'extreme_temperature', 'drought', 'flood', 'forest_fire', 'landslide'],
  risk_scores: ['agriculture', 'energy', 'healthcare', 'roads', 'water'],
  vulnerability_scores: ['agriculture', 'energy', 'healthcare', 'roads', 'water'],
};

export const SUBGROUP_LABELS: Record<string, string> = {
  temperature: 'Temperature',
  precipitation: 'Precipitation',
  agriculture: 'Agriculture',
  energy: 'Energy',
  forest: 'Forest & Biodiversity',
  healthcare: 'Healthcare',
  roads: 'Roads',
  tourism: 'Tourism',
  water: 'Water',
  extreme_rainfall: 'Extreme Rainfall',
  extreme_temperature: 'Extreme Temperature',
  drought: 'Drought',
  flood: 'Flood',
  forest_fire: 'Forest Fire',
  landslide: 'Landslide',
};
