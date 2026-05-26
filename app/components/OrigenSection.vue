<template>
  <section id="origen" class="origen">
    <div class="origen__inner">
      <div class="section-eyebrow">{{ t('origen.eyebrow') }}</div>
      <h2 class="section-title">{{ t('origen.title') }}</h2>

      <div class="origen__content">
        <div class="origen__text">
          <p class="origen__p">{{ t('origen.p1') }}</p>
          <p class="origen__p">{{ t('origen.p2') }}</p>

          <blockquote class="origen__pull">{{ t('origen.pull') }}</blockquote>

          <p class="origen__p">{{ t('origen.p3') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()
</script>

<style scoped>
.origen {
  padding: 120px 40px;
}
.origen__inner {
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

.origen__content {
  max-width: 720px;
}

.origen__text {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.origen__p {
  font-size: 17px;
  line-height: 1.75;
  color: var(--color-text);
  margin: 0;
}

.origen__pull {
  border-left: 4px solid var(--color-primary);
  padding: 16px 0 16px 24px;
  margin: 8px 0;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2.5vw, 1.6rem);
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.3;
  font-style: normal;
  letter-spacing: -0.01em;
}

@media (max-width: 768px) {
  .origen { padding: 80px 20px; }
  .origen__p { font-size: 15px; }
}
</style>
