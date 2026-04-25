<script setup>
import { ref } from 'vue'

const variants = [
  { id: 'gazette', label: 'Gazette', tagline: 'Presse villageoise · ink-on-paper' },
  { id: 'terroir', label: 'Terroir', tagline: 'Earth & vineyard · warm maximal' },
  { id: 'brutal',  label: 'Brutalist', tagline: 'Raw · oversized · monospace' },
]
const active = ref('gazette')

const sampleEvents = [
  {
    day: '02',
    month: 'MAI',
    weekday: 'Samedi',
    year: '2026',
    title: 'Marché solidaire de printemps',
    time: '10h00 — 16h00',
    place: 'Place de Lincé',
    category: 'Solidarité',
    excerpt: 'Producteurs locaux, artisans, buvette et concert en fin d’après-midi. Tous les bénéfices reversés au comité scolaire du village.',
  },
  {
    day: '15',
    month: 'MAI',
    weekday: 'Vendredi',
    year: '2026',
    title: 'Balade gourmande des Coteaux',
    time: '18h30',
    place: 'Vignoble des Coteaux de Lincé',
    category: 'Vin',
    excerpt: 'Parcours de 4 km ponctué de cinq haltes dégustation. Vue imprenable sur l’Ourthe au coucher du soleil.',
  },
  {
    day: '07',
    month: 'JUIN',
    weekday: 'Dimanche',
    year: '2026',
    title: 'Dégustation Lincette — cuvée d’été',
    time: '14h00',
    place: 'Brasserie du village',
    category: 'Bière',
    excerpt: 'Lancement de la nouvelle cuvée brassée pour l’été. Planche charcuterie & fromages du pays, musique acoustique.',
  },
]
</script>

