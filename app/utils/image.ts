const BASE_PATH = '/freak'

export function resolveImageSrc(src: string): string {
  if (!src) return ''
  if (src.startsWith('http') || src.startsWith(BASE_PATH)) return src
  if (src.startsWith('/')) return BASE_PATH + src
  return src
}

export function getThumbnailSrc(thumbnailField: string | undefined, category: string): string {
  if (thumbnailField && (thumbnailField.startsWith('/') || thumbnailField.startsWith('http'))) {
    return thumbnailField
  }

  if (thumbnailField && thumbnailField.includes('.')) {
    return `/images/thumbnails/${thumbnailField}`
  }

  const c = category.toLowerCase().replace(/[^a-z0-9]+/g, '')

  const mapping: Record<string, string> = {
    architecture: 'spring',
    springboot: 'spring-boot-java',
    springsecurity: 'security',
    mysql: 'database',
    api: 'backend',
    rabbitmq: 'devops',
    books: 'books',
  }

  const filename = mapping[c] || category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `/images/thumbnails/${filename}.png`
}

function normalizeContentImageSrc(src: string): string {
  const trimmed = src.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http') || trimmed.startsWith('/')) return trimmed

  const publicPath = trimmed.match(/(?:^|\/)public\/(.+)$/)
  if (publicPath?.[1]) {
    return `/${publicPath[1]}`
  }

  return trimmed
}

export function extractFirstMarkdownImageSrc(markdown: string | undefined): string {
  if (!markdown) return ''

  const imageMatch = markdown.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/)
  if (imageMatch?.[1]) {
    return normalizeContentImageSrc(imageMatch[1])
  }

  const htmlImageMatch = markdown.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)
  if (htmlImageMatch?.[1]) {
    return normalizeContentImageSrc(htmlImageMatch[1])
  }

  return ''
}

export function extractFirstBodyImageSrc(value: unknown): string {
  if (!value || typeof value !== 'object') return ''

  if (Array.isArray(value)) {
    const [tag, props] = value
    if ((tag === 'img' || tag === 'image') && props && typeof props === 'object') {
      const src = (props as Record<string, unknown>).src
      if (typeof src === 'string') {
        return normalizeContentImageSrc(src)
      }
    }

    for (const item of value) {
      const src = extractFirstBodyImageSrc(item)
      if (src) return src
    }
    return ''
  }

  const record = value as Record<string, unknown>
  const tag = record.tag ?? record.type

  if (tag === 'img' || tag === 'image') {
    const props = record.props as Record<string, unknown> | undefined
    const src = record.src ?? record.url ?? props?.src
    if (typeof src === 'string') {
      return normalizeContentImageSrc(src)
    }
  }

  for (const child of Object.values(record)) {
    const src = extractFirstBodyImageSrc(child)
    if (src) return src
  }

  return ''
}

export function getPostThumbnailSrc(
  thumbnailField: string | undefined,
  category: string,
  rawbody?: string,
  body?: unknown,
): string {
  return (
    (thumbnailField ? getThumbnailSrc(thumbnailField, category) : '') ||
    extractFirstMarkdownImageSrc(rawbody) ||
    extractFirstBodyImageSrc(body) ||
    getThumbnailSrc(undefined, category)
  )
}
