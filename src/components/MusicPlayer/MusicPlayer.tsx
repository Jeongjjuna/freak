'use client';

import { useEffect, useRef, useState } from 'react';

// public/music/song.mp3 파일을 넣어주세요.
const SONG = {
  title: '꿈을 꿨어요',
  artist: '카더가든',
  src: '/freak/music/song_01.mp3',
};

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="px-5 pb-5 mb-6 border-b border-[var(--c-border)]">
      <audio ref={audioRef} src={SONG.src} preload="metadata" />

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-lg"
          style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}
        >
          {isPlaying ? '🎵' : '🎶'}
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
