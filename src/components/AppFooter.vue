<script setup>
const lastUpdatedLabel = new Intl.DateTimeFormat('fr-BE', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Brussels',
}).format(new Date(__LAST_UPDATED_AT__))
</script>

<template>
  <footer class="border-t-2 border-village-900 mt-12">
    <div class="max-w-5xl mx-auto px-5 sm:px-8 py-5">
      <div class="flex flex-col sm:flex-row sm:justify-between gap-2 font-mono text-[11px] tracking-wider uppercase text-village-500">
        <div class="flex items-center gap-2">
          <span class="text-accent-500">▞</span>
          <span>LINCÉ.BE · {{ new Date().getFullYear() }} · ÉDITION COMMUNAUTAIRE</span>
        </div>
        <div class="flex items-center gap-3">
          <a
            href="https://github.com/tintamarre/lince.be"
            class="hover:text-accent-500 transition-colors"
          >[ CODE SOURCE ]</a>
          <span class="text-village-300">·</span>
          <span>MAJ {{ lastUpdatedLabel }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>
