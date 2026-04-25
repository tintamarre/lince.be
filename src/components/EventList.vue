<script setup>
import { ref } from 'vue'
import { useEvents } from '../composables/useEvents.js'
import EventCard from './EventCard.vue'

const { groupedByMonth, pastEvents } = useEvents()
const showPast = ref(false)
</script>

<template>
  <div>
    <section
      v-for="(group, gi) in groupedByMonth"
      :key="group.label"
      class="border-2 border-village-900 mb-8 bg-village-50"
    >
      <h3 class="font-mono text-[11px] font-bold tracking-widest uppercase text-village-900 px-5 sm:px-8 py-2 bg-village-100 border-b-2 border-village-900 flex justify-between items-center">
        <span>{{ String(gi + 1).padStart(2, '0') }} / {{ group.label }}</span>
        <span class="text-village-500">{{ group.events.length }} ÉV.</span>
      </h3>
      <EventCard
        v-for="(event, i) in group.events"
        :key="event.id"
        :event="event"
      />
    </section>

    <p
      v-if="groupedByMonth.length === 0"
      class="text-center font-mono text-xs tracking-widest uppercase text-village-500 py-16 border-2 border-dashed border-village-300"
    >
      AUCUN ÉVÉNEMENT À VENIR
    </p>

    <section v-if="pastEvents.length > 0" class="pt-4">
      <button
        class="font-mono text-[11px] font-bold tracking-widest uppercase text-village-500 hover:text-accent-500 transition-colors flex items-center gap-2"
        @click="showPast = !showPast"
      >
        <span class="transition-transform inline-block" :class="{ 'rotate-90': showPast }">▸</span>
        ÉVÉNEMENTS PASSÉS [ {{ pastEvents.length }} ]
      </button>
      <section
        v-if="showPast"
        class="mt-4 border-2 border-village-300 opacity-70"
      >
        <EventCard
          v-for="event in pastEvents"
          :key="event.id"
          :event="event"
        />
      </section>
    </section>
  </div>
</template>
