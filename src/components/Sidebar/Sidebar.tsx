'use client';

import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type {PostMeta} from '@/types/post';
import {CategoryGroup} from '@/lib/posts';
import {getCategoryEmoji} from '@/lib/categoryEmoji';
import ContributionGrass from '@/components/ContributionGrass/ContributionGrass';
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer';
import {resolveImageSrc} from '@/lib/image';

interface Props {
  groups: CategoryGroup[];
  recentPosts: PostMeta[];
}

export default function Sidebar({groups, recentPosts}: Props) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    // 기본적으로 모든 그룹을 열어둠
    return groups.reduce((acc, group) => ({...acc, [group.name]: true}), {});
  });

  const toggleGroup = (name: string) => {
    setOpenGroups(prev => ({...prev, [name]: !prev[name]}));
  };

  return (
    <aside className="w-70 shrink-0 py-8 min-h-[calc(100vh-96px)] max-[1200px]:hidden">
      {/* 뮤직 플레이어 */}
      <MusicPlayer />

      {/* 이것저것 */}
      <div className="px-5 pb-2 mb-6 border-b border-[var(--c-border)]">
        <p className="text-[16px] font-medium text-[var(--c-text)]">이것저것</p>
      </div>

      {/* 전체 카테고리 */}
      <div className="px-5 pb-6 mb-6 border-b border-[var(--c-border)]">
        <p className="text-[16px] font-medium text-[var(--c-text)] mb-2">전체 카테고리</p>
        <div className="border-b border-[var(--c-border)] -mx-5 mb-6"/>
        <div className="flex flex-col gap-5">
          {groups.map((group) => {
            const isOpen = openGroups[group.name];
            return (
              <div key={group.name} className="flex flex-col">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center justify-between w-full text-[14px] font-bold text-[var(--c-text)] mb-2 group/btn cursor-pointer"
                >
                  <span className="opacity-80 group-hover/btn:opacity-100 transition-opacity">{group.name}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <ul className="flex flex-col gap-1.5 pl-1 border-l-2 border-[var(--c-border)] ml-1 mb-2">
                    {group.categories.map((cat) => (
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
              </div>
            );
          })}
        </div>
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
