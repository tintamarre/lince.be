<script setup>
import { ref } from 'vue'
import { useEvents } from '../composables/useEvents.js'
import EventCard from './EventCard.vue'

const { groupedByMonth, pastEvents } = useEvents()
const showPast = ref(false)
</script>

<template>
  <div class="space-y-10">
    <section v-for="group in groupedByMonth" :key="group.label">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-village-400 mb-4 capitalize">
        {{ group.label }}
      </h3>
      <div class="divide-y divide-village-200/60">
        <EventCard v-for="event in group.events" :key="event.id" :event="event" />
      </div>
    </section>

    <p v-if="groupedByMonth.length === 0" class="text-center text-village-400 py-16 text-sm">
      Aucun événement à venir pour le moment.
    </p>

    <section v-if="pastEvents.length > 0" class="pt-4">
      <button
        class="text-xs text-village-400 hover:text-village-600 transition-colors flex items-center gap-1.5"
        @click="showPast = !showPast"
      >
        <svg
          class="w-3 h-3 transition-transform"
          :class="{ 'rotate-90': showPast }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        Événements passés ({{ pastEvents.length }})
      </button>
      <div v-if="showPast" class="mt-4 divide-y divide-village-200/40 opacity-50">
        <EventCard v-for="event in pastEvents" :key="event.id" :event="event" />
      </div>
    </section>
  </div>
</template>
