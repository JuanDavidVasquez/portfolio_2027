<template>
  <ClientOnly>
    <Teleport to="body">
      <button
        class="gravity-fab"
        :class="{ 'gravity-fab--active': isActive }"
        :aria-label="isActive ? 'Cerrar' : 'Activar gravedad'"
        @click="toggle"
      >
        <svg v-if="!isActive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none" />
          <line x1="12" y1="9" x2="12" y2="17" />
          <polyline points="9 14 12 18 15 14" />
          <line x1="5" y1="21" x2="19" y2="21" stroke-width="1.2" stroke-dasharray="2 2" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
const GRAVITY      = 0.68
const BOUNCE       = 0.35
const DAMPING      = 0.992
const VROT_DAMPING = 0.96

const CHIPS = [
  { label: 'Vue.js',      color: '#41b883', bg: 'rgba(65,184,131,0.10)'  },
  { label: 'Nuxt 4',      color: '#00dc82', bg: 'rgba(0,220,130,0.10)'   },
  { label: 'TypeScript',  color: '#3b82f6', bg: 'rgba(59,130,246,0.10)'  },
  { label: 'NestJS',      color: '#e0234e', bg: 'rgba(224,35,78,0.10)'   },
  { label: 'Node.js',     color: '#6dbf47', bg: 'rgba(109,191,71,0.10)'  },
  { label: 'AWS',         color: '#ff9900', bg: 'rgba(255,153,0,0.10)'   },
  { label: 'Tailwind',    color: '#38bdf8', bg: 'rgba(56,189,248,0.10)'  },
  { label: 'PostgreSQL',  color: '#7c6af7', bg: 'rgba(124,106,247,0.10)' },
  { label: 'Docker',      color: '#2496ed', bg: 'rgba(36,150,237,0.10)'  },
  { label: 'Figma',       color: '#f24e1e', bg: 'rgba(242,78,30,0.10)'   },
]

interface Particle {
  el:      HTMLElement
  origY:   number   // posición fija de inicio (sobre el viewport)
  y:       number   // offset acumulado desde origY
  vy:      number
  rot:     number
  vrot:    number
  floor:   number   // distancia máxima de caída (hasta el suelo)
  settled: boolean
  startAt: number   // timestamp de inicio de caída (stagger)
}

const isActive = ref(false)
let particles: Particle[]            = []
let rafId:     number | null         = null
let overlay:   HTMLDivElement | null = null
let stage:     HTMLDivElement | null = null
let restoring  = false

