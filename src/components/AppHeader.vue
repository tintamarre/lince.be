<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-village-50/95 backdrop-blur border-b border-village-200">
    <div class="max-w-4xl mx-auto px-5 sm:px-8">
      <div class="flex items-center justify-between h-14">
        <RouterLink to="/" class="font-display text-xl font-semibold text-village-900 tracking-tight">
          Lincé
        </RouterLink>

        <nav class="hidden sm:flex items-center gap-8">
          <RouterLink
            to="/"
            class="text-sm text-village-600 hover:text-village-900 transition-colors"
            active-class="!text-village-900 !font-medium"
          >
            Accueil
          </RouterLink>
          <RouterLink
            to="/agenda"
            class="text-sm text-village-600 hover:text-village-900 transition-colors"
            active-class="!text-village-900 !font-medium"
          >
            Agenda
          </RouterLink>
        </nav>

        <button
          class="sm:hidden p-2 text-village-600 hover:text-village-900"
          @click="menuOpen = !menuOpen"
          aria-label="Menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!menuOpen"
              stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav v-if="menuOpen" class="sm:hidden pb-4 space-y-1 border-t border-village-200 pt-3">
        <RouterLink
          to="/"
          class="block py-2 text-sm text-village-600 hover:text-village-900"
          active-class="!text-village-900 !font-medium"
          @click="menuOpen = false"
        >
          Accueil
        </RouterLink>
        <RouterLink
          to="/agenda"
          class="block py-2 text-sm text-village-600 hover:text-village-900"
          active-class="!text-village-900 !font-medium"
          @click="menuOpen = false"
        >
          Agenda
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
