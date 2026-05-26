<template>
  <section id="trayectoria" class="tray-outer" ref="outerEl">
    <div class="tray-sticky">
      <div class="tray__inner">

        <!-- Progress bar -->
        <div class="scroll-bar">
          <div class="scroll-bar__fill" :style="{ width: scrollProgress * 100 + '%' }" />
        </div>

        <!-- Header -->
        <div class="tray__header">
          <div class="tray__header-left">
            <div class="section-eyebrow">{{ t('tray.eyebrow') }}</div>
            <h2 class="section-title">{{ t('tray.title') }}</h2>
          </div>
          <p class="tray__lead">{{ t('tray.lead') }}</p>
        </div>

        <!-- Carousel nav -->
        <div class="tray__nav-row">
          <div class="tray__dots">
            <button
              v-for="(_, i) in jobs"
              :key="i"
              class="tray__dot"
              :class="{ 'tray__dot--active': i === activeIdx }"
              @click="scrollToCard(i)"
              :aria-label="jobs[i]?.company"
            />
          </div>
          <div class="carousel-nav">
            <button class="carousel-btn" :disabled="!canScrollLeft" @click="scrollGrid(-1)" aria-label="anterior">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="carousel-btn" :disabled="!canScrollRight" @click="scrollGrid(1)" aria-label="siguiente">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Cards carousel -->
        <div class="tray__grid-wrap">
          <div class="grid-edge-fade" :class="{ 'grid-edge-fade--visible': canScrollRight }" />
          <div class="tray__grid" ref="gridEl">
            <article
              v-for="(job, i) in jobs"
              :key="i"
              class="job-card"
              :style="`--job-color: ${job.color}; --i: ${i}`"
            >
              <div class="job-card__top">
                <span class="job-card__index">{{ pad(i + 1) }} / {{ pad(jobs.length) }}</span>
                <span class="job-card__tag">{{ t(job.tagKey) }}</span>
              </div>
              <div class="job-card__year">{{ job.year }}</div>
              <h3 class="job-card__role">{{ job.role }}</h3>
              <div class="job-card__company">@ {{ job.company }}</div>
              <p class="job-card__context">{{ locale === 'es' ? job.context.es : job.context.en }}</p>

              <div class="job-card__logros">
                <h4 class="job-card__logros-label">{{ t('tray.logros') }}</h4>
                <ul>
                  <li v-for="l in job.logros" :key="l.es">
                    {{ locale === 'es' ? l.es : l.en }}
                  </li>
                </ul>
              </div>

              <div class="job-card__chips">
                <span v-for="chip in job.chips" :key="chip" class="job-card__chip">{{ chip }}</span>
              </div>
            </article>
          </div>
        </div>

        <!-- Scroll hint -->
        <div class="scroll-hint" :class="{ 'scroll-hint--done': scrollProgress >= 0.95 }">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <rect x="1" y="1" width="14" height="18" rx="7" stroke="currentColor" stroke-width="1.2"/>
            <line class="scroll-hint__dot" x1="8" y1="5" x2="8" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>{{ locale === 'es' ? 'Scroll para explorar' : 'Scroll to explore' }}</span>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()

const CARD_STEP    = 380   // card width 360 + gap 20
const TOTAL_SLOTS  = 5     // one scroll-viewport per card

const outerEl        = ref<HTMLElement | null>(null)
const gridEl         = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const canScrollLeft  = ref(false)
const canScrollRight = ref(false)
const activeIdx      = ref(0)

const pad = (n: number) => String(n).padStart(2, '0')

