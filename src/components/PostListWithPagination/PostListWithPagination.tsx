'use client';

import {useSearchParams} from 'next/navigation';
import type {PostMeta} from '@/types/post';
import PostCard from '@/components/PostCard/PostCard';
import Pagination from '@/components/Pagination/Pagination';

const PAGE_SIZE = 6;

interface Props {
  posts: PostMeta[];
}

export default function PostListWithPagination({ posts }: Props) {
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? 1));
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const pagePosts = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <div key={currentPage} className="animate-fade-in">
        {pagePosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/" />
    </>
  );
}
