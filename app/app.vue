<template>
  <div>
    <ClientOnly>
      <AppLoader v-if="loading" :duration="2500" @done="onLoaderDone" />
    </ClientOnly>
    <AppNav />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)

onMounted(() => {
  loading.value = true
})

function onLoaderDone() {
  loading.value = false
}
</script>
