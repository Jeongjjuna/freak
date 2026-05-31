<script setup lang="ts">
const sakura = ref(false)
let observer: MutationObserver | null = null

onMounted(() => {
  const update = () => {
    sakura.value = document.documentElement.classList.contains('sakura')
  }
  update()
  observer = new MutationObserver(update)
  observer.observe(document.documentElement, { attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

const toggle = () => {
  const next = !sakura.value
  sakura.value = next
  if (next) {
    document.documentElement.classList.add('sakura')
    document.documentElement.classList.remove('rain')
    localStorage.setItem('color-theme', 'sakura')
    localStorage.setItem('weather-theme', 'none')
  } else {
    document.documentElement.classList.remove('sakura')
    localStorage.setItem('color-theme', 'original')
  }
}
</script>

<template>
  <button
    aria-label="벚꽃 테마 전환"
    class="flex items-center justify-center w-8 h-8 rounded-full hover:opacity-60 transition-opacity cursor-pointer"
    :title="sakura ? '오리지널 테마로 전환' : '벚꽃 테마로 전환'"
    @click="toggle"
  >
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      :fill="sakura ? '#e8739a' : 'none'"
      :stroke="sakura ? '#e8739a' : 'var(--c-toggle)'"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(72 12 12)" />
      <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(144 12 12)" />
      <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(216 12 12)" />
      <ellipse cx="12" cy="5" rx="2.2" ry="3.5" transform="rotate(288 12 12)" />
      <circle cx="12" cy="12" r="1.8" :fill="sakura ? '#fff' : 'var(--c-toggle)'" stroke="none" />
    </svg>
  </button>
</template>