/* ---------- data ---------- */
const jobs = [
  {
    tagKey: 'tray.tag.paralelo',
    year: '2024 — presente',
    role: 'Founder · Fullstack',
    company: 'One Lesson Per Day',
    color: '#0EA5E9',
    context: {
      es: 'Proyecto propio: plataforma de adopción y gestión de mascotas. Tres roles distintos (shelter, adoptante, profesional) sobre una misma base de código.',
      en: 'Personal project: pet adoption and management platform. Three distinct roles (shelter, adoptee, professional) on a single codebase.',
    },
    logros: [
      { es: 'Arquitectura multi-rol con permisos granulares', en: 'Multi-role architecture with granular permissions' },
      { es: 'Diseño UX completo + identidad visual propia',   en: 'Complete UX design + custom visual identity' },
      { es: 'Sistema de matching adoptante ↔ shelter',        en: 'Adoptee ↔ shelter matching system' },
    ],
    chips: ['Nuxt', 'NestJS', 'PostgreSQL', 'AWS', 'TypeScript'],
  },
  {
    tagKey: 'tray.tag.principal',
    year: '2024 — actualidad',
    role: 'Fullstack Developer',
    company: 'Kubo S.A.S.',
    color: '#22C55E',
    context: {
      es: 'Desarrollo de software a medida para clientes empresariales. Stack varía por proyecto — frontend con Nuxt, APIs con NestJS/Node, datos en SQL/Postgres.',
      en: 'Custom software for enterprise clients. Stack varies per project — Nuxt frontend, NestJS/Node APIs, SQL/Postgres data.',
    },
    logros: [
      { es: 'Entrega continua bajo metodología scrum',         en: 'Continuous delivery under scrum methodology' },
      { es: 'Backends modulares con NestJS + Postgres',        en: 'Modular backends with NestJS + Postgres' },
      { es: 'Frontends en Nuxt con foco en performance',       en: 'Performance-focused Nuxt frontends' },
    ],
    chips: ['Nuxt', 'NestJS', 'Node', 'PostgreSQL', 'MySQL', 'Scrum'],
  },
  {
    tagKey: 'tray.tag.paralelo',
    year: '2023',
    role: 'Web Developer (freelance)',
    company: 'Soy Cultura — Bogotá',
    color: '#FACC15',
    context: {
      es: 'Sitio institucional para el programa Soy Cultura de la Alcaldía de Bogotá. Construido desde cero con énfasis en performance, accesibilidad y animaciones avanzadas.',
      en: 'Institutional site for Bogotá City Hall\'s Soy Cultura program. Built from scratch — performance, accessibility and advanced animations.',
    },
    logros: [
      { es: 'HTML/CSS/JS vanilla, sin frameworks pesados', en: 'Vanilla HTML/CSS/JS, no heavy frameworks' },
      { es: 'Score Lighthouse > 95',                      en: 'Lighthouse score > 95' },
      { es: 'Diseño responsivo mobile-first',             en: 'Mobile-first responsive design' },
    ],
    chips: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
  },
  {
    tagKey: 'tray.tag.principal',
    year: '2019 — 2023',
    role: 'Fullstack Developer',
    company: 'Mentius',
    color: '#3B82F6',
    context: {
      es: 'Cuatro años construyendo sistemas internos de gestión empresarial: CRM de call center, tickets TI, plataformas de reclutamiento y control de tiempos.',
      en: 'Four years building internal enterprise systems: call center CRM, IT ticketing, recruitment platforms and time tracking.',
    },
    logros: [
      { es: 'Sistemas de alta concurrencia en producción',               en: 'High-concurrency systems in production' },
      { es: 'Múltiples módulos con Laravel + React + MySQL',             en: 'Multiple modules with Laravel + React + MySQL' },
      { es: 'Integración con APIs externas y flujos automatizados',      en: 'External API integrations and automated workflows' },
    ],
    chips: ['Laravel', 'React', 'Angular', 'MySQL', 'PHP', 'JavaScript'],
  },
  {
    tagKey: 'tray.tag.early',
    year: '2018 — 2019',
    role: 'Frontend Developer',
    company: 'Primer empleo',
    color: '#94A3B8',
    context: {
      es: 'Primer rol formal como desarrollador. Tickets cortos, entregas diarias. HTML, CSS y JS bajo presión real. Disciplina antes que elegancia.',
      en: 'First formal role as a developer. Short tickets, daily deliveries. HTML, CSS and JS under real pressure. Discipline before elegance.',
    },
    logros: [
      { es: 'HTML, CSS y JavaScript desde cero',        en: 'HTML, CSS and JavaScript from scratch' },
      { es: 'Entregas diarias con control de calidad',  en: 'Daily deliveries with quality control' },
      { es: 'Base sólida de frontend vanilla',          en: 'Solid vanilla frontend foundation' },
    ],
    chips: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
  },
]

/* ---------- helpers ---------- */
function scrollPageToCarousel(carouselScroll: number) {
  if (!outerEl.value || !gridEl.value) return
  const el = gridEl.value
  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= 0) return

  const within   = Math.max(0, Math.min(1, carouselScroll / maxScroll))
  const progress = within                               // simple 1-section mapping

  const outerH = outerEl.value.offsetHeight
  const viewH  = window.innerHeight
  const navH   = 60
  window.scrollTo({
    top: outerEl.value.offsetTop - navH + progress * (outerH - viewH),
    behavior: 'smooth',
  })
}

function scrollGrid(dir: number) {
  const el = gridEl.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  scrollPageToCarousel(Math.max(0, Math.min(maxScroll, el.scrollLeft + dir * CARD_STEP)))
}

function scrollToCard(i: number) {
  scrollPageToCarousel(i * CARD_STEP)
}

/* ---------- scroll driver ---------- */
function onWindowScroll() {
  if (!outerEl.value) return
  const outerH   = outerEl.value.offsetHeight
  const viewH    = window.innerHeight
  const navH     = 60
  const scrolled = window.scrollY - outerEl.value.offsetTop + navH
  const progress = Math.max(0, Math.min(1, scrolled / (outerH - viewH)))
  scrollProgress.value = progress

  const el = gridEl.value
  if (el) {
    const maxScroll = el.scrollWidth - el.clientWidth
    const target    = progress * maxScroll
    el.scrollLeft   = target
    canScrollLeft.value  = target > 4
    canScrollRight.value = target < maxScroll - 4
    activeIdx.value      = Math.round(target / CARD_STEP)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll)
})
</script>

