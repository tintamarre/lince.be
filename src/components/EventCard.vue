<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '../composables/useEvents.js'

const props = defineProps({
  event: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

const { formatDate, formatDay, categoryColor, formatRelativeDiff } = useEvents()
const colors = categoryColor(props.event.category)

const typeIcons = {
  image: '🖼️',
  gpx: '🗺️',
  document: '📄',
  link: '🔗',
}

const route = useRoute()
const isHighlighted = computed(() => route.query.date === props.event.startDate)

const expanded = ref(isHighlighted.value)
const copied = ref(false)
const cardEl = ref(null)

const relativeDiff = computed(() => formatRelativeDiff(props.event.startDate))

function toggleExpand() {
  expanded.value = !expanded.value
}

function copyLink() {
  const url = `${window.location.origin}${window.location.pathname}#/agenda?date=${props.event.startDate}`
  navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

onMounted(async () => {
  if (isHighlighted.value && cardEl.value) {
    await nextTick()
    cardEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})
</script>

<template>
  <article
    ref="cardEl"
    class="flex gap-4 p-4 rounded-lg transition-colors"
    :class="isHighlighted ? 'bg-village-50 ring-1 ring-village-300' : 'hover:bg-gray-50'"
  >
    <!-- Date badge -->
    <div class="flex-shrink-0 flex flex-col items-center gap-1">
      <div class="w-14 h-14 rounded-lg bg-village-50 border border-village-200 flex flex-col items-center justify-center">
        <span class="text-lg font-bold text-village-800 leading-none">{{ formatDay(event.startDate) }}</span>
        <span class="text-[10px] uppercase text-village-600 leading-tight mt-0.5">
          {{ event.startDate.split('-')[1] }}/{{ event.startDate.split('-')[0].slice(2) }}
        </span>
      </div>
      <span
        v-if="relativeDiff"
        class="text-[10px] text-center leading-tight text-village-600 font-medium w-14"
      >{{ relativeDiff }}</span>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start gap-2 flex-wrap">
        <h3 class="font-semibold text-gray-900">{{ event.title }}</h3>
        <span
          v-if="event.category"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          :class="[colors.bg, colors.text]"
        >
          {{ event.category }}
        </span>
      </div>

      <div v-if="!compact" class="mt-1 space-y-0.5 text-sm text-gray-500">
        <p v-if="event.startTime">
          <span class="inline-block w-4">🕐</span> {{ event.startTime }}<span v-if="event.endTime"> – {{ event.endTime }}</span>
        </p>
        <p v-if="event.location">
          <span class="inline-block w-4">📍</span> {{ event.location }}
        </p>
      </div>

      <template v-if="!compact && event.description">
        <p class="mt-2 text-sm text-gray-600" :class="{ 'line-clamp-2': !expanded }">
          {{ event.description }}
        </p>
        <button
          class="mt-1 text-xs text-village-600 hover:text-village-800 font-medium transition-colors"
          @click="toggleExpand"
        >
          {{ expanded ? 'Réduire ▲' : 'Lire la suite ▼' }}
        </button>
      </template>

      <!-- Attachments -->
      <div v-if="!compact && event.attachments?.length" class="mt-2 flex flex-wrap gap-2">
        <a
          v-for="att in event.attachments"
          :key="att.url"
          :href="att.url"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <span>{{ typeIcons[att.type] || '🔗' }}</span>
          {{ att.label }}
        </a>
      </div>

      <!-- Share link -->
      <div v-if="!compact" class="mt-2">
        <button
          class="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          @click="copyLink"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {{ copied ? 'Lien copié ✓' : 'Copier le lien' }}
        </button>
      </div>
    </div>
  </article>
</template>
