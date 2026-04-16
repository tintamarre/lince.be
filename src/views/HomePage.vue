<script setup>
import { useEvents } from '../composables/useEvents.js'
import EventCard from '../components/EventCard.vue'

const { upcomingEvents } = useEvents()
const nextEvents = upcomingEvents.value.slice(0, 3)
</script>

<template>
  <div>
    <!-- Hero — minimal, typographic -->
    <section class="py-16 sm:py-24">
      <div class="max-w-4xl mx-auto px-5 sm:px-8">
        <h1 class="font-display text-4xl sm:text-5xl font-semibold text-village-950 tracking-tight leading-tight">
          Lincé
        </h1>
        <p class="mt-2 text-lg text-village-500 font-light">
          Village de Wallonie
        </p>
        <div class="mt-6">
          <router-link
            to="/agenda"
            class="inline-flex items-center gap-2 text-sm font-medium text-accent-600 hover:text-accent-700 transition-colors"
          >
            Consulter l'agenda
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Upcoming events -->
    <section v-if="nextEvents.length > 0" class="max-w-4xl mx-auto px-5 sm:px-8 pb-20">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="font-display text-xl font-semibold text-village-900">Prochains événements</h2>
        <router-link
          to="/agenda"
          class="text-xs text-village-500 hover:text-village-700 transition-colors"
        >
          Tout voir
        </router-link>
      </div>
      <div class="divide-y divide-village-200/60">
        <EventCard v-for="event in nextEvents" :key="event.id" :event="event" />
      </div>
    </section>

    <!-- Initiatives du village -->
    <section class="max-w-4xl mx-auto px-5 sm:px-8 pb-20">
      <h2 class="font-display text-xl font-semibold text-village-900 mb-6">Initiatives du village</h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <a
          href="https://coteauxdelince.be/"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-4 p-5 rounded-xl border border-village-200 hover:border-village-300 hover:bg-white transition-colors"
        >
          <span class="text-3xl">🍇</span>
          <div>
            <span class="font-semibold text-village-900 group-hover:text-accent-700 transition-colors">Les Coteaux de Lincé</span>
            <p class="text-sm text-village-500 mt-0.5">Vin de Lincé</p>
          </div>
        </a>
        <a
          href="https://lincette.be/"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-4 p-5 rounded-xl border border-village-200 hover:border-village-300 hover:bg-white transition-colors"
        >
          <span class="text-3xl">🍺</span>
          <div>
            <span class="font-semibold text-village-900 group-hover:text-accent-700 transition-colors">La Lincette</span>
            <p class="text-sm text-village-500 mt-0.5">Bière de Lincé</p>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