<style scoped>
/* ── Scroll-driver outer shell ─────────────────────────────── */
.tray-outer {
  height: calc(v-bind(TOTAL_SLOTS) * 100vh);
  position: relative;
}

.tray-sticky {
  position: sticky;
  top: 60px;
  padding-bottom: 60px;
}

.tray__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 60px 40px 0;
}

/* Progress bar */
.scroll-bar {
  height: 2px;
  background: var(--color-border);
  border-radius: 9999px;
  margin-bottom: 40px;
  overflow: hidden;
}
.scroll-bar__fill {
  height: 100%;
  background: linear-gradient(to right, var(--color-primary), var(--color-accent));
  border-radius: 9999px;
  transition: width .1s linear;
}

/* Header */
.tray__header {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 48px;
  align-items: end;
  margin-bottom: 28px;
}
.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.2vw, 2.5rem);
  font-weight: 900;
  color: var(--color-heading);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.tray__lead {
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-muted);
  margin: 0;
  align-self: end;
}

/* Nav row */
.tray__nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.tray__dots {
  display: flex;
  gap: 6px;
  align-items: center;
}
.tray__dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-border);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background .25s ease, width .25s cubic-bezier(.2,.7,.2,1);
  flex-shrink: 0;
}
.tray__dot--active {
  width: 20px;
  background: var(--color-primary);
}

.carousel-nav {
  display: flex;
  gap: 8px;
}
.carousel-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-heading);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease, color .2s ease;
}
.carousel-btn:disabled { opacity: .25; cursor: not-allowed; }
.carousel-btn:not(:disabled):hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

/* Grid wrapper */
.tray__grid-wrap {
  position: relative;
}
.grid-edge-fade {
  position: absolute;
  right: 0; top: 0; bottom: 16px;
  width: 120px;
  background: linear-gradient(to right, transparent, var(--color-bg) 85%);
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity .35s ease;
}
.grid-edge-fade--visible { opacity: 1; }

/* Cards grid — scroll driven by JS, overflow hidden */
.tray__grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 20px;
  overflow: hidden;
  padding: 8px 0 16px;
}

/* ── Job card ────────────────────────────────────────────────── */
.job-card {
  flex: 0 0 360px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--job-color);
  border-radius: var(--radius-lg);
  padding: 24px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: card-in .4s cubic-bezier(.2,.7,.2,1) both;
  animation-delay: calc(var(--i, 0) * 60ms);
  transition: box-shadow .3s ease, transform .3s ease;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(16px) scale(.98); }
  to   { opacity: 1; transform: none; }
}
.job-card:hover {
  box-shadow: 0 0 28px rgba(59,130,246,.1);
  transform: translateY(-2px);
}

.job-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.job-card__index {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  letter-spacing: 1px;
}
.job-card__tag {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 1.5px;
  color: var(--job-color);
  background: color-mix(in srgb, var(--job-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--job-color) 30%, transparent);
  padding: 3px 8px;
  border-radius: 9999px;
}
.job-card__year {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  margin-top: 4px;
}
.job-card__role {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 900;
  color: var(--color-heading);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.job-card__company {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--job-color);
  font-weight: 500;
}
.job-card__context {
  font-size: 13px;
  line-height: 1.65;
  color: var(--color-muted);
  margin: 4px 0 0;
  flex: 1;
}

.job-card__logros {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
}
.job-card__logros-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--color-muted);
  text-transform: uppercase;
  margin: 0 0 8px 0;
}
.job-card__logros ul {
  list-style: none;
  padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 5px;
}
.job-card__logros li {
  font-size: 12px;
  line-height: 1.45;
  color: var(--color-text);
  padding-left: 14px;
  position: relative;
}
.job-card__logros li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--job-color);
  font-size: 14px;
  line-height: 1.2;
}

.job-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.job-card__chip {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  background: rgba(148,163,184,.08);
  border: 1px solid rgba(148,163,184,.18);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
}

/* Scroll hint */
.scroll-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  opacity: 1;
  transition: opacity .5s ease;
}
.scroll-hint--done { opacity: 0; pointer-events: none; }
.scroll-hint__dot { animation: scroll-bounce 1.4s ease-in-out infinite; }
@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(3px); }
}

@media (max-width: 768px) {
  .tray__inner { padding: 40px 20px 0; }
  .tray__header { grid-template-columns: 1fr; gap: 16px; }
  .job-card { flex: 0 0 290px; }
  .job-card__role { font-size: 18px; }
}
</style>
