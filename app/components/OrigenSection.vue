<template>
  <section id="origen" class="origen">
    <div class="origen__inner">
      <div class="section-eyebrow">{{ t('origen.eyebrow') }}</div>
      <h2 class="section-title">{{ t('origen.title') }}</h2>
      <p class="origen__lead">{{ t('origen.lead') }}</p>

      <div class="origen__timeline">
        <div
          v-for="(entry, i) in entries"
          :key="entry.year"
          class="origen__entry"
          :style="`--entry-color: ${entry.color}`"
        >
          <!-- Left: dot + line -->
          <div class="origen__connector">
            <div class="origen__dot" />
            <div v-if="i < entries.length - 1" class="origen__line" />
          </div>

          <!-- Right: content -->
          <div class="origen__content">
            <div class="origen__meta">
              <span class="origen__year">{{ entry.year }}</span>
              <span class="origen__tag">{{ locale === 'es' ? entry.tag.es : entry.tag.en }}</span>
            </div>
            <h3 class="origen__entry-title">{{ locale === 'es' ? entry.title.es : entry.title.en }}</h3>
            <p class="origen__entry-desc">{{ locale === 'es' ? entry.desc.es : entry.desc.en }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t, locale } = useLocale()

const entries = [
  {
    year: '2018',
    color: '#0EA5E9',
    tag: { es: 'INICIO', en: 'START' },
    title: {
      es: 'Frontend desde cero.',
      en: 'Frontend from scratch.',
    },
    desc: {
      es: 'Primer empleo como desarrollador. Tickets cortos, sprints de un día. Aprendí HTML, CSS y JavaScript bajo presión real. Sin mentores, sin bootcamp — solo entregar.',
      en: 'First job as a developer. Short tickets, one-day sprints. Learned HTML, CSS and JavaScript under real pressure. No mentors, no bootcamp — just deliver.',
    },
  },
  {
    year: '2019',
    color: '#3B82F6',
    tag: { es: 'CRECER', en: 'GROW' },
    title: {
      es: 'Fullstack — cuatro años construyendo sistemas reales.',
      en: 'Fullstack — four years building real systems.',
    },
    desc: {
      es: 'Pasé del frontend al fullstack construyendo CRMs, integraciones con GLPI y sistemas de control de tiempos. Entendí qué significa que un código sobreviva años en producción — y que tú no estés ahí para defenderlo.',
      en: 'I moved from frontend to fullstack building CRMs, GLPI integrations and time-tracking systems. I learned what it means for code to survive years in production — without you there to defend it.',
    },
  },
  {
    year: '2022',
    color: '#FACC15',
    tag: { es: 'DOMINAR', en: 'MASTER' },
    title: {
      es: 'Perfil fullstack consolidado.',
      en: 'Consolidated fullstack profile.',
    },
    desc: {
      es: 'AWS, Docker, CI/CD, Clean Architecture. Para 2022 el stack era completo: Laravel, Node, React, Angular, PostgreSQL, MySQL, MongoDB, Redis. De generalista a especialista sin dejar de ser versátil.',
      en: 'AWS, Docker, CI/CD, Clean Architecture. By 2022 the stack was complete: Laravel, Node, React, Angular, PostgreSQL, MySQL, MongoDB, Redis. From generalist to specialist without losing versatility.',
    },
  },
  {
    year: '2023',
    color: '#22C55E',
    tag: { es: 'SALIR SOLO', en: 'GO SOLO' },
    title: {
      es: 'Primer cliente directo: Soy Cultura.',
      en: 'First direct client: Soy Cultura.',
    },
    desc: {
      es: 'La Alcaldía de Bogotá como primer cliente freelance directo. Proyecto público, alta visibilidad. Confirmó que podía entregar sin red de seguridad — y que la arquitectura importa cuando el mundo mira.',
      en: "Bogotá City Hall as first direct freelance client. Public project, high visibility. Confirmed I could deliver without a safety net — and that architecture matters when the world is watching.",
    },
  },
  {
    year: '2024',
    color: '#6366F1',
    tag: { es: 'FOUNDER', en: 'FOUNDER' },
    title: {
      es: 'Kubo S.A.S. + One Lesson Per Day.',
      en: 'Kubo S.A.S. + One Lesson Per Day.',
    },
    desc: {
      es: 'Desarrollador principal en Kubo S.A.S. y fundador de mi propio producto. Dos velocidades simultáneas: entregar para clientes y construir para el largo plazo. Microservicios, integración de IA, diseño de sistemas complejos.',
      en: 'Lead developer at Kubo S.A.S. and founder of my own product. Two simultaneous speeds: delivering for clients and building for the long term. Microservices, AI integration, complex system design.',
    },
  },
]
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
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
}
.origen__lead {
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-muted);
  margin: 0 0 72px 0;
  max-width: 600px;
}

.origen__timeline {
  max-width: 820px;
  display: flex;
  flex-direction: column;
}

.origen__entry {
  display: grid;
  grid-template-columns: 28px 1fr;
  gap: 0 28px;
}

/* Dot + line column */
.origen__connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 6px;
}

.origen__dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--entry-color);
  box-shadow: 0 0 12px color-mix(in srgb, var(--entry-color) 50%, transparent);
  flex-shrink: 0;
  border: 2px solid color-mix(in srgb, var(--entry-color) 40%, #0F172A);
}

.origen__line {
  width: 2px;
  flex: 1;
  min-height: 40px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--entry-color) 35%, transparent),
    color-mix(in srgb, var(--entry-color) 8%, transparent)
  );
  margin: 8px 0;
}

/* Content column */
.origen__content {
  padding-bottom: 56px;
}
.origen__entry:last-child .origen__content {
  padding-bottom: 0;
}

.origen__meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.origen__year {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  color: var(--entry-color);
  letter-spacing: -0.03em;
  line-height: 1;
}

.origen__tag {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--entry-color);
  background: color-mix(in srgb, var(--entry-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--entry-color) 25%, transparent);
  padding: 4px 10px;
  border-radius: 9999px;
}

.origen__entry-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0 0 10px 0;
  letter-spacing: -0.01em;
}

.origen__entry-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-muted);
  margin: 0;
  max-width: 640px;
}

@media (max-width: 768px) {
  .origen { padding: 80px 20px; }
  .origen__entry { gap: 0 16px; }
  .origen__year { font-size: 1.5rem; }
  .origen__entry-title { font-size: 17px; }
  .origen__entry-desc { font-size: 14px; }
}
</style>
