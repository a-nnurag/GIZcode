import { create } from 'zustand';
import { PINNED_LAYER_IDS, LAYERS_BY_ID } from '../config/layers';
import { CATEGORY_ORDER, type CategoryId } from '../config/categories';

export interface CompareState {
  active: boolean;
  leftLayerId: string | null;
  rightLayerId: string | null;
}

interface MapState {
  // Ordered array = z-order (index 0 = bottom, last = top).
  activeLayers: string[];
  layerOpacity: Record<string, number>;
  hoveredBlock: string | null;
  selectedBlock: string | null;
  compareMode: CompareState;
  selectedCategory: CategoryId | null;

  toggleLayer: (id: string, defaultOpacity: number) => void;
  setOpacity: (id: string, value: number) => void;
  reorderLayers: (newOrderedIds: string[]) => void;
  hoverBlock: (bpcode: string | null) => void;
  selectBlock: (bpcode: string | null) => void;
  setCompareMode: (active: boolean) => void;
  setCompareLayers: (leftLayerId: string | null, rightLayerId: string | null) => void;
  setSelectedCategory: (category: CategoryId | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLayers: [...PINNED_LAYER_IDS],
  layerOpacity: {},
  hoveredBlock: null,
  selectedBlock: null,
  compareMode: { active: false, leftLayerId: null, rightLayerId: null },
  selectedCategory: null,

  toggleLayer: (id, defaultOpacity) =>
    set((state) => {
      const isActive = state.activeLayers.includes(id);
      if (isActive) {
        return { activeLayers: state.activeLayers.filter((l) => l !== id) };
      }
      // Insert at the end of this layer's category block, keeping the array
      // grouped by CATEGORY_ORDER so z-order stays category-based by default
      // regardless of the order layers happen to be toggled on in.
      const category = LAYERS_BY_ID[id]?.category;
      const categoryRank = category ? CATEGORY_ORDER.indexOf(category) : CATEGORY_ORDER.length;
      let insertAt = state.activeLayers.length;
      for (let i = 0; i < state.activeLayers.length; i++) {
        const otherCategory = LAYERS_BY_ID[state.activeLayers[i]]?.category;
        const otherRank = otherCategory ? CATEGORY_ORDER.indexOf(otherCategory) : CATEGORY_ORDER.length;
        if (otherRank > categoryRank) {
          insertAt = i;
          break;
        }
      }
      const activeLayers = [...state.activeLayers];
      activeLayers.splice(insertAt, 0, id);
      return {
        activeLayers,
        layerOpacity: { ...state.layerOpacity, [id]: state.layerOpacity[id] ?? defaultOpacity },
      };
    }),

  setOpacity: (id, value) =>
    set((state) => ({ layerOpacity: { ...state.layerOpacity, [id]: value } })),

  // Repositions exactly the given ids (e.g. one subgroup's active layers) as a
  // contiguous block at the position of their earliest previous occurrence,
  // leaving every other active layer's relative order untouched. Works the
  // same whether newOrderedIds spans a whole flat category or just one
  // subgroup within it.
  reorderLayers: (newOrderedIds) =>
    set((state) => {
      const idSet = new Set(newOrderedIds);
      const firstIndex = state.activeLayers.findIndex((id) => idSet.has(id));
      if (firstIndex === -1) return {};
      const rest = state.activeLayers.filter((id) => !idSet.has(id));
      const insertAt = state.activeLayers.slice(0, firstIndex).filter((id) => !idSet.has(id)).length;
      const activeLayers = [...rest.slice(0, insertAt), ...newOrderedIds, ...rest.slice(insertAt)];
      return { activeLayers };
    }),

  hoverBlock: (bpcode) => set({ hoveredBlock: bpcode }),
  selectBlock: (bpcode) => set({ selectedBlock: bpcode }),

  setCompareMode: (active) =>
    set((state) => ({ compareMode: { ...state.compareMode, active } })),

  setCompareLayers: (leftLayerId, rightLayerId) =>
    set((state) => ({ compareMode: { ...state.compareMode, leftLayerId, rightLayerId } })),

  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
