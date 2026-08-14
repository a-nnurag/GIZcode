import type { FeatureCollection } from 'geojson';
import { withBase } from './basePath';

export type IndicatorTable = Record<string, Record<string, number>>;
export type CentroidTable = Record<string, [number, number]>;

let blocksPromise: Promise<FeatureCollection> | null = null;
let districtsPromise: Promise<FeatureCollection> | null = null;
let indicatorsPromise: Promise<IndicatorTable> | null = null;
let centroidsPromise: Promise<CentroidTable> | null = null;
const standaloneGeometryPromises = new Map<string, Promise<FeatureCollection>>();

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

export function loadBlocks(): Promise<FeatureCollection> {
  blocksPromise ??= fetchJSON(withBase('/data/blocks.geojson'));
  return blocksPromise;
}

export function loadDistricts(): Promise<FeatureCollection> {
  districtsPromise ??= fetchJSON(withBase('/data/districts.geojson'));
  return districtsPromise;
}

export function loadIndicators(): Promise<IndicatorTable> {
  indicatorsPromise ??= fetchJSON(withBase('/data/indicators.json'));
  return indicatorsPromise;
}

export function loadCentroids(): Promise<CentroidTable> {
  centroidsPromise ??= fetchJSON(withBase('/data/centroids.json'));
  return centroidsPromise;
}

// Generic loader for any standalone (non-blocks/centroids) geometry file —
// used by the flat-extent hazard masks and the raw Infrastructure & Assets
// point/line/polygon layers alike, cached per file path.
export function loadStandaloneGeometry(file: string): Promise<FeatureCollection> {
  if (!standaloneGeometryPromises.has(file)) {
    standaloneGeometryPromises.set(file, fetchJSON(withBase(`/data/${file}`)));
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