<template>
  <div class="styles-shell">
    <!-- Sticky switcher -->
    <div class="switcher">
      <div class="switcher-inner">
        <span class="switcher-label">Aperçu style</span>
        <div class="switcher-group">
          <button
            v-for="v in variants"
            :key="v.id"
            class="switcher-btn"
            :class="{ active: active === v.id }"
            @click="active = v.id"
          >
            <span class="switcher-btn-label">{{ v.label }}</span>
            <span class="switcher-btn-tag">{{ v.tagline }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================== -->
    <!-- VARIANT 1 : GAZETTE                            -->
    <!-- ============================================== -->
    <section v-show="active === 'gazette'" class="gazette">
      <div class="gazette-paper">

        <header class="gz-masthead">
          <div class="gz-masthead-top">
            <span class="gz-meta">N° 04 — Édition d'avril</span>
            <span class="gz-meta gz-meta-center">Depuis 1886</span>
            <span class="gz-meta gz-meta-right">Sprimont · Province de Liège</span>
          </div>
          <h1 class="gz-title">La Gazette de Lincé</h1>
          <div class="gz-subtitle">
            <em>Journal villageois, community edition</em>
            <span class="gz-rule"></span>
            <em>gratuit</em>
          </div>
        </header>

        <section class="gz-hero">
          <div class="gz-hero-kicker">À la une</div>
          <h2 class="gz-hero-title">
            Un village de Wallonie,<br />
            <span class="gz-hero-accent">posé sur les coteaux de l'Ourthe.</span>
          </h2>
          <p class="gz-hero-lede">
            <span class="gz-dropcap">L</span>incé est un hameau de la commune de Sprimont. On y
            vient pour la vigne, pour la bière, pour le silence des bois et pour
            les fêtes qui rassemblent, saison après saison, tous ceux qui tiennent
            à cet endroit.
          </p>
        </section>

        <div class="gz-columns">
          <aside class="gz-sidebar">
            <div class="gz-sidebar-block">
              <div class="gz-sidebar-heading">Sommaire</div>
              <ol class="gz-sidebar-list">
                <li><span>01</span> Prochains rendez-vous</li>
                <li><span>02</span> Initiatives du village</li>
                <li><span>03</span> S'abonner à l'agenda</li>
                <li><span>04</span> Proposer un événement</li>
              </ol>
            </div>
            <div class="gz-sidebar-block">
              <div class="gz-sidebar-heading">Météo du dimanche</div>
              <p class="gz-sidebar-body">
                Ciel voilé, 14°C. Vent d'ouest modéré. Idéal pour marcher le long
                de l'Ourthe.
              </p>
            </div>
          </aside>

          <section class="gz-main">
            <div class="gz-section-head">
              <span class="gz-section-num">01</span>
              <h3 class="gz-section-title">Prochains rendez-vous</h3>
              <a class="gz-section-link" href="#">Tout l'agenda &rarr;</a>
            </div>

            <article v-for="e in sampleEvents" :key="e.title" class="gz-event">
              <div class="gz-event-date">
                <span class="gz-event-day">{{ e.day }}</span>
                <span class="gz-event-month">{{ e.month }}</span>
                <span class="gz-event-year">{{ e.year }}</span>
              </div>
              <div class="gz-event-body">
                <div class="gz-event-meta">
                  <span class="gz-event-weekday">{{ e.weekday }} · {{ e.time }}</span>
                  <span class="gz-event-cat">{{ e.category }}</span>
                </div>
                <h4 class="gz-event-title">{{ e.title }}</h4>
                <p class="gz-event-place">{{ e.place }}</p>
                <p class="gz-event-excerpt">{{ e.excerpt }}</p>
              </div>
            </article>

            <div class="gz-section-head gz-section-head--spaced">
              <span class="gz-section-num">02</span>
              <h3 class="gz-section-title">Initiatives du village</h3>
            </div>

            <div class="gz-initiatives">
              <a href="#" class="gz-initiative">
                <div class="gz-initiative-icon">※</div>
                <div>
                  <div class="gz-initiative-title">Les Coteaux de Lincé</div>
                  <div class="gz-initiative-sub">Vin de Lincé · vignoble coopératif</div>
                </div>
              </a>
              <a href="#" class="gz-initiative">
                <div class="gz-initiative-icon">✦</div>
                <div>
                  <div class="gz-initiative-title">La Lincette</div>
                  <div class="gz-initiative-sub">Bière artisanale · brassée au village</div>
                </div>
              </a>
            </div>
          </section>
        </div>

        <footer class="gz-foot">
          <span>La Gazette — édition communautaire &amp; bénévole</span>
          <span>·</span>
          <span>Imprimé sur les coteaux, 2026</span>
        </footer>
      </div>
    </section>

    <!-- ============================================== -->
    <!-- VARIANT 2 : TERROIR                            -->
    <!-- ============================================== -->
    <section v-show="active === 'terroir'" class="terroir">
      <header class="tr-nav">
        <span class="tr-brand">Lincé<span class="tr-brand-dot">•</span></span>
        <nav class="tr-nav-links">
          <a>Accueil</a><a>Agenda</a><a>Village</a><a>Contact</a>
        </nav>
      </header>

      <section class="tr-hero">
        <div class="tr-hero-mark">N — 50.52 · E — 5.67</div>
        <h1 class="tr-hero-title">
          Lincé, <em>un village</em><br />
          <span class="tr-hero-underline">posé sur ses coteaux.</span>
        </h1>
        <p class="tr-hero-lede">
          Entre vignes, forêts et champs de colza — au sud de Sprimont,
          en Province de Liège. Agenda, saisons, et les petites nouvelles.
        </p>
        <div class="tr-hero-cta">
          <a class="tr-btn tr-btn-primary">Consulter l'agenda →</a>
          <a class="tr-btn tr-btn-ghost">S'abonner (.ics)</a>
        </div>
        <div class="tr-hero-sun"></div>
      </section>

      <section class="tr-events">
        <div class="tr-events-head">
          <div>
            <div class="tr-eyebrow">Saison 26 · printemps</div>
            <h2 class="tr-section-title">Prochains rendez-vous</h2>
          </div>
          <a class="tr-link">Tout voir →</a>
        </div>

        <div class="tr-event-list">
          <article v-for="e in sampleEvents" :key="e.title" class="tr-event">
            <div class="tr-event-date">
              <span class="tr-event-day">{{ e.day }}</span>
              <div>
                <span class="tr-event-month">{{ e.month }}</span>
                <span class="tr-event-weekday">{{ e.weekday }}</span>
              </div>
            </div>
            <div class="tr-event-body">
              <span class="tr-event-cat" :data-cat="e.category">{{ e.category }}</span>
              <h3 class="tr-event-title">{{ e.title }}</h3>
              <div class="tr-event-meta">
                <span>{{ e.time }}</span>
                <span class="tr-event-dot">·</span>
                <span>{{ e.place }}</span>
              </div>
              <p class="tr-event-excerpt">{{ e.excerpt }}</p>
            </div>
            <div class="tr-event-arrow">→</div>
          </article>
        </div>
      </section>

      <section class="tr-initiatives">
        <h2 class="tr-section-title">Faites à Lincé</h2>
        <div class="tr-initiative-grid">
          <a class="tr-initiative tr-initiative--vin">
            <div class="tr-initiative-num">01</div>
            <div class="tr-initiative-name">Les Coteaux <em>de Lincé</em></div>
            <div class="tr-initiative-sub">Vin · vignoble du village</div>
            <div class="tr-initiative-tag">Depuis 2011</div>
          </a>
          <a class="tr-initiative tr-initiative--biere">
            <div class="tr-initiative-num">02</div>
            <div class="tr-initiative-name">La <em>Lincette</em></div>
            <div class="tr-initiative-sub">Bière artisanale · brassée au village</div>
            <div class="tr-initiative-tag">Blonde & ambrée</div>
          </a>
        </div>
      </section>

      <footer class="tr-foot">
        <span>Lincé · 2026 · édition communautaire</span>
      </footer>
    </section>

    <!-- ============================================== -->
    <!-- VARIANT 3 : BRUTALIST                          -->
    <!-- ============================================== -->
    <section v-show="active === 'brutal'" class="brutal">
      <header class="br-nav">
        <div class="br-brand">
          <span class="br-brand-mark">▞</span>
          <span class="br-brand-text">LINCÉ<span class="br-brand-slash">/</span>BE</span>
        </div>
        <div class="br-nav-right">
          <span class="br-nav-coord">50°31′N &nbsp; 5°40′E</span>
          <nav class="br-nav-links">
            <a>INDEX</a><a>AGENDA</a><a>.ICS</a>
          </nav>
        </div>
      </header>

      <section class="br-hero">
        <div class="br-hero-grid">
          <div class="br-hero-label">01 / VILLAGE</div>
          <h1 class="br-hero-title">
            UN<br />VILLAGE<br />DE<br /><span class="br-hero-accent">WALLONIE.</span>
          </h1>
          <div class="br-hero-side">
            <div class="br-hero-side-block">
              <div class="br-kv"><span>POP.</span><span>±800</span></div>
              <div class="br-kv"><span>ALT.</span><span>210m</span></div>
              <div class="br-kv"><span>COMMUNE</span><span>SPRIMONT</span></div>
              <div class="br-kv"><span>PROVINCE</span><span>LIÈGE</span></div>
            </div>
            <p class="br-hero-blurb">
              Un petit site communautaire. Agenda, initiatives, et rien de plus.
              Pas de cookies. Pas de pub.
            </p>
            <a class="br-btn">→ CONSULTER L'AGENDA</a>
          </div>
        </div>
      </section>

      <section class="br-events">
        <div class="br-section-head">
          <span class="br-section-num">02 / AGENDA</span>
          <span class="br-section-count">{{ sampleEvents.length }} ÉVÉNEMENTS</span>
        </div>

        <article v-for="(e, i) in sampleEvents" :key="e.title" class="br-event">
          <div class="br-event-index">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="br-event-date">
            <div class="br-event-day">{{ e.day }}</div>
            <div class="br-event-month">{{ e.month }} {{ e.year }}</div>
            <div class="br-event-weekday">{{ e.weekday.toUpperCase() }}</div>
          </div>
          <div class="br-event-body">
            <div class="br-event-cat">[ {{ e.category.toUpperCase() }} ]</div>
            <h3 class="br-event-title">{{ e.title }}</h3>
            <div class="br-event-meta">{{ e.time }} &nbsp;·&nbsp; {{ e.place }}</div>
            <p class="br-event-excerpt">{{ e.excerpt }}</p>
          </div>
          <div class="br-event-link">→</div>
        </article>
      </section>

      <section class="br-initiatives">
        <div class="br-section-head">
          <span class="br-section-num">03 / MADE IN LINCÉ</span>
        </div>
        <div class="br-initiative-grid">
          <a class="br-initiative">
            <div class="br-initiative-num">01</div>
            <div class="br-initiative-name">LES COTEAUX DE LINCÉ</div>
            <div class="br-initiative-sub">VIN · COOPÉRATIVE</div>
            <div class="br-initiative-arrow">→</div>
          </a>
          <a class="br-initiative">
            <div class="br-initiative-num">02</div>
            <div class="br-initiative-name">LA LINCETTE</div>
            <div class="br-initiative-sub">BIÈRE · BRASSERIE</div>
            <div class="br-initiative-arrow">→</div>
          </a>
        </div>
      </section>

      <footer class="br-foot">
        <div>LINCÉ.BE · 2026 · COMMUNAUTÉ</div>
        <div class="br-foot-right">OPEN SOURCE · MIT</div>
      </footer>
    </section>
  </div>
</template>

<style scoped>
/* ==== SHELL ==== */
.styles-shell {
  margin: 0 -1.25rem;
}
@media (min-width: 640px) {
  .styles-shell { margin: 0 -2rem; }
}

/* ==== SWITCHER ==== */
.switcher {
  position: sticky;
  top: 56px;
  z-index: 40;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
}
.switcher-inner {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}
.switcher-label {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 600;
}
.switcher-group { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.switcher-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}
.switcher-btn:hover { border-color: #64748b; }
.switcher-btn.active {
  background: #0f172a;
  border-color: #0f172a;
  color: white;
}
.switcher-btn-label { font-weight: 600; font-size: 0.85rem; }
.switcher-btn-tag { font-size: 0.65rem; opacity: 0.7; letter-spacing: 0.03em; }

/* =================================================== */
/* VARIANT 1 · GAZETTE                                  */
/* =================================================== */
.gazette {
  --paper: #f2ead7;
  --paper-2: #ebe1c9;
  --ink: #181410;
  --ink-soft: #3a2f24;
  --muted: #6b5d47;
  --rule: #2a201655;
  --accent: #7a1f28;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Newsreader', Georgia, serif;
  min-height: 100vh;
  padding: 3rem 1.25rem 5rem;
  position: relative;
}
.gazette::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 20% 30%, #00000008 0 2px, transparent 3px),
    radial-gradient(circle at 70% 60%, #00000008 0 1.5px, transparent 2.5px),
    radial-gradient(circle at 40% 80%, #00000006 0 2px, transparent 3px);
  background-size: 13px 11px, 17px 19px, 23px 21px;
  mix-blend-mode: multiply;
  opacity: 0.6;
}
.gazette-paper {
  position: relative;
  max-width: 58rem;
  margin: 0 auto;
}

.gz-masthead { text-align: center; padding-bottom: 2rem; border-bottom: 3px double var(--ink); }
.gz-masthead-top {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--rule);
  margin-bottom: 1.25rem;
}
.gz-meta-center { text-align: center; }
.gz-meta-right { text-align: right; }
.gz-title {
  font-family: 'Fraunces', serif;
  font-weight: 800;
  font-variation-settings: 'opsz' 144;
  font-size: clamp(3rem, 9vw, 6rem);
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: var(--ink);
  margin: 0;
}
.gz-subtitle {
  margin-top: 0.85rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 1rem;
  color: var(--ink-soft);
}
.gz-rule { display: inline-block; width: 3rem; height: 1px; background: var(--ink-soft); }

.gz-hero { padding: 2.5rem 0 1.5rem; text-align: center; border-bottom: 1px solid var(--rule); }
.gz-hero-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
  font-weight: 600;
}
.gz-hero-title {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 144, 'wght' 600;
  font-size: clamp(1.75rem, 4vw, 2.9rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0;
}
.gz-hero-accent { font-style: italic; color: var(--accent); font-variation-settings: 'opsz' 144, 'wght' 500; }
.gz-hero-lede {
  max-width: 38rem;
  margin: 1.5rem auto 0;
  font-size: 1.15rem;
  line-height: 1.65;
  color: var(--ink-soft);
  text-align: justify;
  hyphens: auto;
}
.gz-dropcap {
  float: left;
  font-family: 'Fraunces', serif;
  font-weight: 800;
  font-size: 3.8rem;
  line-height: 0.85;
  margin: 0.1rem 0.4rem 0 0;
  color: var(--accent);
}

.gz-columns { display: grid; grid-template-columns: 1fr; gap: 2.5rem; padding-top: 2.5rem; }
@media (min-width: 768px) {
  .gz-columns { grid-template-columns: 14rem 1fr; gap: 3rem; }
}

.gz-sidebar { display: flex; flex-direction: column; gap: 1.75rem; }
.gz-sidebar-block { border-top: 2px solid var(--ink); padding-top: 0.75rem; }
.gz-sidebar-heading {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink);
  font-weight: 600;
  margin-bottom: 0.6rem;
}
.gz-sidebar-list { list-style: none; padding: 0; margin: 0; }
.gz-sidebar-list li {
  display: flex; gap: 0.65rem;
  padding: 0.35rem 0;
  border-bottom: 1px dotted var(--rule);
  font-size: 0.95rem;
  color: var(--ink-soft);
}
.gz-sidebar-list li span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent);
  font-weight: 600;
  min-width: 1.5rem;
}
.gz-sidebar-body { font-size: 0.95rem; line-height: 1.5; color: var(--ink-soft); font-style: italic; }

