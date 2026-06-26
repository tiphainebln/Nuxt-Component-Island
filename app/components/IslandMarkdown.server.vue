<!--
  IslandMarkdown.server.vue — APPROACH #1: an island created by the `.server.vue`
  SUFFIX (the "bottom-up" / by-rename approach).

  WHAT IT DEMONSTRATES
  This component is byte-for-byte what a normal `IslandMarkdown.vue` would be —
  the ONLY thing that makes it a server island is the `.server` in its filename.
  That is the headline of the talk: you can convert a heavy, static component to
  an island just by renaming the file. Use this approach when a component is
  *always* meant to be server-only.

  CONSEQUENCES (all visible in the demo):
    • Its code (and the markdown-it/Shiki it pulls in) is NEVER shipped to the
      client. Nuxt fetches its rendered HTML from /__nuxt_island/... instead.
    • It has no client instance, so lifecycle hooks like onMounted never run in
      the browser — that's why the /compare readout shows it as "not hydrated".
    • It MUST have a single root element (see the wrapping <div>).

  Used on /compare as: <IslandMarkdown :source="..." />  (no <NuxtIsland> needed —
  Nuxt auto-wraps `.server` components as islands.)
-->
<script setup lang="ts">
interface Props {
  source: string
}
defineProps<Props>()

// IMPORTANT: this setup runs ONLY on the server (and on each props change, the
// server re-runs it for a refetch). There is deliberately no onMounted here —
// it could not run client-side anyway. <MarkdownRenderer>'s `await` resolves on
// the server before the HTML is sent, so no <Suspense> wrapper is required.
</script>

<template>
  <!-- Single root element is REQUIRED for islands. -->
  <div>
    <MarkdownRenderer :source="source" />
  </div>
</template>
