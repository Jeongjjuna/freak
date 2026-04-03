'use client';

import {useState} from 'react';
import {Bookmark, Heart, Link, MoreHorizontal, Upload} from 'lucide-react';

export default function PostInteraction() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const toggleShare = () => setIsShareOpen(!isShareOpen);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URL이 복사되었습니다.');
    setIsShareOpen(false);
  };

  return (
    <div className="mt-36 mb-10 relative">
      {/* 공유 팝오버 */}
      {isShareOpen && (
        <div
          className="absolute bottom-[calc(100%+16px)] left-16 z-10 w-48 rounded-md shadow-lg py-2 animate-fade-in border"
          style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-border)' }}
        >
          <button
            onClick={copyUrl}
            className="w-full flex items-center px-4 py-3 text-[14px] transition-colors"
            style={{ color: 'var(--c-text)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--c-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Link className="w-4 h-4 mr-3" style={{ color: 'var(--c-muted)' } as React.CSSProperties} />
            URL 복사
          </button>
          {/* 말풍선 꼬리 */}
          <div
            className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 border-r border-b"
            style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-border)' }}
          />
        </div>
      )}

      {/* 버튼들 */}
      <div className="flex items-center gap-2">
        <button
          className="flex items-center gap-1.5 h-10 px-4 border rounded-md transition-colors text-[14px]"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-text)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--c-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--c-bg)')}
        >
          <Heart className="w-4 h-4" style={{ color: 'var(--c-muted)' } as React.CSSProperties} />
          1
        </button>
        <button
          onClick={toggleShare}
          className="flex items-center justify-center w-10 h-10 border rounded-md transition-colors"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--c-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--c-bg)')}
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          className="flex items-center justify-center w-10 h-10 border rounded-md transition-colors"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--c-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--c-bg)')}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <button
          className="flex items-center gap-1.5 h-10 px-4 border rounded-md transition-colors text-[14px]"
          style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-text)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--c-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--c-bg)')}
        >
          <Bookmark className="w-4 h-4" style={{ color: 'var(--c-text)', fill: 'var(--c-text)' } as React.CSSProperties} />
          구독하기
        </button>
      </div>
    </div>
  );
}
