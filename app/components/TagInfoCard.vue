<script setup lang="ts">
import type { GraphNode, GraphItemRef } from '~/utils/graphData'

defineProps<{
  node: GraphNode | null
}>()

const emit = defineEmits<{
  (e: 'select-item', item: GraphItemRef): void
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
