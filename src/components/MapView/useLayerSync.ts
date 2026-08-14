import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../../state/mapStore';
import { LAYERS_BY_ID } from '../../config/layers';
import type { IndicatorTable } from '../../lib/data';
import { addLayerToMap, removeLayerFromMap, setLayerOpacity, mapLayerId } from './layerSync';

export function useLayerSync(map: MapLibreMap | null, ready: boolean, indicators: IndicatorTable | null) {
  const activeLayers = useMapStore((s) => s.activeLayers);
  const layerOpacity = useMapStore((s) => s.layerOpacity);
  const addedRef = useRef<Set<string>>(new Set());

  // Add/remove layers and enforce z-order whenever the active set or its order changes.
  useEffect(() => {
    if (!map || !ready || !indicators) return;
    const added = addedRef.current;
    const currentIds = new Set(activeLayers);

    for (const id of [...added]) {
      if (!currentIds.has(id)) {
        removeLayerFromMap(map, id);
        added.delete(id);
      }
    }

    for (const id of activeLayers) {
      if (!added.has(id)) {
        const config = LAYERS_BY_ID[id];
        if (!config) continue;
        addLayerToMap(map, config, indicators, layerOpacity[id] ?? config.defaultOpacity);
        added.add(id);
      }
    }

    // activeLayers[0] is meant to render at the bottom, last at the top.
    // moveLayer(id, beforeId) places `id` directly below `beforeId`.
    for (let i = 0; i < activeLayers.length - 1; i++) {
      const belowId = mapLayerId(activeLayers[i]);
      const aboveId = mapLayerId(activeLayers[i + 1]);
      if (map.getLayer(belowId) && map.getLayer(aboveId)) {
        map.moveLayer(belowId, aboveId);
      }
    }
    // layerOpacity intentionally excluded: initial opacity is applied on add,
    // subsequent opacity changes are handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, ready, indicators, activeLayers]);

  // Live opacity updates for already-added layers.
  useEffect(() => {
    if (!map || !ready) return;
    for (const id of activeLayers) {
      const opacity = layerOpacity[id];
      const config = LAYERS_BY_ID[id];
      if (opacity === undefined || !config) continue;
      setLayerOpacity(map, config, opacity);
    }
  }, [map, ready, layerOpacity, activeLayers]);
}
