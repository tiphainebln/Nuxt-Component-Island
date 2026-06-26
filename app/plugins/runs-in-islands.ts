// app/plugins/runs-in-islands.ts
// GOTCHA DEMO (plugins): by default, Nuxt plugins ALSO run while rendering an
// island — the island is its own little Nuxt app and boots its own plugins.
// This one has NO `env.islands` flag, so it runs everywhere, including inside
// islands. The /gotchas island reads `$ranInIslands` and finds it `true`.
export default defineNuxtPlugin({
  name: 'runs-in-islands',
  setup() {
    return {
      provide: {
        // Truthy marker the island can detect to prove this plugin executed.
        ranInIslands: true,
      },
    }
  },
})
