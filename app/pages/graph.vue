<script setup lang="ts">
import type { GraphNode, GraphFeedRef } from '~/utils/graphData'
import type { FeedDoc } from '~/types/feed'

const { data: graph } = await useAsyncData('feed-tag-graph', buildFeedTagGraph)

const nodesById = computed(() => {
  const map = new Map<string, GraphNode>()
  for (const n of graph.value?.nodes ?? []) {
    map.set(n.id, n)
  }
  return map
})

const hoveredId = ref<string | null>(null)
const hoveredNode = computed<GraphNode | null>(() => {
  if (!hoveredId.value) return null
  return nodesById.value.get(hoveredId.value) ?? null
})

const selectedFeed = ref<FeedDoc | null>(null)

async function openFeedDetail(feed: GraphFeedRef) {
  if (!feed.path) {
    const slug = feed.slug || ''
    if (!slug) return
    // @ts-expect-error queryCollection auto-imported
    const doc = await queryCollection('feeds').path(`/feeds/${slug}`).first()
    selectedFeed.value = (doc as FeedDoc | null) ?? null
    return
  }
  // @ts-expect-error queryCollection auto-imported
  const doc = await queryCollection('feeds').path(feed.path).first()
  selectedFeed.value = (doc as FeedDoc | null) ?? null
}

function onClickNode(tag: string) {
  navigateTo(`/tags/${encodeURIComponent(tag)}`)
}

useHead({ title: '그래프 | Freak Blog' })
</script>

<template>
  <div class="w-full">
    <div class="max-w-290 mx-auto px-6 py-4">
      <div class="flex items-baseline gap-2">
        <h1 class="text-[20px] font-medium text-[var(--c-text)]">그래프</h1>
        <span class="text-[13px] text-[var(--c-muted)]">피드 태그 네트워크</span>
      </div>
    </div>

    <div
      class="relative w-full"
      :style="{ height: 'calc(100vh - 200px)', minHeight: '500px' }"
    >
      <ClientOnly>
        <TagGraph
          v-if="graph"
          :data="graph"
          @hover-node="hoveredId = $event"
          @click-node="onClickNode"
        />
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center text-[13px] text-[var(--c-muted)]">
            그래프 로딩 중…
          </div>
        </template>
      </ClientOnly>

      <TagInfoCard
        :node="hoveredNode"
        @select-feed="openFeedDetail"
      />
    </div>

    <FeedDetailModal :entry="selectedFeed" @close="selectedFeed = null" />
  </div>
</template>
