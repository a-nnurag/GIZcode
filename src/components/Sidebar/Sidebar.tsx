import { CATEGORY_LABELS, CATEGORY_SUBGROUPS, SUBGROUP_LABELS } from '../../config/categories';
import { layersByCategory, layersBySubgroup } from '../../config/layers';
import { useMapStore } from '../../state/mapStore';
import { LayerList } from '../CategoryNav/LayerList';
import { SubgroupSection } from '../CategoryNav/SubgroupSection';

export function Sidebar() {
  const selectedCategory = useMapStore((s) => s.selectedCategory);
  const setSelectedCategory = useMapStore((s) => s.setSelectedCategory);
  const assetLayers = layersByCategory('infrastructure');

  const subgroups = selectedCategory ? CATEGORY_SUBGROUPS[selectedCategory] : undefined;
  const categoryLayers = selectedCategory ? layersByCategory(selectedCategory) : [];

  return (
    <div
      data-tour="sidebar"
      className="flex h-full w-80 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white"
    >
      <div className="flex min-h-0 flex-1 flex-col" key={selectedCategory ?? 'none'}>
        {selectedCategory ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
              <h2 className="text-sm font-semibold text-slate-800">{CATEGORY_LABELS[selectedCategory]}</h2>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {categoryLayers.length === 0 ? (
                <p className="px-1.5 py-1 text-xs text-slate-400">No layers in this category.</p>
              ) : subgroups ? (
                subgroups.map((subgroup) => (
                  <SubgroupSection
                    key={subgroup}
                    label={SUBGROUP_LABELS[subgroup] ?? subgroup}
                    layers={layersBySubgroup(selectedCategory, subgroup)}
                  />
                ))
              ) : (
                <LayerList layers={categoryLayers} />
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-slate-400">
            Select Climate, Hazard, Exposure, Vulnerability or Risk above to see its layers.
          </div>
        )}
      </div>

      <div className="max-h-64 shrink-0 overflow-y-auto border-t border-slate-200 px-2 py-2">
        <p className="px-1.5 pb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {CATEGORY_LABELS.infrastructure}
        </p>
        <LayerList layers={assetLayers} />
      </div>
    </div>
  );
}
