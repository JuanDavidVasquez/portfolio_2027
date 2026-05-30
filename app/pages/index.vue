<template>
  <main>
    <HeroSection />
    <AboutSection />
    <StackSection />
    <ProjectsSection />
    <ClientOnly><LiveLabSection /></ClientOnly>
    <ReferencesSection />
    <TrayectoriaSection />
    <CasoEstudioSection />
    <ServiciosSection />
    <OrigenSection />
    <UsesSection />
    <ContactSection />
  </main>
</template>

<script setup lang="ts">
onMounted(() => {
  // Small delay so ClientOnly components are also rendered
  setTimeout(async () => {
    const { gsap }         = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'power2.out'

    // Section eyebrows: slide in from left
    gsap.utils.toArray<Element>('.section-eyebrow').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        x: -24, opacity: 0, duration: 0.55, ease,
      })
    })

    // Section titles: rise up
    gsap.utils.toArray<Element>('.section-title').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        y: 38, opacity: 0, duration: 0.85, ease,
      })
    })

    // About: stat cards stagger
    if (document.querySelector('.about__stats')) {
      gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.about__stats', start: 'top 85%', once: true },
        y: 32, opacity: 0, duration: 0.65, stagger: 0.1, ease,
      })
      gsap.from('.about__text', {
        scrollTrigger: { trigger: '.about__text', start: 'top 88%', once: true },
        y: 28, opacity: 0, duration: 0.75, ease,
      })
    }

    // Stack: cards stagger
    if (document.querySelector('.stack__grid')) {
      gsap.from('.stack-card', {
        scrollTrigger: { trigger: '.stack__grid', start: 'top 85%', once: true },
        y: 30, opacity: 0, duration: 0.6, stagger: 0.07, ease,
      })
    }

    // Terminal (Live Lab)
    if (document.querySelector('.terminal')) {
      gsap.from('.terminal', {
        scrollTrigger: { trigger: '.terminal', start: 'top 88%', once: true },
        y: 40, opacity: 0, duration: 0.9, ease,
      })
    }

    ScrollTrigger.refresh()
  }, 150)
})
</script>
