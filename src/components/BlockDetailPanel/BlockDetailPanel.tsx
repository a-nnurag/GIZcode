import { useEffect, useState } from 'react';
import { useMapStore } from '../../state/mapStore';
import { loadBlockNames, loadIndicators, type BlockIdentity, type IndicatorTable } from '../../lib/data';
import { BlockIndicatorChart } from './BlockIndicatorChart';

export function BlockDetailPanel() {
  const selectedBlock = useMapStore((s) => s.selectedBlock);
  const selectBlock = useMapStore((s) => s.selectBlock);
  const activeLayers = useMapStore((s) => s.activeLayers);
  const [indicators, setIndicators] = useState<IndicatorTable | null>(null);
  const [blockNames, setBlockNames] = useState<Record<string, BlockIdentity> | null>(null);

  useEffect(() => {
    void loadIndicators().then(setIndicators);
    void loadBlockNames().then(setBlockNames);
  }, []);

  if (!selectedBlock) return null;

  const identity = blockNames?.[selectedBlock];
  const values = indicators?.[selectedBlock] ?? {};

  return (
    <div className="w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
        <div>
          <p className="text-sm font-semibold text-slate-800">{identity?.bpname ?? selectedBlock}</p>
          {identity && <p className="text-xs text-slate-400">{identity.dtname} District</p>}
        </div>
        <button
          type="button"
          onClick={() => selectBlock(null)}
          className="text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="p-4">
        {activeLayers.length === 0 ? (
          <p className="text-xs text-slate-400">Toggle a layer on to see this block's values.</p>
        ) : (
          <BlockIndicatorChart layerIds={activeLayers} values={values} />
        )}
      </div>
    </div>
  );
}
