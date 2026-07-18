<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const VEHICLE_URL =
  'https://api-management-discovery-production.azure-api.net/api/gtfs/feed/tec/rt/vehicle-position'
const TRIP_UPDATE_URL =
  'https://api-management-discovery-production.azure-api.net/api/gtfs/feed/tec/rt/trip-update'
const REFRESH_MS = 60_000
const TIME_ZONE = 'Europe/Brussels'
const TO_LIEGE = 'to_liege'
const TO_AYWAILLE = 'to_aywaille'

const mapEl = ref(null)
const line = ref(null)
const selectedPatternId = ref('')
const realtime = ref({ vehicles: [], arrivals: [], nextDepartures: {} })
const loading = ref(true)
const status = ref('Chargement')
const lastPull = ref(null)
const error = ref('')

let map
let routeLayer
let variantLayer
let stopLayer
let vehicleLayer
let refreshTimer
let visibilityHandler

const selectedPattern = computed(() => {
  if (!line.value) return null
  return line.value.patterns.find((pattern) => pattern.id === selectedPatternId.value) || line.value.patterns[0]
})

const activeVehicles = computed(() => realtime.value.vehicles.length)

onMounted(async () => {
  try {
    const [leaflet] = await Promise.all([loadLeaflet(), fetchLineData()])
    initMap(leaflet)
    drawAllVariants()
    selectedPatternId.value = line.value.patterns[0]?.id || ''
    await refreshRealtime()
    refreshTimer = window.setInterval(refreshRealtime, REFRESH_MS)
    visibilityHandler = () => {
      if (!document.hidden) refreshRealtime()
    }
    document.addEventListener('visibilitychange', visibilityHandler)
  } catch (err) {
    console.error(err)
    error.value = "Impossible de charger les données du bus 65."
    status.value = 'Erreur'
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  if (refreshTimer) window.clearInterval(refreshTimer)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
  if (map) map.remove()
})

watch(selectedPattern, () => {
  if (map && selectedPattern.value) drawSelectedPattern()
})

async function fetchLineData() {
  const response = await fetch('/data/tec-65.json')
  if (!response.ok) throw new Error(`tec-65.json: ${response.status}`)
  line.value = await response.json()
}

async function refreshRealtime() {
  if (!line.value || document.hidden) return

  status.value = 'Mise à jour'
  try {
    const [vehicleFeed, tripFeed] = await Promise.all([
      fetchJson(VEHICLE_URL),
      fetchJson(TRIP_UPDATE_URL),
    ])
    const now = Math.floor(Date.now() / 1000)
    const arrivals = parseTripUpdates(tripFeed, now)
    const vehicles = parseVehicles(vehicleFeed)
    realtime.value = {
      vehicles,
      arrivals,
      nextDepartures: nextDepartures(arrivals, now),
    }
    lastPull.value = now
    drawVehicles()
    status.value = 'Direct'
  } catch (err) {
    console.error(err)
    status.value = 'Erreur flux'
    error.value = 'Le flux temps réel TEC est momentanément indisponible.'
  }
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  return response.json()
}

async function loadLeaflet() {
  if (window.L) return window.L

  if (!document.querySelector('link[data-leaflet]')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.dataset.leaflet = 'true'
    document.head.appendChild(link)
  }

  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-leaflet]')
    if (existing) {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.dataset.leaflet = 'true'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })

  return window.L
}

function initMap(L) {
  map = L.map(mapEl.value, { zoomControl: true }).setView(
    [line.value.map_center.lat, line.value.map_center.lon],
    11,
  )
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  variantLayer = L.layerGroup().addTo(map)
  routeLayer = L.layerGroup().addTo(map)
  stopLayer = L.layerGroup().addTo(map)
  vehicleLayer = L.layerGroup().addTo(map)
}

