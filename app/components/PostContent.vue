<script setup lang="ts">
const props = defineProps<{
  doc: any
}>()

const root = ref<HTMLElement | null>(null)

const enhanceCodeBlocks = () => {
  if (!root.value) return
  const pres = root.value.querySelectorAll<HTMLElement>('.prose pre')
  pres.forEach((pre) => {
    if (!pre.querySelector('.lang-label')) {
      const codeEl = pre.querySelector('code')
      let lang: string | null = null
      const classFromPre = Array.from(pre.classList).find(c => c.startsWith('language-'))
      const classFromCode = codeEl ? Array.from(codeEl.classList).find(c => c.startsWith('language-')) : undefined
      const dataLang = codeEl?.getAttribute('data-language')
      if (dataLang) lang = dataLang
      else if (classFromCode) lang = classFromCode.replace('language-', '')
      else if (classFromPre) lang = classFromPre.replace('language-', '')

      if (lang) {
        const label = document.createElement('span')
        label.className = 'lang-label'
        label.textContent = lang
        pre.prepend(label)
      }
    }

    if (pre.querySelector('.copy-btn')) return

    const button = document.createElement('button')
    button.className = 'copy-btn'
    button.textContent = '복사'

    button.addEventListener('click', () => {
      const codeEl = pre.querySelector('code')
      const text = codeEl?.innerText ?? ''
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = '✓'
        button.classList.add('copied')
        setTimeout(() => {
          button.textContent = '복사'
          button.classList.remove('copied')
        }, 1500)
      })
    })

    pre.appendChild(button)
  })
}

onMounted(() => {
  nextTick(enhanceCodeBlocks)
})

watch(() => props.doc, () => {
  nextTick(enhanceCodeBlocks)
})
</script>

<template>
  <div ref="root">
    <ContentRenderer v-if="doc" :value="doc" class="prose" />
  </div>
</template>
