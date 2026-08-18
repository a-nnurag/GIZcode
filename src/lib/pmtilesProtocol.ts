import maplibregl from 'maplibre-gl';
import { PMTiles, Protocol, FetchSource } from 'pmtiles';
import { API_BASE, getAuthHeader } from './apiClient';

// Registered once at module load (ES modules are singletons — every importer shares
// this same instance) so MapLibre can resolve `pmtiles://...` source URLs.
const protocol = new Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

// FetchSource copies this object's entries into a fresh Headers instance on every
// request, so mutating it in place (via .set) is enough to keep every archive's
// requests authenticated — no need to touch each FetchSource individually.
const sharedHeaders = new Headers();

async function refreshAuthHeader() {
  sharedHeaders.set('Authorization', await getAuthHeader());
}

// Proactively refresh well inside the backend's 15-minute token TTL, so a long-lived
// map session never stalls mid-pan waiting on a 401/retry.
void refreshAuthHeader();
setInterval(() => void refreshAuthHeader(), 5 * 60 * 1000);

// Registers (if not already registered) the gated archive `name` (e.g. "blocks.pmtiles"
// or "layer-hazard_drought.pmtiles") with the protocol, and returns the source URL to
// use in a MapLibre style/source definition.
export function pmtilesUrl(name: string): string {
  const archiveUrl = `${API_BASE}/api/tiles/${name}`;
  if (!protocol.get(archiveUrl)) {
    protocol.add(new PMTiles(new FetchSource(archiveUrl, sharedHeaders)));
  }
  return `pmtiles://${archiveUrl}`;
}
