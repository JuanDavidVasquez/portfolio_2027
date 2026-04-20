<template>
  <section id="proyectos" class="projects">
    <div class="projects__inner">
      <div class="section-eyebrow">{{ t('projects.eyebrow') }}</div>
      <h2 class="section-title">{{ t('projects.title') }}</h2>

      <!-- Filter pills -->
      <div class="projects__filters">
        <button
          v-for="f in filters"
          :key="f.id"
          class="filter-btn"
          :class="{ active: activeFilter === f.id }"
          @click="activeFilter = f.id"
        >
          {{ t(f.labelKey) }}
        </button>
      </div>

      <!-- Grid -->
      <div class="projects__grid">
        <article
          v-for="(project, i) in filteredProjects"
          :key="i"
          class="project-card"
          @mouseenter="hoveredIdx = i"
          @mouseleave="hoveredIdx = -1"
          :class="{ hovered: hoveredIdx === i }"
        >
          <!-- Stats: appear on hover, top-right -->
          <div class="project-card__stat">{{ project.stats }}</div>

          <div class="project-card__meta">
            <span class="project-card__year">
              <span class="project-card__dot" />
              {{ project.year }} · {{ project.source }}
            </span>
            <span class="badge" :class="`badge--${project.status}`">
              <span class="badge__dot" />
              {{ project.status === 'ok' ? t('projects.shipped') : t('projects.wip') }}
            </span>
          </div>

          <h3 class="project-card__title">{{ project.title }}</h3>

          <p class="project-card__desc">{{ locale === 'es' ? project.desc.es : project.desc.en }}</p>

          <div class="project-card__footer">
            <div class="project-card__tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <a :href="project.link" target="_blank" rel="noopener" class="project-card__link">
              <span class="project-card__link-txt">{{ locale === 'es' ? project.linkEs : project.linkEn }}</span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { locale, t } = useLocale()

const hoveredIdx = ref(-1)
const activeFilter = ref('all')

const filters = [
  { id: 'all',       labelKey: 'projects.all' },
  { id: 'fullstack', labelKey: 'projects.fullstack' },
  { id: 'backend',   labelKey: 'projects.backend' },
  { id: 'frontend',  labelKey: 'projects.frontend' },
]

const allProjects = [
  {
    year: 2025,
    title: 'stack_notifications',
    desc: {
      es: 'Microservicio de notificaciones sobre NestJS + RabbitMQ para arquitecturas event-driven.',
      en: 'Notifications microservice on NestJS + RabbitMQ for event-driven architectures.',
    },
    tags: ['NestJS', 'RabbitMQ', 'Docker'],
    status: 'ok',
    cat: 'backend',
    stats: '★ 126 · v1.4',
    source: 'open source',
    link: 'https://github.com/JuanDavidVasquez/stack_notifications',
    linkEs: 'Ver repo',
    linkEn: 'View repo',
  },
  {
    year: 2025,
    title: 'one_lesson_per_day',
    desc: {
      es: 'Plataforma de micro-aprendizaje diario con modelos entrenables.',
      en: 'Daily micro-learning platform with trainable models.',
    },
    tags: ['Node', 'AI', 'PostgreSQL'],
    status: 'warn',
    cat: 'fullstack',
    stats: '★ 14 · en curso',
    source: 'github',
    link: 'https://github.com/JuanDavidVasquez/one_lesson_per_day',
    linkEs: 'Ver repo',
    linkEn: 'View repo',
  },
  {
    year: 2025,
    title: 'gratitude',
    desc: {
      es: 'App minimalista de diario de gratitud con recordatorios.',
      en: 'Minimalist gratitude journaling app with reminders.',
    },
    tags: ['Nuxt', 'SQLite'],
    status: 'ok',
    cat: 'fullstack',
    stats: '★ 31 · v2.0',
    source: 'github',
    link: 'https://github.com/JuanDavidVasquez/gratitude',
    linkEs: 'Ver repo',
    linkEn: 'View repo',
  },
  {
    year: 2024,
    title: 'Homi',
    desc: {
      es: 'Plataforma inmobiliaria con búsqueda y filtros avanzados.',
      en: 'Real-estate platform with advanced search and filters.',
    },
    tags: ['NestJS', 'Nuxt', 'AWS'],
    status: 'ok',
    cat: 'fullstack',
    stats: '★ 58 · prod',
    source: 'cliente',
    link: 'https://github.com/JuanDavidVasquez/homi',
    linkEs: 'Ver caso',
    linkEn: 'View case',
  },
  {
    year: 2024,
    title: 'derechos_fundamentales',
    desc: {
      es: 'Plataforma educativa sobre derechos constitucionales.',
      en: 'Educational platform about constitutional rights.',
    },
    tags: ['Vue', 'Pinia'],
    status: 'ok',
    cat: 'frontend',
    stats: '★ 48 · 12 forks',
    source: 'sena',
    link: 'https://github.com/JuanDavidVasquez/derechos_fundamentales',
    linkEs: 'Ver caso',
    linkEn: 'View case',
  },
  {
    year: 2024,
    title: 'stack_node_2025',
    desc: {
      es: 'Stack modular de backend Node + CI/CD para proyectos nuevos.',
      en: 'Modular Node backend stack with CI/CD for new projects.',
    },
    tags: ['Node', 'GH Actions'],
    status: 'ok',
    cat: 'backend',
    stats: '★ 19 · v1.2',
    source: 'open source',
    link: 'https://github.com/JuanDavidVasquez/stack_node_2025',
    linkEs: 'Ver repo',
    linkEn: 'View repo',
  },
]

