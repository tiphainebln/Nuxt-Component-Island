<!--
  AppNav.vue — shared top navigation + dark-mode toggle.

  Not island-related; it just provides consistent chrome and routing. Uses
  typed routes (experimental.typedPages), so every `to` is checked at build time.
-->
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface NavItem {
  label: string
  to: RouteLocationRaw
  icon: string
}

// Single source of truth for the nav. `to` values are typed against the real
// routes, so renaming a page and forgetting to update this would fail typecheck.
const links: NavItem[] = [
  { label: 'Home', to: '/', icon: 'i-lucide-home' },
  { label: 'Compare', to: '/compare', icon: 'i-lucide-columns-2' },
  { label: 'Interactivity', to: '/interactivity', icon: 'i-lucide-mouse-pointer-click' },
  { label: 'Gotchas', to: '/gotchas', icon: 'i-lucide-triangle-alert' },
]
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-(--ui-border) bg-(--ui-bg)/80 backdrop-blur"
  >
    <UContainer class="flex h-16 items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <UIcon name="i-lucide-island" class="size-5 text-(--ui-primary)" />
        <span>Nuxt Islands</span>
        <UBadge color="primary" variant="subtle" size="sm" class="hidden sm:inline-flex">
          server components
        </UBadge>
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <UButton
          v-for="link in links"
          :key="String(link.to)"
          :to="link.to"
          :icon="link.icon"
          color="neutral"
          variant="ghost"
          size="sm"
          active-class="text-(--ui-primary) bg-(--ui-bg-elevated)"
          class="hidden sm:inline-flex"
        >
          {{ link.label }}
        </UButton>

        <UColorModeButton />
      </nav>
    </UContainer>
  </header>
</template>
