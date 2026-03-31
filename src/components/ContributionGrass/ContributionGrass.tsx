'use client';

import { useState, useEffect } from 'react';

const COLS = 32;
const ROWS = 32;
const COLORS_LIGHT = ['#f0f0f0', '#c0c0c0', '#888888', '#444444', '#1a1a1a'];
const COLORS_DARK  = ['#1f2937', '#374151', '#6b7280', '#94a3b8', '#e2e8f0'];

const generateRandomGrid = () => 
  Array(ROWS).fill(0).map(() => 
    Array(COLS).fill(0).map(() => {
      // Create a more realistic contribution distribution
      const rand = Math.random();
      if (rand < 0.5) return 0;      // 50% empty
      if (rand < 0.75) return 1;     // 25% light
      if (rand < 0.9) return 2;      // 15% medium
      if (rand < 0.97) return 3;     // 7% dark
      return 4;                      // 3% darkest
    })
  );

export default function ContributionGrass() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setGrid(generateRandomGrid());
    const id = setInterval(() => {
      setGrid(generateRandomGrid());
    }, 3000);
    return () => clearInterval(id);
  }, []);

  if (grid.length === 0) return null;

  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div className="px-5 py-6">
      <div
        className="mx-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: '1.5px',
          width: 'fit-content',
        }}
      >
        {grid.flatMap((row, r) =>
          row.map((level, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '1px',
                backgroundColor: COLORS[level],
                transition: 'background-color 0.8s ease',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
