<script setup lang="ts">
import type { FeedDoc } from '~/types/feed'

const props = defineProps<{
  entry: FeedDoc | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function pad(n: number) {
  return n.toString().padStart(2, '0')
}
function formatAbsolute(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const isOpen = computed(() => props.entry !== null)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(isOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen && entry"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/50" @click="emit('close')" />

        <div
          class="relative w-full max-w-[720px] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          :style="{ backgroundColor: 'var(--c-bg)', maxHeight: '85vh' }"
        >
          <header
            class="flex items-center justify-between px-7 py-4 border-b shrink-0"
            :style="{ borderColor: 'var(--c-border)' }"
          >
            <span class="text-[13px] text-[var(--c-muted)]">
              {{ formatAbsolute(entry.date) }}
            </span>
            <button
              class="w-7 h-7 flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer"
              :style="{ color: 'var(--c-toggle)' }"
              aria-label="닫기"
              @click="emit('close')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>

          <div class="feed-scroll overflow-y-auto px-7 py-6">
            <ContentRenderer :value="entry" class="prose" />

            <div
              v-if="entry.tags && entry.tags.length > 0"
              class="flex flex-wrap gap-x-2 gap-y-1 mt-6 pt-4 border-t font-serif"
              :style="{ borderColor: 'var(--c-border)' }"
            >
              <NuxtLink
                v-for="tag in entry.tags"
                :key="tag"
                :to="`/tags/${encodeURIComponent(tag)}`"
                class="text-[14px] text-[var(--c-tag-link)] hover:underline"
                @click="emit('close')"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
