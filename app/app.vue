<!--
  app/app.vue — the root component.

  <UApp> is REQUIRED by Nuxt UI v4: it provides the global context that toasts,
  tooltips and overlays rely on. Wrap the whole app in it exactly once.

  The shared chrome (nav + container) lives here so every page inherits it.
-->
<script setup lang="ts">
// A little global <head> setup so the tab + meta look intentional in the demo.
useHead({
  titleTemplate: (title) => (title ? `${title} · Nuxt Islands` : 'Nuxt Islands Demo'),
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-(--ui-bg) text-(--ui-text)">
      <AppNav />
      <UContainer class="py-8 sm:py-10">
        <NuxtPage />
      </UContainer>
    </div>
  </UApp>
</template>
