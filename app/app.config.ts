// app/app.config.ts
// Runtime-editable Nuxt UI theme tokens. (Distinct from nuxt.config.ts, which
// is build-time.) We pick an emerald primary + slate neutral so the demo looks
// intentional in both light and dark mode.
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'slate',
    },
  },
})
