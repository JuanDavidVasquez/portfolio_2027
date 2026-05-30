<template>
  <section id="inicio" class="hero">
    <canvas ref="canvasEl" class="hero__canvas" />

    <!-- Floating code symbols background decoration -->
    <div ref="symbolsEl" class="hero__symbols" aria-hidden="true">
      <span v-for="sym in SYMBOLS" :key="sym + Math.random()" class="hero__symbol">{{ sym }}</span>
    </div>

    <div class="hero__content">
      <div ref="badgeEl" class="hero__badge">
        <span class="hero__badge-dot" />
        {{ t('hero.available') }}
      </div>

      <h1 ref="nameEl" class="hero__name">Juan Vasquez</h1>

      <p ref="taglineEl" class="hero__tagline">&gt; {{ t('hero.tagline') }}</p>

      <div ref="ctasEl" class="hero__ctas">
        <a href="#proyectos" class="btn btn--primary">{{ t('hero.cta1') }} →</a>
        <a href="#contacto" class="btn btn--secondary">{{ t('hero.cta2') }}</a>
      </div>
    </div>

    <div ref="scrollHintEl" class="hero__scroll-hint">scroll ↓</div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const SYMBOLS = [
  '</>', '{ }', 'const', '=>', 'async', 'await',
  'npm i', 'fn()', '&&', '0xFF', 'interface',
  '[ ]', 'return', 'null', 'type', '||', '...',
]

const canvasEl     = useTemplateRef<HTMLCanvasElement>('canvasEl')
const symbolsEl    = useTemplateRef<HTMLElement>('symbolsEl')
const badgeEl      = useTemplateRef<HTMLElement>('badgeEl')
const nameEl       = useTemplateRef<HTMLElement>('nameEl')
const taglineEl    = useTemplateRef<HTMLElement>('taglineEl')
const ctasEl       = useTemplateRef<HTMLElement>('ctasEl')
const scrollHintEl = useTemplateRef<HTMLElement>('scrollHintEl')

let _raf = 0
let _resizeFn = () => {}
const _timelines: Array<{ kill(): void }> = []

onMounted(async () => {
  // ── Canvas: shooting-star animation ───────────────────────────────
  const canvas = canvasEl.value!
  const ctx    = canvas.getContext('2d')!

  _resizeFn = () => {
    canvas.width  = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  _resizeFn()
  window.addEventListener('resize', _resizeFn)

  class Star {
    x = 0; y = 0; length = 0; speed = 0; size = 0
    constructor() { this.reset() }
    reset() {
      this.x      = Math.random() * canvas.width
      this.y      = Math.random() * canvas.height / 2
      this.length = Math.random() * 80 + 10
      this.speed  = Math.random() * 10 + 6
      this.size   = Math.random() * 2 + 1
    }
    update() {
      this.x += this.speed
      this.y += this.speed / 2
      if (this.x > canvas.width || this.y > canvas.height) this.reset()
    }
    draw() {
      const g = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y - this.length / 2)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.strokeStyle = g
      ctx.lineWidth   = this.size
      ctx.moveTo(this.x, this.y)
      ctx.lineTo(this.x - this.length, this.y - this.length / 2)
      ctx.stroke()
    }
  }

  const stars = Array.from({ length: 24 }, () => new Star())
  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(s => { s.update(); s.draw() })
    _raf = requestAnimationFrame(loop)
  }
  loop()

  // ── GSAP ──────────────────────────────────────────────────────────
  const { gsap } = await import('gsap')

  // Hero content entrance timeline
  const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  entranceTl
    .from(badgeEl.value!,      { opacity: 0, y: 20, duration: 0.7 }, 0.2)
    .from(nameEl.value!,       { opacity: 0, y: 60, duration: 1.1 }, 0.5)
    .from(taglineEl.value!,    { opacity: 0, y: 30, duration: 0.8 }, 1.05)
    .from(ctasEl.value!,       { opacity: 0, y: 20, duration: 0.7 }, 1.5)
    .from(scrollHintEl.value!, { opacity: 0, duration: 0.6        }, 2.1)
  _timelines.push(entranceTl)

  // Floating symbols: staggered looping float upward
  symbolsEl.value!.querySelectorAll<HTMLElement>('.hero__symbol').forEach((el) => {
    const left    = 2 + Math.random() * 86        // 2–88 % from left
    const startPct = 22 + Math.random() * 52      // 22–74 % from top
    const drift   = 14 + Math.random() * 22       // how many % to float up
    const dur     = 10 + Math.random() * 8        // 10–18 s per loop
    const delay   = Math.random() * 8             // stagger start
    const alpha   = 0.10 + Math.random() * 0.10  // 10–20 % opacity

    gsap.set(el, { left: `${left}%`, top: `${startPct}%`, opacity: 0 })

    const symTl = gsap.timeline({ repeat: -1, delay, repeatDelay: Math.random() * 5 + 1 })
    symTl
      .to(el, { opacity: alpha, duration: dur * 0.18, ease: 'power1.in' })
      .to(el, { top: `${startPct - drift}%`, duration: dur, ease: 'none' }, 0)
      .to(el, { opacity: 0, duration: dur * 0.22, ease: 'power1.out' }, `>-${dur * 0.22}`)
      .set(el, { top: `${startPct}%` })
    _timelines.push(symTl)
  })
})

onUnmounted(() => {
  cancelAnimationFrame(_raf)
  window.removeEventListener('resize', _resizeFn)
  _timelines.forEach(tl => tl.kill())
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--grad-hero);
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* ── Floating symbols ─────────────────────────────────────────── */
.hero__symbols {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}
.hero__symbol {
  position: absolute;
  font-family: var(--font-mono);
  font-size: clamp(0.6rem, 1.1vw, 0.9rem);
  color: rgba(147, 197, 253, 1);
  user-select: none;
  white-space: nowrap;
  opacity: 0;
  letter-spacing: 0.5px;
}

/* ── Content ──────────────────────────────────────────────────── */
.hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 1100px;
  padding: 0 24px;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 9999px;
  border: 1px solid rgba(59,130,246,.4);
  background: rgba(59,130,246,.1);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-heading);
  margin-bottom: 32px;
}

.hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22C55E;
  box-shadow: 0 0 8px #22C55E;
  flex-shrink: 0;
  animation: jv-pulse 2s ease-in-out infinite;
}

.hero__name {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3rem, 10vw, 9rem);
  line-height: 1;
  color: var(--color-heading);
  margin: 0;
  letter-spacing: -0.04em;
}

.hero__tagline {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-muted);
  margin-top: 20px;
  margin-bottom: 48px;
}

.hero__ctas {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero__scroll-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--color-muted);
  letter-spacing: 2px;
  text-transform: uppercase;
  z-index: 2;
}

/* ── Buttons ──────────────────────────────────────────────────── */
.btn {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}
.btn--primary {
  background: var(--color-primary);
  color: #fff;
}
.btn--primary:hover {
  background: var(--color-accent);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 0 20px rgba(59,130,246,.4);
}
.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}
.btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-heading);
  background: rgba(59,130,246,.08);
}
</style>
