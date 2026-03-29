export function getCategoryEmoji(category: string): string {
  const c = category.toLowerCase();
  if (c.includes('spring') || c.includes('java')) return '🍃';
  if (c.includes('docker')) return '🐳';
  if (c.includes('devops')) return '🚀';
  return '';
}
