// app/middleware/track.global.ts
// GOTCHA DEMO (middleware): route middleware does NOT run for islands. An island
// is fetched via its own endpoint, not via Nuxt's router, so navigation
// middleware is bypassed entirely.
//
// This global middleware flips a shared `useState` flag on every page
// navigation. The /gotchas island reads the SAME state key — but because the
// island is an isolated app, it sees the default value, never the page's `true`.
// That single readout demonstrates BOTH "middleware didn't run" and "island
// state is isolated from the page" at once.
export const MIDDLEWARE_FLAG_KEY = 'island-demo:middleware-ran'

export default defineNuxtRouteMiddleware((to) => {
  const ran = useState<boolean>(MIDDLEWARE_FLAG_KEY, () => false)
  ran.value = true
  // Record where it ran, just to make the page-side readout concrete.
  useState<string>('island-demo:middleware-path', () => '').value = to.fullPath
})
