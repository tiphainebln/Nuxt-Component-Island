// app/utils/sampleContent.ts
// Shared markdown payloads rendered by the demo. Deliberately full of fenced
// code blocks so Shiki has real work to do (and the rendered output is pretty).
// Auto-imported via app/utils/*.

export interface MarkdownSample {
  id: string
  label: string
  source: string
}

export const MARKDOWN_SAMPLES: MarkdownSample[] = [
  {
    id: 'islands',
    label: 'What is an island?',
    source: `## Server islands in a nutshell

A **component island** renders entirely on the server and ships its HTML to the
browser with **no component JavaScript and no hydration**. The rest of your Nuxt
app stays a normal, fully-interactive SPA.

> Mental model: *static islands in a dynamic app* — the inverse of Astro, which
> is dynamic islands in a static page.

\`\`\`ts
// Turning a component into an island can be as small as a file rename:
//   HeavyArticle.vue  ->  HeavyArticle.server.vue
const islandsAreCheap = true
\`\`\`

Great for **heavy, non-interactive** UI: rendered markdown, syntax-highlighted
code, charts-to-SVG, large tables, anything that is expensive to render but does
nothing once on screen.`,
  },
  {
    id: 'highlight',
    label: 'Syntax highlighting',
    source: `### This block is highlighted by Shiki

\`\`\`vue
<script setup lang="ts">
// On the ISLAND side, this highlighter runs only on the server.
const props = defineProps<{ source: string }>()
const md = await getMarkdownRenderer()
const html = computed(() => md.render(props.source))
<\/script>

<template>
  <div class="md-body" v-html="html" />
</template>
\`\`\`

\`\`\`bash
# Watch the network tab while this renders as an island:
#   GET /__nuxt_island/IslandMarkdown:<hash>   ->   HTML, not a JS chunk
pnpm dev
\`\`\``,
  },
  {
    id: 'decision',
    label: 'When to reach for one',
    source: `### Reach for an island when…

1. The component is **expensive to render** but **cheap to look at** (no interactivity).
2. It pulls a **heavy dependency** you would rather not ship (markdown, highlighting, date libs).
3. Its data is **stable for the request** — props don't change rapidly on the client.

### Avoid an island when…

- The UI is **interactive** (use a normal component, or \`nuxt-client\` for a pocket of it).
- Props change **frequently** on the client — every change is a **network refetch**.
- You need **page context** (route, middleware, shared state) inside it without plumbing.`,
  },
]

// Convenience default used by the compare page.
export const DEFAULT_SAMPLE: MarkdownSample = MARKDOWN_SAMPLES[0]!
