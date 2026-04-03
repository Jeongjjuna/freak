'use client';

import {useEffect, useState} from 'react';

export default function SakuraToggle() {
  const [sakura, setSakura] = useState(false);

  useEffect(() => {
    setSakura(document.documentElement.classList.contains('sakura'));
  }, []);

  const toggle = () => {
    const next = !sakura;
    setSakura(next);
    if (next) {
      document.documentElement.classList.add('sakura');
      localStorage.setItem('color-theme', 'sakura');
    } else {
      document.documentElement.classList.remove('sakura');
      localStorage.setItem('color-theme', 'original');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="벚꽃 테마 전환"
      className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-60 transition-opacity cursor-pointer"
      title={sakura ? '오리지널 테마로 전환' : '벚꽃 테마로 전환'}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill={sakura ? '#e8739a' : 'none'}
        stroke={sakura ? '#e8739a' : 'var(--c-toggle)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 벚꽃 5장 꽃잎 */}
        <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(72 12 12)" />
        <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(144 12 12)" />
        <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(216 12 12)" />
        <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(288 12 12)" />
        <circle cx="12" cy="12" r="1.8" fill={sakura ? '#fff' : 'var(--c-toggle)'} stroke="none" />
      </svg>
    </button>
  );
}
