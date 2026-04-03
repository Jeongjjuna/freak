import {notFound} from 'next/navigation';
import Link from 'next/link';
import {
  getAllCategories,
  getAllSlugs,
  getCategoryEmoji,
  getPostBySlug,
  getPostsByCategory,
  getRecentPosts
} from '@/lib/posts';
import {markdownToHtml} from '@/lib/markdown';
import {extractToc} from '@/lib/toc';
import {calcReadingTime} from '@/lib/reading-time';
import Sidebar from '@/components/Sidebar/Sidebar';
import TOC from '@/components/TOC/TOC';
import PostContent from '@/components/PostContent/PostContent';
import PostInteraction from '@/components/PostInteraction/PostInteraction';
import PostLayout from '@/components/PostLayout/PostLayout';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({slug}));
}

export default async function PostPage({params}: Props) {
  const {slug} = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const toc = extractToc(html);
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 5);

  const emoji = getCategoryEmoji(post.category);
  const readingTime = calcReadingTime(post.content);

  return (
    <PostLayout sidebar={<Sidebar categories={categories} recentPosts={recentPosts}/>}>
      <p className="text-[14px] text-[var(--c-muted)] mb-3">{post.category} · {post.date} · {readingTime}분 읽기</p>
      <h1 className="text-[28px] font-medium leading-[1.4] text-[var(--c-text)] mb-8 pb-6 border-b border-[var(--c-border)]">
        {post.title}
      </h1>
      <TOC items={toc}/>
      <PostContent html={html}/>
      <PostInteraction/>

      {/* 관련 글 목록 */}
      <div>
        <div className="py-4 border-b border-[var(--c-border)] mb-6">
          <h3 className="text-[18px] text-[var(--c-muted)] font-normal">
            &apos;{post.category} {emoji}&apos; 카테고리의 다른 글
          </h3>
        </div>
        <ul className="space-y-4">
          {relatedPosts.map((rp) => (
            <li key={rp.slug} className="flex justify-between items-center text-[15px]">
              <Link
                href={`/posts/${rp.slug}`}
                className="text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors line-clamp-1 mr-4"
              >
                {rp.title}
              </Link>
              <span className="text-[var(--c-dot)] text-[13px] whitespace-nowrap">
                {rp.date.replace(/-/g, '.')}
              </span>
            </li>
          ))}
          {relatedPosts.length === 0 && (
            <li className="text-[var(--c-dot)] text-[15px]">이 카테고리에 다른 글이 없습니다.</li>
          )}
        </ul>
      </div>

      {/* 태그 목록 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-14 pt-8 border-t border-[var(--c-border)] font-serif">
          {post.tags.map((tag, index) => (
            <div key={tag} className="flex items-center">
              <Link
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-[17px] text-[var(--c-tag-link)] hover:underline"
              >
                #{tag}
              </Link>
              {index < post.tags.length - 1 && (
                <span className="ml-2 text-[var(--c-muted)]">,</span>
              )}
            </div>
          ))}
        </div>
      )}
    </PostLayout>
  );
}
