<!--
  pages/gotchas.vue — "here be dragons".

  Islands are isolated server-rendered Vue apps, and that isolation has sharp
  edges. We demonstrate the live ones via <RouteContextIsland> and a refetch
  demo, and document the rest with code. Treat the feature as EXPERIMENTAL.
-->
<script setup lang="ts">
useHead({ title: 'Gotchas' })

// This is the PAGE route (the correct one). The island below will report a
// DIFFERENT route from its own useRoute() — that's the gotcha.
const route = useRoute()

// Refetch-on-prop-change demo: this text is passed as an island prop. Every
// change re-fetches the island over the network. Watch the Network tab.
const liveText = ref<string>('Type here — **each change refetches the island**.')

// Single-root-element example, shown as code (NOT executed — it would error).
const singleRootExample = `<!-- ❌ Islands must have ONE root element -->
<template>
  <h2>Title</h2>
  <p>Body</p>   <!-- two roots → island render error -->
</template>

<!-- ✅ Wrap in a single root -->
<template>
  <div>
    <h2>Title</h2>
    <p>Body</p>
  </div>
</template>`

const pluginEnvExample = `// Stop a plugin from running during island rendering:
export default defineNuxtPlugin({
  name: 'analytics',
  env: { islands: false }, // ← skipped for islands
  setup() { /* ... */ },
})`
</script>

<template>
  <div>
    <ExplainerPanel title="Islands are isolated — mind the edges" icon="i-lucide-triangle-alert" tone="warning">
      Each island is its own Vue app rendered in its own server request. That
      buys the zero-JS win, but it also means it does <strong>not</strong> share the page's
      route, middleware, or state. Below: the live surprises, then the documented ones.
    </ExplainerPanel>

    <!-- LIVE: route / state / plugin isolation -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-radar" class="size-4 text-(--ui-primary)" />
          <span class="font-semibold">Live: route, state &amp; plugin isolation</span>
        </div>
      </template>
      <p class="mb-4 text-sm text-(--ui-text-muted)">
        The host page route is <code class="font-mono">{{ route.fullPath }}</code>. Compare it to
        what the island reports from its own <code>useRoute()</code>. Also note the
        middleware flag (isolated) and the two plugin markers.
      </p>
      <!--
        We pass the page path BOTH ways:
          • as a prop (`pagePathFromProps`) — the reliable, recommended approach.
          • via the `context` prop — read inside as nuxtApp.ssrContext.islandContext
            (experimental; format may change).
      -->
      <NuxtIsland
        name="RouteContextIsland"
        :props="{ pagePathFromProps: route.fullPath }"
        :context="{ page: route.fullPath, note: 'passed via the context prop' }"
      />
    </UCard>

    <!-- LIVE: refetch on prop change -->
    <UCard class="mb-6">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-refresh-cw" class="size-4 text-(--ui-primary)" />
          <span class="font-semibold">Live: changing props refetches over the network</span>
        </div>
      </template>
      <p class="mb-3 text-sm text-(--ui-text-muted)">
        Islands re-render on the <strong>server</strong>, so every prop change is an HTTP
        round-trip to <code>/__nuxt_island/…</code>. Open the Network tab and type — each
        change fires a request. <strong>Don't</strong> use islands for rapidly-reactive props.
      </p>
      <UInput v-model="liveText" class="mb-4 w-full" placeholder="Type to trigger refetches…" />
      <div class="rounded-lg border border-(--ui-border) p-4">
        <NuxtIsland name="MarkdownIsland" :props="{ source: liveText }" />
      </div>
    </UCard>

    <!-- DOCUMENTED gotchas -->
    <div class="grid gap-4 sm:grid-cols-2">
      <UCard>
        <h3 class="mb-2 flex items-center gap-2 font-semibold">
          <UIcon name="i-lucide-square-dashed" class="size-4 text-(--ui-warning)" />
          Single root element
        </h3>
        <p class="mb-3 text-sm text-(--ui-text-muted)">
          An island's template must have exactly one root node (HTML comments count
          as nodes). Multiple roots throw at render time.
        </p>
        <pre class="overflow-x-auto rounded-md bg-(--ui-bg-elevated) p-3 text-xs">{{ singleRootExample }}</pre>
      </UCard>

      <UCard>
        <h3 class="mb-2 flex items-center gap-2 font-semibold">
          <UIcon name="i-lucide-plug" class="size-4 text-(--ui-warning)" />
          Plugins re-run for islands
        </h3>
        <p class="mb-3 text-sm text-(--ui-text-muted)">
          Plugins run during island rendering too. Opt out per-plugin with
          <code>env: &#123; islands: false &#125;</code> to skip work an island doesn't need.
        </p>
        <pre class="overflow-x-auto rounded-md bg-(--ui-bg-elevated) p-3 text-xs">{{ pluginEnvExample }}</pre>
      </UCard>

      <UCard>
        <h3 class="mb-2 flex items-center gap-2 font-semibold">
          <UIcon name="i-lucide-route-off" class="size-4 text-(--ui-warning)" />
          Middleware doesn't run
        </h3>
        <p class="text-sm text-(--ui-text-muted)">
          Route middleware never executes for islands — they're fetched via their own
          endpoint, not Nuxt's router. The live demo above proves the global
          middleware flag stays at its default inside the island.
        </p>
      </UCard>

      <UCard>
        <h3 class="mb-2 flex items-center gap-2 font-semibold">
          <UIcon name="i-lucide-layers" class="size-4 text-(--ui-warning)" />
          Nesting adds overhead
        </h3>
        <p class="text-sm text-(--ui-text-muted)">
          Each island is a separate server render (and, when props change, a separate
          fetch). Nesting islands inside islands multiplies that cost — prefer one
          island over a deep tree of them.
        </p>
      </UCard>
    </div>

    <ExplainerPanel title="Still experimental" icon="i-lucide-flask-conical" tone="neutral" class="mt-8">
      Component islands are an <strong>experimental</strong> Nuxt feature. APIs like the
      <code>islandContext</code> shape can change between releases — pin your Nuxt version and
      re-test on upgrade. Prefer passing data as <strong>props</strong> over relying on
      <code>islandContext</code> where you can.
    </ExplainerPanel>
  </div>
</template>
