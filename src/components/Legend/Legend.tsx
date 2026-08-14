import { useMapStore } from '../../state/mapStore';
import { LAYERS_BY_ID, type LayerConfig } from '../../config/layers';
import { isStretchedLayer, isClassedLegend, CLASSED_LEGEND_LABELS } from '../../lib/colorScale';

function formatBreak(value: number, unit: string): string {
  const rounded = Math.round(value * 10) / 10;
  return unit === '%' ? `${rounded}%` : String(rounded);
}

function ClassedEntry({ layer }: { layer: LayerConfig }) {
  return (
    <div className="flex overflow-hidden rounded">
      {layer.colorRamp.map((color, i) => (
        <div key={i} className="flex-1">
          <div className="h-3" style={{ backgroundColor: color }} />
          <p className="mt-0.5 text-center text-[9px] leading-tight text-slate-500">{CLASSED_LEGEND_LABELS[i]}</p>
        </div>
      ))}
    </div>
  );
}

function GradientEntry({ layer }: { layer: LayerConfig }) {
  const gradient = `linear-gradient(to right, ${layer.colorRamp.join(', ')})`;
  return (
    <div>
      <div className="h-3 rounded" style={{ background: gradient }} />
      <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
        <span>{formatBreak(layer.breaks[0], layer.unit)}</span>
        <span>{formatBreak(layer.breaks[layer.breaks.length - 1], layer.unit)}</span>
      </div>
    </div>
  );
}

function StepEntry({ layer }: { layer: LayerConfig }) {
  const { colorRamp, breaks, unit } = layer;
  return (
    <div>
      <div className="flex overflow-hidden rounded">
        {colorRamp.map((color, i) => (
          <div key={i} className="flex-1 h-3" style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className="mt-0.5 flex justify-between text-[10px] text-slate-400">
        <span>0</span>
        {breaks.map((b, i) => (
          <span key={i}>{formatBreak(b, unit)}</span>
        ))}
        {breaks.length > 0 && <span>max</span>}
      </div>
    </div>
  );
}

export function Legend() {
  const activeLayers = useMapStore((s) => s.activeLayers);

  if (activeLayers.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white/50 p-3 text-xs text-slate-400 shadow-md backdrop-blur-sm">
        No layers active — toggle one from the panel to see its legend.
      </div>
    );
  }

  return (
    // Sized to show ~3 legend entries before scrolling; background kept
    // translucent so the map stays visible behind it.
    <div className="max-h-[13.5rem] overflow-y-auto rounded-lg border border-slate-200 bg-white/50 p-3 shadow-md backdrop-blur-sm space-y-3">
      {activeLayers.map((id) => {
        const layer = LAYERS_BY_ID[id];
        if (!layer) return null;

        return (
          <div key={id}>
            <p className="mb-1 text-xs font-medium text-slate-700">{layer.label}</p>
            {isClassedLegend(layer) ? (
              <ClassedEntry layer={layer} />
            ) : isStretchedLayer(layer) ? (
              <GradientEntry layer={layer} />
            ) : (
              <StepEntry layer={layer} />
            )}
          </div>
        );
      })}
    </div>
  );
}