function activate() {
  // Backdrop oscuro
  overlay = document.createElement('div')
  overlay.style.cssText = [
    'position:fixed', 'inset:0',
    'background:rgba(5,8,20,0.94)',
    'z-index:7998',
    'opacity:0',
    'transition:opacity .4s ease',
    'cursor:pointer',
  ].join(';')
  overlay.addEventListener('click', () => { if (!restoring) deactivate() })
  document.body.appendChild(overlay)
  requestAnimationFrame(() => { if (overlay) overlay.style.opacity = '1' })

  // Contenedor de chips
  stage = document.createElement('div')
  stage.style.cssText = 'position:fixed;inset:0;z-index:7999;pointer-events:none;overflow:hidden;'

  // Línea de suelo sutil
  const floorLine = document.createElement('div')
  floorLine.style.cssText = [
    'position:absolute',
    'bottom:32px',
    'left:4%', 'right:4%',
    'height:1px',
    'background:linear-gradient(90deg,transparent,rgba(148,163,184,.2) 15%,rgba(148,163,184,.2) 85%,transparent)',
    'opacity:0',
    'transition:opacity .5s .4s ease',
  ].join(';')
  stage.appendChild(floorLine)
  document.body.appendChild(stage)
  requestAnimationFrame(() => { floorLine.style.opacity = '1' })

  const vh  = window.innerHeight
  const vw  = window.innerWidth
  const now = performance.now()

  // Distribuir chips en filas de 5 para que quepan bien en cualquier pantalla
  const ROW_SIZE  = 5
  const floorY    = vh - 60   // posición absoluta del suelo (top del chip en el suelo)

  particles = CHIPS.map((chip, i) => {
    const row     = Math.floor(i / ROW_SIZE)
    const col     = i % ROW_SIZE
    const colsInRow = Math.min(ROW_SIZE, CHIPS.length - row * ROW_SIZE)

    // Crear elemento chip
    const el = document.createElement('div')
    el.style.cssText = [
      'position:absolute',
      'display:inline-flex',
      'align-items:center',
      'gap:8px',
      'padding:9px 18px',
      `background:${chip.bg}`,
      `border:1px solid ${chip.color}50`,
      'border-radius:99px',
      `color:${chip.color}`,
      'font-size:13px',
      'font-weight:500',
      'letter-spacing:.04em',
      'font-family:inherit',
      'white-space:nowrap',
      'backdrop-filter:blur(12px)',
      '-webkit-backdrop-filter:blur(12px)',
      `box-shadow:0 2px 20px ${chip.color}18, inset 0 1px 0 rgba(255,255,255,.05)`,
      'will-change:top,transform',
      'pointer-events:none',
      'user-select:none',
    ].join(';')

    const dot = document.createElement('span')
    dot.style.cssText = `display:inline-block;width:6px;height:6px;border-radius:50%;background:${chip.color};flex-shrink:0;box-shadow:0 0 6px ${chip.color}80;`
    el.appendChild(dot)

    const lbl = document.createElement('span')
    lbl.textContent = chip.label
    el.appendChild(lbl)

    stage!.appendChild(el)

    // Medir para posicionar correctamente
    const chipW = el.offsetWidth  || 110
    const chipH = el.offsetHeight || 38

    // Distribuir x con margen y centrado por fila
    const totalRowWidth = colsInRow * chipW + (colsInRow - 1) * 16
    const startX        = Math.max(16, (vw - totalRowWidth) / 2)
    const x             = startX + col * (chipW + 16)

    // Cada fila empieza en alturas distintas sobre el viewport
    const origY   = -(chipH + 20 + row * (chipH + 10) + i * 8)
    const floorDist = floorY - origY   // distancia total de caída

    el.style.left = `${x}px`
    el.style.top  = `${origY}px`

    return {
      el,
      origY,
      y: 0,
      vy: 0,
      rot: 0,
      // dirección alternada + variación por posición para que no giren igual
      vrot: (col % 2 === 0 ? 1 : -1) * (0.5 + (i % 4) * 0.35),
      floor:   floorDist,
      settled: false,
      startAt: now + i * 80,
    }
  })

  function tick(ts: number) {
    let allDone = true

    for (const p of particles) {
      if (p.settled) continue
      if (ts < p.startAt) { allDone = false; continue }

      allDone = false

      p.vy   += GRAVITY
      p.vy   *= DAMPING
      p.y    += p.vy
      p.vrot *= VROT_DAMPING
      p.rot  += p.vrot

      if (p.y >= p.floor) {
        p.y    = p.floor
        p.vy   = -(p.vy * BOUNCE)
        p.vrot *= -0.28

        if (Math.abs(p.vy) < 0.5) {
          p.vy      = 0
          p.vrot    = 0
          p.settled = true
          // pequeño glow al asentarse
          p.el.style.boxShadow = p.el.style.boxShadow.replace('18', '35')
        }
      }

      p.el.style.top       = `${p.origY + p.y}px`
      p.el.style.transform = `rotate(${p.rot}deg)`
    }

    rafId = allDone ? null : requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
}

function deactivate() {
  if (restoring) return
  restoring = true

  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null }

  // Uno por uno: cada chip es jalado hacia arriba y desvanecido
  // ease-in puro: empieza lento y acelera → sensación de fuerza gravitatoria jalando
  particles.forEach((p, i) => {
    setTimeout(() => {
      p.el.style.transition = [
        'top 0.52s cubic-bezier(0.55, 0, 1, 0.45)',
        'transform 0.4s cubic-bezier(0.55, 0, 1, 0.45)',
        'opacity 0.28s 0.08s ease',
      ].join(',')
      p.el.style.top       = `${p.origY - 20}px`   // va más arriba del origen
      p.el.style.transform = 'rotate(0deg) scale(0.9)'
      p.el.style.opacity   = '0'
    }, i * 160)
  })

  const cleanupAt = particles.length * 160 + 620

  setTimeout(() => {
    stage?.remove();   stage   = null
    particles = []

    if (overlay) {
      overlay.style.opacity = '0'
      const o = overlay; overlay = null
      setTimeout(() => o.remove(), 400)
    }

    restoring      = false
    isActive.value = false
  }, cleanupAt)
}

function toggle() {
  if (restoring) return
  if (!isActive.value) { isActive.value = true; activate() }
  else                 { deactivate() }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && isActive.value && !restoring) deactivate()
}

onMounted(()        => document.addEventListener('keydown', onKey))
onBeforeUnmount(()  => {
  document.removeEventListener('keydown', onKey)
  if (isActive.value) deactivate()
})
</script>

<style>
.gravity-fab {
  position: fixed;
  right: 24px;
  bottom: 88px;
  z-index: 9999;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(148,163,184,.25);
  background: rgba(15,23,42,.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color .25s ease, background .25s ease, color .25s ease,
              transform .2s ease, box-shadow .25s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,.35);
}
.gravity-fab svg {
  width: 20px;
  height: 20px;
  transition: transform .35s cubic-bezier(.3,.7,.3,1);
}
.gravity-fab:hover {
  border-color: var(--color-primary, #3b82f6);
  color: var(--color-primary, #3b82f6);
  background: rgba(59,130,246,.12);
  box-shadow: 0 0 0 3px rgba(59,130,246,.15), 0 4px 24px rgba(0,0,0,.35);
}
.gravity-fab:hover svg   { transform: translateY(3px); }
.gravity-fab:active      { transform: scale(.92); }

.gravity-fab--active {
  border-color: #f59e0b;
  color: #f59e0b;
  background: rgba(245,158,11,.12);
  box-shadow: 0 0 0 3px rgba(245,158,11,.2), 0 4px 24px rgba(0,0,0,.35);
}
.gravity-fab--active:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  background: rgba(245,158,11,.2);
  box-shadow: 0 0 0 3px rgba(245,158,11,.25), 0 4px 24px rgba(0,0,0,.35);
}
.gravity-fab--active svg { transform: none !important; }
</style>
