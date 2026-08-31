import { getBlockIndicators } from './indicators';
import { resolveBlocksByName, getBlocksInDistrict, getAllBlocks, type BlockIdentity } from './blocks';
import { isValidLayerId, getLayerLabel, layerCatalogSummary } from './layerCatalog';

const MAX_CANDIDATES = 20;
const MAX_TOP_N = 10;

interface ToolDef {
  schema: {
    type: 'function';
    function: { name: string; description: string; parameters: Record<string, unknown> };
  };
  execute: (args: Record<string, unknown>) => unknown;
}

function invalidLayerError(layerId: unknown) {
  return {
    error: `Unknown layerId "${String(layerId)}". Pick a real id from the catalog below.`,
    availableLayers: layerCatalogSummary(),
  };
}

function toCandidates(blocks: BlockIdentity[]) {
  return blocks
    .slice(0, MAX_CANDIDATES)
    .map(({ bpcode, bpname, dtname }) => ({ bpcode, bpname, dtname }));
}

const getBlockData: ToolDef = {
  schema: {
    type: 'function',
    function: {
      name: 'get_block_data',
      description:
        'Look up one block\'s full indicator values by block name, district name, or bpcode. ' +
        'If the query matches more than one block, returns a candidate list instead (no values) ' +
        'so you can ask the user to narrow it down or call again with a more specific name.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'A block name, district name, or bpcode.' },
        },
        required: ['query'],
      },
    },
  },
  execute: ({ query }) => {
    const matches = resolveBlocksByName(String(query ?? ''));
    if (matches.length === 0) return { error: `No block found matching "${query}".` };
    if (matches.length > 1) return { ambiguous: true, candidates: toCandidates(matches) };
    const block = matches[0];
    return { ...block, values: getBlockIndicators(block.bpcode) ?? {} };
  },
};

const getDistrictSummary: ToolDef = {
  schema: {
    type: 'function',
    function: {
      name: 'get_district_summary',
      description:
        'Get one named district\'s mean/min/max for one indicator layer, aggregated across its ' +
        'blocks. Does not return a per-block breakdown.',
      parameters: {
        type: 'object',
        properties: {
          district: { type: 'string', description: 'A district name.' },
          layerId: { type: 'string', description: 'A layer id from the catalog, e.g. "risk_agriculture".' },
        },
        required: ['district', 'layerId'],
      },
    },
  },
  execute: ({ district, layerId }) => {
    if (!isValidLayerId(String(layerId))) return invalidLayerError(layerId);
    const blocks = getBlocksInDistrict(String(district ?? ''));
    if (blocks.length === 0) return { error: `No district found matching "${district}".` };
    const values = blocks
      .map((b) => getBlockIndicators(b.bpcode)?.[String(layerId)])
      .filter((v): v is number => typeof v === 'number');
    if (values.length === 0) return { error: `No values found for "${layerId}" in "${district}".` };
    return {
      district,
      layerId,
      label: getLayerLabel(String(layerId)),
      blockCount: values.length,
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  },
};

const rankBlocks: ToolDef = {
  schema: {
    type: 'function',
    function: {
      name: 'rank_blocks',
      description:
        `Get the top-N (max ${MAX_TOP_N}) blocks statewide for one indicator layer, highest or ` +
        'lowest first. Always a bounded, capped list — never the full block table.',
      parameters: {
        type: 'object',
        properties: {
          layerId: { type: 'string', description: 'A layer id from the catalog, e.g. "risk_agriculture".' },
          direction: { type: 'string', enum: ['highest', 'lowest'] },
          topN: { type: 'number', description: `Number of results to return, capped at ${MAX_TOP_N}.` },
        },
        required: ['layerId', 'direction'],
      },
    },
  },
  execute: ({ layerId, direction, topN }) => {
    if (!isValidLayerId(String(layerId))) return invalidLayerError(layerId);
    const n = Math.max(1, Math.min(Number(topN) || 5, MAX_TOP_N));
    const ranked = getAllBlocks()
      .map((b) => ({ ...b, value: getBlockIndicators(b.bpcode)?.[String(layerId)] }))
      .filter((b): b is BlockIdentity & { value: number } => typeof b.value === 'number')
      .sort((a, b) => (direction === 'lowest' ? a.value - b.value : b.value - a.value))
      .slice(0, n);
    return { layerId, label: getLayerLabel(String(layerId)), direction, results: ranked };
  },
};

export const TOOLS: Record<string, ToolDef> = {
  get_block_data: getBlockData,
  get_district_summary: getDistrictSummary,
  rank_blocks: rankBlocks,
};

export const TOOL_SCHEMAS = Object.values(TOOLS).map((t) => t.schema);
