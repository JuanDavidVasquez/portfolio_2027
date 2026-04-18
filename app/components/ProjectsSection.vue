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
          <div class="project-card__meta">
            <span class="project-card__year">{{ project.year }} · github</span>
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
            <span class="project-card__arrow">→</span>
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
  { id: 'fullstack', labelKey: 'stack.frameworks' },
  { id: 'backend',   labelKey: 'stack.cloud' },
  { id: 'frontend',  labelKey: 'stack.languages' },
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
  },
  {
    year: 2024,
    title: 'derechos_fundamentales',
    desc: {
      es: 'Plataforma educativa sobre derechos constitucionales.',
      en: 'Educational platform about constitutional rights.',
    },
    tags: ['Vue', 'SCSS'],
    status: 'ok',
    cat: 'frontend',
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

.project-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  cursor: pointer;
  transition: all .3s ease;
}
.project-card.hovered {
  border-color: rgba(59,130,246,.5);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0,0,0,.2);
}

.project-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.project-card__year {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
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
  font-size: 20px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 6px 0 10px 0;
}
.project-card__desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0 0 18px 0;
}
.project-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color .2s ease, color .2s ease;
}
.project-card.hovered .tag {
  border-color: rgba(59,130,246,.4);
  color: var(--color-primary);
}
.project-card__arrow {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-primary);
  transition: color .3s ease, transform .3s ease;
}
.project-card.hovered .project-card__arrow {
  color: var(--color-accent);
  transform: translateX(4px);
}
</style>
