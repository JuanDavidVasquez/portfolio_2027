<template>
  <section id="uses" class="uses">
    <div class="uses__inner">
      <div class="section-eyebrow">{{ t('uses.eyebrow') }}</div>
      <h2 class="section-title">{{ t('uses.title') }}</h2>

      <div class="uses__grid">
        <div v-for="group in groups" :key="group.titleKey" class="uses__group">
          <h3 class="uses__group-title">{{ t(group.titleKey) }}</h3>
          <ul class="uses__list">
            <li v-for="item in group.items" :key="item.name" class="uses__item">
              <div class="uses__item-left">
                <span class="uses__item-name">{{ item.name }}</span>
                <span v-if="item.detail" class="uses__item-detail">{{ item.detail }}</span>
              </div>
              <span v-if="item.tag" class="uses__pill" :style="`--pill: ${item.tagColor ?? 'rgba(59,130,246,.12)'};--pill-text: ${item.tagTextColor ?? 'var(--color-primary)'};--pill-border: ${item.tagBorderColor ?? 'rgba(59,130,246,.25)'}`">{{ item.tag }}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="uses__note">
        <a href="https://uses.tech" target="_blank" rel="noopener" class="uses__note-link">{{ t('uses.note') }}</a>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const groups = [
  {
    titleKey: 'uses.hardware',
    items: [
      { name: 'PC Gamer', detail: 'Ryzen 7 · 32GB RAM · RX 7600', tag: 'PRINCIPAL', tagColor: 'rgba(59,130,246,.1)', tagTextColor: 'var(--color-primary)', tagBorderColor: 'rgba(59,130,246,.25)' },
      { name: '3 monitores', detail: '32" curva · 28.5" HP 4K · 20" preview', tag: 'SETUP', tagColor: 'rgba(99,102,241,.1)', tagTextColor: '#818cf8', tagBorderColor: 'rgba(99,102,241,.25)' },
      { name: 'Razer Basilisk', detail: 'mouse', tag: 'PERIFÉRICO', tagColor: 'rgba(148,163,184,.08)', tagTextColor: 'var(--color-muted)', tagBorderColor: 'rgba(148,163,184,.2)' },
      { name: 'OMEN mecánico', detail: 'teclado gamer', tag: 'PERIFÉRICO', tagColor: 'rgba(148,163,184,.08)', tagTextColor: 'var(--color-muted)', tagBorderColor: 'rgba(148,163,184,.2)' },
      { name: 'ASUS VivoBook', detail: 'Ryzen 7 · 16GB — portátil', tag: 'PORTÁTIL', tagColor: 'rgba(14,165,233,.1)', tagTextColor: '#38bdf8', tagBorderColor: 'rgba(14,165,233,.25)' },
    ],
  },
  {
    titleKey: 'uses.editor',
    items: [
      { name: 'Cursor', detail: 'editor principal con IA', tag: 'PRINCIPAL', tagColor: 'rgba(59,130,246,.1)', tagTextColor: 'var(--color-primary)', tagBorderColor: 'rgba(59,130,246,.25)' },
      { name: 'Visual Studio Code', detail: '', tag: 'EDITOR', tagColor: 'rgba(99,102,241,.1)', tagTextColor: '#818cf8', tagBorderColor: 'rgba(99,102,241,.25)' },
      { name: 'Git Bash · Terminal', detail: 'línea de comandos', tag: 'TERMINAL', tagColor: 'rgba(148,163,184,.08)', tagTextColor: 'var(--color-muted)', tagBorderColor: 'rgba(148,163,184,.2)' },
      { name: 'DBeaver + TablePlus', detail: 'gestión de bases de datos', tag: 'DATABASES', tagColor: 'rgba(250,204,21,.08)', tagTextColor: '#fbbf24', tagBorderColor: 'rgba(250,204,21,.2)' },
      { name: 'Claude Code', detail: 'Anthropic', tag: 'AI', tagColor: 'rgba(34,197,94,.08)', tagTextColor: '#4ade80', tagBorderColor: 'rgba(34,197,94,.2)' },
    ],
  },
  {
    titleKey: 'uses.software',
    items: [
      { name: 'GitHub Copilot', detail: 'autocompletado IA', tag: 'AI', tagColor: 'rgba(34,197,94,.08)', tagTextColor: '#4ade80', tagBorderColor: 'rgba(34,197,94,.2)' },
      { name: 'Opera · Mozilla · Explorer', detail: 'cross-browser testing', tag: 'BROWSERS', tagColor: 'rgba(148,163,184,.08)', tagTextColor: 'var(--color-muted)', tagBorderColor: 'rgba(148,163,184,.2)' },
      { name: 'Notion', detail: 'docs y planning', tag: 'PLANNING', tagColor: 'rgba(99,102,241,.1)', tagTextColor: '#818cf8', tagBorderColor: 'rgba(99,102,241,.25)' },
      { name: 'GitHub', detail: 'control de versiones + CI/CD', tag: 'VCS', tagColor: 'rgba(148,163,184,.08)', tagTextColor: 'var(--color-muted)', tagBorderColor: 'rgba(148,163,184,.2)' },
    ],
  },
  {
    titleKey: 'uses.stack',
    items: [
      { name: 'NestJS + Nuxt 4', detail: 'backend + frontend principal', tag: 'CORE', tagColor: 'rgba(59,130,246,.1)', tagTextColor: 'var(--color-primary)', tagBorderColor: 'rgba(59,130,246,.25)' },
      { name: 'Docker + Compose', detail: 'contenedores y entornos', tag: 'INFRA', tagColor: 'rgba(14,165,233,.1)', tagTextColor: '#38bdf8', tagBorderColor: 'rgba(14,165,233,.25)' },
      { name: 'AWS + GitHub Actions', detail: 'cloud y CI/CD automatizado', tag: 'CLOUD', tagColor: 'rgba(250,204,21,.08)', tagTextColor: '#fbbf24', tagBorderColor: 'rgba(250,204,21,.2)' },
      { name: 'PostgreSQL · MySQL · MongoDB · Redis', detail: 'bases de datos', tag: 'DATA', tagColor: 'rgba(34,197,94,.08)', tagTextColor: '#4ade80', tagBorderColor: 'rgba(34,197,94,.2)' },
    ],
  },
]
</script>

<style scoped>
.uses {
  padding: 120px 40px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
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
  grid-template-columns: repeat(4, 1fr);
  gap: 40px 32px;
}
@media (max-width: 1024px) {
  .uses__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .uses__grid { grid-template-columns: 1fr; }
}

.uses__group-title {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.uses__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.uses__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.uses__item-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.uses__item-name {
  font-size: 13px;
  color: var(--color-text);
  font-weight: 500;
  line-height: 1.3;
}

.uses__item-detail {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  line-height: 1.3;
}

.uses__pill {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  color: var(--pill-text);
  background: var(--pill);
  border: 1px solid var(--pill-border);
  padding: 3px 7px;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}

.uses__note {
  margin-top: 48px;
  font-family: var(--font-mono);
  font-size: 11px;
}
.uses__note-link {
  color: var(--color-muted);
  text-decoration: none;
  opacity: 0.55;
  transition: opacity .2s ease, color .2s ease;
}
.uses__note-link:hover {
  color: var(--color-primary);
  opacity: 1;
}

@media (max-width: 768px) {
  .uses { padding: 80px 20px; }
}
</style>
