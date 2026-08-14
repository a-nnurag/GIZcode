// Prefixes a root-relative path with Vite's configured base (e.g. '/GIZcode/'
// on GitHub Pages, '/' everywhere else) so hardcoded '/data/...', '/symbols/...'
// etc. references still resolve when the app isn't served from the domain root.
export function withBase(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
