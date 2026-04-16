<script setup>
import { ref } from 'vue'

const copied = ref(false)
const icsUrl = 'https://lince.be/calendar.ics'
const webcalUrl = 'webcal://lince.be/calendar.ics'

async function copyUrl() {
  await navigator.clipboard.writeText(icsUrl)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="flex-1">
    <h4 class="text-xs font-medium uppercase tracking-widest text-village-400 mb-2">S'abonner</h4>
    <p class="text-sm text-village-600 mb-3">
      Ajoutez l'agenda à votre calendrier.
    </p>
    <div class="flex items-center gap-2">
      <code class="flex-1 bg-village-100 rounded-lg px-2.5 py-1.5 text-xs text-village-600 truncate">
        {{ icsUrl }}
      </code>
      <button
        class="shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors"
        :class="copied ? 'bg-accent-100 text-accent-700' : 'bg-village-100 text-village-600 hover:bg-village-200'"
        @click="copyUrl"
      >
        {{ copied ? 'Copié !' : 'Copier' }}
      </button>
    </div>
    <p class="mt-2 text-[11px] text-village-400">
      <a :href="webcalUrl" class="text-accent-600 hover:text-accent-700">Ouvrir dans Calendrier</a>
      · Compatible Google Calendar, Apple, Outlook
    </p>
  </div>
</template>
