import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';

const loadCommonJsModule = createRequire(path.join(process.cwd(), 'scripts/update-readme.ts'));
const matter = loadCommonJsModule('gray-matter') as typeof import('gray-matter');

const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, 'content/posts');
const README_PATH = process.env.PROFILE_README_PATH
  ? path.resolve(ROOT_DIR, process.env.PROFILE_README_PATH)
  : path.join(ROOT_DIR, 'profile-readme/README.md');
const BLOG_BASE = (process.env.BLOG_BASE_URL ?? 'https://jeongjjuna.github.io/freak').replace(/\/$/, '');
const POST_LIMIT = Number.parseInt(process.env.POST_LIMIT ?? '6', 10);

const START_MARKER = '<!-- BLOG-POST-LIST:START -->';
const END_MARKER = '<!-- BLOG-POST-LIST:END -->';

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  thumbnail: string;
}

type FrontMatter = Partial<Record<keyof PostSummary, unknown>>;

function categoryToFilename(category: string): string {
  const c = category.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const mapping: Record<string, string> = {
    architecture: 'spring',
    springboot: 'spring-boot-java',
    springsecurity: 'security',
    mysql: 'database',
    api: 'backend',
    rabbitmq: 'devops',
  };

  const fallback = c.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return mapping[c] ?? (fallback || 'backend');
}

function toStringValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function assertReadableFile(filePath: string, label: string): void {
  if (!existsSync(filePath)) {
    throw new Error(`${label} 파일을 찾을 수 없습니다: ${filePath}`);
  }
}

function assertReadableDirectory(dirPath: string, label: string): void {
  if (!existsSync(dirPath)) {
    throw new Error(`${label} 디렉터리를 찾을 수 없습니다: ${dirPath}`);
  }
}

function parsePost(filename: string): PostSummary {
  const slug = filename.replace(/\.md$/, '');
  const raw = readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
  const { data } = matter(raw) as { data: FrontMatter };
  const title = toStringValue(data.title);
  const date = toStringValue(data.date);
  const category = toStringValue(data.category);
  const excerpt = toStringValue(data.excerpt);
  const thumbnail = toStringValue(data.thumbnail) || `/images/thumbnails/${categoryToFilename(category)}.png`;

  if (!title) {
    throw new Error(`${filename}: title front matter가 비어 있습니다.`);
  }

  if (!date || Number.isNaN(Date.parse(date))) {
    throw new Error(`${filename}: date front matter가 올바른 날짜가 아닙니다.`);
  }

  if (!category) {
    throw new Error(`${filename}: category front matter가 비어 있습니다.`);
  }

  return { slug, title, date, category, excerpt, thumbnail };
}

function getLatestPosts(limit: number): PostSummary[] {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error(`POST_LIMIT은 1 이상의 정수여야 합니다. 현재 값: ${process.env.POST_LIMIT}`);
  }

  assertReadableDirectory(POSTS_DIR, '블로그 글');

  const files = readdirSync(POSTS_DIR).filter((filename) => filename.endsWith('.md'));

  if (files.length === 0) {
    throw new Error(`${POSTS_DIR}에 markdown 파일이 없습니다.`);
  }

  return files
    .map(parsePost)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, limit);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = String(date.getUTCFullYear()).slice(-2);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
}

function getThumbnailUrl(post: PostSummary): string {
  if (post.thumbnail) {
    return /^https?:\/\//.test(post.thumbnail)
      ? post.thumbnail
      : `${BLOG_BASE}${post.thumbnail}`;
  }

  const label = encodeURIComponent(post.category || 'Blog');

  return `https://placehold.co/400x200/f0f4f8/3a4954?text=${label}`;
}

function truncate(str: string, maxLen = 60): string {
  return str.length > maxLen ? `${str.slice(0, maxLen - 3)}...` : str;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateHtmlTable(posts: PostSummary[]): string {
  const columns = 3;
  const rows: string[] = [];

  for (let i = 0; i < posts.length; i += columns) {
    const cells = posts.slice(i, i + columns).map((post) => {
      const url = `${BLOG_BASE}/posts/${post.slug}/`;
      const img = getThumbnailUrl(post);
      const excerpt = truncate(post.excerpt);
      const date = formatDate(post.date);

      return `<td valign="top">
    <a align="center" href="${escapeHtml(url)}">
        <img width="150px" src="${escapeHtml(img)}" alt="${escapeHtml(post.title)}"/><br/>
        <div>${escapeHtml(post.title)}</div>
    </a>
    <div>${escapeHtml(excerpt)}</div>
    <div>${escapeHtml(date)}</div>
</td>`;
    });

    rows.push(`<tr>\n${cells.join('\n')}\n</tr>`);
  }

  return `<table><tbody>${rows.join('\n')}</tbody></table>`;
}

function updateReadme(html: string): void {
  assertReadableFile(README_PATH, 'README');

  const readme = readFileSync(README_PATH, 'utf-8');

  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`README에서 마커를 찾을 수 없습니다. ${START_MARKER} / ${END_MARKER}를 추가해주세요.`);
  }

  if (startIdx > endIdx) {
    throw new Error('README 마커 순서가 올바르지 않습니다. START 마커가 END 마커보다 앞에 있어야 합니다.');
  }

  const updated =
    readme.slice(0, startIdx + START_MARKER.length) +
    '\n' +
    html +
    '\n' +
    readme.slice(endIdx);

  writeFileSync(README_PATH, updated, 'utf-8');
  console.log(`README.md 업데이트 완료: ${README_PATH}`);
}

function main(): void {
  const posts = getLatestPosts(POST_LIMIT);
  const html = generateHtmlTable(posts);

  updateReadme(html);
}

main();
