import { useParams, Link } from 'react-router-dom';
import { ABOUT_PAGES, type ContentBlock } from '../../content/aboutPages';
import { withBase } from '../../lib/basePath';

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="mt-8 mb-3 text-xl font-semibold text-slate-800 first:mt-0">{block.text}</h2>;
    case 'subheading':
      return <h3 className="mt-6 mb-2 text-base font-semibold text-slate-700">{block.text}</h3>;
    case 'paragraph':
      return <p className="mb-4 leading-relaxed text-slate-600">{block.text}</p>;
    case 'list':
      return (
        <ul className="mb-4 list-disc space-y-1.5 pl-5 text-slate-600">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'image':
      return (
        <figure className="mb-4">
          <img src={withBase(block.src)} alt={block.caption} className="w-full rounded-lg border border-slate-200" />
          <figcaption className="mt-1.5 text-xs text-slate-400">{block.caption}</figcaption>
        </figure>
      );
    case 'term':
      return (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="mb-1 flex items-baseline gap-2">
            <p className="font-medium text-slate-800">{block.name}</p>
            {block.unit && (
              <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-xs text-[var(--color-primary)]">
                {block.unit}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{block.description}</p>
        </div>
      );
    default:
      return null;
  }
}

export function AboutPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = ABOUT_PAGES.find((p) => p.slug === slug);

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-slate-500">Page not found.</p>
        <Link to="/" className="text-sm text-[var(--color-primary)] hover:underline">
          Back to map
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/" className="mb-6 inline-block text-sm text-[var(--color-primary)] hover:underline">
          ← Back to map
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-slate-900">{page.title}</h1>
        {page.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </div>
  );
}
