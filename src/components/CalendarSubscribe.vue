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
  <div>
    <div class="font-mono text-[11px] font-bold tracking-widest uppercase text-accent-500 mb-2">
      04 / S'ABONNER
    </div>
    <h4 class="font-display text-xl uppercase text-village-900 leading-tight mb-2">
      Synchroniser l'agenda
    </h4>
    <p class="text-[14px] text-village-700 mb-4">
      Ajoutez les événements à votre calendrier — mise à jour automatique.
    </p>
    <div class="flex items-stretch border-2 border-village-900 bg-village-50">
      <code class="flex-1 px-3 py-2 font-mono text-[12px] text-village-900 truncate">
        {{ icsUrl }}
      </code>
      <button
        class="shrink-0 px-3 py-2 font-mono text-[11px] font-bold tracking-widest uppercase border-l-2 border-village-900 transition-colors"
        :class="copied ? 'bg-accent-500 text-village-50' : 'bg-village-900 text-village-50 hover:bg-accent-500'"
        @click="copyUrl"
      >
        {{ copied ? '✓ COPIÉ' : 'COPIER' }}
      </button>
    </div>
    <p class="mt-2 font-mono text-[11px] tracking-wider text-village-500">
      <a :href="webcalUrl" class="text-accent-600 hover:text-accent-500 font-bold">→ OUVRIR DANS CALENDRIER</a>
      · GOOGLE · APPLE · OUTLOOK
    </p>
  </div>
</template>
