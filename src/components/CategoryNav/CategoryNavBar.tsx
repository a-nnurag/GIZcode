import { useNavigate } from 'react-router-dom';
import { NAV_CATEGORY_ORDER, CATEGORY_LABELS } from '../../config/categories';
import { layersByCategory } from '../../config/layers';
import { useMapStore } from '../../state/mapStore';

export function CategoryNavBar() {
  const navigate = useNavigate();
  const selectedCategory = useMapStore((s) => s.selectedCategory);
  const setSelectedCategory = useMapStore((s) => s.setSelectedCategory);
  const activeLayers = useMapStore((s) => s.activeLayers);

  return (
    <nav data-tour="category-nav" className="flex items-center gap-1 overflow-x-auto">
      {NAV_CATEGORY_ORDER.map((category) => {
        const isSelected = selectedCategory === category;
        const activeCount = layersByCategory(category).filter((l) => activeLayers.includes(l.id)).length;

        return (
          <button
            key={category}
            type="button"
            onClick={() => {
              setSelectedCategory(isSelected ? null : category);
              navigate('/');
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <span>{CATEGORY_LABELS[category]}</span>
            {activeCount > 0 && (
              <span
                className={`rounded-full px-1.5 text-xs ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                }`}
              >
                {activeCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
