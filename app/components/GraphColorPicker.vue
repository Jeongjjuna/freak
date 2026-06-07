<script setup lang="ts">
interface ColorPreset {
  id: string
  label: string
  value: string | null
}

const NODE_COLOR_PRESETS: readonly ColorPreset[] = [
  { id: 'default', label: '기본', value: null },
  { id: 'blue', label: '파랑', value: '#3182f6' },
  { id: 'violet', label: '보라', value: '#7c3aed' },
  { id: 'emerald', label: '초록', value: '#10b981' },
  { id: 'amber', label: '주황', value: '#f59e0b' },
  { id: 'pink', label: '분홍', value: '#ec4899' },
] as const

const props = defineProps<{
  modelValue: string | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

function isActive(value: string | null): boolean {
  return (props.modelValue ?? null) === (value ?? null)
}

function pick(value: string | null) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex items-center gap-1.5">
    <button
      v-for="preset in NODE_COLOR_PRESETS"
      :key="preset.id"
      class="w-[18px] h-[18px] rounded-full transition-all cursor-pointer flex items-center justify-center"
      :class="isActive(preset.value)
        ? 'ring-2 ring-offset-2 ring-[var(--c-text)]'
        : 'hover:opacity-80'"
      :style="{
        backgroundColor: preset.value ?? 'var(--c-icon-accent)',
        boxShadow: preset.value ? 'none' : 'inset 0 0 0 1px var(--c-border)',
      }"
      :aria-label="`${preset.label}으로 변경`"
      :title="preset.label"
      @click="pick(preset.value)"
    >
      <svg
        v-if="preset.id === 'default'"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    </button>
  </div>
</template>
