import { useEffect, useRef, useState } from 'react';
import { useMapLibreMap } from '../../hooks/useMapLibreMap';
import { useLayerSync } from './useLayerSync';
import { useMapStore } from '../../state/mapStore';
import { loadIndicators, type IndicatorTable } from '../../lib/data';
import { addBaseSources, loadBaseSourceData } from './baseSources';

const HIT_AREA_LAYER = 'blocks-hit-area';

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { map, ready } = useMapLibreMap(containerRef);
  const [indicators, setIndicators] = useState<IndicatorTable | null>(null);
  const [sourcesReady, setSourcesReady] = useState(false);
  const selectBlock = useMapStore((s) => s.selectBlock);
  const hoverBlock = useMapStore((s) => s.hoverBlock);

  // Base sources + hit-area layer, set up once when the map finishes loading.
  useEffect(() => {
    if (!map || !ready) return;
    let cancelled = false;

    async function setup() {
      const [baseData, indicatorTable] = await Promise.all([loadBaseSourceData(), loadIndicators()]);
      if (cancelled || !map) return;

      addBaseSources(map, baseData);

      // Invisible hit-area over every block, independent of which choropleth
      // layer is currently visible, so clicking/hovering a block always works.
      map.addLayer({
        id: HIT_AREA_LAYER,
        type: 'fill',
        source: 'blocks',
        paint: { 'fill-color': 'transparent' },
      });

      map.on('click', HIT_AREA_LAYER, (e) => {
        const feature = e.features?.[0];
        if (feature) selectBlock(String(feature.properties?.bpcode));
      });
      map.on('mousemove', HIT_AREA_LAYER, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        const feature = e.features?.[0];
        if (feature) hoverBlock(String(feature.properties?.bpcode));
      });
      map.on('mouseleave', HIT_AREA_LAYER, () => {
        map.getCanvas().style.cursor = '';
        hoverBlock(null);
      });

      setIndicators(indicatorTable);
      setSourcesReady(true);
    }

    void setup();
    return () => {
      cancelled = true;
    };
  }, [map, ready, selectBlock, hoverBlock]);

  useLayerSync(map, sourcesReady, indicators);

  return <div ref={containerRef} className="h-full w-full" />;
}
