import {getAllCategories, getPostsByCategory, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';
import PostCard from '@/components/PostCard/PostCard';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({
    category: encodeURIComponent(c.name),
  }));
}

export default async function CategoryPage({params}: Props) {
  const {category} = await params;
  const decodedCategory = decodeURIComponent(category);
  const posts = getPostsByCategory(decodedCategory);
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-[1160px] mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar categories={categories} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-[#fff8f9] dark:bg-[#1a0f14] px-10 py-10 max-[1200px]:px-3">
        <div className="flex items-center gap-2 mb-7 text-[16px] text-[#9b7685] dark:text-[#c49ab0]">
          <span className="font-nomal text-[#3d2b35] dark:text-[#f5e0ea]">카테고리</span>
          <span className="font-light text-[#3d2b35] dark:text-[#f5e0ea]">{decodedCategory}</span>
        </div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post}/>
        ))}
      </main>
    </div>
  );
}
