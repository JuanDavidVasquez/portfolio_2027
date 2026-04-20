<template>
  <main class="project-detail">
    <div class="project-detail__inner">

      <NuxtLink to="/#proyectos" class="back-link">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M15 6H1m0 0l5-5M1 6l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ locale === 'es' ? 'Proyectos' : 'Projects' }}</span>
      </NuxtLink>

      <template v-if="project">

        <!-- HEADER -->
        <header class="pd-header">
          <div class="pd-meta">
            <span class="pd-year">
              <span class="pd-dot" />
              {{ project.year }} · {{ project.source }} · {{ project.cat }}
            </span>
            <span class="badge" :class="`badge--${project.status}`">
              <span class="badge__dot" />
              {{ project.status === 'ok' ? t('projects.shipped') : t('projects.wip') }}
            </span>
          </div>

          <h1 class="pd-title">{{ project.title }}</h1>
          <div class="pd-stats">{{ project.stats }}</div>

          <!-- Tech stack pills -->
          <div v-if="techEntries.length" class="pd-tech">
            <div v-for="([cat, items]) in techEntries" :key="cat" class="pd-tech__group">
              <span class="pd-tech__label">{{ cat }}</span>
              <div class="pd-tech__pills">
                <span v-for="item in items" :key="item" class="tech-pill">{{ item }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- CONTEXT -->
        <section class="pd-section">
          <p class="pd-context">{{ locale === 'es' ? project.context.es : project.context.en }}</p>
        </section>

        <!-- DESC -->
        <section class="pd-section pd-section--accent">
          <p class="pd-desc">{{ locale === 'es' ? project.desc.es : project.desc.en }}</p>
        </section>

        <!-- ARCHITECTURE -->
        <section v-if="project.architecture" class="pd-section">
          <h2 class="pd-section__title">{{ locale === 'es' ? 'Arquitectura' : 'Architecture' }}</h2>
          <div class="pd-arch-type">{{ project.architecture.type }}</div>
          <ul class="pd-list">
            <li v-for="d in project.architecture.decisions" :key="d">{{ d }}</li>
          </ul>
        </section>

        <!-- FLOWS -->
        <section v-if="project.flows?.length" class="pd-section">
          <h2 class="pd-section__title">{{ locale === 'es' ? 'Flujos principales' : 'Main flows' }}</h2>
          <ol class="pd-flows">
            <li v-for="(flow, i) in project.flows" :key="i">
              <span class="pd-flows__num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span>{{ flow }}</span>
            </li>
          </ol>
        </section>

        <!-- HIGHLIGHTS -->
        <section v-if="project.highlights?.length" class="pd-section">
          <h2 class="pd-section__title">{{ locale === 'es' ? 'Destacados' : 'Highlights' }}</h2>
          <ul class="pd-highlights">
            <li v-for="h in project.highlights" :key="h">{{ h }}</li>
          </ul>
        </section>

        <!-- UI / DESIGN -->
        <section v-if="project.ui" class="pd-section">
          <h2 class="pd-section__title">{{ locale === 'es' ? 'UI & Diseño' : 'UI & Design' }}</h2>
          <div class="pd-ui">
            <div class="pd-ui__row">
              <span class="pd-ui__label">{{ locale === 'es' ? 'Tipografía' : 'Typography' }}</span>
              <div class="pd-ui__fonts">
                <span v-for="f in project.ui.typography" :key="f" class="font-tag">{{ f }}</span>
              </div>
            </div>
            <div class="pd-ui__row">
              <span class="pd-ui__label">{{ locale === 'es' ? 'Diseño' : 'Design' }}</span>
              <p class="pd-ui__text">{{ project.ui.design }}</p>
            </div>
            <div class="pd-ui__row">
              <span class="pd-ui__label">{{ locale === 'es' ? 'Colores' : 'Colors' }}</span>
              <div class="pd-colors">
                <div
                  v-for="(hex, name) in project.ui.colors"
                  :key="name"
                  class="pd-color"
                  :style="{ background: hex }"
                  :title="`${name}: ${hex}`"
                />
              </div>
            </div>
            <div v-if="project.ui.animations?.length" class="pd-ui__row">
              <span class="pd-ui__label">{{ locale === 'es' ? 'Animaciones' : 'Animations' }}</span>
              <ul class="pd-anim-list">
                <li v-for="a in project.ui.animations" :key="a">{{ a }}</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- PERFORMANCE & IMPACT -->
        <section v-if="project.performance || project.impact" class="pd-section pd-grid-2">
          <div v-if="project.performance" class="pd-card">
            <h3 class="pd-card__title">{{ locale === 'es' ? 'Performance' : 'Performance' }}</h3>
            <p>{{ locale === 'es' ? project.performance.es : project.performance.en }}</p>
          </div>
          <div v-if="project.impact" class="pd-card">
            <h3 class="pd-card__title">{{ locale === 'es' ? 'Impacto' : 'Impact' }}</h3>
            <p>{{ locale === 'es' ? project.impact.es : project.impact.en }}</p>
          </div>
        </section>

      </template>

      <div v-else class="pd-404">
        <p>{{ locale === 'es' ? 'Proyecto no encontrado.' : 'Project not found.' }}</p>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { projects } from '~/data/projects'

const { locale, t } = useLocale()
const route = useRoute()

const project = computed(() =>
  projects.find(p => p.slug === route.params.slug),
)

const techEntries = computed(() => {
  if (!project.value?.tech) return []
  return Object.entries(project.value.tech).filter(([, v]) => v && (v as string[]).length > 0)
})

useHead({
  title: computed(() =>
    project.value
      ? `${project.value.title} — Juan Vasquez`
      : 'Juan Vasquez — Portafolio 2027',
  ),
})
</script>

<style scoped>
.project-detail {
  min-height: 100vh;
  padding: 100px 40px 120px;
}
.project-detail__inner {
  max-width: 760px;
  margin: 0 auto;
}

/* Back link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-muted);
  text-decoration: none;
  margin-bottom: 56px;
  transition: color .25s ease;
}
.back-link:hover { color: var(--color-primary); }
.back-link svg { transition: transform .3s ease; }
.back-link:hover svg { transform: translateX(-4px); }

/* Header */
.pd-header { margin-bottom: 48px; }

.pd-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.pd-year {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}
.pd-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  box-shadow: 0 0 8px var(--color-success);
  flex-shrink: 0;
}

