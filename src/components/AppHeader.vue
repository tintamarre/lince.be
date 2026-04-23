<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-50 bg-village-50/95 backdrop-blur border-b-2 border-village-900">
    <div class="max-w-5xl mx-auto px-5 sm:px-8">
      <div class="flex items-center justify-between h-14">
        <RouterLink to="/" class="flex items-center gap-2 group">
          <span class="text-xl leading-none text-accent-500">▞</span>
          <span class="font-display text-base tracking-tight text-village-900">
            LINCÉ<span class="text-accent-500">/</span>BE
          </span>
        </RouterLink>

        <div class="hidden sm:flex items-center gap-4">
          <span class="font-mono text-[11px] text-village-500 tracking-wider">
            50°31′N · 5°40′E
          </span>
          <nav class="flex items-center gap-1">
            <RouterLink
              to="/"
              class="font-mono text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1.5 border-[1.5px] border-transparent text-village-700 hover:bg-accent-500 hover:text-village-50 hover:border-village-900 transition-colors"
              active-class="!border-village-900 !bg-village-900 !text-village-50"
            >
              Accueil
            </RouterLink>
            <RouterLink
              to="/agenda"
              class="font-mono text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1.5 border-[1.5px] border-transparent text-village-700 hover:bg-accent-500 hover:text-village-50 hover:border-village-900 transition-colors"
              active-class="!border-village-900 !bg-village-900 !text-village-50"
            >
              Agenda
            </RouterLink>
          </nav>
        </div>

        <button
          class="sm:hidden p-2 text-village-900 border-[1.5px] border-village-900"
          @click="menuOpen = !menuOpen"
          aria-label="Menu"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!menuOpen"
              stroke-linecap="square" stroke-width="2"
              d="M4 7h16M4 12h16M4 17h16"
            />
            <path
              v-else
              stroke-linecap="square" stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav v-if="menuOpen" class="sm:hidden pb-3 border-t-[1.5px] border-village-900 pt-2 space-y-0">
        <RouterLink
          to="/"
          class="block py-2.5 px-1 font-mono text-xs font-semibold tracking-widest uppercase text-village-700 border-b border-village-200"
          active-class="!text-accent-500"
          @click="menuOpen = false"
        >
          → Accueil
        </RouterLink>
        <RouterLink
          to="/agenda"
          class="block py-2.5 px-1 font-mono text-xs font-semibold tracking-widest uppercase text-village-700"
          active-class="!text-accent-500"
          @click="menuOpen = false"
        >
          → Agenda
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
