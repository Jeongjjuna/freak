<script setup lang="ts">
import type { FeedDoc } from '~/types/feed'

const props = defineProps<{
  entry: FeedDoc
}>()

const emit = defineEmits<{
  (e: 'open-detail', entry: FeedDoc): void
}>()

const MAX_COLLAPSED_HEIGHT = 280

const bodyEl = ref<HTMLElement | null>(null)
const isLong = ref(false)

function measure() {
  if (!bodyEl.value || isLong.value) return
  if (bodyEl.value.scrollHeight > MAX_COLLAPSED_HEIGHT + 12) {
    isLong.value = true
  }
}

let observer: ResizeObserver | null = null

onMounted(() => {
  nextTick(measure)
  if (bodyEl.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => measure())
    observer.observe(bodyEl.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

function pad(n: number) {
  return n.toString().padStart(2, '0')
}

function formatAbsolute(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function formatRelative(iso: string): string {
  const d = new Date(iso).getTime()
  if (Number.isNaN(d)) return ''
  const now = Date.now()
  const diff = Math.max(0, Math.floor((now - d) / 1000))
  if (diff < 60) return '방금 전'
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400 / 7)}주 전`
  if (diff < 86400 * 365) return `${Math.floor(diff / 86400 / 30)}개월 전`
  return `${Math.floor(diff / 86400 / 365)}년 전`
}

const relative = computed(() => formatRelative(props.entry.date))
const absolute = computed(() => formatAbsolute(props.entry.date))
</script>

<template>
  <article class="feed-card rounded-xl px-7 py-6 cursor-default">
    <header class="flex items-center gap-2 text-[12px] text-[var(--c-muted)] mb-4">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded-full text-[var(--c-text)] font-medium"
        :style="{ backgroundColor: 'var(--c-bg)' }"
      >
        {{ relative }}
      </span>
      <span class="text-[var(--c-dot)]">·</span>
      <span>{{ absolute }}</span>
    </header>

    <div
      ref="bodyEl"
      class="relative"
      :class="{ 'feed-body-clipped': isLong }"
      :style="isLong ? { maxHeight: `${MAX_COLLAPSED_HEIGHT}px`, overflow: 'hidden' } : {}"
    >
      <ContentRenderer :value="entry" class="prose prose-feed" />
      <div v-if="isLong" class="feed-body-fade" aria-hidden="true" />
    </div>

    <button
      v-if="isLong"
      class="mt-3 inline-flex items-center gap-1 text-[13px] text-[var(--c-link)] hover:opacity-70 transition-opacity cursor-pointer"
      @click="emit('open-detail', entry)"
    >
      자세히
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>

    <div
      v-if="entry.tags && entry.tags.length > 0"
      class="flex flex-wrap gap-x-2 gap-y-1 mt-5 font-serif"
    >
      <NuxtLink
        v-for="tag in entry.tags"
        :key="tag"
        :to="`/tags/${encodeURIComponent(tag)}`"
        class="text-[13px] text-[var(--c-tag-link)] hover:underline"
      >
        #{{ tag }}
      </NuxtLink>
    </div>
  </article>
</template>
