import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type {Post, PostMeta} from '@/types/post';
import { CATEGORY_GROUPS } from './categories';
import { getThumbnailSrc } from './image';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function slugify(filename: string): string {
  return filename.replace(/\.md$/, '');
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  return files
    .map((filename) => {
      const slug = slugify(filename);
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const {data} = matter(raw);

      return {
        slug,
        title: data.title ?? '',
        date: data.date ?? '',
        category: data.category ?? '',
        tags: data.tags ?? [],
        excerpt: data.excerpt ?? '',
        thumbnail: getThumbnailSrc(data.thumbnail, data.category ?? ''),
      } satisfies PostMeta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, 'utf-8');
  const {data, content} = matter(raw);

  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    category: data.category ?? '',
    tags: data.tags ?? [],
    excerpt: data.excerpt ?? '',
    thumbnail: getThumbnailSrc(data.thumbnail, data.category ?? ''),
    content,
  };
}

export function getAllCategories(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  posts.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([name, count]) => ({name, count}))
    .sort((a, b) => b.count - a.count);
}

export interface CategoryGroup {
  name: string;
  categories: { name: string; count: number }[];
}

export function getGroupedCategories(): CategoryGroup[] {
  const categories = getAllCategories();
  const groups: CategoryGroup[] = [];

  // 각 그룹 정의에 따라 분류
  Object.entries(CATEGORY_GROUPS).forEach(([groupName, categoryNames]) => {
    const matched = categories
      .filter((c) => (categoryNames as readonly string[]).includes(c.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (matched.length > 0) {
      groups.push({ name: groupName, categories: matched });
    }
  });

  // 정의되지 않은 카테고리는 Etc 그룹으로 분류
  const allDefinedNames = Object.values(CATEGORY_GROUPS).flat() as readonly string[];
  const etc = categories
    .filter((c) => !allDefinedNames.includes(c.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (etc.length > 0) {
    groups.push({ name: 'Etc', categories: etc });
  }

  return groups;
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getAllPosts();
  const map = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
  return Array.from(map.entries())
    .map(([name, count]) => ({name, count}))
    .sort((a, b) => b.count - a.count);
}

export function getRecentPosts(n: number): PostMeta[] {
  return getAllPosts().slice(0, n);
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function searchPostsByTitle(query: string): PostMeta[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return getAllPosts().filter((p) => p.title.toLowerCase().includes(lower));
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(slugify);
}

export function getCategoryEmoji(category: string): string {
  const c = category.toLowerCase();
  if (c.includes('spring') || c.includes('java')) return '🍃';
  if (c.includes('docker')) return '🐳';
  if (c.includes('devops')) return '🚀';
  return '';
}
