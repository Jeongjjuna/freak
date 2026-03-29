'use client';

import type {TocItem} from '@/types/post';

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
      <p className="text-[14px] font-bold text-[#737373] mb-3">≡ 목차</p>
      <ul className="flex flex-col gap-1.5">
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
