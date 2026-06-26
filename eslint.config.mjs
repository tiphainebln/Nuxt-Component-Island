// @ts-check
// Flat ESLint config. `@nuxt/eslint` generates a project-aware base config
// under `.nuxt/` (created by `nuxt prepare` during install); `withNuxt()`
// wraps it so you can append your own rules. We keep it stock on purpose.
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Add custom rule overrides here, e.g.:
  // { rules: { 'vue/no-multiple-template-root': 'off' } }
)
