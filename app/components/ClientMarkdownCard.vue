<!--
  ClientMarkdownCard.vue — the LEFT column of the comparison: the heavy renderer
  rendered the *normal* way.

  WHAT IT DEMONSTRATES
  Importing <MarkdownRenderer> here means markdown-it + Shiki end up in THIS
  page's client bundle, and the component hydrates in the browser. We register a
  hydration probe ('client') whose `onMounted` fires on hydration — flipping the
  readout to "hydrated ✓". This is the baseline we measure the island against.

  Note the <Suspense>: <MarkdownRenderer> is async, so on the client it needs a
  Suspense boundary with a fallback. (The island side needs none — the server
  resolves the await before sending HTML.)
-->
<script setup lang="ts">
interface Props {
  source: string
}
defineProps<Props>()

// Registers the 'client' probe and flips it to hydrated in onMounted (browser).
useHydrationProbe('client', {
  label: 'Client component (SSR + hydrated)',
  shipsClientJs: true,
})
</script>

<template>
  <Suspense>
    <MarkdownRenderer :source="source" />
    <template #fallback>
      <div class="space-y-3">
        <USkeleton class="h-6 w-2/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-5/6" />
        <USkeleton class="h-24 w-full" />
      </div>
    </template>
  </Suspense>
</template>
