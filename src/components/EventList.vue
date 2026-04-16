<script setup>
import { ref } from 'vue'
import { useEvents } from '../composables/useEvents.js'
import EventCard from './EventCard.vue'

const { groupedByMonth, pastEvents } = useEvents()
const showPast = ref(false)
</script>

<template>
  <div class="space-y-8">
    <!-- Upcoming events grouped by month -->
    <section v-for="group in groupedByMonth" :key="group.label">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-village-700 mb-3 capitalize">
        {{ group.label }}
      </h3>
      <div class="divide-y divide-gray-100">
        <EventCard v-for="event in group.events" :key="event.id" :event="event" />
      </div>
    </section>

    <p v-if="groupedByMonth.length === 0" class="text-center text-gray-500 py-12">
      Aucun événement à venir pour le moment.
    </p>

    <!-- Past events -->
    <section v-if="pastEvents.length > 0">
      <button
        class="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
        @click="showPast = !showPast"
      >
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-90': showPast }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        Événements passés ({{ pastEvents.length }})
      </button>
      <div v-if="showPast" class="mt-4 divide-y divide-gray-100 opacity-60">
        <EventCard v-for="event in pastEvents" :key="event.id" :event="event" />
      </div>
    </section>
  </div>
</template>
