<script setup lang="ts">
const route = useRoute()
const drawer = useDrawerStore()

const category = computed(() => {
  const c = route.params.category
  return Array.isArray(c) ? c[0]! : c
})

const decodedCategory = computed(() => decodeURIComponent(category.value))

const { data: posts } = await useAsyncData(`category-${category.value}`, () =>
  fetchPostsByCategory(decodedCategory.value),
)

useHead({ title: `${decodedCategory.value} | Freak Blog` })
</script>

<template>
  <div class="max-w-[1160px] mx-auto flex min-h-[calc(100vh-96px)] px-6">
    <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
      <div class="flex items-center gap-2 mb-7 text-[16px] text-[var(--c-muted)]">
        <span class="font-normal text-[var(--c-text)]">카테고리</span>
        <span class="font-light text-[var(--c-text)]">{{ decodedCategory }}</span>
      </div>
      <PostCard v-for="post in posts ?? []" :key="post.slug" :post="post" />
    </main>
  </div>
</template>
