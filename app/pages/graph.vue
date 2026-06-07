<script setup lang="ts">
import type { GraphNode, GraphItemRef } from '~/utils/graphData'
import type { FeedDoc } from '~/types/feed'

const { data: graph } = await useAsyncData('tag-graph', buildTagGraph)

const nodesById = computed(() => {
  const map = new Map<string, GraphNode>()
  for (const n of graph.value?.nodes ?? []) {
    map.set(n.id, n)
  }
  return map
})

const hoveredTagId = ref<string | null>(null)
const pinnedTagId = ref<string | null>(null)

const displayedTagId = computed<string | null>(() => hoveredTagId.value ?? pinnedTagId.value)
const displayedNode = computed<GraphNode | null>(() => {
  const id = displayedTagId.value
  if (!id) return null
  return nodesById.value.get(id) ?? null
})

let leaveTimer: ReturnType<typeof setTimeout> | null = null
function cancelLeave() {
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
}
function scheduleLeave() {
  cancelLeave()
  leaveTimer = setTimeout(() => {
    hoveredTagId.value = null
  }, 150)
}

function onNodeHover(id: string | null) {
  if (id) {
    cancelLeave()
    hoveredTagId.value = id
  } else {
    scheduleLeave()
  }
}

function onNodeClick(id: string | null) {
  cancelLeave()
  if (id) {
    pinnedTagId.value = id
    hoveredTagId.value = id
  } else {
    pinnedTagId.value = null
    hoveredTagId.value = null
  }
}

function onCardClose() {
  cancelLeave()
  pinnedTagId.value = null
  hoveredTagId.value = null
}

function onCardEnter() {
  cancelLeave()
}

function onCardLeave() {
  scheduleLeave()
}

const NODE_COLOR_STORAGE_KEY = 'graph-node-color'
const nodeColor = ref<string | null>(null)

onMounted(() => {
  if (typeof localStorage === 'undefined') return
  const stored = localStorage.getItem(NODE_COLOR_STORAGE_KEY)
  if (stored && stored !== 'default') {
    nodeColor.value = stored
  }
})

watch(nodeColor, (v) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(NODE_COLOR_STORAGE_KEY, v ?? 'default')
})

const selectedFeed = ref<FeedDoc | null>(null)

async function openItem(item: GraphItemRef) {
  if (item.kind === 'post') {
    if (!item.slug) return
    await navigateTo(`/posts/${item.slug}`)
    return
  }

  if (!item.path) {
    const slug = item.slug || ''
    if (!slug) return
    // @ts-expect-error queryCollection auto-imported
    const doc = await queryCollection('feeds').path(`/feeds/${slug}`).first()
    selectedFeed.value = (doc as FeedDoc | null) ?? null
    return
  }
  // @ts-expect-error queryCollection auto-imported
  const doc = await queryCollection('feeds').path(item.path).first()
  selectedFeed.value = (doc as FeedDoc | null) ?? null
}

useHead({ title: '그래프 | Freak Blog' })
</script>

<template>
  <div class="w-full">
    <div class="max-w-290 mx-auto px-6 py-4">
      <div class="flex items-center gap-2">
        <h1 class="text-[20px] font-medium text-[var(--c-text)]">그래프</h1>
        <span class="text-[13px] text-[var(--c-muted)]">피드 · 블로그 태그 네트워크</span>
        <GraphColorPicker v-model="nodeColor" class="ml-auto" />
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
          :selected-id="pinnedTagId"
          :node-color="nodeColor"
          @hover-node="onNodeHover"
          @click-node="onNodeClick"
        />
        <template #fallback>
          <div class="w-full h-full flex items-center justify-center text-[13px] text-[var(--c-muted)]">
            그래프 로딩 중…
          </div>
        </template>
      </ClientOnly>

      <TagInfoCard
        :node="displayedNode"
        @select-item="openItem"
        @close="onCardClose"
        @card-enter="onCardEnter"
        @card-leave="onCardLeave"
      />
    </div>

    <FeedDetailModal :entry="selectedFeed" @close="selectedFeed = null" />
  </div>
</template>
