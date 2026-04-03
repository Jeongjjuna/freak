import {getAllCategories, getAllTags, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function TagsPage() {
  const tags = getAllTags();
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar categories={categories} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-[#fff8f9] dark:bg-[#1a0f14] px-10 py-10 max-[1200px]:px-3">
        <h1 className="text-[20px] font-medium text-[#3d2b35] dark:text-[#f5e0ea] mb-7 border-[#f0d4de]">태그</h1>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="flex items-center text-[13px] text-[#9b7685] dark:text-[#c49ab0] border border-[#f0d4de] dark:border-[#3d2030] rounded-full px-3.5 py-1 hover:bg-[#fff0f3] dark:hover:bg-[#3d2030] hover:text-[#3d2b35] dark:hover:text-[#f5e0ea] transition-colors"
            >
              #{tag.name}
              <span className="text-[11px] text-[#c4a0b0] ml-1">({tag.count})</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
