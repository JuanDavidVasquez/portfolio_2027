<template>
  <section id="referencias" class="refs">
    <div class="refs__inner">
      <div class="section-eyebrow">{{ t('refs.eyebrow') }}</div>
      <h2 class="section-title">{{ t('refs.title') }}</h2>

      <div class="refs__grid">
        <article v-for="ref in references" :key="ref.nameKey" class="ref-card">
          <span class="ref-card__quote-mark">"</span>
          <blockquote class="ref-card__text">{{ t(ref.quoteKey) }}</blockquote>
          <footer class="ref-card__footer">
            <span class="ref-card__name">{{ t(ref.nameKey) }}</span>
            <span class="ref-card__role">{{ t(ref.roleKey) }}</span>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const references = [
  { quoteKey: 'refs.quote1', nameKey: 'refs.name1', roleKey: 'refs.role1' },
  { quoteKey: 'refs.quote2', nameKey: 'refs.name2', roleKey: 'refs.role2' },
  { quoteKey: 'refs.quote3', nameKey: 'refs.name3', roleKey: 'refs.role3' },
]
</script>

<style scoped>
.refs {
  padding: 120px 40px;
}
.refs__inner {
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

.refs__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) {
  .refs__grid { grid-template-columns: 1fr; }
}

.ref-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  transition: border-color .3s ease, box-shadow .3s ease;
}
.ref-card:hover {
  border-color: rgba(59,130,246,.4);
  box-shadow: 0 0 24px rgba(59,130,246,.08);
}

.ref-card__quote-mark {
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 900;
  line-height: 0.6;
  color: var(--color-primary);
  opacity: 0.18;
  position: absolute;
  top: 24px;
  left: 24px;
  pointer-events: none;
  user-select: none;
}

.ref-card__text {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  font-style: normal;
  margin-top: 16px;
  flex: 1;
}

.ref-card__footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid var(--color-border);
  padding-top: 20px;
}

.ref-card__name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--color-heading);
}

.ref-card__role {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .refs { padding: 80px 20px; }
}
</style>
