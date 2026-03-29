'use client';

import type {TocItem} from '@/types/post';
import {getCategoryEmoji} from "@/lib/categoryEmoji";

interface Props {
  items: TocItem[];
}

export default function TOC({items}: Props) {
  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <div className="border border-[#e5e5e5] rounded-md px-6 py-5 mb-10 bg-[#f8f8f8]">
      <span className="flex items-center gap-1">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        목차
      </span>
      <ul className="flex flex-col gap-1.5 border-t border-[#e5e5e5] mt-3 pt-3">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={[
              'flex items-center gap-1.5 text-[13px] text-[#3a4954] cursor-pointer hover:opacity-60 transition-opacity',
              item.level === 2 ? 'pl-4' : '',
              item.level === 3 ? 'pl-8 text-[12px] text-[#737373]' : '',
            ].join(' ')}
          >
            <span className="text-[10px] text-[#737373]">›</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
