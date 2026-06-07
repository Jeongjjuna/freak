<script setup lang="ts">
import type { GraphNode, GraphFeedRef } from '~/utils/graphData'

defineProps<{
  node: GraphNode | null
}>()

const emit = defineEmits<{
  (e: 'select-feed', feed: GraphFeedRef): void
}>()

function pad(n: number) {
  return n.toString().padStart(2, '0')
}
function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
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
    >
      <header
        class="flex items-baseline gap-2 px-5 py-3 border-b shrink-0"
        :style="{ borderColor: 'var(--c-border)' }"
      >
        <h3 class="text-[15px] font-medium text-[var(--c-text)] truncate">
          #{{ node.id }}
        </h3>
        <span class="text-[12px] text-[var(--c-muted)] shrink-0">
          ({{ node.count }})
        </span>
      </header>

      <div class="feed-scroll overflow-y-auto px-2 py-2">
        <button
          v-for="feed in node.feeds"
          :key="feed.path ?? feed.id ?? feed.slug"
          class="w-full text-left px-3 py-2.5 rounded-md flex flex-col gap-1 hover:bg-[var(--c-hover)] transition-colors cursor-pointer"
          @click="emit('select-feed', feed)"
        >
          <span class="text-[13px] text-[var(--c-text)] leading-snug line-clamp-2">
            {{ feed.title }}
          </span>
          <span class="text-[11px] text-[var(--c-muted)]">
            {{ formatDate(feed.date) }}
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
