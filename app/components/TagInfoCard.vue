<script setup lang="ts">
import type { GraphNode, GraphItemRef } from '~/utils/graphData'

defineProps<{
  node: GraphNode | null
}>()

const emit = defineEmits<{
  (e: 'select-item', item: GraphItemRef): void
  (e: 'close'): void
  (e: 'card-enter'): void
  (e: 'card-leave'): void
}>()

function pad(n: number) {
  return n.toString().padStart(2, '0')
}
function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}
function kindLabel(kind: GraphItemRef['kind']): string {
  return kind === 'post' ? '블로그' : '피드'
}
</script>

<template>
  <Transition name="info-fade">
    <div
      v-if="node"
      class="absolute top-4 right-4 z-30 w-[300px] max-h-[70vh] flex flex-col rounded-xl overflow-hidden pointer-events-auto"
      :style="{
        backgroundColor: 'var(--c-surface)',
        boxShadow: '0 0 0 1px var(--c-border), 0 8px 28px rgba(0,0,0,0.10)',
      }"
      @mouseenter="emit('card-enter')"
      @mouseleave="emit('card-leave')"
    >
      <header
        class="flex items-center gap-2 px-5 py-3 border-b shrink-0"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <NuxtLink
          :to="`/tags/${encodeURIComponent(node.id)}`"
          class="text-[15px] font-medium text-[var(--c-text)] truncate hover:underline"
        >
          #{{ node.id }}
        </NuxtLink>
        <span class="text-[12px] text-[var(--c-muted)] shrink-0">
          ({{ node.count }})
        </span>
        <button
          class="ml-auto w-6 h-6 flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer shrink-0"
          :style="{ color: 'var(--c-toggle)' }"
          aria-label="닫기"
          @click="emit('close')"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <div class="feed-scroll overflow-y-auto px-2 py-2">
        <button
          v-for="item in node.items"
          :key="(item.path ?? item.id ?? '') + ':' + item.kind + ':' + item.slug"
          class="w-full text-left px-3 py-2.5 rounded-md flex items-start gap-2 hover:bg-[var(--c-hover)] transition-colors cursor-pointer"
          @click="emit('select-item', item)"
        >
          <span
            class="text-[10px] font-medium leading-none px-1.5 py-1 rounded shrink-0 mt-0.5"
            :style="{
              backgroundColor: 'var(--c-bg)',
              color: 'var(--c-muted)',
              border: '1px solid var(--c-border)',
            }"
          >
            {{ kindLabel(item.kind) }}
          </span>
          <span class="flex flex-col gap-1 min-w-0 flex-1">
            <span class="text-[13px] text-[var(--c-text)] leading-snug line-clamp-2">
              {{ item.title }}
            </span>
            <span class="text-[11px] text-[var(--c-muted)]">
              {{ formatDate(item.date) }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.info-fade-enter-active,
.info-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.info-fade-enter-from,
.info-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
