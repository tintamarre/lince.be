<script setup>
import { ref } from 'vue'
import EventList from '../components/EventList.vue'
import EventCalendar from '../components/EventCalendar.vue'
import CalendarSubscribe from '../components/CalendarSubscribe.vue'
import ProposeEvent from '../components/ProposeEvent.vue'

const view = ref('list')
</script>

<template>
  <div class="max-w-5xl mx-auto px-5 sm:px-8 py-10">
    <!-- Page header -->
    <div class="border-b-2 border-village-900 pb-5 mb-8">
      <div class="font-mono text-[11px] font-bold tracking-widest uppercase text-village-500 mb-2">
        02 / AGENDA
      </div>
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h1 class="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] tracking-[-0.03em] uppercase text-village-900">
          Agenda<span class="text-accent-500">.</span>
        </h1>
        <div class="flex border-2 border-village-900 bg-village-50">
          <button
            class="px-4 py-2 font-mono text-[11px] font-bold tracking-widest uppercase transition-colors border-r-2 border-village-900"
            :class="view === 'list' ? 'bg-village-900 text-accent-500' : 'text-village-700 hover:bg-village-100'"
            @click="view = 'list'"
          >
            ≡ Liste
          </button>
          <button
            class="px-4 py-2 font-mono text-[11px] font-bold tracking-widest uppercase transition-colors"
            :class="view === 'calendar' ? 'bg-village-900 text-accent-500' : 'text-village-700 hover:bg-village-100'"
            @click="view = 'calendar'"
          >
            ▦ Calendrier
          </button>
        </div>
      </div>
    </div>

    <EventList v-if="view === 'list'" />
    <EventCalendar v-else />

    <!-- Bottom actions -->
    <div class="mt-16 pt-6 border-t-2 border-village-900 grid sm:grid-cols-2 gap-6">
      <ProposeEvent />
      <CalendarSubscribe />
    </div>
  </div>
</template>
