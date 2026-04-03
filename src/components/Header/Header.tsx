'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {useDrawer} from '@/components/Drawer/DrawerProvider';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import SakuraToggle from '@/components/SakuraToggle/SakuraToggle';

export default function Header() {
  const router = useRouter();
  const { open } = useDrawer();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = query.trim();
      router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-shadow duration-300"
      style={{
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--c-bg) 60%, transparent)' : 'var(--c-bg)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* 상단 로고 + 검색 */}
      <div className="max-w-290 mx-auto px-6">
        <div className="flex items-center justify-between h-14 mt-4 mb-4 pl-5 pr-10 max-[1200px]:pr-3">
          <Link href="/" className="text-[20px] font-light text-[var(--c-text)] tracking-tight">
            Freak Blog
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl w-60" style={{ backgroundColor: 'var(--c-search-bg)' }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="8" stroke="var(--c-icon)"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="var(--c-icon-accent)"/>
              </svg>
              <input
                type="text"
                placeholder="키워드를 입력하세요."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-[14px] bg-transparent outline-none w-full font-light"
                style={{ color: 'var(--c-text)' }}
              />
            </div>
            <SakuraToggle />
            <ThemeToggle />
            <button onClick={open} className="min-[1200px]:hidden flex flex-col gap-1.25 w-6 px-0.5 group cursor-pointer" aria-label="메뉴">
              <span className="w-full h-0.75 rounded-full" style={{ backgroundColor: 'var(--c-icon)' }}></span>
              <span className="w-full h-0.75 rounded-full" style={{ backgroundColor: 'var(--c-icon)' }}></span>
              <span className="w-full h-0.75 rounded-full" style={{ backgroundColor: 'var(--c-icon)' }}></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
