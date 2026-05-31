<script setup lang="ts">
import type { PostMeta } from '~/types/post'

const props = defineProps<{
  posts: PostMeta[]
  basePath?: string
}>()

const PAGE_SIZE = 6
const route = useRoute()

const currentPage = computed(() => {
  const raw = route.query.page
  const n = Array.isArray(raw) ? raw[0] : raw
  return Math.max(1, Number(n ?? 1))
})

const totalPages = computed(() => Math.ceil(props.posts.length / PAGE_SIZE))

const pagePosts = computed(() =>
  props.posts.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
)
</script>

<template>
  <div>
    <div :key="currentPage" class="animate-fade-in">
      <PostCard v-for="post in pagePosts" :key="post.slug" :post="post" />
    </div>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :base-path="basePath ?? '/'" />
  </div>
</template>
