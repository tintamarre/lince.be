<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '../composables/useEvents.js'

const props = defineProps({
  event: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

const { formatDay, categoryColor, formatRelativeDiff } = useEvents()
const colors = categoryColor(props.event.category)

const typeIcons = {
  image: '🖼️',
  gpx: '🗺️',
  document: '📄',
  link: '🔗',
}

function parseDMS(str) {
  const re = /(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/
  const m = str.match(re)
  if (!m) return null
  let lat = +m[1] + m[2] / 60 + m[3] / 3600
  let lng = +m[5] + m[6] / 60 + m[7] / 3600
  if (m[4] === 'S') lat = -lat
  if (m[8] === 'W') lng = -lng
  return { lat, lng }
}

function mapUrls(location) {
  if (!location) return null
  const coords = parseDMS(location)
  if (coords) {
    return {
      google: `https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
      osm: `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`,
    }
  }
  const q = encodeURIComponent(location)
  return {
    google: `https://www.google.com/maps/search/?api=1&query=${q}`,
    osm: `https://www.openstreetmap.org/search?query=${q}`,
  }
}

const locationUrls = computed(() => mapUrls(props.event.location))

const route = useRoute()
const isHighlighted = computed(() => route.query.date === props.event.startDate)

const expanded = ref(isHighlighted.value)
const copied = ref(false)
const cardEl = ref(null)

const relativeDiff = computed(() => formatRelativeDiff(props.event.startDate))
const descEl = ref(null)
const isClamped = ref(false)

function toggleExpand() {
  expanded.value = !expanded.value
}

function copyLink() {
  const url = `${window.location.origin}${window.location.pathname}#/agenda?date=${props.event.startDate}#date-${props.event.startDate}`
  navigator.clipboard.writeText(url).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  })
}

onMounted(async () => {
  await nextTick()
  if (descEl.value) {
    isClamped.value = descEl.value.scrollHeight > descEl.value.clientHeight
  }
  if (isHighlighted.value && cardEl.value) {
    cardEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})
</script>

<template>
  <article
    :id="`date-${event.startDate}`"
    ref="cardEl"
    class="flex gap-5 py-5 transition-colors"
    :class="isHighlighted ? 'bg-accent-50/50 px-5 -mx-5 rounded-xl' : ''"
  >
    <!-- Date badge -->
    <div class="flex-shrink-0 flex flex-col items-center gap-1.5">
      <div class="w-14 h-14 rounded-xl bg-accent-50 border border-accent-200 flex flex-col items-center justify-center">
        <span class="text-xl font-bold text-accent-700 leading-none">{{ formatDay(event.startDate) }}</span>
        <span class="text-[10px] uppercase text-accent-500 leading-tight mt-0.5 tracking-wide">
          {{ event.startDate.split('-')[1] }}/{{ event.startDate.split('-')[0].slice(2) }}
        </span>
      </div>
      <span
        v-if="relativeDiff"
        class="text-[10px] text-center leading-tight text-village-400 w-14"
      >{{ relativeDiff }}</span>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start gap-2.5 flex-wrap">
        <h3 class="text-lg font-semibold text-village-900 leading-snug">{{ event.title }}</h3>
        <span
          v-if="event.category"
          class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide mt-0.5"
          :class="[colors.bg, colors.text]"
        >
          {{ event.category }}
        </span>
      </div>

      <div v-if="!compact" class="mt-1.5 space-y-1 text-sm text-village-500">
        <p v-if="event.startTime">
          {{ event.startTime }}<span v-if="event.endTime"> — {{ event.endTime }}</span>
        </p>
        <div v-if="event.location" class="flex items-start gap-1">
          <span class="text-village-500">{{ event.location }}</span>
          <span v-if="locationUrls" class="inline-flex items-center gap-1.5 ml-1 shrink-0">
            <a
              :href="locationUrls.google"
              target="_blank"
              rel="noopener"
              class="text-accent-600 hover:text-accent-700 transition-colors"
              title="Google Maps"
            >Maps</a>
            <span class="text-village-300">/</span>
            <a
              :href="locationUrls.osm"
              target="_blank"
              rel="noopener"
              class="text-accent-600 hover:text-accent-700 transition-colors"
              title="OpenStreetMap"
            >OSM</a>
          </span>
        </div>
      </div>

      <template v-if="!compact && event.description">
        <p ref="descEl" class="mt-2 text-base text-village-600 leading-relaxed" :class="{ 'line-clamp-3': !expanded }">
          {{ event.description }}
        </p>
        <button
          v-if="isClamped || expanded"
          class="mt-1 text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors"
          @click="toggleExpand"
        >
          {{ expanded ? 'Réduire' : 'Lire la suite' }}
        </button>
      </template>

      <!-- Attachments + share -->
      <div v-if="!compact && (event.attachments?.length || true)" class="mt-3 flex flex-wrap items-center gap-2">
        <a
          v-for="att in (event.attachments || [])"
          :key="att.url"
          :href="att.url"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-village-100 text-village-600 hover:bg-village-200 transition-colors"
        >
          <span>{{ typeIcons[att.type] || '🔗' }}</span>
          {{ att.label }}
        </a>
        <button
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-village-400 hover:text-village-600 transition-colors"
          @click="copyLink"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {{ copied ? 'Copié' : 'Lien' }}
        </button>
      </div>
    </div>
  </article>
</template>
