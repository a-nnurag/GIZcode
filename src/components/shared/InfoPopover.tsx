import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { LayerConfig } from '../../config/layers';

const POPOVER_WIDTH = 256;
const GAP = 8;

export function InfoPopover({ layer }: { layer: LayerConfig }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Open to the left of the button by default since layer panels dock to
      // the right edge of the viewport, leaving no room for a right-opening
      // popover; clamp so it never runs off the top or left edge either.
      const left = Math.max(GAP, rect.left - POPOVER_WIDTH - GAP);
      const top = Math.max(GAP, Math.min(rect.top, window.innerHeight - GAP));
      setPosition({ top, left });
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-4 w-4 rounded-full border border-slate-400 text-[10px] leading-none text-slate-500 flex items-center justify-center hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
        aria-label={`About ${layer.label}`}
      >
        i
      </button>
      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
            className="fixed z-50 rounded-md border border-slate-200 bg-white p-3 text-xs shadow-lg"
          >
            <p className="font-medium text-slate-800 mb-1">{layer.label}</p>
            <p className="text-slate-600 mb-2">{layer.description}</p>
            <p className="text-slate-400">Source: {layer.sourceShapefile}</p>
            {layer.dataQualityNote && (
              <p className="mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded p-1.5">
                {layer.dataQualityNote}
              </p>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
