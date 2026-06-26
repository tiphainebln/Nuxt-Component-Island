<!--
  components/islands/RouteContextIsland.vue — the live "here be dragons" island
  for /gotchas. It surfaces, inside a real island, the four most surprising
  behaviours so the audience can see them rather than take our word for it.

  WHAT IT DEMONSTRATES
    1. useRoute() reflects the ISLAND's own request, not the host page route.
    2. Shared useState is ISOLATED — the global middleware's flag reads as its
       default here, proving middleware didn't run AND state doesn't cross over.
    3. Plugins: `$ranInIslands` is true (plugin ran), `$ranOnPageOnly` is
       undefined (that plugin opted out via `env: { islands: false }`).
    4. The RELIABLE way to get page data into an island: pass it as a prop. We
       also read `nuxtApp.ssrContext.islandContext` (populated from <NuxtIsland>'s
       `context` prop) — useful, but EXPERIMENTAL and subject to change.
-->
<script setup lang="ts">
import { MIDDLEWARE_FLAG_KEY } from '~/middleware/track.global'

interface Props {
  /** The host page's path, passed explicitly as a prop — the reliable approach. */
  pagePathFromProps: string
}
defineProps<Props>()

// (1) The island's own route. NOT the page you are looking at.
const islandRoute = useRoute()

// (2) Same state key the page middleware writes to — isolated, so still default.
const middlewareFlag = useState<boolean>(MIDDLEWARE_FLAG_KEY, () => false)

// (3) Plugin provides, observed from inside the island.
const nuxtApp = useNuxtApp()
const ranInIslands = nuxtApp.$ranInIslands // plugin with no env flag → ran
// `$ranOnPageOnly` is typed as present, but at runtime it is undefined inside an
// island because that plugin set `env: { islands: false }`. Read as unknown to
// display it honestly without lying to the type system.
const ranOnPageOnly = (nuxtApp as unknown as { $ranOnPageOnly?: boolean }).$ranOnPageOnly

// (4) The experimental islandContext, read defensively (shape may change).
const islandContext = (nuxtApp.ssrContext as { islandContext?: unknown } | undefined)?.islandContext ?? null
const islandContextJson = JSON.stringify(islandContext, null, 2)
</script>

<template>
  <div class="space-y-3 text-sm">
    <dl class="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div class="rounded-md bg-(--ui-bg-elevated)/60 p-3">
        <dt class="text-xs uppercase tracking-wide text-(--ui-text-muted)">
          useRoute().fullPath (inside island)
        </dt>
        <dd class="font-mono break-all">{{ islandRoute.fullPath }}</dd>
      </div>

      <div class="rounded-md bg-(--ui-bg-elevated)/60 p-3">
        <dt class="text-xs uppercase tracking-wide text-(--ui-text-muted)">
          Page path via prop (reliable)
        </dt>
        <dd class="font-mono break-all">{{ pagePathFromProps }}</dd>
      </div>

      <div class="rounded-md bg-(--ui-bg-elevated)/60 p-3">
        <dt class="text-xs uppercase tracking-wide text-(--ui-text-muted)">
          Middleware flag (shared useState)
        </dt>
        <dd class="font-mono">
          {{ middlewareFlag }} — middleware did <strong>not</strong> run for the island
        </dd>
      </div>

      <div class="rounded-md bg-(--ui-bg-elevated)/60 p-3">
        <dt class="text-xs uppercase tracking-wide text-(--ui-text-muted)">
          Plugins
        </dt>
        <dd class="font-mono">
          $ranInIslands = {{ String(ranInIslands) }}<br>
          $ranOnPageOnly = {{ String(ranOnPageOnly) }}
        </dd>
      </div>
    </dl>

    <div class="rounded-md bg-(--ui-bg-elevated)/60 p-3">
      <p class="mb-1 text-xs uppercase tracking-wide text-(--ui-text-muted)">
        nuxtApp.ssrContext.islandContext (experimental)
      </p>
      <pre class="overflow-x-auto text-xs">{{ islandContextJson }}</pre>
    </div>
  </div>
</template>
