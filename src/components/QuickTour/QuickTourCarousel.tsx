import { useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Modal } from '../shared/Modal';
import { wordmark } from '../../config/theme';

const SLIDES = [
  {
    title: 'Data Layers',
    body: "Pick Climate, Hazard, Expo, Vul or Risk from the header to open its layers in a panel on the left. Check a layer's box to stack it on the map; check several at once to see them layered together.",
  },
  {
    title: 'Metadata',
    body: 'Click the small "i" icon next to any layer to see where its data comes from, what it measures, and any data-quality notes worth knowing before you interpret it.',
  },
  {
    title: 'Legend',
    body: "The legend in the top-right corner always reflects whichever layers are currently active, so the color ramp you're looking at is never a guess.",
  },
];

export function QuickTourCarousel() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage('uk-atlas-tour-seen', false);
  const [slideIndex, setSlideIndex] = useState(0);

  if (hasSeenTour) return null;

  const isLast = slideIndex === SLIDES.length - 1;
  const slide = SLIDES[slideIndex];

  return (
    <Modal onClose={() => setHasSeenTour(true)}>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-primary)]">
        Welcome to {wordmark}
      </p>
      <h2 className="mb-2 text-lg font-semibold text-slate-800">{slide.title}</h2>
      <p className="mb-6 text-sm text-slate-600">{slide.body}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i === slideIndex ? 'bg-[var(--color-primary)]' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setHasSeenTour(true)}
            className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-600"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => (isLast ? setHasSeenTour(true) : setSlideIndex((i) => i + 1))}
            className="rounded-md bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
