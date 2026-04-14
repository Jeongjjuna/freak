'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SONG_SRC = '/freak/music/song_01.mp3';

interface AudioContextValue {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  isLooping: boolean;
  toggleLoop: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isLoopingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => { isLoopingRef.current = isLooping; }, [isLooping]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isLoopingRef.current) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggleLoop = () => setIsLooping(prev => !prev);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(prev => !prev);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
  };

  return (
    <AudioContext.Provider value={{ isPlaying, progress, currentTime, duration, togglePlay, handleSeek, isLooping, toggleLoop }}>
      <audio ref={audioRef} src={SONG_SRC} preload="metadata" />
      {children}
    </AudioContext.Provider>
  );
}
