<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEvents } from '../composables/useEvents.js'

const props = defineProps({
  event: { type: Object, required: true },
  compact: { type: Boolean, default: false },
  index: { type: Number, default: null },
})

const { formatDay, formatRelativeDiff } = useEvents()

const MONTHS_FR_SHORT = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUI', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC']
const WEEKDAYS_FR = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']

function monthLabel(dateStr) {
  const [, m] = dateStr.split('-').map(Number)
  return MONTHS_FR_SHORT[m - 1]
}
function weekdayLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return WEEKDAYS_FR[new Date(y, m - 1, d).getDay()]
}
function yearLabel(dateStr) {
  return dateStr.split('-')[0]
}

const typeIcons = {
  image: '◨',
  gpx: '⌁',
  document: '▤',
  link: '↗',
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
    class="group grid gap-4 sm:gap-6 px-5 sm:px-8 py-6 border-b border-village-900/20 transition-colors hover:bg-village-100/50"
    :class="[
      isHighlighted ? 'bg-accent-500/10 border-l-4 border-l-accent-500' : '',
      index !== null
        ? 'grid-cols-[2.5rem_auto_1fr] sm:grid-cols-[2.5rem_9rem_1fr_2rem]'
        : 'grid-cols-[auto_1fr] sm:grid-cols-[9rem_1fr_2rem]',
    ]"
  >
    <!-- Index badge -->
    <div v-if="index !== null" class="font-display text-2xl sm:text-3xl text-accent-500 leading-none">
      {{ String(index).padStart(2, '0') }}
    </div>

    <!-- Date block -->
    <div class="border-l-2 border-village-900 pl-3 sm:pl-4">
      <div class="font-display text-4xl sm:text-5xl text-village-900 leading-[0.9] tracking-[-0.04em]">
        {{ String(formatDay(event.startDate)).padStart(2, '0') }}
      </div>
      <div class="mt-1.5 font-mono text-[11px] font-bold tracking-widest text-village-900">
        {{ monthLabel(event.startDate) }} {{ yearLabel(event.startDate) }}
      </div>
      <div class="font-mono text-[10px] tracking-widest text-village-500 mt-0.5">
        {{ weekdayLabel(event.startDate) }}<span v-if="relativeDiff" class="text-accent-500 ml-1">· {{ relativeDiff.toUpperCase() }}</span>
      </div>
    </div>

    <!-- Body -->
    <div
      class="min-w-0"
      :class="index !== null ? 'col-span-3 sm:col-auto' : 'col-span-2 sm:col-auto'"
    >
      <div
        v-if="event.category"
        class="font-mono text-[10px] font-bold tracking-widest uppercase text-accent-500 mb-1.5"
      >
        [ {{ event.category }} ]
      </div>
      <h3 class="font-display text-xl sm:text-2xl uppercase text-village-900 leading-[1.05] tracking-[-0.02em] mb-2">
        {{ event.title }}
      </h3>

      <div v-if="!compact" class="font-mono text-[12px] text-village-600 font-semibold space-y-0.5">
        <div v-if="event.startTime">
          <span class="text-village-400">⌚</span>
          {{ event.startTime }}<span v-if="event.endTime"> — {{ event.endTime }}</span>
        </div>
        <div v-if="event.location" class="flex flex-wrap items-center gap-x-1">
          <span class="text-village-400">◎</span>
          <span class="text-village-900">{{ event.location }}</span>
          <span v-if="locationUrls" class="inline-flex items-center gap-1 ml-1 shrink-0">
            <span class="text-village-300">[</span>
            <a
              :href="locationUrls.google"
              target="_blank"
              rel="noopener"
              class="text-accent-600 hover:text-accent-500 transition-colors uppercase tracking-wider"
              title="Google Maps"
            >MAPS</a>
            <span class="text-village-300">·</span>
            <a
              :href="locationUrls.osm"
              target="_blank"
              rel="noopener"
              class="text-accent-600 hover:text-accent-500 transition-colors uppercase tracking-wider"
              title="OpenStreetMap"
            >OSM</a>
            <span class="text-village-300">]</span>
          </span>
        </div>
      </div>

      <template v-if="!compact && event.description">
        <p
          ref="descEl"
          class="mt-3 text-[15px] text-village-900 leading-relaxed whitespace-pre-line"
          :class="{ 'line-clamp-3': !expanded }"
        >
          {{ event.description }}
        </p>
        <button
          v-if="isClamped || expanded"
          class="mt-2 font-mono text-[11px] font-bold tracking-widest uppercase text-accent-500 hover:text-accent-700 transition-colors"
          @click="toggleExpand"
        >
          {{ expanded ? '[ RÉDUIRE ↑ ]' : '[ LIRE LA SUITE ↓ ]' }}
        </button>
      </template>

      <!-- Attachments + share -->
      <div v-if="!compact" class="mt-4 flex flex-wrap items-center gap-2">
        <a
          v-for="att in (event.attachments || [])"
          :key="att.url"
          :href="att.url"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 border-[1.5px] border-village-900 font-mono text-[11px] font-bold uppercase tracking-wider text-village-900 hover:bg-village-900 hover:text-village-50 transition-colors"
        >
          <span>{{ typeIcons[att.type] || '↗' }}</span>
          {{ att.label }}
        </a>
        <button
          class="inline-flex items-center gap-1 px-2.5 py-1 border-[1.5px] border-dashed border-village-400 font-mono text-[11px] font-bold uppercase tracking-wider text-village-500 hover:border-accent-500 hover:text-accent-500 transition-colors"
          @click="copyLink"
        >
          {{ copied ? '✓ COPIÉ' : '∞ LIEN' }}
        </button>
      </div>
    </div>

    <!-- Arrow -->
    <div class="hidden sm:flex items-start justify-end font-display text-2xl text-village-300 group-hover:text-accent-500 group-hover:translate-x-1 transition-all">
      →
    </div>
  </article>
</template>
