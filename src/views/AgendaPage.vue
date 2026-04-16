<script setup>
import { ref } from 'vue'
import EventList from '../components/EventList.vue'
import EventCalendar from '../components/EventCalendar.vue'
import CalendarSubscribe from '../components/CalendarSubscribe.vue'
import ProposeEvent from '../components/ProposeEvent.vue'

const view = ref('list')
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
    <!-- Header + view toggle -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Agenda</h1>
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button
          class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="view = 'list'"
        >
          Liste
        </button>
        <button
          class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          :class="view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="view = 'calendar'"
        >
          Calendrier
        </button>
      </div>
    </div>

    <!-- Views -->
    <EventList v-if="view === 'list'" />
    <EventCalendar v-else />

    <!-- Propose + Subscribe sections -->
    <div class="mt-16 space-y-6">
      <ProposeEvent />
      <CalendarSubscribe />
    </div>
  </div>
</template>
