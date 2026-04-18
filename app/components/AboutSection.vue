<template>
  <section id="sobre" class="about">
    <div class="about__inner">
      <div class="section-eyebrow">{{ t('about.eyebrow') }}</div>
      <h2 class="section-title">{{ t('about.title') }}</h2>

      <div class="about__grid">
        <div class="about__text">
          <p class="about__p1">{{ t('about.p1') }}</p>
          <p class="about__p2">{{ t('about.p2') }}</p>
        </div>

        <div class="about__stats">
          <div v-for="(stat, i) in stats" :key="i" class="stat-card">
            <div class="stat-card__number">
              <CountUp :to="stat.to" :suffix="stat.suffix" :delay="i * 120" />
            </div>
            <div class="stat-card__label">{{ t(stat.labelKey) }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const stats = [
  { to: 5,  suffix: '+', labelKey: 'about.yearsLabel' },
  { to: 20, suffix: '+', labelKey: 'about.projectsLabel' },
  { to: 3,  suffix: '',  labelKey: 'about.cloudsLabel' },
  { to: 2,  suffix: '',  labelKey: 'about.languagesLabel' },
]
</script>

<style scoped>
.about {
  padding: 120px 40px;
}
.about__inner {
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

.about__grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 64px;
  align-items: start;
}
@media (max-width: 768px) {
  .about__grid { grid-template-columns: 1fr; gap: 40px; }
}

.about__p1 {
  font-size: 18px;
  line-height: 1.7;
  color: var(--color-text);
  margin: 0 0 20px 0;
}
.about__p2 {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-muted);
  margin: 0;
}

.about__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: border-color .3s ease, box-shadow .3s ease;
}
.stat-card:hover {
  border-color: rgba(59,130,246,.4);
  box-shadow: 0 0 20px rgba(59,130,246,.1);
}
.stat-card__number {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 900;
  color: var(--color-heading);
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}
.stat-card__label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
