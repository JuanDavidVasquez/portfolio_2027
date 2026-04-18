<template>
  <div>
    <ClientOnly>
      <AppLoader v-if="loading" :duration="2500" @done="onLoaderDone" />
    </ClientOnly>
    <AppNav />
    <main>
      <HeroSection />
      <AboutSection />
      <StackSection />
      <ProjectsSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)

onMounted(() => {
  const key = 'portafolio.loaded'
  if (!sessionStorage.getItem(key)) {
    loading.value = true
  }
})

function onLoaderDone() {
  loading.value = false
  try { sessionStorage.setItem('portafolio.loaded', '1') } catch {}
}
</script>
