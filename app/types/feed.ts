export interface FeedDoc {
  id?: string
  path?: string
  stem?: string
  date: string
  tags: string[]
  body?: unknown
  rawbody?: string
}

export interface FeedMeta {
  slug: string
  date: string
  tags: string[]
}
