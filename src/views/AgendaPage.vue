<script setup>
import { ref } from 'vue'
import EventList from '../components/EventList.vue'
import EventCalendar from '../components/EventCalendar.vue'
import CalendarSubscribe from '../components/CalendarSubscribe.vue'
import ProposeEvent from '../components/ProposeEvent.vue'

const view = ref('list')
</script>

<template>
  <div class="max-w-4xl mx-auto px-5 sm:px-8 py-10">
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-display text-2xl sm:text-3xl font-semibold text-village-900">Agenda</h1>
      <div class="flex bg-village-100 rounded-lg p-0.5">
        <button
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
          :class="view === 'list' ? 'bg-white text-village-900 shadow-sm' : 'text-village-500 hover:text-village-700'"
          @click="view = 'list'"
        >
          Liste
        </button>
        <button
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
          :class="view === 'calendar' ? 'bg-white text-village-900 shadow-sm' : 'text-village-500 hover:text-village-700'"
          @click="view = 'calendar'"
        >
          Calendrier
        </button>
      </div>
    </div>

    <EventList v-if="view === 'list'" />
    <EventCalendar v-else />

    <!-- Bottom actions — compact row -->
    <div class="mt-16 pt-8 border-t border-village-200 flex flex-col sm:flex-row gap-6">
      <ProposeEvent />
      <CalendarSubscribe />
    </div>
  </div>
</template>
