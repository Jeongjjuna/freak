<script setup lang="ts">
const COLS = 32
const ROWS = 32

const COLORS_ORIGINAL_LIGHT = ['#f0f0f0', '#c0c0c0', '#888888', '#444444', '#1a1a1a']
const COLORS_ORIGINAL_DARK = ['#1f2937', '#374151', '#6b7280', '#94a3b8', '#e2e8f0']
const COLORS_SAKURA_LIGHT = ['#f8e0e8', '#f0b0c8', '#e07098', '#c84070', '#8f1a40']
const COLORS_SAKURA_DARK = ['#2d1820', '#5a2840', '#9b4868', '#c87090', '#f0a0c0']

const generateRandomGrid = () =>
  Array(ROWS).fill(0).map(() =>
    Array(COLS).fill(0).map(() => {
      const rand = Math.random()
      if (rand < 0.5) return 0
      if (rand < 0.75) return 1
      if (rand < 0.9) return 2
      if (rand < 0.97) return 3
      return 4
    }),
  )

const grid = ref<number[][]>([])
const isDark = ref(false)
const isSakura = ref(false)
let observer: MutationObserver | null = null
let intervalId: number | null = null

onMounted(() => {
  const update = () => {
    isDark.value = document.documentElement.classList.contains('dark')
    isSakura.value = document.documentElement.classList.contains('sakura')
  }
  update()
  observer = new MutationObserver(update)
  observer.observe(document.documentElement, { attributeFilter: ['class'] })

  grid.value = generateRandomGrid()
  intervalId = window.setInterval(() => {
    grid.value = generateRandomGrid()
  }, 3000)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (intervalId) clearInterval(intervalId)
})

const colors = computed(() => {
  if (isSakura.value) return isDark.value ? COLORS_SAKURA_DARK : COLORS_SAKURA_LIGHT
  return isDark.value ? COLORS_ORIGINAL_DARK : COLORS_ORIGINAL_LIGHT
})

const flattened = computed(() => {
  const cells: { key: string; level: number }[] = []
  grid.value.forEach((row, r) => {
    row.forEach((level, c) => {
      cells.push({ key: `${r}-${c}`, level })
    })
  })
  return cells
})
</script>

<template>
  <div v-if="grid.length > 0" class="px-5 py-6">
    <div
      class="mx-auto"
      :style="{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gap: '1.5px',
        width: 'fit-content',
      }"
    >
      <div
        v-for="cell in flattened"
        :key="cell.key"
        :style="{
          width: '6px',
          height: '6px',
          borderRadius: '1px',
          backgroundColor: colors[cell.level],
          transition: 'background-color 0.8s ease',
        }"
      />
    </div>
  </div>
</template>
