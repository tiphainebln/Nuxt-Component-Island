// app/plugins/page-only.ts
// GOTCHA DEMO (plugins, continued): to STOP a plugin from running during island
// rendering, set `env: { islands: false }`. Use this to skip work that is
// irrelevant or expensive for islands (analytics, client-only SDK setup, etc.).
// The /gotchas island reads `$ranOnPageOnly` and finds it `undefined`, because
// this plugin was skipped for the island.
export default defineNuxtPlugin({
  name: 'page-only',
  env: {
    // false → do NOT run this plugin when rendering islands.
    islands: false,
  },
  setup() {
    return {
      provide: {
        ranOnPageOnly: true,
      },
    }
  },
})
