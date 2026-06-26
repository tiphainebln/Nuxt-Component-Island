<!--
  components/islands/MarkdownIsland.vue — APPROACH #2: an island created by
  placement in the `~/components/islands/` directory, rendered explicitly with
  <NuxtIsland name="MarkdownIsland" :props="..." /> (the "top-down" / contextual
  approach).

  WHAT IT DEMONSTRATES
  Compared to the `.server.vue` suffix, here the COMPONENT and its RENDERING
  STRATEGY are decoupled: the same kind of component sits in a directory, and the
  *caller* decides — per usage — to render it as an island via <NuxtIsland>. Use
  this when a component might be rendered normally elsewhere, or when you want the
  call-site to make the island decision explicit and contextual.

  Note: components in `~/components/islands/` are addressed by their BARE name
  ("MarkdownIsland"), NOT a path-prefixed name. Same island rules apply: no client
  JS, no client lifecycle, single root element.
-->
<script setup lang="ts">
interface Props {
  source: string
}
defineProps<Props>()
</script>

<template>
  <!-- Single root element, again. -->
  <div>
    <MarkdownRenderer :source="source" />
  </div>
</template>
