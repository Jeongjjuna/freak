<script setup lang="ts">
import type { CategoryGroup, PostMeta } from '~/types/post'

const props = defineProps<{
  groups: CategoryGroup[]
  recentPosts: PostMeta[]
}>()

const openGroups = ref<Record<string, boolean>>({})

watchEffect(() => {
  const next: Record<string, boolean> = {}
  props.groups.forEach((g) => {
    next[g.name] = openGroups.value[g.name] ?? true
  })
  openGroups.value = next
})

const toggleGroup = (name: string) => {
  openGroups.value = { ...openGroups.value, [name]: !openGroups.value[name] }
}
</script>

<template>
  <aside class="w-70 shrink-0 py-8 min-h-[calc(100vh-96px)] max-[1200px]:hidden">
    <MusicPlayer />

    <div class="px-5 pb-2 mb-6 border-b border-[var(--c-border)]">
      <p class="text-[16px] font-medium text-[var(--c-text)]">
        이것저것
      </p>
    </div>

    <div class="px-5 pb-6 mb-6 border-b border-[var(--c-border)]">
      <p class="text-[16px] font-medium text-[var(--c-text)] mb-2">
        전체 카테고리
      </p>
      <div class="border-b border-[var(--c-border)] -mx-5 mb-6" />
      <div class="flex flex-col gap-5">
        <div
          v-for="group in groups"
          :key="group.name"
          class="flex flex-col"
        >
          <button
            class="flex items-center justify-between w-full text-[14px] font-bold text-[var(--c-text)] mb-2 group/btn cursor-pointer"
            @click="toggleGroup(group.name)"
          >
            <span class="opacity-80 group-hover/btn:opacity-100 transition-opacity">{{ group.name }}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-transform duration-200"
              :class="{ 'rotate-180': openGroups[group.name] }"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            :class="openGroups[group.name] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'"
          >
            <ul class="flex flex-col gap-1.5 pl-1 border-l-2 border-[var(--c-border)] ml-1 mb-2">
              <li v-for="cat in group.categories" :key="cat.name">
                <NuxtLink
                  :to="`/categories/${encodeURIComponent(cat.name)}`"
                  class="flex justify-between items-center text-[13px] text-[var(--c-text)] hover:opacity-60 transition-opacity py-0.5"
                >
                  <span>{{ cat.name }} {{ getCategoryEmoji(cat.name) }}</span>
                  <span class="text-[12px] text-[var(--c-muted)]">({{ cat.count }})</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="px-5 pb-6 mb-6 border-b border-[var(--c-border)]">
      <p class="text-[16px] font-medium text-[var(--c-text)] mb-3">
        최근 글
      </p>
      <ul class="flex flex-col gap-3">
        <li v-for="post in recentPosts" :key="post.slug">
          <NuxtLink :to="`/posts/${post.slug}`" class="flex gap-2.5 items-start group">
            <img
              v-if="post.thumbnail"
              :src="resolveImageSrc(post.thumbnail)"
              :alt="post.title"
              width="56"
              height="44"
              class="w-14 h-11 object-cover rounded shrink-0"
            >
            <div v-else class="w-14 h-11 rounded shrink-0 bg-[var(--c-empty)]" />
            <span class="text-[12px] text-[var(--c-text)] leading-normal line-clamp-2 group-hover:opacity-60 transition-opacity">
              {{ post.title }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <ClientOnly>
      <ContributionGrass />
    </ClientOnly>
  </aside>
</template>
