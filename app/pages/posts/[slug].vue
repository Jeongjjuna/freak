<script setup lang="ts">
import type { PostMeta, TocItem } from '~/types/post'

const route = useRoute()
const drawer = useDrawerStore()

const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s[0]! : s
})

const { data: doc } = await useAsyncData(`post-${slug.value}`, async () => {
  return await fetchPostBySlug(slug.value)
})

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const post: PostMeta = {
  slug: slug.value,
  title: (doc.value as any).title ?? '',
  date: (doc.value as any).date ?? '',
  category: (doc.value as any).category ?? '',
  tags: (doc.value as any).tags ?? [],
  excerpt: (doc.value as any).excerpt ?? '',
  thumbnail: getPostThumbnailSrc(
    (doc.value as any).thumbnail,
    (doc.value as any).category ?? '',
    (doc.value as any).rawbody,
    (doc.value as any).body,
  ),
}

const toc = computed<TocItem[]>(() => {
  const links = (doc.value as any)?.body?.toc?.links
  return flattenToc(links)
})

const { data: relatedAll } = await useAsyncData(`related-${post.category}`, () =>
  fetchPostsByCategory(post.category),
)

const relatedPosts = computed<PostMeta[]>(() =>
  (relatedAll.value ?? []).filter(p => p.slug !== slug.value).slice(0, 5),
)

const emoji = computed(() => getCategoryEmoji(post.category))

const rawBody = computed<string>(() => {
  const body: any = (doc.value as any)?.body
  if (!body) return ''
  if (typeof body.rawbody === 'string') return body.rawbody
  if (typeof (doc.value as any)?.rawbody === 'string') return (doc.value as any).rawbody
  return ''
})

const readingTime = computed(() => calcReadingTime(rawBody.value || post.title))

useHead({
  title: `${post.title} | Freak Blog`,
  meta: [{ name: 'description', content: post.excerpt }],
})
</script>

<template>
  <PostLayout>
    <template #sidebar>
      <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    </template>
    <p class="text-[14px] text-[var(--c-muted)] mb-3">
      {{ post.category }} · {{ post.date }} · {{ readingTime }}분 읽기
    </p>
    <h1 class="text-[28px] font-medium leading-[1.4] text-[var(--c-text)] mb-8 pb-6 border-b border-[var(--c-border)]">
      {{ post.title }}
    </h1>
    <TOC :items="toc" />
    <PostContent :doc="doc" />
    <PostInteraction />

    <div>
      <div class="py-4 border-b border-[var(--c-border)] mb-6">
        <h3 class="text-[18px] text-[var(--c-muted)] font-normal">
          '{{ post.category }} {{ emoji }}' 카테고리의 다른 글
        </h3>
      </div>
      <ul class="space-y-4">
        <li
          v-for="rp in relatedPosts"
          :key="rp.slug"
          class="flex justify-between items-center text-[15px]"
        >
          <NuxtLink
            :to="`/posts/${rp.slug}`"
            class="text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors line-clamp-1 mr-4"
          >
            {{ rp.title }}
          </NuxtLink>
          <span class="text-[var(--c-dot)] text-[13px] whitespace-nowrap">
            {{ rp.date.replace(/-/g, '.') }}
          </span>
        </li>
        <li v-if="relatedPosts.length === 0" class="text-[var(--c-dot)] text-[15px]">
          이 카테고리에 다른 글이 없습니다.
        </li>
      </ul>
    </div>

    <div
      v-if="post.tags.length > 0"
      class="flex flex-wrap gap-x-2 gap-y-1 mt-14 pt-8 border-t border-[var(--c-border)] font-serif"
    >
      <template v-for="(tag, index) in post.tags" :key="tag">
        <div class="flex items-center">
          <NuxtLink
            :to="`/tags/${encodeURIComponent(tag)}`"
            class="text-[17px] text-[var(--c-tag-link)] hover:underline"
          >
            #{{ tag }}
          </NuxtLink>
          <span v-if="index < post.tags.length - 1" class="ml-2 text-[var(--c-muted)]">,</span>
        </div>
      </template>
    </div>
  </PostLayout>
</template>