.gz-main { min-width: 0; }
.gz-section-head {
  display: flex; align-items: baseline; gap: 0.9rem;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}
.gz-section-head--spaced { margin-top: 3rem; }
.gz-section-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.05em;
}
.gz-section-title {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 144, 'wght' 700;
  font-size: 1.8rem;
  letter-spacing: -0.01em;
  margin: 0;
  flex: 1;
}
.gz-section-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.gz-event {
  display: grid;
  grid-template-columns: 5rem 1fr;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--rule);
}
.gz-event:last-of-type { border-bottom: none; }
.gz-event-date {
  text-align: center;
  border-right: 2px solid var(--ink);
  padding-right: 1rem;
  display: flex; flex-direction: column; align-items: center;
}
.gz-event-day {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 144, 'wght' 800;
  font-size: 3rem;
  line-height: 1;
  color: var(--ink);
}
.gz-event-month {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--accent);
  font-weight: 700;
  margin-top: 0.25rem;
}
.gz-event-year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--muted);
  margin-top: 0.2rem;
}
.gz-event-meta {
  display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.35rem;
}
.gz-event-cat {
  color: var(--accent);
  font-weight: 700;
  border: 1px solid var(--accent);
  padding: 0.1rem 0.5rem;
}
.gz-event-title {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 144, 'wght' 700;
  font-size: 1.6rem;
  line-height: 1.15;
  color: var(--ink);
  margin: 0 0 0.35rem;
  letter-spacing: -0.01em;
}
.gz-event-place {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 1rem;
  color: var(--ink-soft);
  margin: 0 0 0.6rem;
}
.gz-event-excerpt {
  font-size: 1.02rem;
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0;
  text-align: justify;
  hyphens: auto;
}

