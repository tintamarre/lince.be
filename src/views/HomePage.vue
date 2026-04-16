<script setup>
import { useEvents } from '../composables/useEvents.js'
import EventCard from '../components/EventCard.vue'

const { upcomingEvents, formatDate } = useEvents()
const nextEvents = upcomingEvents.value.slice(0, 3)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-b from-village-50 to-white py-20 sm:py-28">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h1 class="text-4xl sm:text-5xl font-bold text-village-900 tracking-tight">
          Lincé
        </h1>
        <p class="mt-4 text-lg sm:text-xl text-village-700">
          Un village de Wallonie
        </p>
        <p class="mt-3 text-gray-500 max-w-lg mx-auto">
          Bienvenue sur le site du village de Lincé. Retrouvez ici l'agenda des événements
          et activités de notre village.
        </p>
        <div class="mt-8">
          <router-link
            to="/agenda"
            class="inline-flex items-center gap-2 px-6 py-3 bg-village-700 text-white font-medium rounded-lg hover:bg-village-800 transition-colors"
          >
            Voir l'agenda
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Upcoming events preview -->
    <section v-if="nextEvents.length > 0" class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Prochains événements</h2>
      <div class="divide-y divide-gray-100">
        <EventCard v-for="event in nextEvents" :key="event.id" :event="event" />
      </div>
      <div class="mt-8 text-center">
        <router-link
          to="/agenda"
          class="text-sm font-medium text-village-700 hover:text-village-800 transition-colors"
        >
          Voir tous les événements &rarr;
        </router-link>
      </div>
    </section>
  </div>
</template>
