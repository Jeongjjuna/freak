import {getGroupedCategories, getAllTags, getPostsByTag, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';
import PostCard from '@/components/PostCard/PostCard';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((t) => ({tag: t.name}));
}

export default async function TagPage({params}: Props) {
  const {tag} = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const groups = getGroupedCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar groups={groups} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
        <div className="flex items-center gap-2 mb-7 text-[13px] text-[var(--c-muted)]">
          <span className="font-bold text-[var(--c-text)]">#{decodedTag}</span>
          <span>태그</span>
          <a href="/tags"
             className="text-[12px] border border-[var(--c-border)] px-2 py-0.5 rounded-full hover:bg-[var(--c-hover)] transition-colors">전체 태그</a>
        </div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post}/>
        ))}
      </main>
    </div>
  );
}
