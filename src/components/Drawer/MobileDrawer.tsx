'use client';

import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {useDrawer} from './DrawerProvider';
import {getCategoryEmoji} from '@/lib/categoryEmoji';
import {resolveImageSrc} from '@/lib/image';

export default function MobileDrawer() {
  const { isOpen, close, categories, recentPosts } = useDrawer();
  const pathname = usePathname();

  useEffect(() => {
    close();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-[59] bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* 드로어 패널 */}
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-[min(288px,85vw)] shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: 'var(--c-bg)' }}
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <span className="text-[16px] font-medium text-[var(--c-text)]">메뉴</span>
          <button
            onClick={close}
            className="w-6 h-6 flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer"
            style={{ color: 'var(--c-toggle)' }}
            aria-label="닫기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* 스크롤 가능한 본문 */}
        <div className="overflow-y-auto h-[calc(100%-57px)]">
          {/* 전체 카테고리 */}
          <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--c-border)' }}>
            <p className="text-[16px] font-medium text-[var(--c-text)] mb-2">전체 카테고리</p>
            <div className="border-b -mx-5 mb-4" style={{ borderColor: 'var(--c-border)' }}/>
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
          <div className="px-5 py-6">
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
        </div>
      </div>
    </>
  );
}
