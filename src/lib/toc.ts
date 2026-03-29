import type {TocItem} from '@/types/post';

export function extractToc(html: string): TocItem[] {
  const headingRegex = /<h([1-3])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-3]>/gi;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    const rawText = match[3].replace(/<[^>]+>/g, '').trim();
    toc.push({id, text: rawText, level});
  }

  return toc;
}
