'use client';

import { useState } from 'react';

interface Props {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function PostLayout({ sidebar, children }: Props) {
  const [isWide, setIsWide] = useState(false);

  return (
    <div className="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out max-[1200px]:hidden ${
          isWide ? 'w-0' : 'w-70'
        }`}
      >
        {sidebar}
      </div>
      <main className="flex-1 min-w-0 bg-white px-10 py-10 max-[1200px]:px-3">
        <div className="flex justify-end mb-4 max-[1200px]:hidden">
          <button
            onClick={() => setIsWide(!isWide)}
            className="flex items-center gap-1.5 text-[13px] text-[#737373] hover:text-[#3a4954] transition-colors cursor-pointer"
          >
            {isWide ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
                </svg>
                기본 보기
              </>
            ) : (
              <>
                넓게 보기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
                </svg>
              </>
            )}
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
