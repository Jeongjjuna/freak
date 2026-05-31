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
