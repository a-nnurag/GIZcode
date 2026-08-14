import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl';
import { BASEMAP_STYLE_URL, INITIAL_VIEW } from '../config/basemap';

export function useMapLibreMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: BASEMAP_STYLE_URL,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
    });
    map.addControl(new maplibregl.NavigationControl({}), 'top-right');
    map.on('load', () => setReady(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [containerRef]);

  return { map: mapRef.current, ready };
}
