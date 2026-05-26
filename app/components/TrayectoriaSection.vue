<template>
  <section id="trayectoria" class="tray">
    <div class="tray__inner">
      <div class="section-eyebrow">{{ t('tray.eyebrow') }}</div>
      <h2 class="section-title">{{ t('tray.title') }}</h2>

      <div class="tray__timeline">
        <div
          v-for="(entry, i) in entries"
          :key="entry.year"
          class="tray__entry"
        >
          <div class="tray__entry-left">
            <span class="tray__year">{{ entry.year }}</span>
          </div>
          <div class="tray__connector">
            <div class="tray__dot" :class="{ 'tray__dot--last': i === entries.length - 1 }" />
            <div v-if="i < entries.length - 1" class="tray__line" />
          </div>
          <div class="tray__entry-right">
            <h3 class="tray__role">{{ t(entry.roleKey) }}</h3>
            <p class="tray__desc">{{ t(entry.descKey) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const entries = [
  { year: '2020',    roleKey: 'tray.2020.role', descKey: 'tray.2020.desc' },
  { year: '2021–22', roleKey: 'tray.2122.role', descKey: 'tray.2122.desc' },
  { year: '2023',    roleKey: 'tray.2023.role', descKey: 'tray.2023.desc' },
  { year: '2024',    roleKey: 'tray.2024.role', descKey: 'tray.2024.desc' },
  { year: '2025',    roleKey: 'tray.2025.role', descKey: 'tray.2025.desc' },
  { year: '2026',    roleKey: 'tray.2026.role', descKey: 'tray.2026.desc' },
]
</script>

<style scoped>
.tray {
  padding: 120px 40px;
}
.tray__inner {
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
  margin: 0 0 64px 0;
  letter-spacing: -0.02em;
}

.tray__timeline {
  max-width: 760px;
}

.tray__entry {
  display: grid;
  grid-template-columns: 88px 32px 1fr;
  gap: 0 16px;
}

.tray__entry-left {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}

.tray__year {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 1px;
  white-space: nowrap;
  line-height: 1.6;
}

.tray__connector {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tray__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 0 10px rgba(59,130,246,.5);
  flex-shrink: 0;
  margin-top: 4px;
  transition: box-shadow .3s ease;
}
.tray__entry:hover .tray__dot {
  box-shadow: 0 0 16px rgba(59,130,246,.8);
}
.tray__dot--last {
  background: var(--color-accent);
  box-shadow: 0 0 14px rgba(99,102,241,.6);
}

.tray__line {
  width: 1px;
  flex: 1;
  background: linear-gradient(to bottom, rgba(59,130,246,.4), rgba(59,130,246,.1));
  margin: 6px 0;
  min-height: 32px;
}

.tray__entry-right {
  padding-bottom: 40px;
}
.tray__entry:last-child .tray__entry-right {
  padding-bottom: 0;
}

.tray__role {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.tray__desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--color-muted);
  margin: 0;
}

@media (max-width: 768px) {
  .tray { padding: 80px 20px; }
  .tray__entry { grid-template-columns: 72px 24px 1fr; gap: 0 10px; }
  .tray__year { font-size: 11px; }
}
</style>
