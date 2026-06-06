import { defineStore } from 'pinia'

interface AudioState {
  isPlaying: boolean
  isLooping: boolean
  progress: number
  currentTime: number
  duration: number
  currentTrackIndex: number
}

export const useAudioStore = defineStore('audio', {
  state: (): AudioState => ({
    isPlaying: false,
    isLooping: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    currentTrackIndex: 0,
  }),
  actions: {
    setPlaying(v: boolean) { this.isPlaying = v },
    toggleLoop() { this.isLooping = !this.isLooping },
    setProgress(p: number) { this.progress = p },
    setCurrentTime(t: number) { this.currentTime = t },
    setDuration(d: number) { this.duration = d },
    setCurrentTrackIndex(i: number) { this.currentTrackIndex = i },
  },
})
