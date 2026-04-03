import Link from 'next/link';
import Image from 'next/image';
import type {PostMeta} from '@/types/post';
import {getCategoryEmoji} from '@/lib/categoryEmoji';
import ContributionGrass from '@/components/ContributionGrass/ContributionGrass';
import {resolveImageSrc} from '@/lib/image';

interface Props {
  categories: { name: string; count: number }[];
  recentPosts: PostMeta[];
}

export default function Sidebar({categories, recentPosts}: Props) {
  return (
    <aside className="w-70 shrink-0 py-8 min-h-[calc(100vh-96px)] max-[1200px]:hidden">
      {/* 공지사항 */}
      <div className="px-5 pb-2 mb-6 border-b border-[var(--c-border)]">
        <p className="text-[16px] font-medium text-[var(--c-text)]">공지사항</p>
      </div>

      {/* 전체 카테고리 */}
      <div className="px-5 pb-6 mb-6 border-b border-[var(--c-border)]">
        <p className="text-[16px] font-medium text-[var(--c-text)] mb-2">전체 카테고리</p>
        <div className="border-b border-[var(--c-border)] -mx-5 mb-6"/>
        <ul className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={`/categories/${encodeURIComponent(cat.name)}`}
                className="flex justify-between items-center text-[13px] text-[var(--c-text)] hover:opacity-60 transition-opacity py-0.5"
              >
                <span>{cat.name} {getCategoryEmoji(cat.name)}</span>
                <span className="text-[12px] text-[var(--c-muted)]">({cat.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 최근 글 */}
      <div className="px-5 pb-6 mb-6 border-b border-[var(--c-border)]">
        <p className="text-[16px] font-medium text-[var(--c-text)] mb-3">최근 글</p>
        <ul className="flex flex-col gap-3">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`} className="flex gap-2.5 items-start group">
                {post.thumbnail ? (
                  <Image
                    src={resolveImageSrc(post.thumbnail)}
                    alt={post.title}
                    width={56}
                    height={44}
                    className="w-14 h-11 object-cover rounded shrink-0"
                  />
                ) : (
                  <div className="w-14 h-11 rounded shrink-0 bg-[var(--c-empty)]"/>
                )}
                <span className="text-[12px] text-[var(--c-text)] leading-normal line-clamp-2 group-hover:opacity-60 transition-opacity">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 잔디 */}
      <ContributionGrass/>
    </aside>
  );
}
