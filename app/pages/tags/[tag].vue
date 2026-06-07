<script setup lang="ts">
import type { FeedDoc } from '~/types/feed'

const route = useRoute()
const drawer = useDrawerStore()

const tag = computed(() => {
  const t = route.params.tag
  return Array.isArray(t) ? t[0]! : t
})

const decodedTag = computed(() => decodeURIComponent(tag.value))

const { data: posts } = await useAsyncData(`tag-posts-${tag.value}`, () =>
  fetchPostsByTag(decodedTag.value),
)
const { data: feeds } = await useAsyncData(`tag-feeds-${tag.value}`, () =>
  fetchFeedsByTag(decodedTag.value),
)

const selectedEntry = ref<FeedDoc | null>(null)

const hasPosts = computed(() => (posts.value?.length ?? 0) > 0)
const hasFeeds = computed(() => (feeds.value?.length ?? 0) > 0)
const isEmpty = computed(() => !hasPosts.value && !hasFeeds.value)

useHead({ title: `#${decodedTag.value} | Freak Blog` })
</script>

<template>
  <div class="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
    <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
      <div class="flex items-center gap-2 mb-7 text-[13px] text-[var(--c-muted)]">
        <span class="font-bold text-[var(--c-text)]">#{{ decodedTag }}</span>
        <span>태그</span>
        <NuxtLink
          to="/tags"
          class="text-[12px] border border-[var(--c-border)] px-2 py-0.5 rounded-full hover:bg-[var(--c-hover)] transition-colors"
        >
          전체 태그
        </NuxtLink>
      </div>

      <section v-if="hasPosts" class="mb-10">
        <div class="flex items-baseline gap-2 mb-4">
          <h2 class="text-[15px] font-medium text-[var(--c-text)]">블로그</h2>
          <span class="text-[12px] text-[var(--c-muted)]">({{ posts?.length ?? 0 }})</span>
        </div>
        <PostCard v-for="post in posts ?? []" :key="post.slug" :post="post" />
      </section>

      <section v-if="hasFeeds">
        <div class="flex items-baseline gap-2 mb-4">
          <h2 class="text-[15px] font-medium text-[var(--c-text)]">피드</h2>
          <span class="text-[12px] text-[var(--c-muted)]">({{ feeds?.length ?? 0 }})</span>
        </div>
        <template v-for="(entry, idx) in feeds ?? []" :key="entry.path ?? entry.id">
          <FeedCard :entry="entry" @open-detail="selectedEntry = $event" />
          <div
            v-if="idx < (feeds?.length ?? 0) - 1"
            class="feed-divider"
            aria-hidden="true"
          />
        </template>
      </section>

      <p
        v-if="isEmpty"
        class="text-[15px] text-[var(--c-muted)] py-10 text-center"
      >
        이 태그에 해당하는 글이 없습니다.
      </p>
    </main>

    <FeedDetailModal :entry="selectedEntry" @close="selectedEntry = null" />
  </div>
</template>
