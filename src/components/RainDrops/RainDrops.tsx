'use client';

import {useEffect, useState} from 'react';

interface DropConfig {
  id: number;
  left: number;
  duration: number;
  delay: number;
  width: number;
  height: number;
  wind: number;
}

export default function RainDrops() {
  const [isRain, setIsRain] = useState(false);
  const [drops, setDrops] = useState<DropConfig[]>([]);

  useEffect(() => {
    const update = () => setIsRain(document.documentElement.classList.contains('rain'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {attributeFilter: ['class']});
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setDrops(
      Array.from({length: 90}, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 1.2 + Math.random() * 1.0,
        delay: Math.random() * 3,
        width: 3.5 + Math.random() * 2,
        height: 40 + Math.random() * 25,
        wind: 8 + Math.random() * 17,
      }))
    );
  }, []);

  if (!isRain || drops.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.left}%`,
            top: '-30px',
            width: `${d.width}px`,
            height: `${d.height}px`,
            animationName: 'rain-fall',
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            '--wind': `${d.wind}px`,
          } as React.CSSProperties}
        >
          <svg viewBox={`0 0 3 20`} width="100%" height="100%">
            <line
              x1="1.5" y1="0" x2="1.5" y2="20"
              stroke="#93c5fd"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
