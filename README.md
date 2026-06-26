# Nuxt Component Islands — a teaching demo

A small, deliberately **didactic** Nuxt 4 + TypeScript app that explains **component
islands (server components)** through a live, side-by-side comparison. The source is
part of the lesson: every island-related file has a top comment explaining what it
demonstrates and why.

> Built for a live presentation. The code is meant to be read on screen.

---

## What is a component island?

A **component island** is a component that renders **entirely on the server** and ships
only its **HTML** to the browser — **no component JavaScript and no hydration cost**. The
rest of your app stays a normal, fully-interactive Nuxt SPA.

**Mental model:** _static islands in a dynamic Nuxt app_ — the **inverse of Astro**, which
puts dynamic (interactive) islands inside an otherwise static page. In Nuxt you start
dynamic and carve out static islands; in Astro you start static and carve out dynamic
ones.

Islands shine for UI that is **expensive to render but does nothing once on screen**:
rendered markdown, syntax-highlighted code, charts-to-SVG, large tables, icon sets.

---

## Run it

Requires **Node 20+** and **pnpm**.

```bash
pnpm install     # also runs `nuxt prepare`, which generates .nuxt/ types + tsconfigs
pnpm dev         # http://localhost:3000
```

Other scripts:

```bash
pnpm typecheck   # vue-tsc across the project (strict mode)
pnpm lint        # ESLint (flat config via @nuxt/eslint)
pnpm build       # production build
```

> **Keep the project in a space-free path.** `vue-tsc`'s build-time typecheck (enabled via
> `typescript.typeCheck: true`) breaks with `TS5083` if the project path contains a space
> (e.g. `.../code projects/...`). `pnpm dev` tolerates it, but `pnpm build` will fail.
> Keep the folder somewhere like `~/code-projects/Nuxt-Component-Island`, or set
> `typeCheck: false` in `nuxt.config.ts`.
>
> **Note on esbuild:** `package.json` pins a single esbuild version via `pnpm.overrides`.
> Without it two esbuild versions can coexist and esbuild's postinstall version-check
> fails (`Expected "0.28.1" but got "0.27.7"`). Leave the override in place.

---

## The one switch that matters

Everything hinges on this block in [`nuxt.config.ts`](./nuxt.config.ts):

```ts
experimental: {
  componentIslands: {
    // 'deep' = nuxt-client works for nested descendants AND for interactive
    // client components passed through an island's slots.
    selectiveClient: 'deep',
  },
  typedPages: true,
}
```

`selectiveClient` values: `false` (islands fully static) → `true` (a direct child may
hydrate via `nuxt-client`) → `'deep'` (nested descendants + slotted client components).
We use `'deep'` because it's the superset that unlocks every demo here.

---

## Two ways to make an island (and when to use each)

| | How | Use when |
|---|---|---|
| **#1 · `.server.vue` suffix** (bottom-up) | Rename `Foo.vue` → `Foo.server.vue`. Nuxt auto-wraps it as an island. Use it like any component: `<Foo …/>`. | The component is **always** server-only. The decision lives in the file. See [`IslandMarkdown.server.vue`](./app/components/IslandMarkdown.server.vue). |
| **#2 · `~/components/islands/` + `<NuxtIsland>`** (top-down) | Put the component in `app/components/islands/`, render with `<NuxtIsland name="Foo" :props="…" />`. | The **call-site** decides, contextually, to render as an island. Component and strategy are **decoupled**. See [`MarkdownIsland.vue`](./app/components/islands/MarkdownIsland.vue). |

Components in `~/components/islands/` are addressed by their **bare name**
(`name="MarkdownIsland"`), not a path-prefixed one.

---

## Per-page presenter guide

### `/` — Landing
Set the mental model: _static islands in a dynamic app, the inverse of Astro_. Three
cards link to the demos.

### `/compare` — the headline
The same `<MarkdownRenderer>` (markdown-it + Shiki — a genuinely heavy dependency) is
rendered **two ways**: hydrated client component (left) vs `.server.vue` island (right),
with a live readout above each.