function drawAllVariants() {
  variantLayer.clearLayers()
  line.value.patterns.forEach((pattern) => {
    window.L.polyline(points(pattern.shape), {
      color: '#5c5b54',
      weight: 2,
      opacity: 0.18,
    }).addTo(variantLayer)
  })
}

function drawSelectedPattern() {
  const pattern = selectedPattern.value
  routeLayer.clearLayers()
  stopLayer.clearLayers()

  window.L.polyline(points(pattern.shape), {
    color: '#2a9d8f',
    weight: 6,
    opacity: 0.92,
  }).addTo(routeLayer)

  pattern.stops.forEach((stop) => {
    const endpoint = stop.id === line.value.origin.id || stop.id === line.value.destination.id
    window.L.circleMarker([stop.lat, stop.lon], {
      radius: endpoint ? 7 : 4,
      color: '#0a0a0a',
      fillColor: endpoint ? '#2a9d8f' : '#fafaf5',
      fillOpacity: 1,
      weight: endpoint ? 2 : 1.5,
    })
      .bindPopup(`<strong>${stop.name}</strong>`)
      .addTo(stopLayer)
  })

  if (pattern.shape.length > 0) {
    map.fitBounds(window.L.latLngBounds(points(pattern.shape)), { padding: [26, 26] })
  }
}

function drawVehicles() {
  vehicleLayer.clearLayers()
  realtime.value.vehicles.forEach((vehicle) => {
    const destination = vehicle.direction === TO_LIEGE ? 'Liège' : vehicle.direction === TO_AYWAILLE ? 'Aywaille' : '?'
    window.L.marker([vehicle.lat, vehicle.lon], {
      icon: window.L.divIcon({
        className: '',
        html: `<div class="bus65-marker"><b>65</b><span>${destination}</span></div>`,
        iconSize: [62, 42],
        iconAnchor: [31, 21],
      }),
    })
      .bindPopup(
        `<strong>Bus 65 ${vehicle.directionLabel}</strong><br>Destination : ${
          vehicle.destination || 'inconnue'
        }<br>Position : ${formatTime(vehicle.timestamp || Math.floor(Date.now() / 1000))}`,
      )
      .addTo(vehicleLayer)
  })
}

function parseVehicles(feed) {
  return feed.entity
    .map((entity) => {
      const vehicle = entity.vehicle || {}
      const trip = vehicle.trip || {}
      const tripId = trip.tripId
      const direction = line.value.trip_directions[tripId]
      if (trip.routeId !== line.value.route.id && !direction) return null
      const position = vehicle.position || {}
      if (position.latitude == null || position.longitude == null) return null
      return {
        id: entity.id,
        tripId,
        ...directionPayload(direction),
        lat: position.latitude,
        lon: position.longitude,
        bearing: position.bearing,
        speed: position.speed,
        timestamp: jsonTimestamp(vehicle.timestamp),
      }
    })
    .filter(Boolean)
}

function parseTripUpdates(feed, now) {
  const allStops = new Set(line.value.patterns.flatMap((pattern) => pattern.stops.map((stop) => stop.id)))
  const arrivals = []

  feed.entity.forEach((entity) => {
    const update = entity.tripUpdate || {}
    const trip = update.trip || {}
    const tripId = trip.tripId
    const direction = line.value.trip_directions[tripId]
    if (trip.routeId !== line.value.route.id && !direction) return

    ;(update.stopTimeUpdate || []).forEach((stopUpdate) => {
      const stopId = line.value.platform_to_stop[stopUpdate.stopId] || stopUpdate.stopId
      if (!allStops.has(stopId)) return
      const event = stopUpdate.arrival || stopUpdate.departure || {}
      const eventTime = jsonTimestamp(event.time)
      if (!eventTime || eventTime < now) return
      arrivals.push({
        tripId,
        ...directionPayload(direction),
        stopId,
        arrivalTime: eventTime,
        delaySeconds: event.delay ?? null,
        source: 'realtime',
      })
    })
  })

  return arrivals.sort((a, b) => a.arrivalTime - b.arrivalTime).slice(0, 80)
}

