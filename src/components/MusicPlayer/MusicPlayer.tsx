'use client';

import { useAudio } from './AudioProvider';

const SONG = {
  title: '꿈을꿨어요',
  artist: '카더가든',
};

export default function MusicPlayer() {
  const { isPlaying, progress, currentTime, duration, togglePlay, handleSeek, isLooping, toggleLoop } = useAudio();

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-5 pb-5 mb-6 border-b border-[var(--c-border)]">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
          style={{
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            animation: isPlaying ? 'cd-spin 3s linear infinite' : 'none',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            {/* 외부 CD 원 */}
            <circle cx="18" cy="18" r="17" fill="var(--c-border)" stroke="var(--c-muted)" strokeWidth="0.5"/>
            {/* 무지개빛 링 영역 */}
            <circle cx="18" cy="18" r="14" fill="var(--c-accent)" opacity="0.15"/>
            <circle cx="18" cy="18" r="10" fill="var(--c-surface)"/>
            {/* 내부 홀 */}
            <circle cx="18" cy="18" r="3" fill="var(--c-bg)" stroke="var(--c-border)" strokeWidth="1"/>
            {/* 반짝임 하이라이트 */}
            <path d="M10 10 Q14 7 20 9" stroke="var(--c-muted)" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-[var(--c-text)] truncate">{SONG.title}</p>
          <p className="text-[11px] text-[var(--c-muted)] truncate">{SONG.artist}</p>
        </div>

        <button
          onClick={togglePlay}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{ background: 'var(--c-progress)', color: '#fff' }}
          aria-label={isPlaying ? '정지' : '재생'}
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="1" width="3" height="10" rx="1"/>
              <rect x="7" y="1" width="3" height="10" rx="1"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 1.5l7 4.5-7 4.5V1.5z"/>
            </svg>
          )}
        </button>

        <button
          onClick={toggleLoop}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            background: isLooping ? 'var(--c-progress)' : 'transparent',
            color: isLooping ? '#fff' : 'var(--c-muted)',
            border: isLooping ? 'none' : '1px solid var(--c-border)',
          }}
          aria-label={isLooping ? '반복 해제' : '반복 재생'}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8.5 0.5 10.5 2.5 8.5 4.5"/>
            <path d="M1.5 5.5V4.5a2 2 0 0 1 2-2h7"/>
            <polyline points="3.5 11.5 1.5 9.5 3.5 7.5"/>
            <path d="M10.5 6.5v1a2 2 0 0 1-2 2h-7"/>
          </svg>
        </button>
      </div>

      <div className="mt-3">
        <div
          className="w-full h-1 rounded-full cursor-pointer"
          style={{ background: 'var(--c-border)' }}
          onClick={handleSeek}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: 'var(--c-progress)' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[var(--c-muted)]">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-[var(--c-muted)]">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
