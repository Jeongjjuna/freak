import {notFound} from 'next/navigation';
import {getAllCategories, getAllSlugs, getPostBySlug, getRecentPosts} from '@/lib/posts';
import {markdownToHtml} from '@/lib/markdown';
import {extractToc} from '@/lib/toc';
import Sidebar from '@/components/Sidebar/Sidebar';
import TOC from '@/components/TOC/TOC';
import PostContent from '@/components/PostContent/PostContent';
import 'highlight.js/styles/github.css';

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

  return (
    <div className="max-w-[1160px] mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar categories={categories} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-white px-10 py-10 max-[1200px]:px-3">
        <p className="text-[13px] text-[#737373] mb-3">{post.category} · {post.date}</p>
        <h1 className="text-[28px] font-bold leading-[1.4] text-[#3a4954] mb-8 pb-6 border-b border-[#e5e5e5]">
          {post.title}
        </h1>
        <TOC items={toc}/>
        <PostContent html={html}/>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#e5e5e5]">
            {post.tags.map((tag) => (
              <a
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-[12px] text-[#737373] border border-[#e5e5e5] rounded-full px-3 py-0.5 hover:bg-[#f8f8f8] transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
