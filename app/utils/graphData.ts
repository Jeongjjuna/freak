import type { FeedDoc } from '~/types/feed'

export interface GraphFeedRef {
  slug: string
  title: string
  date: string
  path?: string
  id?: string
}

export interface GraphNode {
  id: string          // 태그 이름
  count: number       // 그 태그가 달린 피드 수
  feeds: GraphFeedRef[]
}

export interface GraphEdge {
  source: string
  target: string
  weight: number      // 같은 피드에서 함께 등장한 횟수
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

function feedToRef(doc: FeedDoc): GraphFeedRef {
  const slug = feedSlugFromPath(doc.path, doc.stem)
  // 본문 첫 줄을 임시 제목으로 사용 (피드는 title frontmatter 없음)
  const title = slug
  return {
    slug,
    title,
    date: doc.date ?? '',
    path: doc.path,
    id: doc.id,
  }
}

/**
 * 피드 컬렉션을 태그-태그 그래프 데이터로 변환한다.
 *  - 노드: 태그 (count + 그 태그를 가진 피드 목록)
 *  - 엣지: 같은 피드에서 함께 등장한 태그 쌍 (weight = 공동 출현 횟수)
 */
export async function buildFeedTagGraph(): Promise<GraphData> {
  const feeds = await fetchAllFeeds()

  const nodeMap = new Map<string, { count: number; feeds: GraphFeedRef[] }>()
  const edgeMap = new Map<string, number>()

  for (const feed of feeds) {
    const tags = feed.tags ?? []
    const ref = feedToRef(feed)

    for (const tag of tags) {
      const entry = nodeMap.get(tag) ?? { count: 0, feeds: [] }
      entry.count += 1
      entry.feeds.push(ref)
      nodeMap.set(tag, entry)
    }

    const sorted = tags.slice().sort()
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i]!
        const b = sorted[j]!
        const key = `${a}|${b}`
        edgeMap.set(key, (edgeMap.get(key) ?? 0) + 1)
      }
    }
  }

  const nodes: GraphNode[] = Array.from(nodeMap.entries()).map(([id, data]) => ({
    id,
    count: data.count,
    feeds: data.feeds.slice().sort(
      (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime(),
    ),
  }))

  const edges: GraphEdge[] = Array.from(edgeMap.entries()).map(([key, weight]) => {
    const [source, target] = key.split('|') as [string, string]
    return { source, target, weight }
  })

  return { nodes, edges }
}
