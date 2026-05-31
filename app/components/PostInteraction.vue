<script setup lang="ts">
const isShareOpen = ref(false)

const toggleShare = () => {
  isShareOpen.value = !isShareOpen.value
}

const copyUrl = () => {
  if (typeof window === 'undefined') return
  navigator.clipboard.writeText(window.location.href)
  alert('URL이 복사되었습니다.')
  isShareOpen.value = false
}
</script>

<template>
  <div class="mt-36 mb-10 relative">
    <div
      v-if="isShareOpen"
      class="absolute bottom-[calc(100%+16px)] left-16 z-10 w-48 rounded-md shadow-lg py-2 animate-fade-in border"
      :style="{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-border)' }"
    >
      <button
        class="w-full flex items-center px-4 py-3 text-[14px] transition-colors"
        :style="{ color: 'var(--c-text)' }"
        @click="copyUrl"
        @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-hover)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')"
      >
        <svg
          class="w-4 h-4 mr-3"
          :style="{ color: 'var(--c-muted)' }"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        URL 복사
      </button>
      <div
        class="absolute -bottom-2 left-4 w-4 h-4 rotate-45 border-r border-b"
        :style="{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-border)' }"
      />
    </div>

    <div class="flex items-center gap-2">
      <button
        class="flex items-center gap-1.5 h-10 px-4 border rounded-md transition-colors text-[14px]"
        :style="{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-text)' }"
        @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-hover)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-bg)')"
      >
        <svg class="w-4 h-4" :style="{ color: 'var(--c-muted)' }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        1
      </button>
      <button
        class="flex items-center justify-center w-10 h-10 border rounded-md transition-colors"
        :style="{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-muted)' }"
        @click="toggleShare"
        @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-hover)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-bg)')"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </button>
      <button
        class="flex items-center justify-center w-10 h-10 border rounded-md transition-colors"
        :style="{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-muted)' }"
        @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-hover)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-bg)')"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
      <button
        class="flex items-center gap-1.5 h-10 px-4 border rounded-md transition-colors text-[14px]"
        :style="{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-bg)', color: 'var(--c-text)' }"
        @mouseenter="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-hover)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--c-bg)')"
      >
        <svg class="w-4 h-4" :style="{ color: 'var(--c-text)', fill: 'var(--c-text)' }" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        구독하기
      </button>
    </div>
  </div>
</template>
