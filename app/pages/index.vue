<!--
  pages/index.vue — Landing. Explains islands in a few sentences and links to
  each demo. The hero is just chrome; the teaching starts on /compare.
-->
<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

useHead({ title: 'Home' })

interface DemoLink {
  to: RouteLocationRaw
  icon: string
  title: string
  description: string
}

const demos: DemoLink[] = [
  {
    to: '/compare',
    icon: 'i-lucide-columns-2',
    title: 'Compare',
    description:
      'The headline demo: the same heavy component rendered as a hydrated client component vs. a server island, with a live readout of JS shipped + hydration.',
  },
  {
    to: '/interactivity',
    icon: 'i-lucide-mouse-pointer-click',
    title: 'Interactivity',
    description:
      'The island boundary: a static island with a `nuxt-client` interactive pocket, plus an interactive component handed in through a slot.',
  },
  {
    to: '/gotchas',
    icon: 'i-lucide-triangle-alert',
    title: 'Gotchas',
    description:
      'Here be dragons: isolated routes/state, skipped middleware, plugin behaviour, refetch-on-prop-change, single-root rule — shown live.',
  },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden rounded-2xl border border-(--ui-border) bg-gradient-to-br from-(--ui-bg-elevated) to-(--ui-bg) px-6 py-14 sm:px-12 sm:py-20">
      <div class="mx-auto max-w-3xl text-center">
        <UBadge color="primary" variant="subtle" size="lg" class="mb-5">
          <UIcon name="i-lucide-island" class="size-4" />
          Nuxt 4 · Component Islands
        </UBadge>
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Ship the HTML. Skip the JavaScript.
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-(--ui-text-muted)">
          A <strong>component island</strong> renders entirely on the server and sends only
          HTML — <strong>zero component JS, zero hydration</strong>. The rest of your app stays a
          normal, interactive Nuxt SPA. The mental model:
          <em>static islands in a dynamic app</em> — the inverse of Astro.
        </p>
        <p class="mx-auto mt-3 max-w-2xl text-(--ui-text-muted)">
          Use them for heavy, non-interactive UI (rendered markdown, syntax
          highlighting, charts) where the rendering is expensive but nothing
          happens once it's on screen.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <UButton to="/compare" size="lg" icon="i-lucide-columns-2" trailing>
            See the side-by-side
          </UButton>
          <UButton
            to="https://nuxt.com/docs/guide/directory-structure/components#server-components"
            target="_blank"
            size="lg"
            color="neutral"
            variant="subtle"
            icon="i-lucide-external-link"
          >
            Nuxt docs
          </UButton>
        </div>
      </div>
    </section>

    <!-- Demo cards -->
    <section class="mt-10 grid gap-4 sm:grid-cols-3">
      <UCard
        v-for="demo in demos"
        :key="String(demo.to)"
        class="group transition hover:ring-(--ui-primary)"
        @click="navigateTo(demo.to)"
      >
        <div class="flex h-full flex-col">
          <UIcon :name="demo.icon" class="size-7 text-(--ui-primary)" />
          <h3 class="mt-3 text-lg font-semibold">{{ demo.title }}</h3>
          <p class="mt-1.5 flex-1 text-sm text-(--ui-text-muted)">{{ demo.description }}</p>
          <NuxtLink
            :to="demo.to"
            class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-(--ui-primary)"
          >
            Open demo
            <UIcon name="i-lucide-arrow-right" class="size-4 transition group-hover:translate-x-0.5" />
          </NuxtLink>
        </div>
      </UCard>
    </section>
  </div>
</template>
