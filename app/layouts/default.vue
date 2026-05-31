<script setup lang="ts">
const drawer = useDrawerStore()

const { data: layoutData } = await useAsyncData('layout-data', async () => {
  const [groups, recentPosts] = await Promise.all([
    fetchGroupedCategories(),
    fetchRecentPosts(5),
  ])
  return { groups, recentPosts }
})

if (layoutData.value) {
  drawer.setData(layoutData.value.groups, layoutData.value.recentPosts)
}

watch(layoutData, (v) => {
  if (v) drawer.setData(v.groups, v.recentPosts)
})
</script>

<template>
  <div>
    <ClientOnly>
      <SakuraPetals />
      <RainDrops />
    </ClientOnly>
    <SiteHeader />
    <nav class="max-w-290 mx-auto px-6">
      <div class="py-3 flex items-center gap-10 pl-11 max-[1200px]:pl-0 max-[1200px]:mx-3 border-t border-b border-[var(--c-border)]">
        <NuxtLink to="/" class="text-[15px] text-[var(--c-text)] hover:opacity-60 transition-opacity">홈</NuxtLink>
        <NuxtLink to="/tags" class="text-[15px] text-[var(--c-text)] hover:opacity-60 transition-opacity">태그</NuxtLink>
      </div>
    </nav>
    <slot />
    <MobileDrawer />
  </div>
</template>
