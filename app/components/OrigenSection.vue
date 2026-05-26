<template>
  <section id="origen" class="origen">
    <div class="origen__inner">
      <div class="section-eyebrow">{{ t('origen.eyebrow') }}</div>
      <h2 class="section-title">{{ t('origen.title') }}</h2>
      <p v-if="t('origen.lead')" class="origen__lead">{{ t('origen.lead') }}</p>

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
            <template v-if="Array.isArray(entry.desc)">
              <p
                v-for="(para, pi) in entry.desc"
                :key="pi"
                class="origen__entry-desc"
                :class="{ 'origen__entry-desc--spaced': pi > 0 }"
              >{{ locale === 'es' ? para.es : para.en }}</p>
            </template>
            <p v-else class="origen__entry-desc">{{ locale === 'es' ? entry.desc.es : entry.desc.en }}</p>
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
    tag: { es: 'INICIO', en: 'BEGINNINGS' },
    title: {
      es: 'Frontend desde cero.',
      en: 'Frontend from scratch.',
    },
    desc: {
      es: 'Primer empleo. Tickets cortos, sprints de un día. Nadie explicaba dos veces — o entendías en producción o entendías tarde. Todo aprendido a golpes — videos, Udemy, ensayo y error, y el error mismo como maestro. Nadie esperaba que supieras; esperaban que entregaras. Y entregué.',
      en: 'First job. Short tickets, one-day sprints. No one explained things twice — you either figured it out in production or you figured it out too late. Everything learned the hard way — videos, Udemy, trial and error, and the errors themselves as teachers. No one expected you to already know; they expected you to deliver. And I delivered.',
    },
  },
  {
    year: '2019',
    color: '#3B82F6',
    tag: { es: 'CRECER', en: 'GROWING' },
    title: {
      es: 'Del frontend al sistema completo.',
      en: 'From frontend to full system.',
    },
    desc: {
      es: 'Durante cuatro años construí CRMs, integraciones y sistemas de gestión en entornos reales de empresa. Fue ahí donde entendí que el código no se escribe para hoy — se escribe para el equipo que lo va a mantener cuando tú ya no estés en la sala.',
      en: "Over four years I built CRMs, integrations, and management systems in real enterprise environments. That's where I understood that code isn't written for today — it's written for the team that will maintain it long after you've left the room.",
    },
  },
  {
    year: '2022',
    color: '#FACC15',
    tag: { es: 'CRITERIO', en: 'JUDGMENT' },
    title: {
      es: 'De saber hacer a saber decidir.',
      en: 'From knowing how to knowing why.',
    },
    desc: {
      es: 'Con el stack consolidado llegó una pregunta más difícil: no qué tecnología usar, sino cuándo y por qué. AWS, arquitectura limpia, CI/CD — no como buzzwords, sino como decisiones con consecuencias reales. Aprendí a ser especialista sin perder la visión de conjunto.',
      en: 'Once the stack was solid, a harder question emerged: not which technology to use, but when and why. AWS, clean architecture, CI/CD — not as buzzwords, but as decisions with real consequences. I learned to become a specialist without losing sight of the whole picture.',
    },
  },
  {
    year: '2023',
    color: '#22C55E',
    tag: { es: 'SALIR SOLO', en: 'GOING SOLO' },
    title: {
      es: 'Primer cliente directo: Soy Cultura.',
      en: 'First direct client: Soy Cultura.',
    },
    desc: {
      es: 'La Alcaldía de Bogotá como primer proyecto freelance independiente — una plataforma cultural de ciudad, con usuarios reales y exposición institucional. Sin empresa detrás, sin margen de error visible. Confirmó algo importante: que la arquitectura importa especialmente cuando el cliente es el sector público y el mundo puede mirar.',
      en: "The City of Bogotá as my first independent freelance project — a city-scale cultural platform, with real users and institutional visibility. No company behind me, no safety net. It confirmed something important: architecture matters most when the client is the public sector and the world can see the result.",
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
      es: 'Desarrollador principal en Kubo S.A.S. y fundador de mi propio producto en paralelo. Dos velocidades simultáneas: entregar para clientes y construir para el largo plazo. Integración de pasarelas de pago — Bold, Avalpay, PayPal — en sistemas productivos. Arquitectura de microservicios e integración de IA aplicada a productos reales. El año en que el perfil técnico se convirtió también en visión de negocio.',
      en: 'Lead developer at Kubo S.A.S. and founder of my own product at the same time. Two speeds simultaneously: delivering for clients and building for the long term. Payment gateway integrations — Bold, Avalpay, PayPal — in production systems. Microservices architecture and applied AI integration in real products. The year my technical profile became business vision as well.',
    },
  },
  {
    year: '2025',
    color: '#F97316',
    tag: { es: 'A ESCALA', en: 'AT SCALE' },
    title: {
      es: 'IA aplicada, infraestructura propia, sistemas que piensan.',
      en: 'Applied AI, owned infrastructure, systems that think.',
    },
    desc: {
      es: 'Integración profunda de Gemini para análisis agrícola inteligente — identificación de enfermedades, plagas, malezas y características morfológicas de plantas mediante visión artificial. El sistema no solo detecta: cruza el diagnóstico con el catálogo de productos del cliente y entrega recomendaciones comerciales precisas. IA aplicada directamente al campo, con impacto real en la toma de decisiones del agricultor. Chats con historial usando GPT. OCR con AWS Textract para el proyecto JAC de la Gobernación de Cundinamarca. Configuración completa de servidores AWS: instancias, dominios, certificados SSL, entornos de staging y producción. Y un cambio de fondo en el flujo de trabajo: adopción de agentes de IA — Claude Code, Cursor — para construir más rápido sin sacrificar criterio.',
      en: "Deep integration of Gemini for intelligent agricultural analysis — identifying diseases, pests, weeds, and morphological plant characteristics through computer vision. The system doesn't just detect: it cross-references the diagnosis with the client's product catalog and delivers precise commercial recommendations. AI applied directly to the field, with real impact on farmers' decision-making. Conversation history chats using GPT. OCR with AWS Textract for the JAC project at the Gobernación de Cundinamarca. Full AWS server configuration: instances, domains, SSL certificates, staging and production environments. And a fundamental shift in workflow: adoption of AI agents — Claude Code, Cursor — to build faster without sacrificing judgment.",
    },
  },
  {
    year: '2026',
    color: '#E11D48',
    tag: { es: 'PRESENTE', en: 'PRESENT' },
    title: {
      es: 'El momento en que todo lo aprendido encuentra su contexto.',
      en: 'The moment when everything learned finds its context.',
    },
    desc: [
      {
        es: 'El desarrollo de software está atravesando una ruptura real. Los agentes de IA no son una herramienta más — están redefiniendo quién construye, cómo se construye y a qué velocidad. El código que antes tomaba semanas hoy toma días. El perfil que sobrevive — y lidera — no es el que más líneas escribe, sino el que mejor entiende sistemas, toma decisiones de arquitectura y sabe exactamente qué pedirle a una máquina y qué no delegarle.',
        en: "Software development is going through a real rupture. AI agents aren't just another tool — they're redefining who builds, how things are built, and at what speed. What used to take weeks now takes days. The profile that survives — and leads — isn't the one that writes the most lines, but the one that best understands systems, makes architecture decisions, and knows exactly what to delegate to a machine and what not to.",
      },
      {
        es: 'Seis años construyendo en condiciones reales — sin red, sin mentores, con criterio ganado a golpes — resultan ser exactamente la base que este momento exige. No llego a la revolución de los agentes a aprenderla: llego a aplicarla. Con infraestructura propia, integraciones de IA en producción, visión de producto y la capacidad de moverme entre el código y el negocio sin perder ninguno de los dos.',
        en: "Six years building under real conditions — no safety net, no mentors, with judgment earned the hard way — turns out to be exactly the foundation this moment demands. I'm not arriving at the agent revolution to learn it: I'm arriving to apply it. With owned infrastructure, AI integrations in production, product vision, and the ability to move between code and business without losing either.",
      },
      {
        es: 'El futuro del desarrollo es de quienes entienden el problema antes de escribir la primera línea. Ese siempre fue el trabajo. Ahora simplemente es más visible.',
        en: 'The future of development belongs to those who understand the problem before writing the first line. That was always the job. Now it\'s just more visible.',
      },
    ],
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
.origen__entry-desc--spaced {
  margin-top: 14px;
}

@media (max-width: 768px) {
  .origen { padding: 80px 20px; }
  .origen__entry { gap: 0 16px; }
  .origen__year { font-size: 1.5rem; }
  .origen__entry-title { font-size: 17px; }
  .origen__entry-desc { font-size: 14px; }
}
</style>