**Do this live:**
1. Point at the readouts: left shows **JS shipped + hydrated ✓**; right shows **zero
   bytes + not hydrated** (its `onMounted` _cannot_ run — there's no client instance).
2. Open the **Network tab**. The island makes a `GET /__nuxt_island/IslandMarkdown:<hash>`
   request returning **HTML** (a `NuxtIslandResponse`), not a JS chunk.
3. The markdown-it/Shiki chunk you _do_ see is pulled in by the **left** column. Mention:
   delete the left column and that chunk vanishes — the island never asked the client for
   a byte of it. _(This is the honest nuance: on a page with both, the client twin forces
   the library into the bundle; the island itself contributes none.)_
4. Scroll to **Approach #2** — identical output via explicit `<NuxtIsland>`.
5. Change the **Sample** dropdown and re-open Network: the island **refetches**; the
   client side just re-renders. (Segue to `/gotchas`.)

The instrumentation lives in [`composables/useHydrationProbe.ts`](./app/composables/useHydrationProbe.ts):
`onMounted` flips a flag, and an island can never flip it.

### `/interactivity` — the boundary
1. **`nuxt-client`**: `InteractiveHost` is a static island with one hydrated counter.
   Open the console — only that counter logs that it hydrated.
2. **Slots**: a counter passed into `SlotIsland`'s slot stays interactive because the
   **parent** owns it. Explain ownership: island internals are server HTML; slot vnodes
   are rendered by the parent app (Nuxt wraps them in a `display: contents` element).

### `/gotchas` — here be dragons
Live: `RouteContextIsland` shows its own `useRoute()` differs from the page route, the
shared middleware flag reads as default (middleware skipped + state isolated), and the
two plugin markers (`$ranInIslands` true, `$ranOnPageOnly` undefined). Then the
refetch-on-keystroke demo. Documented: single root element, `env: { islands: false }`,
nesting overhead, and the **experimental** caveat (the `islandContext` shape may change —
prefer passing **props**).

---

## When should I actually reach for an island?

**Reach for one when:**
- The component is **expensive to render** but **cheap to look at** (no interactivity).
- It pulls a **heavy dependency** you'd rather not ship (markdown, highlighting, dates).
- Its data is **stable for the request** — props don't change rapidly on the client.

**Avoid one when:**
- The UI is **interactive** — use a normal component, or a `nuxt-client` pocket.
- Props change **frequently** on the client — every change is a **network refetch**.
- You need **page context** (route, middleware, shared state) inside it without plumbing
  it through props.

---

## Project structure

```
.
├── nuxt.config.ts                 # the islands switch lives here (read the comments)
├── tsconfig.json                  # Nuxt 4 project references → .nuxt/*
├── eslint.config.mjs              # flat config via @nuxt/eslint
├── package.json
└── app/                           # Nuxt 4 srcDir
    ├── app.vue                    # <UApp> root + shared chrome
    ├── app.config.ts              # Nuxt UI theme tokens
    ├── assets/css/main.css        # tailwind + @nuxt/ui + markdown/Shiki styles
    ├── components/
    │   ├── AppNav.vue
    │   ├── ExplainerPanel.vue
    │   ├── HydrationReadout.vue    # live "did it hydrate?" panel
    │   ├── MarkdownRenderer.vue    # THE shared heavy component (markdown-it + Shiki)
    │   ├── ClientMarkdownCard.vue  # left column: hydrated client version
    │   ├── IslandMarkdown.server.vue   # island via .server suffix (approach #1)
    │   ├── InteractiveCounter.vue  # the interactive pocket
    │   ├── SlotIsland.server.vue   # island exposing an interactive slot
    │   └── islands/
    │       ├── MarkdownIsland.vue      # island via directory (approach #2)
    │       ├── InteractiveHost.vue     # static island hosting a nuxt-client child
    │       └── RouteContextIsland.vue  # live gotchas readout
    ├── composables/
    │   └── useHydrationProbe.ts    # the instrumentation
    ├── middleware/
    │   └── track.global.ts         # proves middleware is skipped for islands
    ├── plugins/
    │   ├── runs-in-islands.ts      # plugin that runs everywhere (incl. islands)
    │   └── page-only.ts            # env:{islands:false} → skipped for islands
    ├── pages/
    │   ├── index.vue
    │   ├── compare.vue
    │   ├── interactivity.vue
    │   └── gotchas.vue
    └── utils/
        ├── markdown.ts             # cached markdown-it + Shiki renderer factory
        └── sampleContent.ts        # markdown payloads used by the demos
```

---

_Component islands are an experimental Nuxt feature; pin your Nuxt version and re-test on
upgrade._
