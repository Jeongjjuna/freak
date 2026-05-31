<script setup lang="ts">
const router = useRouter()
const drawer = useDrawerStore()
const scrolled = ref(false)
const query = ref('')

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    const trimmed = query.value.trim()
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }
}

const onScroll = () => {
  scrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const headerStyle = computed(() => ({
  backgroundColor: scrolled.value ? 'color-mix(in srgb, var(--c-bg) 60%, transparent)' : 'var(--c-bg)',
  backdropFilter: scrolled.value ? 'blur(12px)' : 'none',
  boxShadow: scrolled.value ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
}))
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-shadow duration-300"
    :style="headerStyle"
  >
    <div class="max-w-290 mx-auto px-6">
      <div class="flex items-center justify-between h-14 mt-4 mb-4 pl-5 pr-10 max-[1200px]:pr-3 max-[640px]:pl-0">
        <NuxtLink to="/" class="text-[20px] font-light text-[var(--c-text)] tracking-tight">
          Freak Blog
        </NuxtLink>
        <div class="flex items-center gap-4 max-[640px]:gap-2">
          <div
            class="flex items-center gap-3 px-4 py-2.5 rounded-2xl w-60 max-[640px]:hidden"
            :style="{ backgroundColor: 'var(--c-search-bg)' }"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="shrink-0"
            >
              <circle cx="11" cy="11" r="8" stroke="var(--c-icon)" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="var(--c-icon-accent)" />
            </svg>
            <input
              v-model="query"
              type="text"
              placeholder="키워드를 입력하세요."
              class="text-[14px] bg-transparent outline-none w-full font-light"
              :style="{ color: 'var(--c-text)' }"
              @keydown="handleKeydown"
            >
          </div>
          <SakuraToggle />
          <RainToggle />
          <ThemeToggle />
          <button
            class="min-[1200px]:hidden flex flex-col gap-1.25 w-6 px-0.5 group cursor-pointer"
            aria-label="메뉴"
            @click="drawer.open"
          >
            <span class="w-full h-0.75 rounded-full" :style="{ backgroundColor: 'var(--c-icon)' }" />
            <span class="w-full h-0.75 rounded-full" :style="{ backgroundColor: 'var(--c-icon)' }" />
            <span class="w-full h-0.75 rounded-full" :style="{ backgroundColor: 'var(--c-icon)' }" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
