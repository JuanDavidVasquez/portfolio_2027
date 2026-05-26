<template>
  <section id="trayectoria" class="tray">
    <div class="tray__inner">
      <div class="tray__header">
        <div class="tray__header-left">
          <div class="section-eyebrow">{{ t('tray.eyebrow') }}</div>
          <h2 class="section-title">{{ t('tray.title') }}</h2>
        </div>
        <p class="tray__lead">{{ t('tray.lead') }}</p>
      </div>
    </div>

    <div class="tray__scroll-wrap">
      <div class="tray__track">
        <article
          v-for="(job, i) in jobs"
          :key="i"
          class="job-card"
          :style="`--job-color: ${job.color}`"
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
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()

const pad = (n: number) => String(n).padStart(2, '0')

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
      { es: 'Diseño UX completo + identidad visual propia', en: 'Complete UX design + custom visual identity' },
      { es: 'Sistema de matching adoptante ↔ shelter', en: 'Adoptee ↔ shelter matching system' },
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
      en: 'Custom software development for enterprise clients. Stack varies per project — Nuxt frontend, NestJS/Node APIs, SQL/Postgres data.',
    },
    logros: [
      { es: 'Entrega continua bajo metodología scrum', en: 'Continuous delivery under scrum methodology' },
      { es: 'Backends modulares con NestJS + Postgres', en: 'Modular backends with NestJS + Postgres' },
      { es: 'Frontends en Nuxt con foco en performance', en: 'Performance-focused Nuxt frontends' },
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
      es: 'Sitio institucional para el programa Soy Cultura de la Alcaldía de Bogotá. Construido desde cero con énfasis en performance, accesibilidad y animaciones avanzadas con GSAP.',
      en: 'Institutional site for Bogotá City Hall\'s Soy Cultura program. Built from scratch with focus on performance, accessibility and advanced GSAP animations.',
    },
    logros: [
      { es: 'HTML/CSS/JS vanilla, sin frameworks pesados', en: 'Vanilla HTML/CSS/JS, no heavy frameworks' },
      { es: 'Score Lighthouse > 95', en: 'Lighthouse score > 95' },
      { es: 'Diseño responsivo mobile-first', en: 'Mobile-first responsive design' },
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
      es: 'Cuatro años construyendo sistemas internos de gestión empresarial: CRM de call center, gestión de tickets TI, plataformas de reclutamiento y control de tiempos.',
      en: 'Four years building internal enterprise management systems: call center CRM, IT ticket management, recruitment platforms and time tracking.',
    },
    logros: [
      { es: 'Sistemas de alta concurrencia en producción', en: 'High-concurrency systems in production' },
      { es: 'Múltiples módulos con Laravel + React + MySQL', en: 'Multiple modules with Laravel + React + MySQL' },
      { es: 'Integración con APIs externas y flujos automatizados', en: 'External API integrations and automated workflows' },
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
      es: 'Primer rol formal como desarrollador. Tickets cortos, entregas diarias. Aprendizaje de HTML, CSS y JS bajo presión real. Disciplina antes que elegancia.',
      en: 'First formal role as a developer. Short tickets, daily deliveries. Learning HTML, CSS and JS under real pressure. Discipline before elegance.',
    },
    logros: [
      { es: 'HTML, CSS y JavaScript desde cero', en: 'HTML, CSS and JavaScript from scratch' },
      { es: 'Entregas diarias con control de calidad', en: 'Daily deliveries with quality control' },
      { es: 'Base sólida de frontend vanilla', en: 'Solid vanilla frontend foundation' },
    ],
    chips: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
  },
]
</script>

<style scoped>
.tray {
  padding: 120px 0 120px 40px;
  overflow: hidden;
}

.tray__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  padding-right: 40px;
}

.section-eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.tray__header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: end;
  margin-bottom: 56px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
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

/* Horizontal scroll container */
.tray__scroll-wrap {
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: thin;
  scrollbar-color: rgba(59,130,246,.3) transparent;
  cursor: grab;
  padding-bottom: 20px;
}
.tray__scroll-wrap:active { cursor: grabbing; }
.tray__scroll-wrap::-webkit-scrollbar { height: 4px; }
.tray__scroll-wrap::-webkit-scrollbar-track { background: transparent; }
.tray__scroll-wrap::-webkit-scrollbar-thumb {
  background: rgba(59,130,246,.3);
  border-radius: 9999px;
}

.tray__track {
  display: flex;
  gap: 20px;
  padding: 4px 40px 4px 40px;
  width: max-content;
}

/* Job card */
.job-card {
  width: 360px;
  flex-shrink: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--job-color);
  border-radius: var(--radius-lg);
  padding: 24px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow .3s ease, transform .3s ease;
}
.job-card:hover {
  box-shadow: 0 0 24px rgba(59,130,246,.1);
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
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
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

@media (max-width: 768px) {
  .tray { padding: 80px 0 80px 20px; }
  .tray__inner { padding-right: 20px; }
  .tray__header { grid-template-columns: 1fr; gap: 16px; }
  .tray__track { padding: 4px 20px; }
  .job-card { width: 300px; }
  .job-card__role { font-size: 18px; }
}
</style>
