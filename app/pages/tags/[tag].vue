<script setup lang="ts">
const route = useRoute()
const drawer = useDrawerStore()

const tag = computed(() => {
  const t = route.params.tag
  return Array.isArray(t) ? t[0]! : t
})

const decodedTag = computed(() => decodeURIComponent(tag.value))

const { data: posts } = await useAsyncData(`tag-${tag.value}`, () =>
  fetchPostsByTag(decodedTag.value),
)

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
      <PostCard v-for="post in posts ?? []" :key="post.slug" :post="post" />
    </main>
  </div>
</template>
