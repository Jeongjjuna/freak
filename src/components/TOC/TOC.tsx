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
    <div
      className="rounded-md px-6 py-5 mb-10 border"
      style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}
    >
      <span className="flex items-center gap-1 text-[var(--c-text)]">
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
      <ul className="flex flex-col gap-1.5 border-t mt-3 pt-3" style={{ borderColor: 'var(--c-border)' }}>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={[
              'flex items-center gap-1.5 text-[13px] cursor-pointer hover:opacity-60 transition-opacity',
              item.level === 2 ? 'pl-4' : '',
              item.level === 3 ? 'pl-8 text-[12px]' : '',
            ].join(' ')}
            style={{ color: item.level === 3 ? 'var(--c-muted)' : 'var(--c-text)' }}
          >
            <span className="text-[10px]" style={{ color: 'var(--c-muted)' }}>›</span>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
