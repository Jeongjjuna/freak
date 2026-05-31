<script setup lang="ts">
import type { PostMeta } from '~/types/post'

defineProps<{
  post: PostMeta
}>()
</script>

<template>
  <article class="flex justify-between items-start gap-5 py-7 border-b border-[var(--c-border)] first:pt-0">
    <div class="flex-1 min-w-0">
      <NuxtLink
        :to="`/posts/${post.slug}`"
        class="block text-[17px] font-normal text-[var(--c-text)] leading-[1.4] mb-2.5 line-clamp-2 hover:opacity-60 transition-opacity"
      >
        {{ post.title }}
      </NuxtLink>
      <p
        v-if="post.excerpt"
        class="text-[15px] text-[var(--c-muted)] leading-[1.7] line-clamp-2 mb-3"
      >
        {{ post.excerpt }}
      </p>
      <div class="flex items-center gap-1.5 text-[12px] text-[var(--c-muted)]">
        <span class="flex items-center gap-1">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="shrink-0"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          {{ post.category }} {{ getCategoryEmoji(post.category) }}
        </span>
        <span class="text-[var(--c-dot)]">·</span>
        <span>{{ post.date }}</span>
      </div>
    </div>
    <img
      v-if="post.thumbnail"
      :src="resolveImageSrc(post.thumbnail)"
      :alt="post.title"
      width="120"
      height="88"
      class="w-[120px] h-[88px] object-cover rounded shrink-0 max-[640px]:hidden"
    >
    <div v-else class="w-[120px] h-[88px] rounded shrink-0 bg-[var(--c-empty)] max-[640px]:hidden" />
  </article>
</template>