.gz-initiatives { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 640px) { .gz-initiatives { grid-template-columns: 1fr; } }
.gz-initiative {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--ink);
  text-decoration: none;
  color: inherit;
  background: transparent;
  transition: background 0.15s;
}
.gz-initiative:hover { background: var(--paper-2); }
.gz-initiative-icon {
  font-size: 1.8rem;
  color: var(--accent);
  font-family: 'Fraunces', serif;
}
.gz-initiative-title {
  font-family: 'Fraunces', serif;
  font-variation-settings: 'opsz' 144, 'wght' 700;
  font-size: 1.15rem;
  color: var(--ink);
}
.gz-initiative-sub {
  font-size: 0.9rem;
  color: var(--muted);
  font-style: italic;
  margin-top: 0.15rem;
}

.gz-foot {
  margin-top: 4rem;
  padding-top: 1rem;
  border-top: 3px double var(--ink);
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;
}

/* =================================================== */
/* VARIANT 2 · TERROIR                                  */
/* =================================================== */
.terroir {
  --bg: #f0e9dc;
  --bg-2: #e8dfce;
  --ink: #2a1f15;
  --ink-soft: #4a3b2a;
  --muted: #8a7a62;
  --forest: #2d4a32;
  --forest-2: #1f3524;
  --amber: #c67d2e;
  --wine: #6e1e2b;
  background: var(--bg);
  color: var(--ink);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}
