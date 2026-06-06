<script setup lang="ts">
import { PLAYLIST } from '~/utils/playlist'

const store = useAudioStore()
const player = useAudioPlayer()

const currentTrack = computed(() =>
  PLAYLIST[store.currentTrackIndex] ?? PLAYLIST[0]!,
)

onMounted(() => {
  player.init()
})

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="px-5 pb-5 mb-6 border-b border-[var(--c-border)]">
    <div class="flex items-center gap-3">
      <div
        class="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
        :style="{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border)',
          animation: store.isPlaying ? 'cd-spin 3s linear infinite' : 'none',
        }"
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="17" fill="var(--c-border)" stroke="var(--c-muted)" stroke-width="0.5" />
          <circle cx="18" cy="18" r="14" fill="var(--c-accent)" opacity="0.15" />
          <circle cx="18" cy="18" r="10" fill="var(--c-surface)" />
          <circle cx="18" cy="18" r="3" fill="var(--c-bg)" stroke="var(--c-border)" stroke-width="1" />
          <path d="M10 10 Q14 7 20 9" stroke="var(--c-muted)" stroke-width="1" stroke-linecap="round" opacity="0.5" />
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-[13px] font-medium text-[var(--c-text)] truncate">
          {{ currentTrack.title }}
        </p>
        <p class="text-[11px] text-[var(--c-muted)] truncate">
          {{ currentTrack.artist }}
        </p>
      </div>

      <button
        class="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
        :style="{ background: 'var(--c-progress)', color: '#fff' }"
        :aria-label="store.isPlaying ? '정지' : '재생'"
        @click="player.togglePlay"
      >
        <svg v-if="store.isPlaying" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <rect x="2" y="1" width="3" height="10" rx="1" />
          <rect x="7" y="1" width="3" height="10" rx="1" />
        </svg>
        <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3 1.5l7 4.5-7 4.5V1.5z" />
        </svg>
      </button>

      <button
        class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
        :style="{
          background: 'transparent',
          color: 'var(--c-muted)',
          border: '1px solid var(--c-border)',
        }"
        aria-label="다음 곡"
        @click="player.next"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M1 1.5l4 3-4 3v-6z" />
          <path d="M5.5 1.5l4 3-4 3v-6z" />
          <rect x="9.7" y="1.5" width="1" height="6" rx="0.3" />
        </svg>
      </button>

      <button
        class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
        :style="{
          background: store.isLooping ? 'var(--c-progress)' : 'transparent',
          color: store.isLooping ? '#fff' : 'var(--c-muted)',
          border: store.isLooping ? 'none' : '1px solid var(--c-border)',
        }"
        :aria-label="store.isLooping ? '반복 해제' : '반복 재생'"
        @click="player.toggleLoop"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="8.5 0.5 10.5 2.5 8.5 4.5" />
          <path d="M1.5 5.5V4.5a2 2 0 0 1 2-2h7" />
          <polyline points="3.5 11.5 1.5 9.5 3.5 7.5" />
          <path d="M10.5 6.5v1a2 2 0 0 1-2 2h-7" />
        </svg>
      </button>
    </div>

    <div class="mt-3">
      <div
        class="w-full h-1 rounded-full cursor-pointer"
        :style="{ background: 'var(--c-border)' }"
        @click="player.handleSeek($event)"
      >
        <div
          class="h-full rounded-full transition-all"
          :style="{ width: `${store.progress}%`, background: 'var(--c-progress)' }"
        />
      </div>
      <div class="flex justify-between mt-1">
        <span class="text-[10px] text-[var(--c-muted)]">{{ formatTime(store.currentTime) }}</span>
        <span class="text-[10px] text-[var(--c-muted)]">{{ formatTime(store.duration) }}</span>
      </div>
    </div>
  </div>
</template>