const filteredProjects = computed(() =>
  activeFilter.value === 'all'
    ? allProjects
    : allProjects.filter(p => p.cat === activeFilter.value),
)
</script>

<style scoped>
.projects {
  padding: 120px 40px;
}
.projects__inner {
  max-width: var(--container-max);
  margin: 0 auto;
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
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--color-heading);
  margin: 0 0 32px 0;
  letter-spacing: -0.02em;
}

.projects__filters {
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.filter-btn {
  font-family: var(--font-mono);
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: transparent;
  color: var(--color-muted);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all .2s ease;
}
.filter-btn.active {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}
.filter-btn:not(.active):hover {
  border-color: var(--color-primary);
  color: var(--color-heading);
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

/* ===== Project card ===== */
.project-card {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .3s ease, box-shadow .35s ease;
  will-change: transform;
}

/* Rotating conic-gradient sweep border */
.project-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  padding: 1px;
  background: conic-gradient(
    from var(--ang, 0deg),
    transparent 0deg,
    var(--color-primary) 40deg,
    var(--color-accent) 80deg,
    transparent 140deg,
    transparent 360deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
}
.project-card.hovered::before {
  opacity: 1;
  animation: jv-spin 4s linear infinite;
}

/* Blue halo at bottom */
.project-card::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -40%;
  width: 140%;
  height: 80%;
  transform: translateX(-50%);
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(59,130,246,.22), transparent 60%);
  opacity: 0;
  transition: opacity .4s ease;
}
.project-card.hovered {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: 0 20px 40px -20px rgba(59,130,246,.35), 0 0 0 1px rgba(59,130,246,.25);
}
.project-card.hovered::after {
  opacity: 1;
}
.project-card:active { transform: translateY(-1px); }

/* Stats — hidden until hover */
.project-card__stat {
  position: absolute;
  top: 18px;
  right: 20px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity .3s ease .05s, transform .3s ease .05s, color .3s ease;
  z-index: 1;
}
.project-card.hovered .project-card__stat {
  opacity: 1;
  transform: translateY(0);
  color: var(--color-primary);
}

/* Meta row */
.project-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.project-card__year {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}
.project-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  flex-shrink: 0;
  animation: jv-pulse 2s ease-in-out infinite;
}

/* Status badges */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 9999px;
}
.badge--ok   { color: #22C55E; background: rgba(34,197,94,.08);  border: 1px solid rgba(34,197,94,.4);  }
.badge--warn { color: #FACC15; background: rgba(250,204,21,.08); border: 1px solid rgba(250,204,21,.4); }
.badge__dot  { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

.project-card__title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 6px 0 8px 0;
  letter-spacing: -0.02em;
  transition: color .3s ease;
}
.project-card.hovered .project-card__title { color: #fff; }

.project-card__desc {
  font-size: 13.5px;
  line-height: 1.55;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

/* Footer: tags + link */
.project-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}
.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-family: var(--font-mono);
  font-size: 10px;
  padding: 3px 9px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  transition: color .25s ease, border-color .25s ease, background .25s ease;
}
.project-card.hovered .tag {
  color: var(--color-heading);
  border-color: rgba(59,130,246,.5);
  background: rgba(59,130,246,.08);
}
.project-card.hovered .tag:nth-child(2) { transition-delay: .05s; }

/* Link arrow */
.project-card__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
  transition: color .3s ease;
}
.project-card.hovered .project-card__link {
  color: var(--color-accent);
}
.project-card__link svg {
  transition: transform .4s cubic-bezier(.2,.7,.2,1);
  flex-shrink: 0;
}
.project-card.hovered .project-card__link svg {
  transform: translateX(6px);
}

@media (max-width: 640px) {
  .projects { padding: 80px 20px; }
}
</style>
