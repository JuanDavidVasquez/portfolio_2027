<template>
  <section id="inicio" class="hero">
    <canvas ref="canvasEl" class="hero__canvas" />

    <div class="hero__content">
      <div class="hero__badge">
        <span class="hero__badge-dot" />
        {{ t('hero.available') }}
      </div>

      <h1 class="hero__name">Juan Vasquez</h1>

      <p class="hero__tagline">&gt; {{ t('hero.tagline') }}</p>

      <div class="hero__ctas">
        <a href="#proyectos" class="btn btn--primary">{{ t('hero.cta1') }} →</a>
        <a href="#contacto" class="btn btn--secondary">{{ t('hero.cta2') }}</a>
      </div>
    </div>

    <div class="hero__scroll-hint">scroll ↓</div>
  </section>
</template>

<script setup lang="ts">
const { t } = useLocale()

const canvasEl = useTemplateRef<HTMLCanvasElement>('canvasEl')

onMounted(() => {
  const canvas = canvasEl.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!

  function resize() {
    canvas.width  = canvas.clientWidth
    canvas.height = canvas.clientHeight
  }
  resize()
  window.addEventListener('resize', resize)

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
  let raf: number
  ;(function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(s => { s.update(); s.draw() })
    raf = requestAnimationFrame(loop)
  })()

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
  })
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
  z-index: 1;
}

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
  opacity: 0;
  animation: pFadeIn 1s ease forwards 0.2s;
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
  opacity: 0;
  transform: translateY(40px);
  animation: pFadeUp 1.5s ease forwards 0.5s;
}

.hero__tagline {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-muted);
  margin-top: 20px;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(40px);
  animation: pFadeUp 1.5s ease forwards 1s;
}

.hero__ctas {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  opacity: 0;
  animation: pFadeIn 1s ease forwards 1.4s;
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
  opacity: 0;
  animation: pFadeIn 1s ease forwards 2s;
}

/* Buttons */
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
