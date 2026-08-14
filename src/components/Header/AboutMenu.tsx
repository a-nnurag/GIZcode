import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ABOUT_PAGES } from '../../content/aboutPages';

const ABOUT_ITEMS = [...ABOUT_PAGES.map((p) => ({ slug: p.slug, label: p.title })), { slug: 'consultation', label: 'Consultation' }];
const MENU_WIDTH = 224;

export function AboutMenu() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ top: rect.bottom + 4, left: rect.left });
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
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
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
        className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          open ? 'bg-[var(--color-primary)] text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
        }`}
      >
        About
        <span className="text-[10px]">{open ? '▲' : '▼'}</span>
      </button>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH }}
            className="fixed z-50 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
          >
            {ABOUT_ITEMS.map((item) => (
              <Link
                key={item.slug}
                to={`/about/${item.slug}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
