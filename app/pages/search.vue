<script setup lang="ts">
const route = useRoute()
const drawer = useDrawerStore()

const PAGE_SIZE = 6

const { data: allPosts } = await useAsyncData('all-posts', () => fetchAllPosts())

const query = computed(() => {
  const q = route.query.q
  const raw = Array.isArray(q) ? q[0] : q
  return (raw ?? '').toString()
})
const trimmed = computed(() => query.value.trim())

const filtered = computed(() => {
  const posts = allPosts.value ?? []
  if (!trimmed.value) return posts
  const lower = trimmed.value.toLowerCase()
  return posts.filter(p => p.title.toLowerCase().includes(lower))
})

const currentPage = computed(() => {
  if (trimmed.value) return 1
  const raw = route.query.page
  const n = Array.isArray(raw) ? raw[0] : raw
  return Math.max(1, Number(n ?? 1))
})

const totalPages = computed(() => (trimmed.value ? 1 : Math.ceil(filtered.value.length / PAGE_SIZE)))

const pagePosts = computed(() => {
  if (trimmed.value) return filtered.value
  return filtered.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE)
})

useHead({ title: trimmed.value ? `"${trimmed.value}" 검색 결과` : '전체 게시글' })
</script>

<template>
  <div class="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
    <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
      <div class="flex items-center gap-2 mb-7 text-[13px] text-[var(--c-muted)]">
        <template v-if="trimmed">
          <span class="font-bold text-[var(--c-text)]">&ldquo;{{ trimmed }}&rdquo;</span>
          <span>검색 결과</span>
        </template>
        <template v-else>
          <span class="font-bold text-[var(--c-text)]">전체 게시글</span>
        </template>
        <span class="text-[12px] border border-[var(--c-border)] px-2 py-0.5 rounded-full bg-[var(--c-surface)]">
          {{ filtered.length }}개의 결과
        </span>
      </div>
      <div v-if="pagePosts.length > 0" :key="currentPage" class="animate-fade-in">
        <PostCard v-for="post in pagePosts" :key="post.slug" :post="post" />
      </div>
      <p v-else class="text-[15px] text-[var(--c-muted)] py-10 text-center">
        검색 결과가 없습니다.
      </p>
      <Pagination
        v-if="!trimmed"
        :current-page="currentPage"
        :total-pages="totalPages"
        base-path="/search"
      />
    </main>
  </div>
</template>