function nextDepartures(arrivals, now) {
  const forward = arrivals.find(
    (arrival) => arrival.direction === TO_LIEGE && arrival.stopId === line.value.origin.id,
  )
  const reverse = arrivals.find(
    (arrival) => arrival.direction === TO_AYWAILLE && arrival.stopId === line.value.destination.id,
  )

  return {
    linceToBelleIle: forward || nextScheduled(TO_LIEGE, now),
    belleIleToLince: reverse || nextScheduled(TO_AYWAILLE, now),
  }
}

function nextScheduled(direction, now) {
  const candidates = []
  const today = brusselsDate(new Date(now * 1000))

  line.value.scheduled_departures
    .filter((departure) => departure.direction === direction)
    .forEach((departure) => {
      for (let offset = 0; offset < 2; offset += 1) {
        const serviceDate = addDays(today, offset)
        if (!serviceActive(line.value.services[departure.service_id], serviceDate)) continue
        const timestamp = brusselsLocalTimestamp(serviceDate, departure.departure_seconds)
        if (timestamp >= now) candidates.push({ departure, timestamp })
      }
    })

  if (candidates.length === 0) return null
  const { departure, timestamp } = candidates.sort((a, b) => a.timestamp - b.timestamp)[0]
  return {
    tripId: departure.trip_id,
    stopId: departure.stop_id,
    arrivalTime: timestamp,
    delaySeconds: null,
    direction: departure.direction,
    directionLabel: departure.direction_label,
    destination: departure.destination,
    headsign: departure.headsign,
    source: 'schedule',
  }
}

function serviceActive(service, serviceDate) {
  if (!service) return false
  const exception = service.exceptions?.[serviceDate]
  if (exception === 1) return true
  if (exception === 2) return false
  if (!service.start_date || !service.end_date) return false
  if (serviceDate < service.start_date || serviceDate > service.end_date) return false
  const weekday = new Date(`${serviceDate}T12:00:00Z`).getUTCDay()
  const mondayIndex = weekday === 0 ? 6 : weekday - 1
  return service.weekdays?.[mondayIndex] === true
}

function directionPayload(direction) {
  if (!direction) {
    return {
      direction: null,
      directionLabel: 'direction inconnue',
      destination: null,
      headsign: null,
    }
  }
  return {
    direction: direction.code,
    directionLabel: direction.label,
    destination: direction.destination,
    headsign: direction.headsign,
  }
}

function jsonTimestamp(value) {
  if (value == null) return null
  if (typeof value === 'number') return Math.trunc(value)
  if (typeof value === 'object' && value.low != null) {
    return Number(value.low) + Number(value.high || 0) * 2 ** 32
  }
  return null
}

function points(shape) {
  return shape.map((point) => [point.lat, point.lon])
}

function minutesUntil(timestamp) {
  const minutes = Math.round((timestamp * 1000 - Date.now()) / 60000)
  if (minutes <= 0) return 'maintenant'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('fr-BE', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000))
}

function formatPull(timestamp) {
  if (!timestamp) return '—'
  return new Intl.DateTimeFormat('fr-BE', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp * 1000))
}

function brusselsDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function addDays(dateIso, days) {
  const date = new Date(`${dateIso}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function brusselsLocalTimestamp(dateIso, seconds) {
  const [year, month, day] = dateIso.split('-').map(Number)
  const localAsUtc = Date.UTC(year, month - 1, day) + seconds * 1000
  const offset = timezoneOffsetMs(new Date(localAsUtc), TIME_ZONE)
  return Math.floor((localAsUtc - offset) / 1000)
}

function timezoneOffsetMs(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const localAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  )
  return localAsUtc - date.getTime()
}

function stopName(stopId) {
  const stop = selectedPattern.value?.stops.find((item) => item.id === stopId)
  return stop?.name || stopId
}
</script>

<template>
  <div>
    <section class="border-b-2 border-village-900">
      <div class="max-w-5xl mx-auto">
        <div class="px-5 sm:px-8 py-2 font-mono text-[11px] tracking-widest uppercase text-village-500 border-b border-village-900/20">
          01 / MOBILITÉ
        </div>
        <div class="grid lg:grid-cols-[1.1fr_1fr]">
          <div class="px-5 sm:px-8 py-6 border-b lg:border-b-0 lg:border-r-2 border-village-900">
            <p class="font-mono text-[11px] tracking-widest uppercase text-village-500 mb-3">
              TEC · Ligne 65
            </p>
            <h1 class="font-display uppercase text-village-900 text-[clamp(2.8rem,9vw,6rem)] leading-[0.85] tracking-[-0.04em]">
              BUS 65
            </h1>
            <p class="mt-5 text-[15px] leading-relaxed font-medium max-w-xl">
              Positions en direct et prochains départs entre Lincé, Belle-Île, Liège, Aywaille et Remouchamps.
            </p>
          </div>
          <div class="px-5 sm:px-8 py-6 grid gap-3 content-start">
            <div class="grid grid-cols-2 gap-3">
              <div class="border-2 border-village-900 p-4 bg-village-50">
                <span class="font-mono text-[10px] tracking-widest uppercase text-village-500">Bus actifs</span>
                <strong class="block font-display text-3xl leading-none mt-1">{{ activeVehicles }}</strong>
              </div>
              <div class="border-2 border-village-900 p-4 bg-village-50">
                <span class="font-mono text-[10px] tracking-widest uppercase text-village-500">Statut</span>
                <strong class="block font-mono text-sm uppercase mt-2">{{ status }}</strong>
              </div>
            </div>
            <p class="font-mono text-[11px] text-village-500">
              Dernière mise à jour : {{ formatPull(lastPull) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-b-2 border-village-900">
      <div class="max-w-5xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <div class="min-h-[520px] border-b lg:border-b-0 lg:border-r-2 border-village-900">
          <div ref="mapEl" class="h-[520px] lg:h-[calc(100vh-11rem)] min-h-[520px]"></div>
        </div>

        <aside class="px-5 sm:px-8 py-5 grid gap-6 content-start bg-village-50">
          <div v-if="loading" class="font-mono text-xs uppercase tracking-widest text-village-500">
            Chargement de la carte…
          </div>
          <div v-if="error" class="border-2 border-village-900 bg-accent-50 p-4 font-mono text-xs">
            {{ error }}
          </div>

          <section>
            <h2 class="font-mono text-[11px] tracking-widest uppercase text-village-500 mb-2">
              Variante
            </h2>
            <select
              v-model="selectedPatternId"
              class="w-full border-2 border-village-900 bg-village-50 px-3 py-2 font-mono text-xs"
            >
              <option
                v-for="(pattern, index) in line?.patterns || []"
                :key="pattern.id"
                :value="pattern.id"
              >
                {{ index + 1 }}. {{ pattern.label }} · {{ pattern.trip_count }} trajets
              </option>
            </select>
            <div v-if="selectedPattern" class="mt-3 grid gap-1 font-mono text-[11px] text-village-500">
              <span>{{ selectedPattern.direction_label }} · {{ selectedPattern.headsign }}</span>
              <span>{{ selectedPattern.stops.length }} arrêts · {{ selectedPattern.trip_count }} trajets dans le GTFS</span>
            </div>
          </section>

          <section>
            <h2 class="font-mono text-[11px] tracking-widest uppercase text-village-500 mb-2">
              Prochains bus
            </h2>
            <div class="grid gap-2">
              <div class="border-2 border-village-900 p-3 bg-village-100">
                <span class="font-mono text-[10px] tracking-widest uppercase text-village-500">Lincé → Belle-Île</span>
                <strong class="block font-display text-2xl leading-none mt-1">
                  <template v-if="realtime.nextDepartures.linceToBelleIle">
                    {{ minutesUntil(realtime.nextDepartures.linceToBelleIle.arrivalTime) }}
                  </template>
                  <template v-else>—</template>
                </strong>
                <span class="font-mono text-[11px] text-village-500">
                  <template v-if="realtime.nextDepartures.linceToBelleIle">
                    {{ formatTime(realtime.nextDepartures.linceToBelleIle.arrivalTime) }} ·
                    {{ realtime.nextDepartures.linceToBelleIle.source === 'realtime' ? 'temps réel' : 'horaire' }}
                  </template>
                  <template v-else>Aucun départ trouvé</template>
                </span>
              </div>

              <div class="border-2 border-village-900 p-3 bg-village-100">
                <span class="font-mono text-[10px] tracking-widest uppercase text-village-500">Belle-Île → Lincé</span>
                <strong class="block font-display text-2xl leading-none mt-1">
                  <template v-if="realtime.nextDepartures.belleIleToLince">
                    {{ minutesUntil(realtime.nextDepartures.belleIleToLince.arrivalTime) }}
                  </template>
                  <template v-else>—</template>
                </strong>
                <span class="font-mono text-[11px] text-village-500">
                  <template v-if="realtime.nextDepartures.belleIleToLince">
                    {{ formatTime(realtime.nextDepartures.belleIleToLince.arrivalTime) }} ·
                    {{ realtime.nextDepartures.belleIleToLince.source === 'realtime' ? 'temps réel' : 'horaire' }}
                  </template>
                  <template v-else>Aucun départ trouvé</template>
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 class="font-mono text-[11px] tracking-widest uppercase text-village-500 mb-2">
              Estimations aux arrêts
            </h2>
            <div class="grid gap-2 max-h-56 overflow-auto border-y border-village-900/20 py-2">
              <div
                v-for="arrival in realtime.arrivals.slice(0, 8)"
                :key="`${arrival.tripId}-${arrival.stopId}-${arrival.arrivalTime}`"
                class="grid grid-cols-[1fr_auto] gap-3 text-sm"
              >
                <div>
                  <strong class="block">{{ stopName(arrival.stopId) }}</strong>
                  <span class="font-mono text-[11px] text-village-500">{{ arrival.directionLabel }}</span>
                </div>
                <time class="font-mono text-xs font-bold">{{ minutesUntil(arrival.arrivalTime) }}</time>
              </div>
              <p v-if="realtime.arrivals.length === 0" class="font-mono text-xs text-village-500">
                Pas d'estimation temps réel sur cette variante pour l'instant.
              </p>
            </div>
          </section>

          <section>
            <h2 class="font-mono text-[11px] tracking-widest uppercase text-village-500 mb-2">
              Arrêts de la variante
            </h2>
            <ol class="grid gap-1 max-h-80 overflow-auto border-y border-village-900/20 py-2">
              <li
                v-for="stop in selectedPattern?.stops || []"
                :key="`${selectedPattern?.id}-${stop.id}-${stop.sequence}`"
                class="grid grid-cols-[2rem_1fr] gap-2 text-sm"
              >
                <span class="font-mono text-[11px] text-village-500">{{ stop.sequence }}</span>
                <strong>{{ stop.name }}</strong>
              </li>
            </ol>
          </section>
        </aside>
      </div>
    </section>
  </div>
</template>

<style>
.bus65-marker {
  align-items: center;
  background: #2a9d8f;
  border: 2px solid #0a0a0a;
  color: #fafaf5;
  display: flex;
  flex-direction: column;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 11px;
  font-weight: 900;
  height: 42px;
  justify-content: center;
  line-height: 1.05;
  width: 62px;
}

.bus65-marker span {
  font-size: 10px;
}
</style>
