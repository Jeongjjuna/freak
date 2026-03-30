import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const BLOG_BASE = 'https://jeongjjuna.github.io/freak';
const README_PATH = path.join(process.cwd(), 'profile-readme/README.md');

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

function categoryToFilename(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getLatestPosts(n = 6): PostSummary[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map((filename): PostSummary => {
      const slug = filename.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      const category = data.category ?? '';
      return {
        slug,
        title: data.title ?? '',
        date: data.date ?? '',
        category,
        excerpt: data.excerpt ?? '',
        thumbnail: data.thumbnail ?? `/images/thumbnails/${categoryToFilename(category)}.png`,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, n);
}

function formatDate(dateStr: string): string {
  // "2025-10-10" → "25.10.10"
  return dateStr.replace(/^20/, '').replaceAll('-', '.');
}

function getThumbnailUrl(post: PostSummary): string {
  if (post.thumbnail) {
    return post.thumbnail.startsWith('http')
      ? post.thumbnail
      : `${BLOG_BASE}${post.thumbnail}`;
  }
  const label = encodeURIComponent(post.category || 'Blog');
  return `https://placehold.co/400x200/f0f4f8/3a4954?text=${label}`;
}

function truncate(str: string, maxLen = 60): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

function generateHtmlTable(posts: PostSummary[]): string {
  const COLS = 3;
  const rows: string[] = [];

  for (let i = 0; i < posts.length; i += COLS) {
    const cells = posts.slice(i, i + COLS).map((post) => {
      const url = `${BLOG_BASE}/posts/${post.slug}/`;
      const img = getThumbnailUrl(post);
      const excerpt = truncate(post.excerpt);
      const date = formatDate(post.date);

      return `<td valign="top">
    <a align="center" href="${url}">
        <img width="150px" src="${img}" alt=""/><br/>
        <div>${post.title}</div>
    </a>
    <div>${excerpt}</div>
    <div>${date}</div>
</td>`;
    });

    rows.push(`<tr>\n${cells.join('\n')}\n</tr>`);
  }

  return `<table><tbody>${rows.join('\n')}</tbody></table>`;
}

function updateReadme(html: string): void {
  const readme = fs.readFileSync(README_PATH, 'utf-8');

  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    console.error('README에서 마커를 찾을 수 없습니다. START/END 마커를 추가해주세요.');
    process.exit(1);
  }

  const updated =
    readme.slice(0, startIdx + START_MARKER.length) +
    '\n' +
    html +
    '\n' +
    readme.slice(endIdx);

  fs.writeFileSync(README_PATH, updated, 'utf-8');
  console.log('README.md 업데이트 완료');
}

const posts = getLatestPosts(6);
const html = generateHtmlTable(posts);
updateReadme(html);
