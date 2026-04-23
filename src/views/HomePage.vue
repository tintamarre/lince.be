<script setup>
import { useEvents } from '../composables/useEvents.js'
import EventCard from '../components/EventCard.vue'

const { upcomingEvents } = useEvents()
const nextEvents = upcomingEvents.value.slice(0, 3)
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="border-b-2 border-village-900">
      <div class="max-w-5xl mx-auto">
        <div class="px-5 sm:px-8 py-2 font-mono text-[11px] tracking-widest uppercase text-village-500 border-b border-village-900/20">
          01 / VILLAGE
        </div>
        <div class="grid md:grid-cols-[2fr_1fr]">
          <h1 class="font-display uppercase text-village-900 px-5 sm:px-8 py-6 md:py-8 border-b md:border-b-0 md:border-r-2 border-village-900 text-[clamp(3rem,12vw,9rem)] leading-[0.85] tracking-[-0.04em]">
            UN<br />VILLAGE<br />DE<br /><span class="bg-accent-500 text-village-50 px-2 inline-block">WALLONIE.</span>
          </h1>
          <div class="px-5 sm:px-8 py-6 md:py-8 flex flex-col gap-5">
            <dl class="flex flex-col gap-0 font-mono text-[13px]">
              <div class="flex justify-between py-1.5 border-b border-dashed border-village-900">
                <dt class="font-semibold text-village-500 tracking-wider">NOM</dt>
                <dd class="font-bold text-village-900">LINCÉ</dd>
              </div>
              <div class="flex justify-between py-1.5 border-b border-dashed border-village-900">
                <dt class="font-semibold text-village-500 tracking-wider">COMMUNE</dt>
                <dd class="font-bold text-village-900">SPRIMONT</dd>
              </div>
              <div class="flex justify-between py-1.5 border-b border-dashed border-village-900">
                <dt class="font-semibold text-village-500 tracking-wider">PROVINCE</dt>
                <dd class="font-bold text-village-900">LIÈGE</dd>
              </div>
              <div class="flex justify-between py-1.5 border-b border-dashed border-village-900">
                <dt class="font-semibold text-village-500 tracking-wider">RÉGION</dt>
                <dd class="font-bold text-village-900">WALLONIE</dd>
              </div>
            </dl>
            <p class="text-[15px] leading-relaxed text-village-900 font-medium">
              Un petit site communautaire pour le village de Lincé. L'agenda, les initiatives — et rien de plus.
            </p>
            <router-link
              to="/agenda"
              class="self-start inline-block font-mono text-[13px] font-bold tracking-wider uppercase px-4 py-3 bg-village-900 text-village-50 border-2 border-village-900 shadow-[5px_5px_0_0_var(--color-accent-500)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_var(--color-accent-500)] transition-all"
            >
              → CONSULTER L'AGENDA
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- UPCOMING EVENTS -->
    <section v-if="nextEvents.length > 0" class="border-b-2 border-village-900">
      <div class="max-w-5xl mx-auto">
        <div class="px-5 sm:px-8 py-2 flex justify-between items-center border-b border-village-900/20 bg-village-100/50">
          <span class="font-mono text-[11px] tracking-widest uppercase text-village-500">
            02 / PROCHAINS ÉVÉNEMENTS
          </span>
          <router-link
            to="/agenda"
            class="font-mono text-[11px] tracking-widest uppercase text-village-900 hover:text-accent-500 transition-colors font-bold"
          >
            [ TOUT VOIR → ]
          </router-link>
        </div>
        <div>
          <EventCard
            v-for="(event, i) in nextEvents"
            :key="event.id"
            :event="event"
            :index="i + 1"
          />
        </div>
      </div>
    </section>

    <!-- INITIATIVES -->
    <section class="border-b-2 border-village-900">
      <div class="max-w-5xl mx-auto">
        <div class="px-5 sm:px-8 py-2 font-mono text-[11px] tracking-widest uppercase text-village-500 border-b border-village-900/20 bg-village-100/50">
          03 / MADE IN LINCÉ
        </div>
        <div class="grid sm:grid-cols-2">
          <a
            href="https://coteauxdelince.be/"
            target="_blank"
            rel="noopener"
            class="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8 py-8 border-b sm:border-b-0 sm:border-r-2 border-village-900 hover:bg-village-900 hover:text-village-50 transition-colors"
          >
            <span class="font-mono text-xs tracking-widest text-village-500 group-hover:text-accent-500 font-bold">01</span>
            <div>
              <div class="font-display text-xl tracking-tight uppercase leading-none">Les Coteaux de Lincé</div>
              <div class="mt-1.5 font-mono text-[11px] tracking-widest uppercase text-village-500 group-hover:text-village-300">VIN · VIGNOBLE</div>
            </div>
            <span class="font-display text-2xl text-village-900 group-hover:text-accent-500 group-hover:translate-x-1 transition-all">→</span>
          </a>
          <a
            href="https://lincette.be/"
            target="_blank"
            rel="noopener"
            class="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8 py-8 hover:bg-village-900 hover:text-village-50 transition-colors"
          >
            <span class="font-mono text-xs tracking-widest text-village-500 group-hover:text-accent-500 font-bold">02</span>
            <div>
              <div class="font-display text-xl tracking-tight uppercase leading-none">La Lincette</div>
              <div class="mt-1.5 font-mono text-[11px] tracking-widest uppercase text-village-500 group-hover:text-village-300">BIÈRE · BRASSERIE</div>
            </div>
            <span class="font-display text-2xl text-village-900 group-hover:text-accent-500 group-hover:translate-x-1 transition-all">→</span>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>