.pd-title {
  font-family: var(--font-mono);
  font-size: clamp(1.75rem, 5vw, 2.75rem);
  font-weight: 700;
  color: var(--color-heading);
  letter-spacing: -0.03em;
  margin: 0 0 12px;
  line-height: 1.1;
}
.pd-stats {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  margin-bottom: 24px;
}

/* Tech pills */
.pd-tech {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pd-tech__group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.pd-tech__label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: .08em;
  min-width: 64px;
}
.pd-tech__pills { display: flex; flex-wrap: wrap; gap: 6px; }
.tech-pill {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

/* Sections */
.pd-section {
  border-top: 1px solid var(--color-border);
  padding: 36px 0;
}
.pd-section--accent {
  background: rgba(99,102,241,.04);
  border: 1px solid rgba(99,102,241,.12);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 0;
}
.pd-section__title {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--color-muted);
  margin: 0 0 20px;
}

/* Context & desc */
.pd-context {
  font-size: 16px;
  line-height: 1.75;
  color: var(--color-text);
  margin: 0;
}
.pd-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-primary);
  margin: 0;
  font-style: italic;
}

/* Architecture */
.pd-arch-type {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-heading);
  margin-bottom: 16px;
}
.pd-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pd-list li {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  padding-left: 16px;
  position: relative;
}
.pd-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--color-muted);
  font-size: 12px;
}

/* Flows */
.pd-flows {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.pd-flows li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
}
.pd-flows__num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  flex-shrink: 0;
  padding-top: 2px;
}

/* Highlights */
.pd-highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pd-highlights li {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  padding-left: 18px;
  position: relative;
}
.pd-highlights li::before {
  content: '✦';
  position: absolute;
  left: 0;
  font-size: 9px;
  color: var(--color-primary);
  top: 3px;
}

/* UI Design */
.pd-ui {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.pd-ui__row {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}
.pd-ui__label {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: var(--color-muted);
  min-width: 90px;
  padding-top: 2px;
  flex-shrink: 0;
}
.pd-ui__text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text);
  margin: 0;
}
.pd-ui__fonts { display: flex; gap: 8px; flex-wrap: wrap; }
.font-tag {
  font-size: 13px;
  color: var(--color-heading);
  padding: 2px 10px;
  border-radius: 4px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.pd-colors { display: flex; gap: 8px; }
.pd-color {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.08);
  cursor: default;
}

.pd-anim-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pd-anim-list li {
  font-size: 13px;
  color: var(--color-muted);
  padding-left: 14px;
  position: relative;
}
.pd-anim-list li::before {
  content: '·';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

/* Performance / Impact grid */
.pd-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.pd-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}
.pd-card__title {
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .1em;
  color: var(--color-muted);
  margin: 0 0 12px;
}
.pd-card p {
  font-size: 13px;
  line-height: 1.65;
  color: var(--color-text);
  margin: 0;
}

/* Badges */
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

.pd-404 { color: var(--color-muted); font-family: var(--font-mono); }

@media (max-width: 640px) {
  .project-detail { padding: 80px 20px 100px; }
  .back-link { margin-bottom: 40px; }
  .pd-grid-2 { grid-template-columns: 1fr; }
  .pd-ui__row { flex-direction: column; gap: 8px; }
  .pd-ui__label { min-width: unset; }
  .pd-tech__group { flex-direction: column; align-items: flex-start; gap: 6px; }
  .pd-tech__label { min-width: unset; }
}
</style>
