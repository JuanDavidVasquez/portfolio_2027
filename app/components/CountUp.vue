<template>
  <span ref="el">{{ display }}{{ suffix }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: number
  suffix?: string
  duration?: number
  delay?: number
}>()

const el = useTemplateRef<HTMLElement>('el')
const display = ref(0)
const started = ref(false)

onMounted(() => {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting && !started.value) {
        started.value = true
        io.disconnect()
        runCount()
      }
    }
  }, { threshold: 0.35 })

  if (el.value) io.observe(el.value)
  onUnmounted(() => io.disconnect())
})

function runCount() {
  const dur   = props.duration ?? 1600
  const delay = props.delay   ?? 0
  setTimeout(() => {
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      display.value = Math.round(eased * props.to)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    onUnmounted(() => cancelAnimationFrame(raf))
  }, delay)
}
</script>
