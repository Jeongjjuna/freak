'use client';

import {useEffect, useState} from 'react';

export default function RainToggle() {
  const [rain, setRain] = useState(false);

  useEffect(() => {
    const update = () => setRain(document.documentElement.classList.contains('rain'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {attributeFilter: ['class']});
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = !rain;
    setRain(next);
    if (next) {
      document.documentElement.classList.add('rain');
      document.documentElement.classList.remove('sakura');
      localStorage.setItem('weather-theme', 'rain');
      localStorage.setItem('color-theme', 'original');
    } else {
      document.documentElement.classList.remove('rain');
      localStorage.setItem('weather-theme', 'none');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="비 테마 전환"
      className="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-60 transition-opacity cursor-pointer"
      title={rain ? '오리지널 테마로 전환' : '비 테마로 전환'}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 구름 */}
        <path
          d="M6 16a4 4 0 0 1-.5-7.9A5.5 5.5 0 0 1 16.5 9H17a3 3 0 0 1 0 6H6Z"
          fill={rain ? '#3b82f6' : 'none'}
          stroke={rain ? '#3b82f6' : 'var(--c-toggle)'}
        />
        {/* 빗방울 3개 */}
        <line x1="8"  y1="19" x2="7"  y2="22" stroke={rain ? '#3b82f6' : 'var(--c-toggle)'} />
        <line x1="12" y1="19" x2="11" y2="22" stroke={rain ? '#3b82f6' : 'var(--c-toggle)'} />
        <line x1="16" y1="19" x2="15" y2="22" stroke={rain ? '#3b82f6' : 'var(--c-toggle)'} />
      </svg>
    </button>
  );
}
