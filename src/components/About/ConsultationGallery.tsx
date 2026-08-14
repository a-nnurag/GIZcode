import { useState } from 'react';
import { Link } from 'react-router-dom';

const PHOTO_COUNT = 20;
const PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => `/consultant/consultation-${String(i + 1).padStart(2, '0')}.jpeg`);

export function ConsultationGallery() {
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/" className="mb-6 inline-block text-sm text-[var(--color-primary)] hover:underline">
          ← Back to map
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Consultation</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {PHOTOS.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpenPhoto(src)}
              className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img src={src} alt="Consultation" className="h-full w-full object-cover transition-transform hover:scale-105" />
            </button>
          ))}
        </div>
      </div>

      {openPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setOpenPhoto(null)}
        >
          <img src={openPhoto} alt="Consultation" className="max-h-full max-w-full rounded-lg object-contain" />
          <button
            type="button"
            onClick={() => setOpenPhoto(null)}
            className="absolute top-4 right-4 text-2xl text-white hover:text-slate-300"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
