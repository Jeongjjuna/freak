import {getAllCategories, getGroupedCategories, getPostsByCategory, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';
import PostCard from '@/components/PostCard/PostCard';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({
    category: c.name,
  }));
}

export default async function CategoryPage({params}: Props) {
  const {category} = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = getPostsByCategory(decodedCategory);
  const groups = getGroupedCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-[1160px] mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar groups={groups} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
        <div className="flex items-center gap-2 mb-7 text-[16px] text-[var(--c-muted)]">
          <span className="font-normal text-[var(--c-text)]">카테고리</span>
          <span className="font-light text-[var(--c-text)]">{decodedCategory}</span>
        </div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post}/>
        ))}
      </main>
    </div>
  );
}
