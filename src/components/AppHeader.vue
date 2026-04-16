<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        <RouterLink to="/" class="text-xl font-bold text-village-800 tracking-tight">
          Lincé
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden sm:flex items-center gap-8">
          <RouterLink
            to="/"
            class="text-sm font-medium text-gray-600 hover:text-village-700 transition-colors"
            active-class="!text-village-800"
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/agenda"
            class="text-sm font-medium text-gray-600 hover:text-village-700 transition-colors"
            active-class="!text-village-800"
          >
            Agenda
          </RouterLink>
        </nav>

        <!-- Mobile hamburger -->
        <button
          class="sm:hidden p-2 text-gray-600 hover:text-village-700"
          @click="menuOpen = !menuOpen"
          aria-label="Menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!menuOpen"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile nav -->
      <nav v-if="menuOpen" class="sm:hidden pb-4 space-y-2">
        <RouterLink
          to="/"
          class="block py-2 text-sm font-medium text-gray-600 hover:text-village-700"
          active-class="!text-village-800"
          @click="menuOpen = false"
        >
          Accueil
        </RouterLink>
        <RouterLink
          to="/agenda"
          class="block py-2 text-sm font-medium text-gray-600 hover:text-village-700"
          active-class="!text-village-800"
          @click="menuOpen = false"
        >
          Agenda
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
