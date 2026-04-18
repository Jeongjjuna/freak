import {getGroupedCategories, getAllTags, getRecentPosts} from '@/lib/posts';
import Sidebar from '@/components/Sidebar/Sidebar';

export default function TagsPage() {
  const tags = getAllTags();
  const groups = getGroupedCategories();
  const recentPosts = getRecentPosts(5);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <Sidebar groups={groups} recentPosts={recentPosts}/>
      <main className="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
        <h1 className="text-[20px] font-medium text-[var(--c-text)] mb-7">태그</h1>
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`/tags/${encodeURIComponent(tag.name)}`}
              className="flex items-center text-[13px] text-[var(--c-muted)] border border-[var(--c-border)] rounded-full px-3.5 py-1 hover:bg-[var(--c-hover)] hover:text-[var(--c-text)] transition-colors"
            >
              #{tag.name}
              <span className="text-[11px] text-[var(--c-dot)] ml-1">({tag.count})</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
