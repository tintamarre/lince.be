<script setup>
import { ref, computed } from 'vue'
import { useEvents } from '../composables/useEvents.js'
import EventCard from './EventCard.vue'

const { eventsForDate } = useEvents()

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
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
  <div>
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-6">
      <button
        class="p-2 rounded-lg hover:bg-village-100 text-village-500 transition-colors"
        @click="prevMonth"
        aria-label="Mois précédent"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h3 class="font-display text-lg font-semibold text-village-900">{{ monthLabel }}</h3>
      <button
        class="p-2 rounded-lg hover:bg-village-100 text-village-500 transition-colors"
        @click="nextMonth"
        aria-label="Mois suivant"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Day headers -->
    <div class="grid grid-cols-7 mb-1">
      <div v-for="day in DAYS_FR" :key="day" class="text-center text-[10px] font-medium text-village-400 uppercase tracking-widest">
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-px bg-village-200 rounded-lg overflow-hidden">
      <button
        v-for="(cell, i) in calendarDays"
        :key="i"
        class="relative p-2 min-h-[3rem] text-sm transition-colors"
        :class="{
          'bg-village-50/50 text-village-300': cell.outside,
          'bg-village-50 text-village-800 hover:bg-village-100': !cell.outside && !hasEvents(cell.date),
          'bg-accent-200 text-accent-900 font-semibold hover:bg-accent-300': !cell.outside && hasEvents(cell.date),
          '!bg-accent-600 !text-white': selectedDate === cell.date,
        }"
        @click="!cell.outside && selectDate(cell.date)"
        :disabled="cell.outside"
      >
        <span
          v-if="isToday(cell.date)"
          class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-village-800 text-white text-sm font-medium"
        >
          {{ cell.day }}
        </span>
        <span v-else>{{ cell.day }}</span>
      </button>
    </div>

    <!-- Selected date events -->
    <div v-if="selectedDate && selectedEvents.length > 0" class="mt-6 divide-y divide-village-200/60">
      <EventCard v-for="event in selectedEvents" :key="event.id" :event="event" />
    </div>
    <p v-else-if="selectedDate" class="mt-6 text-center text-sm text-village-400">
      Aucun événement ce jour.
    </p>
  </div>
</template>
