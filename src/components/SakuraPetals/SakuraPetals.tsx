'use client';

import {useEffect, useState} from 'react';

interface PetalConfig {
  id: number;
  left: number;
  duration: number;
  delay: number;
  size: number;
  sway: number;
  rotate: number;
}

export default function SakuraPetals() {
  const [isSakura, setIsSakura] = useState(false);
  const [petals, setPetals] = useState<PetalConfig[]>([]);

  useEffect(() => {
    const update = () => setIsSakura(document.documentElement.classList.contains('sakura'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {attributeFilter: ['class']});
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setPetals(
      Array.from({length: 35}, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 15,
        size: 20 + Math.random() * 18,
        sway: 30 + Math.random() * 50,
        rotate: Math.random() * 360,
      }))
    );
  }, []);

  if (!isSakura || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-30px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationName: 'sakura-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            '--sway': `${p.sway}px`,
            transform: `rotate(${p.rotate}deg)`,
          } as React.CSSProperties}
        >
          <svg viewBox="0 0 20 26" fill="none" width="100%" height="100%">
            <path
              d="M10 0 C15 5 18 12 10 26 C2 12 5 5 10 0Z"
              fill="#ffb7c5"
              opacity="0.85"
            />
            <path
              d="M10 0 C15 5 18 12 10 26 C2 12 5 5 10 0Z"
              fill="#ffe0ea"
              opacity="0.45"
              transform="scale(0.6) translate(3.3, 4)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
