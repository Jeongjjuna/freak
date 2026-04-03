'use client';

import {useEffect, useState} from 'react';

const COLS = 32;
const ROWS = 32;

const COLORS_ORIGINAL_LIGHT = ['#f0f0f0', '#c0c0c0', '#888888', '#444444', '#1a1a1a'];
const COLORS_ORIGINAL_DARK  = ['#1f2937', '#374151', '#6b7280', '#94a3b8', '#e2e8f0'];
const COLORS_SAKURA_LIGHT   = ['#f8e0e8', '#f0b0c8', '#e07098', '#c84070', '#8f1a40'];
const COLORS_SAKURA_DARK    = ['#2d1820', '#5a2840', '#9b4868', '#c87090', '#f0a0c0'];

const generateRandomGrid = () =>
  Array(ROWS).fill(0).map(() =>
    Array(COLS).fill(0).map(() => {
      const rand = Math.random();
      if (rand < 0.5) return 0;
      if (rand < 0.75) return 1;
      if (rand < 0.9) return 2;
      if (rand < 0.97) return 3;
      return 4;
    })
  );

export default function ContributionGrass() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [isDark, setIsDark] = useState(false);
  const [isSakura, setIsSakura] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
      setIsSakura(document.documentElement.classList.contains('sakura'));
    };
    update();
    const observer = new MutationObserver(update);
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

  const COLORS = isSakura
    ? (isDark ? COLORS_SAKURA_DARK : COLORS_SAKURA_LIGHT)
    : (isDark ? COLORS_ORIGINAL_DARK : COLORS_ORIGINAL_LIGHT);

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
