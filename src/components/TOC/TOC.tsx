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
    <div className="border border-[#f0d4de] dark:border-[#3d2030] rounded-md px-6 py-5 mb-10 bg-[#fff0f3] dark:bg-[#25101a]">
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
      <ul className="flex flex-col gap-1.5 border-t border-[#f0d4de] dark:border-[#3d2030] mt-3 pt-3">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={[
              'flex items-center gap-1.5 text-[13px] text-[#3d2b35] dark:text-[#f5e0ea] cursor-pointer hover:opacity-60 transition-opacity',
              item.level === 2 ? 'pl-4' : '',
              item.level === 3 ? 'pl-8 text-[12px] text-[#9b7685] dark:text-[#c49ab0]' : '',
            ].join(' ')}
          >
            <span className="text-[10px] text-[#9b7685] dark:text-[#c49ab0]">›</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
