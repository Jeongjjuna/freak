'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
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
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/60 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.06)]' : 'bg-white'}`}>
      {/* 상단 로고 + 검색 */}
      <div className="max-w-290 mx-auto px-6">
        <div className="flex items-center justify-between h-14 mt-4 mb-4 pl-5 pr-10 max-[1200px]:pr-3">
          <Link href="/" className="text-[20px] font-light text-[#3a4954] tracking-tight">
            Freak Blog
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#f5f7f7] px-4 py-2.5 rounded-2xl w-60">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5c5c5c"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#3182f6"/>
              </svg>
              <input
                type="text"
                placeholder="키워드를 입력하세요."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-[14px] text-[#3a4954] placeholder:text-[#8b8b8b] bg-transparent outline-none w-full font-light"
              />
            </div>
            <button className="flex flex-col gap-1.25 w-6 px-0.5 group cursor-pointer" aria-label="메뉴">
              <span className="w-full h-0.75 bg-[#666666] rounded-full"></span>
              <span className="w-full h-0.75 bg-[#666666] rounded-full"></span>
              <span className="w-full h-0.75 bg-[#666666] rounded-full"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
