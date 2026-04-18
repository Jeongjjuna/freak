import {Suspense} from 'react';
import {getGroupedCategories, getAllPosts, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';
import PostListWithPagination from '@/components/PostListWithPagination/PostListWithPagination';

export default function Home() {
  const allPosts = getAllPosts();
  const groups = getGroupedCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-[1160px] mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar groups={groups} recentPosts={recentPosts} />
      <main className="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
        <Suspense>
          <PostListWithPagination posts={allPosts} />
        </Suspense>
      </main>
    </div>
  );
}
