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
      <div className="flex items-center gap-2 mb-7 text-[13px] text-[#9b7685] dark:text-[#c49ab0]">
        {trimmed ? (
          <>
            <span className="font-bold text-[#3d2b35] dark:text-[#f5e0ea]">&ldquo;{trimmed}&rdquo;</span>
            <span>검색 결과</span>
          </>
        ) : (
          <span className="font-bold text-[#3d2b35] dark:text-[#f5e0ea]">전체 게시글</span>
        )}
        <span className="text-[12px] border border-[#f0d4de] dark:border-[#3d2030] px-2 py-0.5 rounded-full bg-[#fff0f3] dark:bg-[#25101a]">
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
        <p className="text-[15px] text-[#9b7685] dark:text-[#c49ab0] py-10 text-center">
          검색 결과가 없습니다.
        </p>
      )}
      {!trimmed && (
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/search" />
      )}
    </>
  );
}
