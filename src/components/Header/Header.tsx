import { wordmark } from '../../config/theme';
import { useMapStore } from '../../state/mapStore';
import { withBase } from '../../lib/basePath';
import { AboutMenu } from './AboutMenu';
import { CategoryNavBar } from '../CategoryNav/CategoryNavBar';

const SYMBOLS = [
  { src: withBase('/symbols/image008.png'), alt: 'Government of Uttarakhand' },
  { src: withBase('/symbols/image009.png'), alt: 'STS' },
  { src: withBase('/symbols/image010.jpg'), alt: 'ICARS' },
  { src: withBase('/symbols/image011.png'), alt: 'Institute of Technology Roorkee' },
  { src: withBase('/symbols/image007.jpg'), alt: 'German Cooperation / GIZ' },
];

export function Header() {
  const compareMode = useMapStore((s) => s.compareMode);
  const setCompareMode = useMapStore((s) => s.setCompareMode);

  return (
    <header className="flex shrink-0 flex-col border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between gap-3 px-4">
        <h1 className="truncate text-base font-semibold text-[var(--color-primary)]">{wordmark}</h1>
        <div className="flex shrink-0 items-center gap-3">
          {SYMBOLS.map((symbol) => (
            <img key={symbol.src} src={symbol.src} alt={symbol.alt} className="h-12 w-auto" />
          ))}
        </div>
      </div>
      <div className="flex h-12 items-center justify-between gap-2 border-t border-slate-100 px-4">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
          <AboutMenu />
          <div className="mx-1 h-5 w-px shrink-0 bg-slate-200" />
          <CategoryNavBar />
        </div>
        <button
          type="button"
          onClick={() => setCompareMode(!compareMode.active)}
          className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            compareMode.active
              ? 'bg-[var(--color-primary)] text-white'
              : 'border border-slate-300 text-slate-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
          }`}
        >
          {compareMode.active ? 'Exit Compare' : 'Compare Layers'}
        </button>
      </div>
    </header>
  );
}
