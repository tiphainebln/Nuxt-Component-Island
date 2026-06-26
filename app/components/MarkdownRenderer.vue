<!--
  MarkdownRenderer.vue — THE shared, deliberately heavy component.

  WHAT IT DEMONSTRATES
  This is the exact same component used on BOTH sides of the comparison:
    • directly (client/SSR + hydration)  — see ClientMarkdownCard.vue
    • inside an island (server-only)      — see IslandMarkdown.server.vue
                                            and components/islands/MarkdownIsland.vue
  Because it imports markdown-it + Shiki, rendering it on the CLIENT pulls a
  large chunk into the browser bundle. Rendering it inside an ISLAND pulls ZERO
  of that to the client. One component, two rendering strategies — that decoupling
  is the entire lesson.

  WHY TOP-LEVEL AWAIT
  Building the Shiki-powered renderer is async, so this is an async setup
  component. On the server (and inside islands) Nuxt simply awaits it. On the
  client it resolves inside the page's <Suspense> boundary — which is why the
  client-side usages wrap it in <Suspense> with a skeleton fallback.
-->
<script setup lang="ts">
interface Props {
  /** Raw markdown source to render. Changing it re-renders (and, for an island,
   *  triggers a network refetch — see the /gotchas page). */
  source: string
}

const props = defineProps<Props>()

// Heavy, async, cached. This `await` is what makes the component "expensive".
const md = await getMarkdownRenderer()

// Re-render whenever the source prop changes.
const html = computed(() => md.render(props.source))
</script>

<template>
  <!-- v-html is safe here: markdown-it is configured with html:false, and the
       only input is our own trusted sample content. -->
  <div class="md-body" v-html="html" />
</template>
