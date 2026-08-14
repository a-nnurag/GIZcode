import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LAYERS_BY_ID } from '../../config/layers';

interface ChartDatum {
  layerId: string;
  label: string;
  value: number;
  unit: string;
  color: string;
}

export function BlockIndicatorChart({ layerIds, values }: { layerIds: string[]; values: Record<string, number> }) {
  const data: ChartDatum[] = [];
  for (const id of layerIds) {
    const layer = LAYERS_BY_ID[id];
    const value = values[id];
    if (!layer || value === undefined) continue;
    data.push({
      layerId: id,
      label: layer.label,
      value,
      unit: layer.unit,
      color: layer.colorRamp[layer.colorRamp.length - 1],
    });
  }

  if (data.length === 0) {
    return <p className="text-xs text-slate-400">No active layers have data for this block.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 34)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 'auto']} />
        <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(value, _name, item) => {
            const datum = item.payload as ChartDatum;
            return [`${value}${datum.unit === '%' ? '%' : ''}`, datum.label];
          }}
        />
        <Bar dataKey="value" radius={[0, 3, 3, 0]}>
          {data.map((d) => (
            <Cell key={d.layerId} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
