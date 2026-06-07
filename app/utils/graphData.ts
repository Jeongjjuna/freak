import type { FeedDoc } from '~/types/feed'
import type { PostMeta } from '~/types/post'

export type GraphItemKind = 'feed' | 'post'

export interface GraphItemRef {
  kind: GraphItemKind
  slug: string
  title: string
  date: string
  path?: string
  id?: string
}

export interface GraphNode {
  id: string          // 태그 이름
  count: number       // 그 태그가 달린 항목 수 (피드 + 블로그)
  items: GraphItemRef[]
}

export interface GraphEdge {
  source: string
  target: string
  weight: number      // 같은 항목에서 함께 등장한 횟수
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

function feedToRef(doc: FeedDoc): GraphItemRef {
  const slug = feedSlugFromPath(doc.path, doc.stem)
  // 피드는 title frontmatter가 없으므로 slug를 임시 제목으로 사용
  return {
    kind: 'feed',
    slug,
    title: slug,
    date: doc.date ?? '',
    path: doc.path,
    id: doc.id,
  }
}

function postToRef(post: PostMeta): GraphItemRef {
  return {
    kind: 'post',
    slug: post.slug,
    title: post.title || post.slug,
    date: post.date ?? '',
  }
}

function accumulate(
  tags: string[] | undefined,
  ref: GraphItemRef,
  nodeMap: Map<string, { count: number; items: GraphItemRef[] }>,
  edgeMap: Map<string, number>,
) {
  const list = tags ?? []
  for (const tag of list) {
    const entry = nodeMap.get(tag) ?? { count: 0, items: [] }
    entry.count += 1
    entry.items.push(ref)
    nodeMap.set(tag, entry)
  }

  const sorted = list.slice().sort()
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i]!
      const b = sorted[j]!
      const key = `${a}|${b}`
      edgeMap.set(key, (edgeMap.get(key) ?? 0) + 1)
    }
  }
}

/**
 * 피드 + 블로그 컬렉션을 태그-태그 그래프 데이터로 변환한다.
 *  - 노드: 태그 (count + 그 태그를 가진 항목 목록, 피드/블로그 혼합)
 *  - 엣지: 같은 항목에서 함께 등장한 태그 쌍 (weight = 공동 출현 횟수)
 */
export async function buildTagGraph(): Promise<GraphData> {
  const [feeds, posts] = await Promise.all([fetchAllFeeds(), fetchAllPosts()])

  const nodeMap = new Map<string, { count: number; items: GraphItemRef[] }>()
  const edgeMap = new Map<string, number>()

  for (const feed of feeds) {
    accumulate(feed.tags, feedToRef(feed), nodeMap, edgeMap)
  }
  for (const post of posts) {
    accumulate(post.tags, postToRef(post), nodeMap, edgeMap)
  }

  const nodes: GraphNode[] = Array.from(nodeMap.entries()).map(([id, data]) => ({
    id,
    count: data.count,
    items: data.items.slice().sort(
      (x, y) => new Date(y.date).getTime() - new Date(x.date).getTime(),
    ),
  }))

  const edges: GraphEdge[] = Array.from(edgeMap.entries()).map(([key, weight]) => {
    const [source, target] = key.split('|') as [string, string]
    return { source, target, weight }
  })

  return { nodes, edges }
}
