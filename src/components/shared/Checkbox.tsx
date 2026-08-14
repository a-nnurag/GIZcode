interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  color?: string;
}

export function Checkbox({ checked, onChange, label, color }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
      />
      {color && <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />}
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
