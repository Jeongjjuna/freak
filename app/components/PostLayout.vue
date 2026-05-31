<script setup lang="ts">
const isWide = ref(false)
</script>

<template>
  <div>
    <ReadingProgress />
    <div class="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
      <div
        class="overflow-hidden transition-all duration-300 ease-in-out max-[1200px]:hidden"
        :class="isWide ? 'w-0' : 'w-70'"
      >
        <slot name="sidebar" />
      </div>
      <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
        <div class="flex justify-end mb-4 max-[1200px]:hidden">
          <button
            class="flex items-center gap-1.5 text-[13px] text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors cursor-pointer"
            @click="isWide = !isWide"
          >
            <template v-if="isWide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
              </svg>
              기본 보기
            </template>
            <template v-else>
              넓게 보기
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
              </svg>
            </template>
          </button>
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>
