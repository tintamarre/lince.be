import { computed } from 'vue'
import events from 'virtual:events'

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

const CATEGORY_COLORS = {
  sport: { bg: 'bg-sky-50', text: 'text-sky-700' },
  marché: { bg: 'bg-amber-50', text: 'text-amber-700' },
  fête: { bg: 'bg-rose-50', text: 'text-rose-700' },
  culture: { bg: 'bg-violet-50', text: 'text-violet-700' },
  réunion: { bg: 'bg-village-100', text: 'text-village-700' },
  'vie locale': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

const DEFAULT_COLOR = { bg: 'bg-village-100', text: 'text-village-600' }

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

function formatRelativeDiff(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [y, m, d] = dateStr.split('-').map(Number)
  const eventDate = new Date(y, m - 1, d)
  const diffDays = Math.round((eventDate - today) / 86400000)

  if (diffDays < 0) return null
  if (diffDays === 0) return "aujourd'hui"
  if (diffDays === 1) return 'demain'
  if (diffDays < 7) return `dans ${diffDays} jours`
  if (diffDays < 14) return 'dans 1 semaine'
  if (diffDays < 30) return `dans ${Math.floor(diffDays / 7)} semaines`
  if (diffDays < 60) return 'dans 1 mois'
  return `dans ${Math.floor(diffDays / 30)} mois`
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
    formatRelativeDiff,
  }
}
