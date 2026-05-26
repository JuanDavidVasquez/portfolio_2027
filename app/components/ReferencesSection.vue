<template>
  <section id="referencias" class="refs">
    <div class="refs__inner">
      <div class="section-eyebrow">{{ t('refs.eyebrow') }}</div>
      <h2 class="section-title">{{ t('refs.title') }}</h2>
      <p class="refs__lead">{{ t('refs.lead') }}</p>

      <!-- Company logos marquee -->
      <div class="refs__logos-section">
        <div class="refs__collaborated-label">{{ t('refs.collaborated') }}</div>
        <div class="refs__logos-track-wrap">
          <div class="refs__logos-track">
            <div
              v-for="co in [...companies, ...companies]"
              :key="`${co.abbr}-${Math.random()}`"
              class="refs__logo-pill"
            >
              <span class="refs__logo-abbr">{{ co.abbr }}</span>
              <span class="refs__logo-name">{{ co.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials grid -->
      <div class="refs__grid">
        <article v-for="ref in testimonials" :key="ref.initials" class="ref-card">
          <blockquote class="ref-card__quote">
            <span class="ref-card__quote-mark">"</span>
            {{ locale === 'es' ? ref.quote.es : ref.quote.en }}
          </blockquote>

          <footer class="ref-card__footer">
            <div class="ref-card__avatar" :style="`--av-color: ${ref.color}`">
              {{ ref.initials }}
            </div>
            <div class="ref-card__info">
              <span class="ref-card__name">{{ ref.name }}</span>
              <span class="ref-card__role">{{ ref.role }}</span>
            </div>
            <span class="ref-card__badge">{{ t('refs.verified') }}</span>
          </footer>
        </article>
      </div>

      <p class="refs__disclaimer">{{ t('refs.disclaimer') }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()

const companies = [
  { abbr: 'PA', name: 'PrismApps' },
  { abbr: 'VC', name: 'Vector Co.' },
  { abbr: 'NW', name: 'Nubeware' },
  { abbr: 'ST', name: 'Stack Studio' },
  { abbr: 'CA', name: 'CodeArc' },
  { abbr: 'OD', name: 'OrbitalDev' },
  { abbr: 'NS', name: 'NovaSoft' },
  { abbr: 'LL', name: 'Lumen Labs' },
]

const testimonials = [
  {
    initials: 'CM',
    color: '#3B82F6',
    name: 'Carolina M.',
    role: 'Engineering Manager · Nubeware',
    quote: {
      es: 'Juan tiene una rara combinación: piensa en arquitectura como un senior y entrega como una máquina. Lideró el rediseño de nuestra API de notificaciones y nos ahorró meses de deuda técnica.',
      en: 'Juan has a rare combination: he thinks in architecture like a senior and delivers like a machine. He led the redesign of our notification API and saved us months of technical debt.',
    },
  },
  {
    initials: 'AR',
    color: '#6366F1',
    name: 'Andrés R.',
    role: 'CTO · Stack Studio',
    quote: {
      es: 'Trabajar con Juan fue refrescante. Documenta, propone alternativas y empuja por buenas prácticas sin volverse insufrible. El backend que dejó sigue corriendo dos años después sin tocarlo.',
      en: 'Working with Juan was refreshing. He documents, proposes alternatives and pushes for best practices without being insufferable. The backend he left is still running two years later untouched.',
    },
  },
  {
    initials: 'MP',
    color: '#0EA5E9',
    name: 'Marcela P.',
    role: 'Product Lead · CodeArc',
    quote: {
      es: 'Lo contraté para un proyecto puntual de integración con AWS y terminamos extendiendo el contrato dos veces. Comunicación clara, deadlines respetados, código limpio. Lo recomendaría sin dudarlo.',
      en: 'I hired him for a one-off AWS integration project and ended up extending the contract twice. Clear communication, deadlines met, clean code. I would recommend him without hesitation.',
    },
  },
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
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}
.refs__lead {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-muted);
  margin: 0 0 56px 0;
}

/* Logos section */
.refs__logos-section {
  margin-bottom: 64px;
}

.refs__collaborated-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.refs__logos-track-wrap {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
}

.refs__logos-track {
  display: flex;
  gap: 12px;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.refs__logos-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.refs__logo-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 8px 16px 8px 10px;
  white-space: nowrap;
  transition: border-color .2s ease;
}
.refs__logo-pill:hover {
  border-color: rgba(59,130,246,.4);
}

.refs__logo-abbr {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--color-primary);
  background: rgba(59,130,246,.12);
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.refs__logo-name {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

/* Testimonials grid */
.refs__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
@media (max-width: 900px) {
  .refs__grid { grid-template-columns: 1fr; }
}

.ref-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 28px 26px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: border-color .3s ease, box-shadow .3s ease;
}
.ref-card:hover {
  border-color: rgba(59,130,246,.3);
  box-shadow: 0 0 24px rgba(59,130,246,.07);
}

.ref-card__quote {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  font-style: normal;
  margin: 0;
  flex: 1;
  position: relative;
}

.ref-card__quote-mark {
  font-family: var(--font-display);
  font-size: 64px;
  font-weight: 900;
  color: var(--color-primary);
  opacity: 0.15;
  position: absolute;
  top: -12px;
  left: -6px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.ref-card__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 18px;
  flex-wrap: wrap;
}

.ref-card__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--av-color) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--av-color) 35%, transparent);
  color: var(--av-color);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ref-card__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.ref-card__name {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ref-card__role {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ref-card__badge {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 1px;
  color: #22C55E;
  background: rgba(34,197,94,.1);
  border: 1px solid rgba(34,197,94,.25);
  padding: 3px 8px;
  border-radius: 9999px;
  white-space: nowrap;
  align-self: flex-start;
}

/* Disclaimer */
.refs__disclaimer {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
  opacity: 0.6;
  margin: 0;
}

@media (max-width: 768px) {
  .refs { padding: 80px 20px; }
}
</style>
