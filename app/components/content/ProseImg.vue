<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  width?: string | number
  height?: string | number
  title?: string
}>(), {
  src: '',
  alt: '',
})

const resolvedSrc = computed(() => resolveImageSrc(props.src))
</script>

<template>
  <img
    :src="resolvedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    :title="title"
    loading="lazy"
  >
</template>
