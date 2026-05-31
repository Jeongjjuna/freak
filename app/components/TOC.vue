<script setup lang="ts">
import type { TocItem } from '~/types/post'

const props = defineProps<{
  items: TocItem[]
}>()

const handleClick = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div
    v-if="items.length > 0"
    class="rounded-md px-6 py-5 mb-10 border"
    :style="{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }"
  >
    <span class="flex items-center gap-1 text-[var(--c-text)]">
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="shrink-0"
      >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
      목차
    </span>
    <ul
      class="flex flex-col gap-1.5 border-t mt-3 pt-3"
      :style="{ borderColor: 'var(--c-border)' }"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-1.5 text-[13px] cursor-pointer hover:opacity-60 transition-opacity"
        :class="[
          item.level === 2 ? 'pl-4' : '',
          item.level === 3 ? 'pl-8 text-[12px]' : '',
        ]"
        :style="{ color: item.level === 3 ? 'var(--c-muted)' : 'var(--c-text)' }"
        @click="handleClick(item.id)"
      >
        <span class="text-[10px]" :style="{ color: 'var(--c-muted)' }">›</span>
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>
