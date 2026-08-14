import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { LayerConfig } from '../../config/layers';
import { useMapStore } from '../../state/mapStore';
import { Checkbox } from '../shared/Checkbox';
import { Slider } from '../shared/Slider';
import { InfoPopover } from '../shared/InfoPopover';

export function LayerRow({ layer }: { layer: LayerConfig }) {
  const activeLayers = useMapStore((s) => s.activeLayers);
  const opacity = useMapStore((s) => s.layerOpacity[layer.id] ?? layer.defaultOpacity);
  const toggleLayer = useMapStore((s) => s.toggleLayer);
  const setOpacity = useMapStore((s) => s.setOpacity);
  const isActive = activeLayers.includes(layer.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
    disabled: !isActive,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center gap-2 rounded px-1.5 py-1 hover:bg-slate-50"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className={`shrink-0 text-slate-300 ${isActive ? 'cursor-grab hover:text-slate-500' : 'cursor-not-allowed'}`}
        aria-label="Reorder layer"
        title={isActive ? 'Drag to reorder' : undefined}
      >
        ⠿
      </button>
      <div className="min-w-0 flex-1">
        <Checkbox
          checked={isActive}
          onChange={() => toggleLayer(layer.id, layer.defaultOpacity)}
          label={layer.label}
          color={
            layer.renderType === 'flat-extent' ||
            layer.renderType === 'raw-points' ||
            layer.renderType === 'raw-lines' ||
            layer.renderType === 'raw-polygons'
              ? undefined
              : layer.colorRamp[layer.colorRamp.length - 1]
          }
        />
      </div>
      <Slider value={opacity} onChange={(v) => setOpacity(layer.id, v)} disabled={!isActive} />
      <InfoPopover layer={layer} />
    </div>
  );
}
