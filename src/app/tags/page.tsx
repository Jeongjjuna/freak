import {getAllCategories, getAllTags, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function TagsPage() {
  const tags = getAllTags();
  const categories = getAllCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar categories={categories} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-white px-10 py-10 max-[1200px]:px-3">
        <h1 className="text-[20px] font-medium text-[#3a4954] mb-7 border-[#e5e5e5]">태그</h1>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="flex items-center text-[13px] text-[#737373] border border-[#e5e5e5] rounded-full px-3.5 py-1 hover:bg-[#f8f8f8] hover:text-[#3a4954] transition-colors"
            >
              #{tag.name}
              <span className="text-[11px] text-[#909090] ml-1">({tag.count})</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
