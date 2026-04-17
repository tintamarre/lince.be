import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { loadEvents } from '../src/plugins/parse-events.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const events = loadEvents(rootDir)
const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const siteUrl = 'https://lince.be'

function escapeIcsText(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

function buildEventUrl(event) {
  return `${siteUrl}/#/agenda?date=${event.startDate}#date-${event.startDate}`
}

let ics = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Lince.be//Agenda//FR',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-CALNAME:Agenda de Lincé',
  'X-WR-TIMEZONE:Europe/Brussels',
]

for (const event of events) {
  const eventUrl = buildEventUrl(event)
  const description = event.description
    ? `${event.description}\n\nLien : ${eventUrl}`
    : `Lien : ${eventUrl}`

  ics.push('BEGIN:VEVENT')
  ics.push(`UID:${event.id}@lince.be`)
  ics.push(`DTSTAMP:${now}`)
  ics.push(`SUMMARY:${escapeIcsText(event.title)}`)

  if (event.startTime) {
    const dtStart = event.startDate.replace(/-/g, '') + 'T' + event.startTime.replace(':', '') + '00'
    ics.push(`DTSTART;TZID=Europe/Brussels:${dtStart}`)
    if (event.endTime) {
      const dtEnd = event.endDate.replace(/-/g, '') + 'T' + event.endTime.replace(':', '') + '00'
      ics.push(`DTEND;TZID=Europe/Brussels:${dtEnd}`)
    }
  } else {
    ics.push(`DTSTART;VALUE=DATE:${event.startDate.replace(/-/g, '')}`)
    if (event.endDate !== event.startDate) {
      ics.push(`DTEND;VALUE=DATE:${event.endDate.replace(/-/g, '')}`)
    }
  }

  if (event.location) ics.push(`LOCATION:${escapeIcsText(event.location)}`)
  ics.push(`URL:${eventUrl}`)
  ics.push(`DESCRIPTION:${escapeIcsText(description)}`)

  ics.push('END:VEVENT')
}

ics.push('END:VCALENDAR')

const output = ics.join('\r\n') + '\r\n'
const outPath = resolve(rootDir, 'public/calendar.ics')
writeFileSync(outPath, output, 'utf-8')
console.log(`Generated ${outPath} with ${events.length} events`)
