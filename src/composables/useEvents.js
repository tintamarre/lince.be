import { computed } from 'vue'
import events from 'virtual:events'

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

const CATEGORY_COLORS = {
  sport: { bg: 'bg-blue-100', text: 'text-blue-800' },
  marché: { bg: 'bg-amber-100', text: 'text-amber-800' },
  fête: { bg: 'bg-pink-100', text: 'text-pink-800' },
  culture: { bg: 'bg-purple-100', text: 'text-purple-800' },
  réunion: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

const DEFAULT_COLOR = { bg: 'bg-village-100', text: 'text-village-800' }

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${d} ${MONTHS_FR[m - 1]} ${y}`
}

function formatDay(dateStr) {
  const [, , d] = dateStr.split('-').map(Number)
  return d
}

function formatMonthYear(dateStr) {
  const [y, m] = dateStr.split('-').map(Number)
  return `${MONTHS_FR[m - 1]} ${y}`
}

function categoryColor(category) {
  return CATEGORY_COLORS[category?.toLowerCase()] || DEFAULT_COLOR
}

export function useEvents() {
  const allEvents = computed(() =>
    [...events].sort((a, b) => a.startDate.localeCompare(b.startDate))
  )

  const upcomingEvents = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return allEvents.value.filter(e => e.startDate >= today)
  })

  const pastEvents = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return allEvents.value.filter(e => e.startDate < today).reverse()
  })

  const groupedByMonth = computed(() => {
    const groups = []
    let currentKey = ''
    for (const event of upcomingEvents.value) {
      const key = event.startDate.slice(0, 7)
      if (key !== currentKey) {
        currentKey = key
        groups.push({ label: formatMonthYear(event.startDate), events: [] })
      }
      groups[groups.length - 1].events.push(event)
    }
    return groups
  })

  function eventsForDate(dateStr) {
    return allEvents.value.filter(e => e.startDate === dateStr)
  }

  return {
    allEvents,
    upcomingEvents,
    pastEvents,
    groupedByMonth,
    eventsForDate,
    formatDate,
    formatDay,
    formatMonthYear,
    categoryColor,
  }
}
