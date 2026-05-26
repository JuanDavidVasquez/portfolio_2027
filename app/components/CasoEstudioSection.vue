<template>
  <section id="caso-estudio" class="caso">
    <div class="caso__inner">
      <div class="section-eyebrow">{{ t('caso.eyebrow') }}</div>
      <h2 class="section-title">{{ project?.title }}</h2>
      <p class="caso__subtitle">{{ t('caso.subtitle') }}</p>

      <div class="caso__grid">
        <!-- Left: narrative -->
        <div class="caso__left">
          <div class="caso__block">
            <h3 class="caso__block-title">{{ t('caso.problem') }}</h3>
            <p class="caso__block-text">{{ locale === 'es' ? project?.context.es : project?.context.en }}</p>
          </div>

          <div class="caso__block">
            <h3 class="caso__block-title">{{ t('caso.decisions') }}</h3>
            <ul class="caso__list">
              <li v-for="d in project?.architecture.decisions" :key="d">{{ d }}</li>
            </ul>
          </div>

          <div class="caso__block">
            <h3 class="caso__block-title">{{ t('caso.highlights') }}</h3>
            <ul class="caso__list">
              <li v-for="h in project?.highlights" :key="h">{{ h }}</li>
            </ul>
          </div>

          <NuxtLink :to="`/projects/${project?.slug}`" class="caso__cta">
            {{ t('caso.viewProject') }}
          </NuxtLink>
        </div>

        <!-- Right: architecture + tech -->
        <div class="caso__right">
          <div class="caso__arch-card">
            <div class="caso__arch-label">arquitectura</div>
            <pre class="caso__arch-diagram">{{ diagram }}</pre>
          </div>

          <div class="caso__tech-card">
            <div class="caso__arch-label">tech stack</div>
            <div class="caso__tech-groups">
              <div
                v-for="(items, category) in techGroups"
                :key="category"
                class="caso__tech-group"
              >
                <span class="caso__tech-category">{{ category }}</span>
                <div class="caso__badges">
                  <span v-for="item in items" :key="item" class="caso__badge">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="caso__meta-card">
            <div class="caso__meta-item">
              <span class="caso__meta-key">tipo</span>
              <span class="caso__meta-val">{{ project?.architecture.type }}</span>
            </div>
            <div class="caso__meta-item">
              <span class="caso__meta-key">estado</span>
              <span class="caso__meta-val">{{ project?.stats }}</span>
            </div>
            <div class="caso__meta-item">
              <span class="caso__meta-key">categoría</span>
              <span class="caso__meta-val">{{ project?.cat }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { projects } from '~/data/projects'

const { t, locale } = useLocale()

const project = projects.find(p => p.slug === 'one-lesson-per-day')

const diagram = `  Cliente  →  [API Gateway]  →  Servicio Adopciones
                   ↓         →  Servicio Historial
              Auth + RL      →  Servicio Vacunación
                   ↓
              PostgreSQL × 3`

const techGroups = computed(() => {
  if (!project) return {}
  const result: Record<string, string[]> = {}
  for (const [key, val] of Object.entries(project.tech)) {
    if (val && val.length) result[key] = val
  }
  return result
})
</script>

<style scoped>
.caso {
  padding: 120px 40px;
}
.caso__inner {
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
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}
.caso__subtitle {
  font-size: 16px;
  color: var(--color-muted);
  margin: 0 0 56px 0;
  line-height: 1.6;
}

.caso__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
@media (max-width: 900px) {
  .caso__grid { grid-template-columns: 1fr; }
}

/* Left */
.caso__left {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.caso__block-title {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0 0 12px 0;
}

.caso__block-text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0;
}

.caso__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.caso__list li {
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-muted);
  padding-left: 16px;
  position: relative;
}
.caso__list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-size: 11px;
  top: 1px;
}

.caso__cta {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-primary);
  text-decoration: none;
  transition: color .2s ease, gap .2s ease;
  gap: 6px;
}
.caso__cta:hover {
  color: var(--color-accent);
  gap: 10px;
}

/* Right */
.caso__right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.caso__arch-card,
.caso__tech-card,
.caso__meta-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px 22px;
}

.caso__arch-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.caso__arch-diagram {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre;
  overflow-x: auto;
  margin: 0;
}

.caso__tech-groups {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.caso__tech-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.caso__tech-category {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.caso__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.caso__badge {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  background: rgba(59,130,246,.08);
  border: 1px solid rgba(59,130,246,.2);
  border-radius: var(--radius-sm);
  padding: 3px 8px;
}

.caso__meta-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.caso__meta-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.caso__meta-key {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 70px;
}
.caso__meta-val {
  font-size: 13px;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .caso { padding: 80px 20px; }
  .caso__arch-diagram { font-size: 10px; }
}
</style>
