<script setup lang="ts">
import type { FeedDoc } from '~/types/feed'

const drawer = useDrawerStore()
const scrollEl = ref<HTMLElement | null>(null)
const sentinelEl = ref<HTMLElement | null>(null)
const selectedEntry = ref<FeedDoc | null>(null)

const { data: feeds } = await useAsyncData('all-feeds', () => fetchAllFeeds())

const PAGE_SIZE = 3

// 커서: 현재까지 노출한 항목 수 (= 다음 청크 시작 인덱스)
// SSR/초기 렌더에 PAGE_SIZE 개를 노출해 SEO·FCP 보존
const cursor = ref(PAGE_SIZE)

const displayed = computed(() => (feeds.value ?? []).slice(0, cursor.value))
const hasMore = computed(() => cursor.value < (feeds.value?.length ?? 0))

function loadMore() {
  if (!hasMore.value) return
  cursor.value = Math.min(cursor.value + PAGE_SIZE, feeds.value?.length ?? 0)
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinelEl.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) loadMore()
    },
    {
      root: scrollEl.value,
      rootMargin: '120px',
      threshold: 0,
    },
  )
  observer.observe(sentinelEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

useHead({
  title: 'Freak Blog',
  meta: [
    { name: 'description', content: '개발하며 배운 것들을 기록하는 블로그' },
  ],
})
</script>

<template>
  <div class="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
    <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
      <div class="flex items-baseline gap-2 mb-7">
        <h1 class="text-[20px] font-medium text-[var(--c-text)]">피드</h1>
        <span class="text-[13px] text-[var(--c-muted)]">짧은 개발 메모와 학습 노트</span>
      </div>

      <div
        ref="scrollEl"
        class="feed-scroll overflow-y-auto pl-2 pr-4 py-2"
        :style="{ maxHeight: 'calc(100vh - 280px)', minHeight: '400px' }"
      >
        <div v-if="displayed.length > 0" class="animate-fade-in">
          <template v-for="(entry, idx) in displayed" :key="entry.path ?? entry.id">
            <FeedCard :entry="entry" @open-detail="selectedEntry = $event" />
            <div
              v-if="idx < displayed.length - 1"
              class="feed-divider"
              aria-hidden="true"
            />
          </template>
        </div>
        <p v-else class="text-[15px] text-[var(--c-muted)] py-10 text-center">
          아직 작성된 피드가 없습니다.
        </p>

        <div ref="sentinelEl" aria-hidden="true" class="h-px w-full" />

        <p
          v-if="!hasMore && displayed.length > 0"
          class="text-center text-[13px] text-[var(--c-muted)] py-6"
        >
          마지막 글입니다.
        </p>
      </div>
    </main>

    <FeedDetailModal :entry="selectedEntry" @close="selectedEntry = null" />
  </div>
</template>
