// =============================================================================
// app/utils/markdown.ts
// -----------------------------------------------------------------------------
// This is the "heavy dependency" at the heart of the demo. markdown-it + Shiki
// (a full TextMate-grammar syntax highlighter that bundles language grammars and
// themes) is genuinely large — hundreds of KB. That weight is the POINT: when we
// render markdown inside an island it costs the client ZERO of those bytes,
// because the island runs this code only on the server.
//
// The same renderer is imported by:
//   - MarkdownRenderer.vue        (client/SSR path → ships this to the browser)
//   - IslandMarkdown.server.vue   (island via .server suffix → server only)
//   - components/islands/*.vue     (island via NuxtIsland → server only)
//
// `app/utils/*` is auto-imported by Nuxt, so `getMarkdownRenderer()` is callable
// anywhere with no import statement.
// =============================================================================

import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

// We build the markdown-it instance lazily and cache the promise at module
// scope. Shiki's initialization is async (it loads grammars/themes), and we
// never want to pay that cost more than once per runtime. The SAME cached
// instance serves every render on a given server (or, for the client path, the
// single browser instance).
let rendererPromise: Promise<MarkdownIt> | null = null

export function getMarkdownRenderer(): Promise<MarkdownIt> {
  if (!rendererPromise) {
    rendererPromise = createRenderer()
  }
  return rendererPromise
}

async function createRenderer(): Promise<MarkdownIt> {
  const md = new MarkdownIt({
    html: false, // never trust raw HTML in markdown for a demo
    linkify: true,
    typographer: true,
  })

  // Shiki's markdown-it integration. `themes` enables dual-theme output: each
  // token carries both a light and a dark color as CSS variables, and our
  // stylesheet swaps them under `.dark`. `langs` are the grammars we bundle —
  // every extra language is extra weight, which is exactly what makes the
  // island's zero-byte client cost so striking.
  md.use(
    await Shiki({
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      langs: ['ts', 'js', 'vue', 'vue-html', 'bash', 'json', 'html'],
    }),
  )

  return md
}
