import { Suspense } from 'react';
import { getAllCategories, getAllPosts, getRecentPosts } from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';
import SearchResults from './SearchResults';

export default function SearchPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar categories={categories} recentPosts={recentPosts} />
      <main className="flex-1 min-w-0 bg-[#fff8f9] dark:bg-[#1a0f14] px-10 py-10 max-[1200px]:px-3">
        <Suspense fallback={null}>
          <SearchResults allPosts={allPosts} />
        </Suspense>
      </main>
    </div>
  );
}
