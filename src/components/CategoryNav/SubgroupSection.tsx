import { useState } from 'react';
import type { LayerConfig } from '../../config/layers';
import { useMapStore } from '../../state/mapStore';
import { LayerList } from './LayerList';

export function SubgroupSection({ label, layers }: { label: string; layers: LayerConfig[] }) {
  const [expanded, setExpanded] = useState(false);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const activeCount = layers.filter((l) => activeLayers.includes(l.id)).length;

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between px-1.5 py-1.5 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span className="flex items-center gap-2 text-xs text-slate-400">
          {activeCount > 0 && (
            <span className="rounded-full bg-[var(--color-primary)]/10 px-1.5 text-[var(--color-primary)]">
              {activeCount}
            </span>
          )}
          <span>{expanded ? '−' : '+'}</span>
        </span>
      </button>
      {expanded && (
        <div className="pb-1.5">
          <LayerList layers={layers} />
        </div>
      )}
    </div>
  );
}
