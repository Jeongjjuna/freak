<script setup lang="ts">
import type { GraphData } from '~/utils/graphData'

const props = defineProps<{
  data: GraphData
}>()

const emit = defineEmits<{
  (e: 'hover-node', id: string | null): void
  (e: 'click-node', id: string): void
}>()

const containerEl = ref<HTMLElement | null>(null)
let cy: any = null
let themeObserver: MutationObserver | null = null

function readThemeColors() {
  const cs = getComputedStyle(document.documentElement)
  return {
    accent: cs.getPropertyValue('--c-icon-accent').trim() || '#3182f6',
    text: cs.getPropertyValue('--c-text').trim() || '#333',
    muted: cs.getPropertyValue('--c-muted').trim() || '#888',
    border: cs.getPropertyValue('--c-border').trim() || '#ccc',
    bg: cs.getPropertyValue('--c-bg').trim() || '#fff',
    surface: cs.getPropertyValue('--c-surface').trim() || '#f5f5f5',
  }
}

function buildElements(data: GraphData) {
  const elements: any[] = []
  for (const node of data.nodes) {
    elements.push({
      group: 'nodes',
      data: { id: node.id, count: node.count },
    })
  }
  for (const edge of data.edges) {
    elements.push({
      group: 'edges',
      data: {
        id: `${edge.source}__${edge.target}`,
        source: edge.source,
        target: edge.target,
        weight: edge.weight,
      },
    })
  }
  return elements
}

function applyStyles() {
  if (!cy) return
  const c = readThemeColors()
  cy.style()
    .resetToDefault()
    .selector('node')
    .style({
      'background-color': c.accent,
      'label': 'data(id)',
      'color': c.text,
      'font-size': 11,
      'font-weight': 500,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 4,
      'text-outline-color': c.bg,
      'text-outline-width': 2,
      'width': (ele: any) => Math.sqrt(ele.data('count')) * 12 + 14,
      'height': (ele: any) => Math.sqrt(ele.data('count')) * 12 + 14,
      'border-width': 0,
      'transition-property': 'background-color, opacity, border-width, border-color',
      'transition-duration': '0.18s' as any,
    })
    .selector('edge')
    .style({
      'width': (ele: any) => Math.min(1 + ele.data('weight') * 1.2, 6),
      'line-color': c.border,
      'opacity': 0.55,
      'curve-style': 'bezier',
      'transition-property': 'line-color, opacity, width',
      'transition-duration': '0.18s' as any,
    })
    .selector('.faded')
    .style({ 'opacity': 0.12 })
    .selector('node.hovered')
    .style({
      'border-width': 3,
      'border-color': c.text,
    })
    .selector('node.connected')
    .style({
      'border-width': 2,
      'border-color': c.muted,
    })
    .selector('edge.highlighted')
    .style({
      'line-color': c.accent,
      'opacity': 1,
    })
    .update()
}

function highlightNeighborhood(nodeId: string | null) {
  if (!cy) return
  cy.elements().removeClass('faded hovered connected highlighted')
  if (!nodeId) return
  const node = cy.$id(nodeId)
  if (!node || node.empty()) return

  const neighborhood = node.closedNeighborhood()
  cy.elements().difference(neighborhood).addClass('faded')
  node.addClass('hovered')
  neighborhood.nodes().difference(node).addClass('connected')
  neighborhood.edges().addClass('highlighted')
}

async function mountGraph() {
  if (!containerEl.value) return

  const cytoscape = (await import('cytoscape')).default
  const fcose = (await import('cytoscape-fcose')).default
  cytoscape.use(fcose)

  cy = cytoscape({
    container: containerEl.value,
    elements: buildElements(props.data),
    minZoom: 0.3,
    maxZoom: 3,
    wheelSensitivity: 0.2,
    layout: {
      name: 'fcose',
      animate: true,
      animationDuration: 700,
      nodeRepulsion: 6000,
      idealEdgeLength: 110,
      edgeElasticity: 0.45,
      randomize: true,
    } as any,
  })

  applyStyles()

  cy.on('mouseover', 'node', (evt: any) => {
    const id = evt.target.id()
    highlightNeighborhood(id)
    emit('hover-node', id)
  })
  cy.on('mouseout', 'node', () => {
    highlightNeighborhood(null)
    emit('hover-node', null)
  })
  cy.on('tap', 'node', (evt: any) => {
    emit('click-node', evt.target.id())
  })
  cy.on('tap', (evt: any) => {
    if (evt.target === cy) {
      highlightNeighborhood(null)
      emit('hover-node', null)
    }
  })

  themeObserver = new MutationObserver(() => {
    applyStyles()
  })
  themeObserver.observe(document.documentElement, { attributeFilter: ['class'] })
}

onMounted(() => {
  void mountGraph()
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
  cy?.destroy()
  cy = null
})

watch(() => props.data, (next) => {
  if (!cy) return
  cy.elements().remove()
  cy.add(buildElements(next))
  cy.layout({
    name: 'fcose',
    animate: true,
    animationDuration: 500,
    randomize: true,
  } as any).run()
})
</script>

<template>
  <div
    ref="containerEl"
    class="w-full h-full"
    :style="{ backgroundColor: 'var(--c-bg)' }"
  />
</template>
