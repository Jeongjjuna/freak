<script setup lang="ts">
const progress = ref(0)

const update = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  update()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
})
</script>

<template>
  <div class="fixed top-0 left-0 w-full z-[70]" style="height: 3px;">
    <div
      class="h-full"
      :style="{
        width: `${progress}%`,
        backgroundColor: 'var(--c-progress)',
        transition: 'width 0.1s linear',
      }"
    />
  </div>
</template>
