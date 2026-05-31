<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
  basePath: string
}>()

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, '...', current - 1, current, current + 1, '...', total]
}

const pages = computed(() => getPageNumbers(props.currentPage, props.totalPages))

const pageUrl = (p: number) => (p === 1 ? props.basePath : `${props.basePath}?page=${p}`)
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="flex items-center justify-center gap-2 mt-10 text-[15px] text-[var(--c-text)]"
  >
    <NuxtLink
      v-if="currentPage > 1"
      :to="pageUrl(currentPage - 1)"
      class="px-1 hover:opacity-60 transition-opacity"
    >
      &lt;
    </NuxtLink>
    <span v-else class="px-1 text-[var(--c-border)]">&lt;</span>

    <template v-for="(page, i) in pages" :key="page === '...' ? `ellipsis-${i}` : `page-${page}`">
      <span v-if="page === '...'" class="px-1 text-[var(--c-dot)]">···</span>
      <NuxtLink
        v-else
        :to="pageUrl(page)"
        class="px-1 hover:opacity-60 transition-opacity"
        :class="page === currentPage ? 'font-bold underline underline-offset-4' : ''"
      >
        {{ page }}
      </NuxtLink>
    </template>

    <NuxtLink
      v-if="currentPage < totalPages"
      :to="pageUrl(currentPage + 1)"
      class="px-1 hover:opacity-60 transition-opacity"
    >
      &gt;
    </NuxtLink>
    <span v-else class="px-1 text-[var(--c-border)]">&gt;</span>
  </div>
</template>