.terroir::before {
  content: '';
  position: absolute;
  top: -10%; right: -10%;
  width: 60rem; height: 60rem;
  background: radial-gradient(circle, #c67d2e33 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.terroir::after {
  content: '';
  position: absolute;
  bottom: 20%; left: -15%;
  width: 50rem; height: 50rem;
  background: radial-gradient(circle, #2d4a3233 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.terroir > * { position: relative; z-index: 1; }

.tr-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 2rem;
  max-width: 72rem;
  margin: 0 auto;
}
.tr-brand {
  font-family: 'Instrument Serif', serif;
  font-size: 1.8rem;
  color: var(--forest);
  letter-spacing: -0.02em;
}
.tr-brand-dot { color: var(--amber); margin-left: 0.2rem; }
.tr-nav-links { display: flex; gap: 1.5rem; }
.tr-nav-links a {
  font-size: 0.85rem;
  color: var(--ink-soft);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s;
}
.tr-nav-links a:hover { color: var(--forest); }

.tr-hero {
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 2rem 5rem;
  position: relative;
}
.tr-hero-mark {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: 0.12em;
  margin-bottom: 1.5rem;
}
.tr-hero-title {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(3rem, 8.5vw, 6.5rem);
  line-height: 0.95;
  color: var(--ink);
  margin: 0;
  letter-spacing: -0.03em;
  font-weight: 400;
  max-width: 50rem;
}
.tr-hero-title em { color: var(--wine); font-style: italic; }
.tr-hero-underline {
  background: linear-gradient(to bottom, transparent 72%, #c67d2e55 72%, #c67d2e55 92%, transparent 92%);
}
.tr-hero-lede {
  margin: 2rem 0 2.5rem;
  font-size: 1.2rem;
  line-height: 1.55;
  color: var(--ink-soft);
  max-width: 32rem;
}
.tr-hero-cta { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.tr-btn {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.85rem 1.35rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.92rem;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.tr-btn-primary {
  background: var(--forest);
  color: var(--bg);
  box-shadow: 0 4px 0 0 var(--forest-2);
}
.tr-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 0 0 var(--forest-2); }
.tr-btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--ink);
}
.tr-btn-ghost:hover { background: var(--ink); color: var(--bg); }

.tr-hero-sun {
  position: absolute;
  top: 2rem; right: 2rem;
  width: 10rem; height: 10rem;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f4c576 0%, #c67d2e 60%, #8a4a1a 100%);
  box-shadow: 0 0 80px #c67d2e66;
  opacity: 0.85;
}
@media (max-width: 640px) {
  .tr-hero-sun { width: 6rem; height: 6rem; opacity: 0.6; }
}

.tr-events {
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 2rem;
}
.tr-events-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; gap: 1rem; }
.tr-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--amber);
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.tr-section-title {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--ink);
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.02em;
}
.tr-link {
  font-size: 0.9rem;
  color: var(--forest);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1.5px solid var(--forest);
  padding-bottom: 0.15rem;
  cursor: pointer;
}
.tr-event-list { display: flex; flex-direction: column; gap: 0.75rem; }
.tr-event {
  display: grid;
  grid-template-columns: 7rem 1fr auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 252, 244, 0.65);
  backdrop-filter: blur(6px);
  border: 1px solid #d8ceb8;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s, box-shadow 0.18s;
  cursor: pointer;
}
.tr-event:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px #2a1f1520;
  border-color: var(--amber);
}
@media (max-width: 640px) {
  .tr-event { grid-template-columns: 1fr; }
  .tr-event-arrow { display: none; }
}
.tr-event-date { display: flex; align-items: center; gap: 0.75rem; }
.tr-event-day {
  font-family: 'Instrument Serif', serif;
  font-size: 3.5rem;
  line-height: 1;
  color: var(--wine);
  font-weight: 400;
}
.tr-event-month {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--ink);
  font-weight: 600;
}
.tr-event-weekday {
  display: block;
  font-size: 0.82rem;
  color: var(--muted);
  font-style: italic;
  margin-top: 0.2rem;
}
.tr-event-cat {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 99px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.tr-event-cat[data-cat="Solidarité"] { background: #2d4a3222; color: var(--forest); }
.tr-event-cat[data-cat="Vin"] { background: #6e1e2b22; color: var(--wine); }
.tr-event-cat[data-cat="Bière"] { background: #c67d2e22; color: #8a4a1a; }
.tr-event-title {
  font-family: 'Instrument Serif', serif;
  font-size: 1.65rem;
  color: var(--ink);
  margin: 0 0 0.4rem;
  line-height: 1.15;
  font-weight: 400;
  letter-spacing: -0.01em;
}
.tr-event-meta {
  display: flex; gap: 0.4rem; align-items: center;
  font-size: 0.88rem;
  color: var(--ink-soft);
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
}
.tr-event-dot { color: var(--amber); }
.tr-event-excerpt {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--ink-soft);
  margin: 0;
}
.tr-event-arrow {
  font-family: 'Instrument Serif', serif;
  font-size: 2rem;
  color: var(--forest);
  transition: transform 0.18s;
}
.tr-event:hover .tr-event-arrow { transform: translateX(4px); }

.tr-initiatives {
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;
}
.tr-initiative-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); gap: 1.25rem; margin-top: 1.5rem; }
.tr-initiative {
  display: flex; flex-direction: column; gap: 0.5rem;
  padding: 2rem;
  border-radius: 24px;
  text-decoration: none;
  color: var(--bg);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s;
}
.tr-initiative:hover { transform: translateY(-3px); }
.tr-initiative--vin {
  background: linear-gradient(135deg, var(--wine) 0%, #4a1319 100%);
}
.tr-initiative--biere {
  background: linear-gradient(135deg, var(--amber) 0%, #8a4a1a 100%);
}
.tr-initiative-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  opacity: 0.7;
  margin-bottom: 2rem;
}
.tr-initiative-name {
  font-family: 'Instrument Serif', serif;
  font-size: 2.2rem;
  line-height: 1;
  margin-bottom: 0.35rem;
  font-weight: 400;
}
.tr-initiative-name em { font-style: italic; }
.tr-initiative-sub { font-size: 0.95rem; opacity: 0.85; }
.tr-initiative-tag {
  align-self: flex-start;
  margin-top: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.65rem;
  border: 1px solid currentColor;
  border-radius: 99px;
  opacity: 0.85;
}

.tr-foot {
  padding: 2rem;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  color: var(--muted);
  border-top: 1px solid #d8ceb8;
  max-width: 72rem;
  margin: 0 auto;
}

/* =================================================== */
/* VARIANT 3 · BRUTALIST                                */
/* =================================================== */
.brutal {
  --bg: #fafaf5;
  --ink: #0a0a0a;
  --accent: #2a9d8f;
  --muted: #555;
  --border: #0a0a0a;
  background: var(--bg);
  color: var(--ink);
  font-family: 'IBM Plex Sans', sans-serif;
  min-height: 100vh;
  background-image:
    linear-gradient(to right, #0a0a0a08 1px, transparent 1px);
  background-size: 4rem 4rem;
}

.br-nav {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid var(--ink);
  background: var(--bg);
}
.br-brand { display: flex; align-items: center; gap: 0.5rem; }
.br-brand-mark {
  font-size: 1.5rem;
  color: var(--accent);
  line-height: 1;
}
.br-brand-text {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.04em;
}
.br-brand-slash { color: var(--accent); }
.br-nav-right { display: flex; align-items: center; gap: 1.5rem; }
.br-nav-coord {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--muted);
}
.br-nav-links { display: flex; gap: 0.75rem; }
.br-nav-links a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.35rem 0.55rem;
  border: 1.5px solid transparent;
  transition: all 0.1s;
}
.br-nav-links a:hover { border-color: var(--ink); background: var(--accent); color: var(--bg); }

.br-hero {
  border-bottom: 2px solid var(--ink);
  padding: 0;
}
.br-hero-grid {
  display: grid;
  grid-template-columns: 1fr;
}
@media (min-width: 900px) {
  .br-hero-grid { grid-template-columns: 2fr 1fr; }
}
.br-hero-label {
  grid-column: 1 / -1;
  padding: 0.5rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  color: var(--muted);
  border-bottom: 1px solid var(--ink);
}
.br-hero-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(4rem, 13vw, 11rem);
  line-height: 0.85;
  letter-spacing: -0.04em;
  margin: 0;
  padding: 1.5rem;
  border-right: 2px solid var(--ink);
  text-transform: uppercase;
}
@media (max-width: 899px) { .br-hero-title { border-right: none; border-bottom: 2px solid var(--ink); } }
.br-hero-accent {
  background: var(--accent);
  color: var(--bg);
  padding: 0 0.5rem;
  display: inline-block;
}

