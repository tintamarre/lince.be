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

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const days = []

  // Padding days from previous month
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(currentYear.value, currentMonth.value, -i)
    days.push({ date: fmt(d), day: d.getDate(), outside: true })
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(currentYear.value, currentMonth.value, d)
    days.push({ date: fmt(date), day: d, outside: false })
  }

  // Padding days for next month
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
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
  selectedDate.value = null
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
  selectedDate.value = null
}

function selectDate(dateStr) {
  selectedDate.value = selectedDate.value === dateStr ? null : dateStr
}

function isToday(dateStr) {
  return dateStr === fmt(now)
}

function hasEvents(dateStr) {
  return eventsForDate(dateStr).length > 0
}
</script>

<template>
  <div>
    <!-- Month navigation -->
    <div class="flex items-center justify-between mb-6">
      <button
        class="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        @click="prevMonth"
        aria-label="Mois précédent"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h3 class="text-lg font-semibold text-gray-900">{{ monthLabel }}</h3>
      <button
        class="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
        @click="nextMonth"
        aria-label="Mois suivant"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Day headers -->
    <div class="grid grid-cols-7 mb-2">
      <div v-for="day in DAYS_FR" :key="day" class="text-center text-xs font-medium text-gray-400 uppercase">
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden">
      <button
        v-for="(cell, i) in calendarDays"
        :key="i"
        class="relative p-2 min-h-[3rem] text-sm transition-colors"
        :class="{
          'bg-white text-gray-300': cell.outside,
          'bg-white text-gray-900 hover:bg-gray-50': !cell.outside && !hasEvents(cell.date),
          'bg-village-100 text-village-900 font-semibold hover:bg-village-200': !cell.outside && hasEvents(cell.date),
          'ring-2 ring-village-500 ring-inset': selectedDate === cell.date,
          'font-bold': isToday(cell.date),
        }"
        @click="!cell.outside && selectDate(cell.date)"
        :disabled="cell.outside"
      >
        <span
          v-if="isToday(cell.date)"
          class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-village-700 text-white text-sm"
        >
          {{ cell.day }}
        </span>
        <span v-else>{{ cell.day }}</span>
      </button>
    </div>

    <!-- Selected date events -->
    <div v-if="selectedDate && selectedEvents.length > 0" class="mt-6 divide-y divide-gray-100">
      <EventCard v-for="event in selectedEvents" :key="event.id" :event="event" />
    </div>
    <p v-else-if="selectedDate" class="mt-6 text-center text-sm text-gray-400">
      Aucun événement ce jour.
    </p>
  </div>
</template>
