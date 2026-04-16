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
  <section class="rounded-xl border border-gray-200 bg-gray-50 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-2">S'abonner au calendrier</h3>
    <p class="text-sm text-gray-600 mb-5">
      Recevez automatiquement les événements de Lincé dans votre application de calendrier.
    </p>

    <div class="space-y-4">
      <!-- URL + copy -->
      <div class="flex items-center gap-2">
        <code class="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 truncate">
          {{ icsUrl }}
        </code>
        <button
          class="shrink-0 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="copied ? 'bg-village-100 text-village-700' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'"
          @click="copyUrl"
        >
          {{ copied ? 'Copié !' : 'Copier' }}
        </button>
      </div>

      <!-- Instructions -->
      <div class="grid gap-4 sm:grid-cols-3">
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <h4 class="font-medium text-sm text-gray-900 mb-2">Google Calendar</h4>
          <ol class="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>Ouvrir Google Calendar</li>
            <li>Cliquer sur <strong>+</strong> à côté de "Autres agendas"</li>
            <li>Choisir "À partir de l'URL"</li>
            <li>Coller l'URL ci-dessus</li>
          </ol>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <h4 class="font-medium text-sm text-gray-900 mb-2">Apple Calendar</h4>
          <ol class="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>
              <a :href="webcalUrl" class="text-village-600 underline">Cliquer ici pour s'abonner</a>
            </li>
            <li>Ou dans Calendrier : Fichier &rarr; Nouvel abonnement</li>
            <li>Coller l'URL ci-dessus</li>
          </ol>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <h4 class="font-medium text-sm text-gray-900 mb-2">Outlook</h4>
          <ol class="text-xs text-gray-500 space-y-1 list-decimal list-inside">
            <li>Ouvrir Outlook</li>
            <li>Calendrier &rarr; Ajouter un calendrier</li>
            <li>Choisir "S'abonner depuis le web"</li>
            <li>Coller l'URL ci-dessus</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
