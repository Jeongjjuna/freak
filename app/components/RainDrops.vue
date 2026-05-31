<script setup lang="ts">
interface DropConfig {
  id: number
  left: number
  duration: number
  delay: number
  width: number
  height: number
  wind: number
}

const isRain = ref(false)
const drops = ref<DropConfig[]>([])
let observer: MutationObserver | null = null

onMounted(() => {
  const update = () => {
    isRain.value = document.documentElement.classList.contains('rain')
  }
  update()
  observer = new MutationObserver(update)
  observer.observe(document.documentElement, { attributeFilter: ['class'] })

  drops.value = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 1.2 + Math.random() * 1.0,
    delay: Math.random() * 3,
    width: 3.5 + Math.random() * 2,
    height: 40 + Math.random() * 25,
    wind: 8 + Math.random() * 17,
  }))
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    v-if="isRain && drops.length > 0"
    class="fixed left-0 right-0 bottom-0 pointer-events-none z-40 overflow-hidden"
    :style="{ top: 'var(--menu-h)' }"
  >
    <div
      v-for="d in drops"
      :key="d.id"
      :style="{
        position: 'absolute',
        left: `${d.left}%`,
        top: '-30px',
        width: `${d.width}px`,
        height: `${d.height}px`,
        animationName: 'rain-fall',
        animationDuration: `${d.duration}s`,
        animationDelay: `${d.delay}s`,
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationFillMode: 'both',
        '--wind': `${d.wind}px`,
      }"
    >
      <svg viewBox="0 0 3 20" width="100%" height="100%">
        <line
          x1="1.5"
          y1="0"
          x2="1.5"
          y2="20"
          stroke="#93c5fd"
          stroke-width="1.5"
          stroke-linecap="round"
          opacity="0.55"
        />
      </svg>
    </div>
  </div>
</template>
