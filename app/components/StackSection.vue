<template>
  <section id="stack" class="stack">
    <div class="stack__inner">
      <div class="section-eyebrow">{{ t('stack.eyebrow') }}</div>
      <h2 class="section-title">{{ t('stack.title') }}</h2>

      <div class="stack__grid">
        <div v-for="(group, i) in groups" :key="i" class="stack-card">
          <div class="stack-card__label">{{ t(group.titleKey) }}</div>
          <div class="stack-card__items">
            <span v-for="item in group.items" :key="item" class="badge">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const groups = [
  { titleKey: 'stack.frameworks', items: ['NestJS', 'Nuxt 4', 'Vue 3', 'React', 'Laravel', 'PrimeVue 4', 'Bootstrap', 'Tailwind CSS'] },
  { titleKey: 'stack.languages',  items: ['TypeScript', 'JavaScript', 'Node.js', 'HTML', 'CSS/SCSS', 'Java'] },
  { titleKey: 'stack.databases',  items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'VectorDB'] },
  { titleKey: 'stack.cloud',      items: ['AWS', 'Docker', 'PM2', 'GitHub Actions', 'Nginx', 'Vercel', 'Hostinger'] },
  { titleKey: 'stack.ai',         items: ['OpenAI GPT', 'Google Gemini', 'Prompt design'] },
]
</script>

<style scoped>
.stack {
  background: var(--grad-surface);
  padding: 120px 40px;
}
.stack__inner {
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
  margin: 0 0 48px 0;
  letter-spacing: -0.02em;
}

.stack__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.stack-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  transition: border-color .3s ease;
}
.stack-card:hover {
  border-color: rgba(59,130,246,.35);
}

.stack-card__label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.stack-card__items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  transition: border-color .2s ease, color .2s ease;
}
.badge:hover {
  border-color: var(--color-primary);
  color: var(--color-heading);
}
</style>
