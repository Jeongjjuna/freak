import { PLAYLIST } from '~/utils/playlist'
import { useAudioStore } from '~/stores/audio'

let audioEl: HTMLAudioElement | null = null
let initialized = false

function ensureAudio() {
  if (typeof window === 'undefined') return null
  if (audioEl) return audioEl

  const store = useAudioStore()
  const initialSrc = PLAYLIST[store.currentTrackIndex]?.src ?? PLAYLIST[0]!.src

  audioEl = new Audio(initialSrc)
  audioEl.preload = 'metadata'

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
      // 자동으로 다음 곡 (모듈러 순환)
      playTrack(store.currentTrackIndex + 1)
    }
  })

  if (audioEl.readyState >= 1 && audioEl.duration) {
    store.setDuration(audioEl.duration)
  }

  initialized = true
  return audioEl
}

function playTrack(index: number) {
  const el = ensureAudio()
  if (!el) return
  const store = useAudioStore()
  const total = PLAYLIST.length
  if (total === 0) return
  const next = ((index % total) + total) % total
  const track = PLAYLIST[next]!

  store.setCurrentTrackIndex(next)
  el.src = track.src
  el.load()
  el.currentTime = 0
  store.setCurrentTime(0)
  store.setProgress(0)
  store.setDuration(0)
  void el.play()
  store.setPlaying(true)
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

  const next = () => {
    playTrack(store.currentTrackIndex + 1)
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
    next,
    handleSeek,
  }
}
