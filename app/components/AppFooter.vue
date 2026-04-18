<template>
  <footer class="footer">
    <div class="footer__inner">
      <span class="footer__text">© 2027 Juan David Vásquez · {{ t('footer.built') }}</span>
      <span class="footer__text">v2027.0 · {{ t('footer.status') }}</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useLocale()
</script>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  padding: 32px 40px;
}
.footer__inner {
  max-width: var(--container-max);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.footer__text {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-muted);
}
</style>
