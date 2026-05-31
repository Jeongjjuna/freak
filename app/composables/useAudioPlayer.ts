import { useAudioStore } from '~/stores/audio'

let audioEl: HTMLAudioElement | null = null
let initialized = false

const SONG_SRC = '/freak/music/song_01.mp3'

function ensureAudio() {
  if (typeof window === 'undefined') return null
  if (audioEl) return audioEl

  audioEl = new Audio(SONG_SRC)
  audioEl.preload = 'metadata'

  const store = useAudioStore()

  audioEl.addEventListener('timeupdate', () => {
    if (!audioEl) return
    store.setCurrentTime(audioEl.currentTime)
    if (audioEl.duration) {
      store.setProgress((audioEl.currentTime / audioEl.duration) * 100)
    }
  })

  audioEl.addEventListener('loadedmetadata', () => {
    if (!audioEl) return
    store.setDuration(audioEl.duration)
  })

  audioEl.addEventListener('ended', () => {
    if (!audioEl) return
    if (store.isLooping) {
      audioEl.currentTime = 0
      void audioEl.play()
    } else {
      store.setPlaying(false)
    }
  })

  if (audioEl.readyState >= 1 && audioEl.duration) {
    store.setDuration(audioEl.duration)
  }

  initialized = true
  return audioEl
}

export function useAudioPlayer() {
  const store = useAudioStore()

  const init = () => {
    if (!initialized) ensureAudio()
  }

  const togglePlay = () => {
    const el = ensureAudio()
    if (!el) return
    if (store.isPlaying) {
      el.pause()
    } else {
      void el.play()
    }
    store.setPlaying(!store.isPlaying)
  }

  const toggleLoop = () => {
    store.toggleLoop()
  }

  const handleSeek = (e: MouseEvent) => {
    const el = ensureAudio()
    if (!el) return
    const audioDuration = el.duration
    if (!audioDuration || !isFinite(audioDuration)) return
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    el.currentTime = ratio * audioDuration
    store.setCurrentTime(ratio * audioDuration)
    store.setProgress(ratio * 100)
  }

  return {
    init,
    togglePlay,
    toggleLoop,
    handleSeek,
  }
}
