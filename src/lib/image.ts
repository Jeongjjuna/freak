const BASE_PATH = '/freak';

export function resolveImageSrc(src: string): string {
  if (src.startsWith('http') || src.startsWith(BASE_PATH)) return src;
  if (src.startsWith('/')) return BASE_PATH + src;
  return src;
}

export function getThumbnailSrc(thumbnailField: string | undefined, category: string): string {
  // 1. 사용자가 직접 경로를 지정한 경우 (이미지 필드가 있고 / 로 시작하거나 http 로 시작할 때)
  if (thumbnailField && (thumbnailField.startsWith('/') || thumbnailField.startsWith('http'))) {
    return thumbnailField;
  }

  // 2. 사용자가 파일명만 지정한 경우 (예: "custom.png")
  if (thumbnailField && thumbnailField.includes('.')) {
    return `/images/thumbnails/${thumbnailField}`;
  }

  // 3. 지정된 썸네일이 없는 경우 카테고리 기반 자동 매핑
  const c = category.toLowerCase().replace(/[^a-z0-9]+/g, '');
  
  const mapping: Record<string, string> = {
    'architecture': 'spring',
    'springboot': 'spring-boot-java',
    'springsecurity': 'security',
    'mysql': 'database',
    'api': 'backend',
    'rabbitmq': 'devops',
    'books': 'books'
  };

  const filename = mapping[c] || category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `/images/thumbnails/${filename}.png`;
}
