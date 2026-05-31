<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[85] flex items-center justify-center p-6"
        role="dialog"
        aria-modal="true"
      >
        <div class="absolute inset-0 bg-black/80" @click="emit('close')" />

        <img
          :src="src"
          :alt="alt ?? ''"
          class="relative max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          @click.stop
        >

        <button
          class="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
          aria-label="닫기"
          @click="emit('close')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.18s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
