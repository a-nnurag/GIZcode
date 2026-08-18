import { useEffect, useRef, useState } from 'react';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import { BASEMAP_STYLE_URL, INITIAL_VIEW } from '../../config/basemap';
import { addBaseSources } from '../MapView/baseSources';
import { addLayerToMap, removeLayerFromMap } from '../MapView/layerSync';
import { LAYERS_BY_ID } from '../../config/layers';

function useCompareMap(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [map, setMap] = useState<MapLibreMap | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const instance = new maplibregl.Map({
      container: containerRef.current,
      style: BASEMAP_STYLE_URL,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      interactive: true,
    });
    instance.on('load', () => setMap(instance));
    return () => instance.remove();
  }, [containerRef]);
  return map;
}

// `sourcesReady` gates layer-adding until addBaseSources has actually run on this map
// — without it, addLayerToMap can fire before the 'blocks'/'districts' sources exist
// and throw ("There is no source with ID 'blocks'"), which (uncaught, inside a
// useEffect) can crash the whole compare view.
function useForcedLayer(map: MapLibreMap | null, sourcesReady: boolean, layerId: string | null) {
  const currentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!map || !sourcesReady) return;
    if (currentRef.current) {
      removeLayerFromMap(map, currentRef.current);
      currentRef.current = null;
    }
    if (layerId) {
      const config = LAYERS_BY_ID[layerId];
      if (config) {
        addLayerToMap(map, config, config.defaultOpacity);
        currentRef.current = layerId;
      }
    }
  }, [map, sourcesReady, layerId]);
}

export function SyncedMapPair({ leftLayerId, rightLayerId }: { leftLayerId: string | null; rightLayerId: string | null }) {
  const leftContainer = useRef<HTMLDivElement>(null);
  const rightContainer = useRef<HTMLDivElement>(null);
  const leftMap = useCompareMap(leftContainer);
  const rightMap = useCompareMap(rightContainer);
  const [sourcesReady, setSourcesReady] = useState(false);
  const [sliderPct, setSliderPct] = useState(50);
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!leftMap || !rightMap) return;
    addBaseSources(leftMap);
    addBaseSources(rightMap);
    setSourcesReady(true);
  }, [leftMap, rightMap]);

  // Mirror pan/zoom between the two maps, guarding against feedback loops.
  useEffect(() => {
    if (!leftMap || !rightMap) return;

    function mirror(from: MapLibreMap, to: MapLibreMap) {
      if (syncingRef.current) return;
      syncingRef.current = true;
      to.jumpTo({ center: from.getCenter(), zoom: from.getZoom(), bearing: from.getBearing(), pitch: from.getPitch() });
      syncingRef.current = false;
    }

    const onLeftMove = () => mirror(leftMap, rightMap);
    const onRightMove = () => mirror(rightMap, leftMap);
    leftMap.on('move', onLeftMove);
    rightMap.on('move', onRightMove);
    return () => {
      leftMap.off('move', onLeftMove);
      rightMap.off('move', onRightMove);
    };
  }, [leftMap, rightMap]);

  useForcedLayer(leftMap, sourcesReady, leftLayerId);
  useForcedLayer(rightMap, sourcesReady, rightLayerId);

  function handleDividerDrag(e: React.PointerEvent<HTMLDivElement>) {
    const container = e.currentTarget.parentElement;
    if (!container) return;
    const bounds = container.getBoundingClientRect();

    function onMove(moveEvent: PointerEvent) {
      const pct = ((moveEvent.clientX - bounds.left) / bounds.width) * 100;
      setSliderPct(Math.min(96, Math.max(4, pct)));
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/*
        MapLibre attaches its own `maplibregl-map` class directly to the
        element you pass as `container` — it does not wrap it. That class's
        bundled CSS sets `position: relative`, which (at equal specificity,
        later in the cascade than Tailwind's utilities) overrides `absolute`
        on that same element, collapsing its height to 0 since `inset-0` only
        sizes absolutely/fixed-positioned boxes. So `absolute inset-0` must
        live on a wrapper div that MapLibre never touches; the div actually
        passed to `new maplibregl.Map()` just fills that wrapper with
        `h-full w-full` and never needs `position: absolute` itself.
      */}
      <div className="absolute inset-0">
        <div ref={rightContainer} className="h-full w-full" />
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}>
        <div ref={leftContainer} className="h-full w-full" />
      </div>
      <div
        className="absolute inset-y-0 z-10 flex w-6 -ml-3 cursor-ew-resize items-center justify-center"
        style={{ left: `${sliderPct}%` }}
        onPointerDown={handleDividerDrag}
      >
        <div className="h-full w-0.5 bg-white shadow" />
        <div className="absolute h-8 w-8 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
          ⇔
        </div>
      </div>
    </div>
  );
}
