import { useMapStore } from '../../state/mapStore';
import { LAYERS } from '../../config/layers';
import { CATEGORY_LABELS } from '../../config/categories';
import { SyncedMapPair } from './SyncedMapPair';

function LayerSelect({ value, onChange, label }: { value: string | null; onChange: (id: string) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      {label}
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-slate-300 px-2 py-1 text-sm"
      >
        <option value="" disabled>
          Choose a layer…
        </option>
        {LAYERS.filter(
          (l) => !['flat-extent', 'raw-points', 'raw-lines', 'raw-polygons'].includes(l.renderType),
        ).map((l) => (
          <option key={l.id} value={l.id}>
            [{CATEGORY_LABELS[l.category]}] {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CompareView() {
  const compareMode = useMapStore((s) => s.compareMode);
  const setCompareLayers = useMapStore((s) => s.setCompareLayers);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center gap-6 border-b border-slate-200 bg-white px-4 py-2">
        <LayerSelect
          label="Left"
          value={compareMode.leftLayerId}
          onChange={(id) => setCompareLayers(id, compareMode.rightLayerId)}
        />
        <LayerSelect
          label="Right"
          value={compareMode.rightLayerId}
          onChange={(id) => setCompareLayers(compareMode.leftLayerId, id)}
        />
      </div>
      <div className="relative flex-1">
        {compareMode.leftLayerId && compareMode.rightLayerId ? (
          <SyncedMapPair leftLayerId={compareMode.leftLayerId} rightLayerId={compareMode.rightLayerId} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Choose two layers above to compare them side by side.
          </div>
        )}
      </div>
    </div>
  );
}
