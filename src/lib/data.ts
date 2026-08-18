import type { FeatureCollection } from 'geojson';
import { apiFetch } from './apiClient';

let blocksPromise: Promise<FeatureCollection> | null = null;
let districtsPromise: Promise<FeatureCollection> | null = null;
const standaloneGeometryPromises = new Map<string, Promise<FeatureCollection>>();

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export function loadBlocks(): Promise<FeatureCollection> {
  blocksPromise ??= fetchJSON('/api/data/blocks.geojson');
  return blocksPromise;
}

export function loadDistricts(): Promise<FeatureCollection> {
  districtsPromise ??= fetchJSON('/api/data/districts.geojson');
  return districtsPromise;
}

export interface BlockInfo {
  bpcode: string;
  values: Record<string, number>;
}

const blockInfoPromises = new Map<string, Promise<BlockInfo>>();

// One block's indicator values, fetched only when that block is actually selected —
// this is the piece that keeps the full analytical table from ever reaching the
// browser in bulk (see BlockDetailPanel.tsx, the only caller).
export function loadBlockInfo(bpcode: string): Promise<BlockInfo> {
  if (!blockInfoPromises.has(bpcode)) {
    blockInfoPromises.set(bpcode, fetchJSON(`/api/block-info/${bpcode}`));
  }
  return blockInfoPromises.get(bpcode)!;
}

// Generic loader for any standalone (non-blocks) geometry file —
// used by the flat-extent hazard masks and the raw Infrastructure & Assets
// point/line/polygon layers alike, cached per file path.
export function loadStandaloneGeometry(file: string): Promise<FeatureCollection> {
  if (!standaloneGeometryPromises.has(file)) {
    standaloneGeometryPromises.set(file, fetchJSON(`/api/data/${file}`));
  }
  return standaloneGeometryPromises.get(file)!;
}

export interface BlockIdentity {
  bpname: string;
  dtname: string;
}

let blockNamesPromise: Promise<Record<string, BlockIdentity>> | null = null;

export function loadBlockNames(): Promise<Record<string, BlockIdentity>> {
  blockNamesPromise ??= loadBlocks().then((blocks) => {
    const out: Record<string, BlockIdentity> = {};
    for (const feature of blocks.features) {
      const props = feature.properties as Record<string, unknown>;
      out[String(props.bpcode)] = { bpname: String(props.bpname), dtname: String(props.dtname) };
    }
    return out;
  });
  return blockNamesPromise;
}
