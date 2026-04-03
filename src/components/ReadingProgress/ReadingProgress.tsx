'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[70]" style={{ height: '3px' }}>
      {/* 진행 바 */}
      <div
        className="h-full bg-[#e8739a]"
        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
      />
      {/* Docker 고래 아이콘 */}
      {progress > 0 && (
        <div
          className="absolute top-0"
          style={{
            left: `${progress}%`,
            transform: 'translateX(-50%) translateY(-1%)',
            transition: 'left 0.1s linear',
          }}
        >
          <Image
            src="/freak/images/docker-whale.png"
            alt="docker whale"
            width={18}
            height={14}
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}
          />
        </div>
      )}
    </div>
  );
}
