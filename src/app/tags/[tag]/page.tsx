import {getAllCategories, getAllTags, getPostsByTag, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';
import PostCard from '@/components/PostCard/PostCard';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((t) => ({tag: encodeURIComponent(t.name)}));
}

export default async function TagPage({params}: Props) {
  const {tag} = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar categories={categories} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-[#fff8f9] dark:bg-[#1a0f14] px-10 py-10 max-[1200px]:px-3">
        <div className="flex items-center gap-2 mb-7 text-[13px] text-[#9b7685] dark:text-[#c49ab0]">
          <span className="font-bold text-[#3d2b35] dark:text-[#f5e0ea]">#{decodedTag}</span>
          <span>태그</span>
          <a href="/tags"
             className="text-[12px] border border-[#f0d4de] dark:border-[#3d2030] px-2 py-0.5 rounded-full hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] transition-colors">전체
            태그</a>
        </div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post}/>
        ))}
      </main>
    </div>
  );
}
