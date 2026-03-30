const BASE_PATH = '/freak';

export function resolveImageSrc(src: string): string {
  if (src.startsWith('http') || src.startsWith(BASE_PATH)) return src;
  if (src.startsWith('/')) return BASE_PATH + src;
  return src;
}
