<script setup>
import { ref, computed } from 'vue'
import { useEvents } from '../composables/useEvents.js'
import EventCard from './EventCard.vue'

const { eventsForDate } = useEvents()

const DAYS_FR = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM']
const MONTHS_FR = [
  'JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
  'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE',
]

const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYear = ref(now.getFullYear())
const selectedDate = ref(null)

const monthLabel = computed(() => `${MONTHS_FR[currentMonth.value]} ${currentYear.value}`)

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)

  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days = []

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value, -i)
    days.push({ date: fmt(d), day: d.getDate(), outside: true })
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear.value, currentMonth.value, d)
    days.push({ date: fmt(date), day: d, outside: false })
  }

  const remaining = 7 - (days.length % 7)
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(currentYear.value, currentMonth.value + 1, d)
      days.push({ date: fmt(date), day: d, outside: true })
    }
  }

  return days
})

const selectedEvents = computed(() => {
  if (!selectedDate.value) return []
  return eventsForDate(selectedDate.value)
})

function fmt(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function prevMonth() {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
  selectedDate.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
  selectedDate.value = null
}

function selectDate(dateStr) {
  selectedDate.value = selectedDate.value === dateStr ? null : dateStr
}

function isToday(dateStr) { return dateStr === fmt(now) }
function hasEvents(dateStr) { return eventsForDate(dateStr).length > 0 }
</script>

<template>
  <div class="border-2 border-village-900 bg-village-50">
    <!-- Month navigation -->
    <div class="flex items-stretch border-b-2 border-village-900">
      <button
        class="px-4 py-3 font-display text-xl text-village-900 border-r-2 border-village-900 hover:bg-village-900 hover:text-accent-500 transition-colors"
        @click="prevMonth"
        aria-label="Mois précédent"
      >
        ←
      </button>
      <h3 class="flex-1 flex items-center justify-center font-display uppercase text-village-900 text-lg sm:text-xl tracking-tight">
        {{ monthLabel }}
      </h3>
      <button
        class="px-4 py-3 font-display text-xl text-village-900 border-l-2 border-village-900 hover:bg-village-900 hover:text-accent-500 transition-colors"
        @click="nextMonth"
        aria-label="Mois suivant"
      >
        →
      </button>
    </div>

    <!-- Day headers -->
    <div class="grid grid-cols-7 border-b-2 border-village-900 bg-village-100">
      <div
        v-for="day in DAYS_FR"
        :key="day"
        class="text-center font-mono text-[10px] font-bold tracking-widest text-village-900 py-1.5"
      >
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7">
      <button
        v-for="(cell, i) in calendarDays"
        :key="i"
        class="relative min-h-[3rem] sm:min-h-[3.5rem] font-mono text-sm transition-colors border-r border-b border-village-900/20"
        :class="[
          (i % 7 === 6) ? '!border-r-0' : '',
          cell.outside
            ? 'bg-village-100/50 text-village-300'
            : hasEvents(cell.date)
              ? 'bg-accent-100 text-village-900 font-bold hover:bg-accent-500 hover:text-village-50'
              : 'bg-village-50 text-village-700 hover:bg-village-100',
          selectedDate === cell.date ? '!bg-village-900 !text-accent-500' : '',
        ]"
        @click="!cell.outside && selectDate(cell.date)"
        :disabled="cell.outside"
      >
        <span
          v-if="isToday(cell.date) && selectedDate !== cell.date"
          class="inline-flex items-center justify-center w-7 h-7 bg-village-900 text-village-50 font-display text-sm"
        >
          {{ cell.day }}
        </span>
        <span v-else>{{ String(cell.day).padStart(2, '0') }}</span>
        <span
          v-if="hasEvents(cell.date) && !cell.outside"
          class="absolute bottom-1 right-1 w-1.5 h-1.5 bg-accent-500"
          :class="selectedDate === cell.date ? '!bg-accent-500' : ''"
        ></span>
      </button>
    </div>

    <!-- Selected date events -->
    <div v-if="selectedDate && selectedEvents.length > 0" class="border-t-2 border-village-900">
      <div class="px-5 sm:px-8 py-2 bg-village-900 text-village-50 font-mono text-[11px] font-bold tracking-widest uppercase">
        {{ selectedDate }} · {{ selectedEvents.length }} ÉVÉNEMENT{{ selectedEvents.length > 1 ? 'S' : '' }}
      </div>
      <EventCard
        v-for="(event, i) in selectedEvents"
        :key="event.id"
        :event="event"
        :index="i + 1"
      />
    </div>
    <p
      v-else-if="selectedDate"
      class="border-t-2 border-village-900 text-center font-mono text-xs tracking-widest uppercase text-village-500 py-8"
    >
      AUCUN ÉVÉNEMENT CE JOUR
    </p>
  </div>
</template>
