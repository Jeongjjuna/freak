import type { TocItem } from '~/types/post'

interface RawTocLink {
  id?: string
  text?: string
  depth?: number
  children?: RawTocLink[]
}

export function flattenToc(links: RawTocLink[] | undefined, maxDepth = 3): TocItem[] {
  if (!links || links.length === 0) return []
  const result: TocItem[] = []
  const walk = (nodes: RawTocLink[]) => {
    for (const node of nodes) {
      if (node.id && node.text && node.depth && node.depth <= maxDepth) {
        result.push({ id: node.id, text: node.text, level: node.depth })
      }
      if (node.children) walk(node.children)
    }
  }
  walk(links)
  return result
}
