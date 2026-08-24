#!/usr/bin/env node
// Regenerates public/data/tec-65.json from the TEC GTFS static feed.
//
// The Bus 65 page (src/views/Bus65Page.vue) needs a baked snapshot of route 65:
// its stop patterns, shapes, trip → direction map and a fallback timetable for
// the Lincé and Belle-Île stops. TEC rolls its GTFS service period every few
// weeks, which changes every trip_id, so this must be re-run periodically
// (see .github/workflows/refresh-tec-65.yml).
//
// Usage: node scripts/generate-tec-65.js
// No dependencies: streams the zip members through the system `unzip -p`.

import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { writeFileSync, mkdtempSync, createWriteStream, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const GTFS_URL =
  'https://api-management-discovery-production.azure-api.net/api/gtfs/feed/tec/static'
const OUTPUT = fileURLToPath(new URL('../public/data/tec-65.json', import.meta.url))
const ROUTE_SHORT_NAME = '65'

// The page is anchored on these two stops (normalized GTFS parent_station ids).
const ORIGIN_ID = 'tec:s-linceeglise'
const DESTINATION_ID = 'tec:s-liegepontdebellele'
const MAP_CENTER = { lat: 50.57, lon: 5.59 }

// Fixed labels per GTFS direction_id for route 65.
const DIRECTIONS = {
  0: { code: 'to_aywaille', label: 'to Aywaille', destination: 'Aywaille / Remouchamps', headsign: 'Remouchamps' },
  1: { code: 'to_liege', label: 'to Liège', destination: 'Liège / Guillemins', headsign: 'Guillemins' },
}
// For the fallback timetable, each anchor stop only cares about one direction:
// Lincé → Belle-Île uses to_liege departures, Belle-Île → Lincé uses to_aywaille.
const SCHEDULE_DIRECTION = { [ORIGIN_ID]: 'to_liege', [DESTINATION_ID]: 'to_aywaille' }

function log(...args) {
  console.error('[tec-65]', ...args)
}

// Minimal RFC4180-ish CSV line parser (handles quoted fields and "" escapes).
function parseCsvLine(line) {
  const out = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { field += '"'; i += 1 } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { out.push(field); field = '' }
    else field += c
  }
  out.push(field)
  return out
}

// Stream one member of the zip line by line, invoking `onRow(record)` with a
// header-keyed object. Uses `unzip -p` so nothing is written to disk.
async function streamMember(zipPath, member, onRow) {
  const child = spawn('unzip', ['-p', zipPath, member])
  child.stderr.on('data', (d) => log(`unzip ${member}: ${d}`.trim()))
  const rl = createInterface({ input: child.stdout, crlfDelay: Infinity })
  let header = null
  for await (const line of rl) {
    if (!line) continue
    const cols = parseCsvLine(line)
    if (!header) {
      header = cols
      continue
    }
    const record = {}
    for (let i = 0; i < header.length; i += 1) record[header[i]] = cols[i]
    onRow(record)
  }
  const code = await new Promise((resolve) => child.on('close', resolve))
  if (code !== 0) throw new Error(`unzip -p ${member} exited with code ${code}`)
}

async function downloadZip() {
  const dir = mkdtempSync(join(tmpdir(), 'tec-gtfs-'))
  const zipPath = join(dir, 'gtfs.zip')
  log('downloading GTFS static feed…')
  const res = await fetch(GTFS_URL)
  if (!res.ok) throw new Error(`GTFS download failed: HTTP ${res.status}`)
  await pipeline(Readable.fromWeb(res.body), createWriteStream(zipPath))
  log('downloaded to', zipPath)
  return { dir, zipPath }
}

function isoDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

function toSeconds(hms) {
  if (!hms) return null
  const [h, m, s] = hms.split(':').map(Number)
  return h * 3600 + m * 60 + s
}

