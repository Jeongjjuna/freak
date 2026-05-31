<script setup lang="ts">
const drawer = useDrawerStore()
const route = useRoute()

const openGroups = ref<Record<string, boolean>>({})

watchEffect(() => {
  const next: Record<string, boolean> = {}
  drawer.groups.forEach((g) => {
    next[g.name] = openGroups.value[g.name] ?? true
  })
  openGroups.value = next
})

const toggleGroup = (name: string) => {
  openGroups.value = { ...openGroups.value, [name]: !openGroups.value[name] }
}

watch(() => route.fullPath, () => {
  drawer.close()
})

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') drawer.close()
}

watch(() => drawer.isOpen, (open) => {
  if (typeof document === 'undefined') return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    document.addEventListener('keydown', onKey)
  } else {
    document.removeEventListener('keydown', onKey)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKey)
  }
})
</script>

<template>
  <div>
    <div
      class="fixed inset-0 z-[59] bg-black/40 transition-opacity duration-300"
      :class="drawer.isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      aria-hidden="true"
      @click="drawer.close"
    />

    <div
      class="fixed top-0 right-0 z-[60] h-full w-[min(288px,85vw)] shadow-xl transition-transform duration-300 ease-in-out"
      :class="drawer.isOpen ? 'translate-x-0' : 'translate-x-full'"
      :style="{ backgroundColor: 'var(--c-bg)' }"
      role="dialog"
      aria-modal="true"
      aria-label="메뉴"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b" :style="{ borderColor: 'var(--c-border)' }">
        <span class="text-[16px] font-medium text-[var(--c-text)]">메뉴</span>
        <button
          class="w-6 h-6 flex items-center justify-center hover:opacity-60 transition-opacity cursor-pointer"
          :style="{ color: 'var(--c-toggle)' }"
          aria-label="닫기"
          @click="drawer.close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="overflow-y-auto h-[calc(100%-57px)]">
        <div class="pt-5">
          <MusicPlayer />
        </div>

        <div class="px-5 py-6 border-b" :style="{ borderColor: 'var(--c-border)' }">
          <p class="text-[16px] font-medium text-[var(--c-text)] mb-2">전체 카테고리</p>
          <div class="border-b -mx-5 mb-4" :style="{ borderColor: 'var(--c-border)' }" />
          <div class="flex flex-col gap-5">
            <div v-for="group in drawer.groups" :key="group.name" class="flex flex-col">
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

        <div class="px-5 py-6">
          <p class="text-[16px] font-medium text-[var(--c-text)] mb-3">최근 글</p>
          <ul class="flex flex-col gap-3">
            <li v-for="post in drawer.recentPosts" :key="post.slug">
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
      </div>
    </div>
  </div>
</template>
