import { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { LayerConfig } from '../../config/layers';
import { useMapStore } from '../../state/mapStore';
import { LayerRow } from '../LayerPanel/LayerRow';

export function LayerList({ layers }: { layers: LayerConfig[] }) {
  const [order, setOrder] = useState(layers.map((l) => l.id));
  const activeLayers = useMapStore((s) => s.activeLayers);
  const reorderLayers = useMapStore((s) => s.reorderLayers);
  const layersById = Object.fromEntries(layers.map((l) => [l.id, l]));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    const nextOrder = arrayMove(order, oldIndex, newIndex);
    setOrder(nextOrder);
    reorderLayers(nextOrder.filter((id) => activeLayers.includes(id)));
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        {order.map((id) => (
          <LayerRow key={id} layer={layersById[id]} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
