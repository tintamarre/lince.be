import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseEventsMd } from './parse-events.js'

const EVENTS_ID = 'virtual:events'
const RESOLVED_ID = '\0' + EVENTS_ID

export default function markdownEvents() {
  const eventsPath = resolve('src/data/events.md')

  return {
    name: 'markdown-events',
    resolveId(id) {
      if (id === EVENTS_ID) return RESOLVED_ID
    },
    load(id) {
      if (id === RESOLVED_ID) {
        const content = readFileSync(eventsPath, 'utf-8')
        const events = parseEventsMd(content)
        return `export default ${JSON.stringify(events)}`
      }
    },
    handleHotUpdate({ file, server }) {
      if (file === eventsPath) {
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          server.ws.send({ type: 'full-reload' })
        }
      }
    },
  }
}
