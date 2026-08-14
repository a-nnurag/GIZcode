interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function Slider({ value, onChange, disabled }: SliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1 w-20 accent-[var(--color-primary)] disabled:opacity-30"
      aria-label="Layer opacity"
    />
  );
}
