// =============================================================================
// nuxt.config.ts
// -----------------------------------------------------------------------------
// This file is the single most important piece of the demo: the lines that turn
// component islands on. Everything else (the pages, the heavy markdown renderer,
// the instrumentation) only EXISTS to make the effect of these few settings
// visible to a live audience. Read the `experimental.componentIslands` block.
// =============================================================================

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 ships `app/` as the default source directory. Pages, components,
  // composables, plugins, middleware and `app.vue` all live under `app/`.
  // (`nuxt.config.ts`, `package.json`, `tsconfig.json` stay at the repo root.)
  compatibilityDate: '2025-01-01',

  modules: [
    // Nuxt UI v4 - our entire visual layer (Tailwind v4 is bundled with it).
    '@nuxt/ui',
    // Generates a flat-config ESLint setup tuned for this exact Nuxt project.
    '@nuxt/eslint',
  ],

  // Tailwind + Nuxt UI are pulled in via this one stylesheet (see the file).
  css: ['~/assets/css/main.css'],

  // ---------------------------------------------------------------------------
  // THE FEATURE. This is the whole talk in a handful of lines.
  // Note: `experimental` is ONE object - every island-related flag lives here.
  // ---------------------------------------------------------------------------
  experimental: {
    componentIslands: {
      // `selectiveClient` controls whether components INSIDE a server island are
      // allowed to opt back into client-side hydration via the `nuxt-client`
      // attribute. Three meaningful values:
      //
      //   false  - islands are 100% static. No `nuxt-client` islands at all.
      //   true   - a DIRECT child of an island may use `nuxt-client` and hydrate.
      //   'deep' - `nuxt-client` works for nested descendants too, AND it is the
      //            level required for interactive *client components passed
      //            through an island's slots* to work.
      //
      // We use 'deep' because the /interactivity page demonstrates BOTH a
      // `nuxt-client` island internal AND an interactive component handed to an
      // island via a slot. 'deep' is the superset, so it unlocks every demo here.
      selectiveClient: 'deep',
    },

    // Strongly-typed `<NuxtLink to="...">` and `navigateTo()` for every route.
    // Mistype a path and `nuxt typecheck` fails - the types ARE documentation.
    typedPages: true,
  },

  typescript: {
    // Full strict mode - no implicit any, strict null checks, the works.
    strict: true,
    // Run `vue-tsc` as part of dev/build so type errors surface immediately.
    // Deliberate for a teaching repo: the types ARE part of the lesson.
    // NOTE: vue-tsc's project-reference typecheck breaks if the project path
    // contains a SPACE (e.g. ".../code projects/...") → TS5083. Keep the project
    // in a space-free path, or set this to `false` to skip build-time checking.
    typeCheck: true,
  },

  // Dark mode is on by default through Nuxt UI's bundled color-mode integration;
  // `<UColorModeButton>` in the nav toggles it. Theme tokens live in
  // app/app.config.ts. Nothing else to configure here.

  devtools: { enabled: true },
})
