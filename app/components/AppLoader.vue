<template>
  <div class="jv-loader" :class="{ gone: done }">
    <div class="stars" />

    <div class="center">
      <div class="pct">{{ pct }}<span class="unit">%</span></div>
      <div class="label">Cargando experiencia</div>
    </div>

    <div class="water" :style="{ height: pct + '%' }">
      <div class="wave w2" />
      <div class="wave w1" />
      <div class="body-fill" />
    </div>

    <div class="bubbles">
      <span v-for="i in 7" :key="i" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ duration?: number }>()
const emit = defineEmits<{ done: [] }>()

const pct = ref(0)
const done = ref(false)

onMounted(() => {
  const dur = props.duration ?? 2500
  const start = performance.now()
  let raf: number

  function tick(now: number) {
    const t = Math.min(1, (now - start) / dur)
    let p: number
    if (t < 0.55)      p = (t / 0.55) * 85
    else if (t < 0.85) p = 85 + ((t - 0.55) / 0.30) * 15
    else               p = 100
    pct.value = Math.round(p)
    if (t < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      done.value = true
      setTimeout(() => emit('done'), 450)
    }
  }
  raf = requestAnimationFrame(tick)
  onUnmounted(() => cancelAnimationFrame(raf))
})
</script>

<style scoped>
.jv-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(180deg, #0B1220 0%, #0F172A 100%);
  overflow: hidden;
  transition: opacity 0.45s ease;
}
.jv-loader.gone {
  opacity: 0;
  pointer-events: none;
}

.stars {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,.5), transparent),
    radial-gradient(1px 1px at 75% 35%, rgba(255,255,255,.35), transparent),
    radial-gradient(1px 1px at 40% 60%, rgba(255,255,255,.4), transparent),
    radial-gradient(1px 1px at 90% 15%, rgba(255,255,255,.25), transparent),
    radial-gradient(1px 1px at 25% 80%, rgba(255,255,255,.3), transparent);
  pointer-events: none;
}

.water {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  transition: height 0.12s linear;
  pointer-events: none;
}

.body-fill {
  position: absolute;
  left: 0; right: 0; top: 14px; bottom: 0;
  background: linear-gradient(180deg,
    rgba(59,130,246,.25) 0%,
    rgba(37,99,235,.55) 40%,
    rgba(14,78,163,.85) 100%
  );
  box-shadow: inset 0 12px 40px rgba(59,130,246,.25);
}

.wave {
  position: absolute;
  left: -50%; right: -50%;
  top: 0; height: 28px;
  background-repeat: repeat-x;
  background-size: 200px 28px;
}
.w1 {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 28' preserveAspectRatio='none'><path d='M0 14 Q 25 0 50 14 T 100 14 T 150 14 T 200 14 V28 H0Z' fill='%233B82F6'/></svg>");
  animation: jv-scroll 4s linear infinite;
  opacity: 0.9;
}
.w2 {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 28' preserveAspectRatio='none'><path d='M0 18 Q 25 6 50 18 T 100 18 T 150 18 T 200 18 V28 H0Z' fill='%236366F1'/></svg>");
  animation: jv-scroll 6s linear infinite reverse;
  opacity: 0.55;
  top: 6px;
}

.bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bubbles span {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.8), rgba(255,255,255,.1) 60%, transparent 70%);
  animation: jv-float linear infinite;
}
.bubbles span:nth-child(1) { left: 10%; width: 8px;  height: 8px;  animation-duration: 4.5s; animation-delay: 0.2s; }
.bubbles span:nth-child(2) { left: 22%; width: 5px;  height: 5px;  animation-duration: 3.2s; animation-delay: 1.1s; }
.bubbles span:nth-child(3) { left: 40%; width: 10px; height: 10px; animation-duration: 5.0s; animation-delay: 0.6s; }
.bubbles span:nth-child(4) { left: 55%; width: 6px;  height: 6px;  animation-duration: 3.8s; animation-delay: 2.0s; }
.bubbles span:nth-child(5) { left: 70%; width: 4px;  height: 4px;  animation-duration: 2.8s; animation-delay: 0.4s; }
.bubbles span:nth-child(6) { left: 82%; width: 9px;  height: 9px;  animation-duration: 5.2s; animation-delay: 1.5s; }
.bubbles span:nth-child(7) { left: 92%; width: 5px;  height: 5px;  animation-duration: 3.6s; animation-delay: 0.9s; }

.center {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  mix-blend-mode: plus-lighter;
}

.pct {
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: -0.05em;
  font-size: clamp(72px, 14vw, 160px);
  line-height: 1;
  color: #F8FAFC;
  text-shadow: 0 0 40px rgba(59,130,246,.5);
  font-variant-numeric: tabular-nums;
}

.unit {
  font-size: 0.4em;
  color: #94A3B8;
  font-weight: 500;
  margin-left: 4px;
}

.label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #94A3B8;
  margin-top: 8px;
  animation: jv-blink 1.4s ease-in-out infinite;
}
</style>
