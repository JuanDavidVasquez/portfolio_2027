<template>
  <section id="uses" class="uses">
    <div class="uses__inner">
      <div class="section-eyebrow">{{ t('uses.eyebrow') }}</div>
      <h2 class="section-title">{{ t('uses.title') }}</h2>

      <div class="uses__grid">
        <div v-for="cat in categories" :key="cat.name" class="uses__cat">
          <h3 class="uses__cat-name">{{ cat.name }}</h3>
          <ul class="uses__list">
            <li v-for="item in cat.items" :key="item.name" class="uses__item">
              <span class="uses__bullet">·</span>
              <span class="uses__item-name">{{ item.name }}</span>
              <span v-if="item.note" class="uses__item-note">{{ item.note }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const categories = [
  {
    name: 'Editor & Terminal',
    items: [
      { name: 'Visual Studio Code', note: 'principal' },
      { name: 'Windows Terminal + WSL' },
      { name: 'JetBrains IDEs', note: 'ocasional' },
    ],
  },
  {
    name: 'AI & Productividad',
    items: [
      { name: 'Claude Code', note: 'Anthropic' },
      { name: 'GitHub Copilot' },
      { name: 'Notion', note: 'docs y planning' },
    ],
  },
  {
    name: 'Stack diario',
    items: [
      { name: 'NestJS + Nuxt 4' },
      { name: 'Docker + Docker Compose' },
      { name: 'Git + GitHub' },
    ],
  },
  {
    name: 'Cloud & Infra',
    items: [
      { name: 'AWS', note: 'EC2, S3, RDS, Lambda' },
      { name: 'GitHub Actions', note: 'CI/CD' },
      { name: 'Linux', note: 'Ubuntu en servidores' },
    ],
  },
  {
    name: 'Diseño',
    items: [
      { name: 'Claude Design' },
      { name: 'Figma', note: 'lectura de specs' },
      { name: 'Tokens CSS propios' },
    ],
  },
]
</script>

<style scoped>
.uses {
  padding: 120px 40px;
}
.uses__inner {
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
  margin: 0 0 56px 0;
  letter-spacing: -0.02em;
}

.uses__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 40px 32px;
}
@media (max-width: 1024px) {
  .uses__grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .uses__grid { grid-template-columns: repeat(2, 1fr); gap: 32px 20px; }
}
@media (max-width: 400px) {
  .uses__grid { grid-template-columns: 1fr; }
}

.uses__cat-name {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
}

.uses__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.uses__item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.uses__bullet {
  color: var(--color-primary);
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.uses__item-name {
  font-size: 13px;
  color: var(--color-text);
  line-height: 1.4;
}

.uses__item-note {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 0.3px;
}

@media (max-width: 768px) {
  .uses { padding: 80px 20px; }
}
</style>
