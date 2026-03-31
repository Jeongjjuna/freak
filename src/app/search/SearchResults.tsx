'use client';

import { useSearchParams } from 'next/navigation';
import PostCard from '@/components/PostCard/PostCard';
import Pagination from '@/components/Pagination/Pagination';
import type { PostMeta } from '@/types/post';

const PAGE_SIZE = 6;

interface Props {
  allPosts: PostMeta[];
}

export default function SearchResults({ allPosts }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const trimmed = query.trim();

  const filtered = trimmed
    ? allPosts.filter((p) => p.title.toLowerCase().includes(trimmed.toLowerCase()))
    : allPosts;

  const currentPage = trimmed ? 1 : Math.max(1, Number(searchParams.get('page') ?? 1));
  const totalPages = trimmed ? 1 : Math.ceil(filtered.length / PAGE_SIZE);
  const pagePosts = trimmed
    ? filtered
    : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div className="flex items-center gap-2 mb-7 text-[13px] text-[#737373] dark:text-[#94a3b8]">
        {trimmed ? (
          <>
            <span className="font-bold text-[#3a4954] dark:text-[#e2e8f0]">&ldquo;{trimmed}&rdquo;</span>
            <span>검색 결과</span>
          </>
        ) : (
          <span className="font-bold text-[#3a4954] dark:text-[#e2e8f0]">전체 게시글</span>
        )}
        <span className="text-[12px] border border-[#e5e5e5] dark:border-[#374151] px-2 py-0.5 rounded-full bg-[#f8f8f8] dark:bg-[#1f2937]">
          {filtered.length}개의 결과
        </span>
      </div>
      {pagePosts.length > 0 ? (
        <div key={currentPage} className="animate-fade-in">
          {pagePosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-[15px] text-[#737373] dark:text-[#94a3b8] py-10 text-center">
          검색 결과가 없습니다.
        </p>
      )}
      {!trimmed && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/search" />
      )}
    </>
  );
}