.br-hero-side { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.br-hero-side-block { display: flex; flex-direction: column; gap: 0.5rem; }
.br-kv {
  display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  padding: 0.35rem 0;
  border-bottom: 1px dashed var(--ink);
}
.br-kv span:first-child { color: var(--muted); font-weight: 600; }
.br-kv span:last-child { font-weight: 700; }
.br-hero-blurb {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--ink);
  margin: 0;
  font-weight: 500;
}
.br-btn {
  display: inline-block;
  padding: 0.9rem 1.25rem;
  background: var(--ink);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-decoration: none;
  cursor: pointer;
  border: 2px solid var(--ink);
  box-shadow: 5px 5px 0 0 var(--accent);
  transition: transform 0.1s, box-shadow 0.1s;
  align-self: flex-start;
}
.br-btn:hover { transform: translate(2px, 2px); box-shadow: 3px 3px 0 0 var(--accent); }

.br-events { border-bottom: 2px solid var(--ink); }
.br-initiatives { border-bottom: 2px solid var(--ink); }
.br-section-head {
  display: flex; justify-content: space-between;
  padding: 0.5rem 1.5rem;
  border-bottom: 1px solid var(--ink);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  color: var(--muted);
  background: #f3f2e8;
}

.br-event {
  display: grid;
  grid-template-columns: 3.5rem 10rem 1fr 3rem;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1.75rem 1.5rem;
  border-bottom: 1.5px solid var(--ink);
  cursor: pointer;
  transition: background 0.1s;
  position: relative;
}
.br-event:last-child { border-bottom: none; }
.br-event:hover { background: #fff4ef; }
.br-event:hover .br-event-link { color: var(--accent); transform: translateX(4px); }
@media (max-width: 700px) {
  .br-event { grid-template-columns: 3rem 1fr; }
  .br-event-date { grid-column: 1 / -1; display: flex; gap: 1rem; align-items: baseline; }
  .br-event-body { grid-column: 1 / -1; }
  .br-event-link { display: none; }
}
.br-event-index {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2rem;
  color: var(--accent);
  line-height: 1;
}
.br-event-date { border-left: 2px solid var(--ink); padding-left: 1rem; }
.br-event-day {
  font-family: 'Archivo Black', sans-serif;
  font-size: 3.5rem;
  line-height: 0.9;
  letter-spacing: -0.04em;
}
.br-event-month {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: var(--ink);
  font-weight: 700;
  margin-top: 0.35rem;
}
.br-event-weekday {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--muted);
  margin-top: 0.15rem;
}
.br-event-cat {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--accent);
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.br-event-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.6rem;
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 0.45rem;
  text-transform: uppercase;
}
.br-event-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--muted);
  margin-bottom: 0.75rem;
  font-weight: 600;
}
.br-event-excerpt {
  font-size: 1rem;
  line-height: 1.55;
  color: var(--ink);
  margin: 0;
  max-width: 40rem;
}
.br-event-link {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2rem;
  color: var(--ink);
  transition: color 0.1s, transform 0.15s;
  text-align: right;
}

.br-initiative-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
@media (max-width: 640px) { .br-initiative-grid { grid-template-columns: 1fr; } }
.br-initiative {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 2rem 1.5rem;
  border-right: 1.5px solid var(--ink);
  cursor: pointer;
  transition: background 0.1s;
}
.br-initiative:last-child { border-right: none; }
.br-initiative:hover { background: var(--ink); color: var(--bg); }
.br-initiative:hover .br-initiative-num { color: var(--accent); }
.br-initiative:hover .br-initiative-arrow { color: var(--accent); transform: translateX(4px); }
@media (max-width: 640px) {
  .br-initiative { border-right: none; border-bottom: 1.5px solid var(--ink); }
  .br-initiative:last-child { border-bottom: none; }
}
.br-initiative-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
  letter-spacing: 0.1em;
  font-weight: 700;
}
.br-initiative-name {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.4rem;
  line-height: 1;
  letter-spacing: -0.02em;
}
.br-initiative-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-top: 0.35rem;
}
.br-initiative-arrow {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2rem;
  transition: color 0.1s, transform 0.15s;
}

.br-foot {
  display: flex; justify-content: space-between;
  padding: 1rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--muted);
}
.br-foot-right { text-align: right; }
</style>
