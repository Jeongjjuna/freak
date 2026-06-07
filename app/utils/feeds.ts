import type { FeedDoc } from '~/types/feed'

export function feedSlugFromPath(path: string | undefined, stem: string | undefined): string {
  if (path) {
    const m = path.match(/\/feeds?\/(.+)$/)
    if (m) return m[1]!
  }
  if (stem) return stem.replace(/^feeds\//, '')
  return ''
}

export async function fetchAllFeeds(): Promise<FeedDoc[]> {
  // @ts-expect-error queryCollection is auto-imported from @nuxt/content
  const docs = (await queryCollection('feeds').all()) as FeedDoc[]
  return docs
    .slice()
    .sort((a, b) => new Date(b.date ?? '').getTime() - new Date(a.date ?? '').getTime())
}

export async function fetchFeedsByTag(tag: string): Promise<FeedDoc[]> {
  const feeds = await fetchAllFeeds()
  return feeds.filter(f => (f.tags ?? []).includes(tag))
}
