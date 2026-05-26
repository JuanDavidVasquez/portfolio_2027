<template>
  <section id="servicios" class="serv">
    <div class="serv__inner">
      <div class="section-eyebrow">{{ t('serv.eyebrow') }}</div>
      <h2 class="section-title">{{ t('serv.title') }}</h2>

      <div class="serv__grid">
        <article v-for="s in services" :key="s.id" class="serv-card">
          <div class="serv-card__num">{{ s.id }}</div>
          <h3 class="serv-card__title">{{ t(s.titleKey) }}</h3>
          <p class="serv-card__desc">{{ t(s.descKey) }}</p>
          <div class="serv-card__chips">
            <span v-for="chip in s.chips" :key="chip" class="serv-card__chip">{{ chip }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const services = [
  {
    id: '01',
    titleKey: 'serv.s1.title',
    descKey: 'serv.s1.desc',
    chips: ['NestJS', 'Node.js', 'TypeScript'],
  },
  {
    id: '02',
    titleKey: 'serv.s2.title',
    descKey: 'serv.s2.desc',
    chips: ['Nuxt 4', 'Vue 3', 'CSS'],
  },
  {
    id: '03',
    titleKey: 'serv.s3.title',
    descKey: 'serv.s3.desc',
    chips: ['AWS', 'CI/CD', 'Docker'],
  },
  {
    id: '04',
    titleKey: 'serv.s4.title',
    descKey: 'serv.s4.desc',
    chips: ['Clean Arch', 'DDD', 'API Design'],
  },
  {
    id: '05',
    titleKey: 'serv.s5.title',
    descKey: 'serv.s5.desc',
    chips: ['GPT', 'Claude API', 'Agents'],
  },
]
</script>

<style scoped>
.serv {
  padding: 120px 40px;
}
.serv__inner {
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

.serv__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 960px) {
  .serv__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .serv__grid { grid-template-columns: 1fr; }
}

.serv-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease;
}
.serv-card:hover {
  border-color: rgba(59,130,246,.4);
  box-shadow: 0 0 24px rgba(59,130,246,.08);
  transform: translateY(-2px);
}

.serv-card__num {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  letter-spacing: 1.5px;
  opacity: 0.7;
}

.serv-card__title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
  letter-spacing: -0.01em;
}

.serv-card__desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--color-muted);
  margin: 0;
  flex: 1;
}

.serv-card__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.serv-card__chip {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  background: rgba(59,130,246,.08);
  border: 1px solid rgba(59,130,246,.2);
  border-radius: var(--radius-sm);
  padding: 3px 8px;
}

@media (max-width: 768px) {
  .serv { padding: 80px 20px; }
}
</style>
