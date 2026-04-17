import { getEventWatchPaths, isEventSourceFile, loadEvents } from './parse-events.js'

const EVENTS_ID = 'virtual:events'
const RESOLVED_ID = '\0' + EVENTS_ID

export default function markdownEvents() {
  return {
    name: 'markdown-events',
    configureServer(server) {
      server.watcher.add(getEventWatchPaths())
    },
    resolveId(id) {
      if (id === EVENTS_ID) return RESOLVED_ID
    },
    load(id) {
      if (id === RESOLVED_ID) {
        const events = loadEvents()
        return `export default ${JSON.stringify(events)}`
      }
    },
    handleHotUpdate({ file, server }) {
      if (isEventSourceFile(file)) {
        const module = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (module) {
          server.moduleGraph.invalidateModule(module)
          server.ws.send({ type: 'full-reload' })
        }
      }
    },
  }
}