async function main() {
  const { dir, zipPath } = await downloadZip()
  try {
    // 1. Resolve the route id from its short name.
    let routeId = null
    let routeMeta = null
    await streamMember(zipPath, 'routes.txt', (r) => {
      if (r.route_short_name !== ROUTE_SHORT_NAME) return
      // Prefer the main line if several share the short name.
      if (!routeId || (r.route_long_name || '').includes('Aywaille')) {
        routeId = r.route_id
        routeMeta = r
      }
    })
    if (!routeId) throw new Error(`route with short_name ${ROUTE_SHORT_NAME} not found`)
    log('route', routeId, `(${routeMeta.route_long_name})`)

    // 2. Trips for this route.
    const trips = new Map() // trip_id -> { serviceId, shapeId, directionId, headsign }
    const shapeIds = new Set()
    const serviceIds = new Set()
    await streamMember(zipPath, 'trips.txt', (r) => {
      if (r.route_id !== routeId) return
      trips.set(r.trip_id, {
        serviceId: r.service_id,
        shapeId: r.shape_id,
        directionId: Number(r.direction_id),
        headsign: r.trip_headsign,
      })
      if (r.shape_id) shapeIds.add(r.shape_id)
      if (r.service_id) serviceIds.add(r.service_id)
    })
    log(trips.size, 'trips,', shapeIds.size, 'shapes,', serviceIds.size, 'services')

    // 3. Stops (full index: id -> parent/name/coords).
    const stopIndex = new Map()
    await streamMember(zipPath, 'stops.txt', (r) => {
      stopIndex.set(r.stop_id, {
        parent: r.parent_station || '',
        name: r.stop_name,
        lat: Number(r.stop_lat),
        lon: Number(r.stop_lon),
      })
    })
    const normalizeStop = (stopId) => stopIndex.get(stopId)?.parent || stopId
    const stationInfo = (normId, fallbackId) => {
      const s = stopIndex.get(normId) || stopIndex.get(fallbackId) || {}
      return { name: s.name, lat: s.lat, lon: s.lon }
    }

    // 4. Stop times (big file) — keep only this route's trips.
    const tripStops = new Map() // trip_id -> [{ seq, stopId, dep }]
    await streamMember(zipPath, 'stop_times.txt', (r) => {
      if (!trips.has(r.trip_id)) return
      let arr = tripStops.get(r.trip_id)
      if (!arr) { arr = []; tripStops.set(r.trip_id, arr) }
      arr.push({
        seq: Number(r.stop_sequence),
        stopId: r.stop_id,
        dep: toSeconds(r.departure_time || r.arrival_time),
      })
    })
    for (const arr of tripStops.values()) arr.sort((a, b) => a.seq - b.seq)
    log('stop_times loaded for', tripStops.size, 'trips')

    // 5. Shapes (big file) — keep only this route's shapes.
    const shapes = new Map() // shape_id -> [{ seq, lat, lon }]
    await streamMember(zipPath, 'shapes.txt', (r) => {
      if (!shapeIds.has(r.shape_id)) return
      let arr = shapes.get(r.shape_id)
      if (!arr) { arr = []; shapes.set(r.shape_id, arr) }
      arr.push({
        seq: Number(r.shape_pt_sequence),
        lat: Number(r.shape_pt_lat),
        lon: Number(r.shape_pt_lon),
      })
    })
    for (const arr of shapes.values()) arr.sort((a, b) => a.seq - b.seq)
    log('shapes loaded for', shapes.size, 'shapes')

    // 6. Calendar + exceptions for the used services.
    const services = {}
    await streamMember(zipPath, 'calendar.txt', (r) => {
      if (!serviceIds.has(r.service_id)) return
      services[r.service_id] = {
        start_date: isoDate(r.start_date),
        end_date: isoDate(r.end_date),
        weekdays: {
          0: r.monday === '1',
          1: r.tuesday === '1',
          2: r.wednesday === '1',
          3: r.thursday === '1',
          4: r.friday === '1',
          5: r.saturday === '1',
          6: r.sunday === '1',
        },
        exceptions: {},
      }
    })
    await streamMember(zipPath, 'calendar_dates.txt', (r) => {
      if (!serviceIds.has(r.service_id)) return
      const svc = services[r.service_id] || (services[r.service_id] = {
        start_date: null, end_date: null, weekdays: {}, exceptions: {},
      })
      svc.exceptions[isoDate(r.date)] = Number(r.exception_type)
    })
    log(Object.keys(services).length, 'services detailed')

    // --- Build the output structures ---

    // Group trips by shape to form patterns; a representative trip supplies stops.
    const byShape = new Map()
    for (const [tripId, t] of trips) {
      if (!t.shapeId) continue
      let g = byShape.get(t.shapeId)
      if (!g) { g = { tripIds: [], directionId: t.directionId }; byShape.set(t.shapeId, g) }
      g.tripIds.push(tripId)
    }

    const patterns = []
    for (const [shapeId, g] of byShape) {
      // Representative = the trip with the most stops (most complete variant).
      let repId = g.tripIds[0]
      let repLen = tripStops.get(repId)?.length || 0
      for (const id of g.tripIds) {
        const len = tripStops.get(id)?.length || 0
        if (len > repLen) { repId = id; repLen = len }
      }
      const repStops = tripStops.get(repId) || []
      const stops = repStops.map((st) => {
        const normId = normalizeStop(st.stopId)
        const info = stationInfo(normId, st.stopId)
        return { id: normId, name: info.name, lat: info.lat, lon: info.lon, sequence: st.seq }
      })
      const dir = DIRECTIONS[g.directionId] || {}
      patterns.push({
        id: shapeId,
        label: stops.length ? `${stops[0].name} -> ${stops[stops.length - 1].name}` : shapeId,
        direction: dir.code || null,
        direction_label: dir.label || null,
        destination: dir.destination || null,
        headsign: dir.headsign || null,
        trip_count: g.tripIds.length,
        sample_trip_id: repId,
        stops,
        shape: (shapes.get(shapeId) || []).map((p) => ({ lat: p.lat, lon: p.lon, sequence: p.seq })),
      })
    }
    patterns.sort((a, b) => b.trip_count - a.trip_count)

    const tripIds = [...trips.keys()]
    const trip_directions = {}
    const trip_patterns = {}
    for (const [tripId, t] of trips) {
      trip_directions[tripId] = DIRECTIONS[t.directionId] || null
      if (t.shapeId) trip_patterns[tripId] = t.shapeId
    }

    // platform_to_stop: every route-65 platform that has a distinct parent.
    const platform_to_stop = {}
    for (const arr of tripStops.values()) {
      for (const st of arr) {
        const parent = stopIndex.get(st.stopId)?.parent
        if (parent && parent !== st.stopId) platform_to_stop[st.stopId] = parent
      }
    }

    // scheduled_departures: fallback timetable at the two anchor stops.
    const scheduled_departures = []
    for (const [tripId, t] of trips) {
      const dir = DIRECTIONS[t.directionId]
      if (!dir) continue
      for (const st of tripStops.get(tripId) || []) {
        const normId = normalizeStop(st.stopId)
        if (SCHEDULE_DIRECTION[normId] !== dir.code) continue
        scheduled_departures.push({
          trip_id: tripId,
          service_id: t.serviceId,
          stop_id: normId,
          departure_seconds: st.dep,
          direction: dir.code,
          direction_label: dir.label,
          destination: dir.destination,
          headsign: dir.headsign,
        })
      }
    }
    scheduled_departures.sort((a, b) => a.departure_seconds - b.departure_seconds)

    const origin = { id: ORIGIN_ID, ...stationInfo(ORIGIN_ID) }
    const destination = { id: DESTINATION_ID, ...stationInfo(DESTINATION_ID) }

    const output = {
      route: {
        id: routeId,
        short_name: routeMeta.route_short_name,
        long_name: routeMeta.route_long_name,
        color: routeMeta.route_color,
      },
      origin,
      destination,
      map_center: MAP_CENTER,
      patterns,
      trip_ids: tripIds,
      trip_directions,
      platform_to_stop,
      scheduled_departures,
      services,
      trip_patterns,
    }

    writeFileSync(OUTPUT, JSON.stringify(output))
    log('wrote', OUTPUT)
    log('summary:', patterns.length, 'patterns,', tripIds.length, 'trips,',
      scheduled_departures.length, 'scheduled departures')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  log('ERROR', err)
  process.exit(1)
})
