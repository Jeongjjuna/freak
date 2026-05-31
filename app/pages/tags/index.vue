<script setup lang="ts">
const drawer = useDrawerStore()

const { data: tags } = await useAsyncData('all-tags', () => fetchAllTags())

useHead({ title: '태그 | Freak Blog' })
</script>

<template>
  <div class="max-w-290 mx-auto flex min-h-[calc(100vh-96px)] px-6">
    <SiteSidebar :groups="drawer.groups" :recent-posts="drawer.recentPosts" />
    <main class="flex-1 min-w-0 bg-[var(--c-bg)] px-10 py-10 max-[1200px]:px-3">
      <h1 class="text-[20px] font-medium text-[var(--c-text)] mb-7">
        태그
      </h1>
      <div class="flex flex-wrap gap-2.5">
        <NuxtLink
          v-for="tag in tags ?? []"
          :key="tag.name"
          :to="`/tags/${encodeURIComponent(tag.name)}`"
          class="flex items-center text-[13px] text-[var(--c-muted)] border border-[var(--c-border)] rounded-full px-3.5 py-1 hover:bg-[var(--c-hover)] hover:text-[var(--c-text)] transition-colors"
        >
          #{{ tag.name }}
          <span class="text-[11px] text-[var(--c-dot)] ml-1">({{ tag.count }})</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>
