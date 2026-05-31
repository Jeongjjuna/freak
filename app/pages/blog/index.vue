<script setup lang="ts">
const drawer = useDrawerStore()

const { data: posts } = await useAsyncData('all-posts', () => fetchAllPosts())

useHead({
  title: '블로그 | Freak Blog',
  meta: [
    { name: 'description', content: '개발하며 배운 것들을 기록하는 블로그' },
  ],
})
</script>

<template>
  <div class="max-w-[1160px] mx-auto flex min-h-[calc(100vh-96px)] px-6">
    <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
      <PostListWithPagination :posts="posts ?? []" base-path="/blog" />
    </main>
  </div>
</template>
