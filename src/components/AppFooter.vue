<script setup>
const lastUpdatedLabel = new Intl.DateTimeFormat('fr-BE', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Brussels',
}).format(new Date(__LAST_UPDATED_AT__))
</script>

<template>
  <footer class="border-t border-village-200">
    <div class="max-w-4xl mx-auto px-5 sm:px-8 py-6 text-center text-xs text-village-400 space-y-1">
      <p>
        {{ new Date().getFullYear() }} Lincé |
        <a href="https://github.com/tintamarre/lince.be" class="text-village-400 hover:text-village-600">Code source</a>
        | Édition communautaire et bénévole.
      </p>
      <p>Dernière mise à jour : {{ lastUpdatedLabel }}</p>
    </div>
  </footer>
</template>
