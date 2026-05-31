import type { CategoryCount, CategoryGroup, PostMeta } from '~/types/post'

interface PostDoc {
  id?: string
  path?: string
  stem?: string
  title?: string
  date?: string
  category?: string
  tags?: string[]
  excerpt?: string
  thumbnail?: string
  body?: unknown
  rawbody?: string
}

function slugFromPath(path: string | undefined, stem: string | undefined): string {
  if (path) {
    const m = path.match(/\/posts\/(.+)$/)
    if (m) return m[1]!
  }
  if (stem) return stem.replace(/^posts\//, '')
  return ''
}

function toPostMeta(doc: PostDoc): PostMeta {
  const slug = slugFromPath(doc.path, doc.stem)
  return {
    slug,
    title: doc.title ?? '',
    date: doc.date ?? '',
    category: doc.category ?? '',
    tags: doc.tags ?? [],
    excerpt: doc.excerpt ?? '',
    thumbnail: getThumbnailSrc(doc.thumbnail, doc.category ?? ''),
  }
}

export async function fetchAllPosts(): Promise<PostMeta[]> {
  // @ts-expect-error queryCollection is auto-imported from @nuxt/content
  const docs = (await queryCollection('posts').all()) as PostDoc[]
  return docs
    .map(toPostMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function fetchPostBySlug(slug: string): Promise<PostDoc | null> {
  // @ts-expect-error queryCollection is auto-imported from @nuxt/content
  const doc = (await queryCollection('posts').path(`/posts/${slug}`).first()) as PostDoc | null
  return doc
}

export async function fetchAllSlugs(): Promise<string[]> {
  const posts = await fetchAllPosts()
  return posts.map(p => p.slug)
}

export async function fetchAllCategories(): Promise<CategoryCount[]> {
  const posts = await fetchAllPosts()
  const map = new Map<string, number>()
  posts.forEach(p => map.set(p.category, (map.get(p.category) ?? 0) + 1))
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchGroupedCategories(): Promise<CategoryGroup[]> {
  const categories = await fetchAllCategories()
  const groups: CategoryGroup[] = []

  Object.entries(CATEGORY_GROUPS).forEach(([groupName, categoryNames]) => {
    const matched = categories
      .filter(c => (categoryNames as readonly string[]).includes(c.name))
      .sort((a, b) => a.name.localeCompare(b.name))

    if (matched.length > 0) {
      groups.push({ name: groupName, categories: matched })
    }
  })

  const allDefinedNames = Object.values(CATEGORY_GROUPS).flat() as readonly string[]
  const etc = categories
    .filter(c => !allDefinedNames.includes(c.name))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (etc.length > 0) {
    groups.push({ name: 'Etc', categories: etc })
  }

  return groups
}

export async function fetchAllTags(): Promise<CategoryCount[]> {
  const posts = await fetchAllPosts()
  const map = new Map<string, number>()
  posts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) ?? 0) + 1)))
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function fetchRecentPosts(n: number): Promise<PostMeta[]> {
  const posts = await fetchAllPosts()
  return posts.slice(0, n)
}

export async function fetchPostsByCategory(category: string): Promise<PostMeta[]> {
  const posts = await fetchAllPosts()
  return posts.filter(p => p.category === category)
}

export async function fetchPostsByTag(tag: string): Promise<PostMeta[]> {
  const posts = await fetchAllPosts()
  return posts.filter(p => p.tags.includes(tag))
}
