<script setup>
import { useEvents } from '../composables/useEvents.js'

const props = defineProps({
  event: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})

const { formatDate, formatDay, categoryColor } = useEvents()
const colors = categoryColor(props.event.category)

const typeIcons = {
  image: '🖼️',
  gpx: '🗺️',
  document: '📄',
  link: '🔗',
}
</script>

<template>
  <article class="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
    <!-- Date badge -->
    <div class="flex-shrink-0 w-14 h-14 rounded-lg bg-village-50 border border-village-200 flex flex-col items-center justify-center">
      <span class="text-lg font-bold text-village-800 leading-none">{{ formatDay(event.startDate) }}</span>
      <span class="text-[10px] uppercase text-village-600 leading-tight mt-0.5">
        {{ event.startDate.split('-')[1] }}/{{ event.startDate.split('-')[0].slice(2) }}
      </span>
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

      <p v-if="!compact && event.description" class="mt-2 text-sm text-gray-600 line-clamp-2">
        {{ event.description }}
      </p>

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
    </div>
  </article>
</template>
