<!--
  pages/compare.vue — THE headline demo.

  Left column : <ClientMarkdownCard>  → the heavy renderer, hydrated normally.
  Right column: <IslandMarkdown>       → the SAME renderer, as a `.server.vue` island.

  Above each column, <HydrationReadout> shows live: was component JS shipped?
  did onMounted fire (i.e. did it hydrate)? Below, we also show the SECOND way to
  make an island — explicit <NuxtIsland name="MarkdownIsland"> — to drive home
  that the component and its rendering strategy are decoupled.

  PRESENTER NOTE (read this to the room): open the Network tab.
    • The LEFT column's code lives in a `/_nuxt/*.js` chunk that downloads + hydrates.
    • The RIGHT column makes a `GET /__nuxt_island/IslandMarkdown:<hash>` request
      that returns rendered HTML (a NuxtIslandResponse) — no component JS, and its
      onMounted never runs. The markdown-it/Shiki chunk you DO see is pulled in by
      the left column; delete the left column and that chunk disappears entirely,
      proving the island never asked the client for a single byte of it.
-->
<script setup lang="ts">
useHead({ title: 'Compare' })

// Sample picker. Note the consequence, visible in the Network tab:
//   • left (client): changing this re-renders in-browser (a computed) — no request.
//   • right (island): changing the prop triggers a NEW /__nuxt_island fetch.
const selectedId = ref<string>(DEFAULT_SAMPLE.id)
const selectItems = MARKDOWN_SAMPLES.map((s) => ({ label: s.label, value: s.id }))
const source = computed<string>(
  () => MARKDOWN_SAMPLES.find((s) => s.id === selectedId.value)?.source ?? DEFAULT_SAMPLE.source,
)

// Seed the ISLAND probe row from the page. The island runs in an isolated Vue
// app and cannot write to this page's state, so it can never flip itself to
// "hydrated" — which is exactly the truth we want the readout to show.
seedProbe('island', { label: 'Server island (.server.vue)', shipsClientJs: false })
</script>

<template>
  <div>
    <ExplainerPanel title="Same component, two rendering strategies" icon="i-lucide-columns-2">
      Both columns render the <strong>identical</strong> <code>&lt;MarkdownRenderer&gt;</code>
      (markdown-it + Shiki). The left one is a normal client/SSR component that
      <strong>hydrates</strong>; the right one is a <code>.server.vue</code> <strong>island</strong>.
      Open your browser's Network tab and watch for the <code>/__nuxt_island/…</code> request.
    </ExplainerPanel>

    <div class="mb-6 flex items-center gap-3">
      <UIcon name="i-lucide-file-text" class="size-4 text-(--ui-text-muted)" />
      <span class="text-sm text-(--ui-text-muted)">Sample:</span>
      <USelect v-model="selectedId" :items="selectItems" class="w-64" />
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- LEFT: client / hydrated -->
      <div class="space-y-3">
        <HydrationReadout probe-key="client" />
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-monitor" class="size-4 text-(--ui-warning)" />
              <span class="font-semibold">Client component (hydrated)</span>
            </div>
          </template>
          <ClientMarkdownCard :source="source" />
        </UCard>
      </div>

      <!-- RIGHT: island / server-only -->
      <div class="space-y-3">
        <HydrationReadout probe-key="island" />
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-server" class="size-4 text-(--ui-primary)" />
              <span class="font-semibold">Server island (.server.vue)</span>
            </div>
          </template>
          <!--
            No <Suspense> needed: the server resolves the async renderer before
            sending HTML. This is APPROACH #1 — island by `.server.vue` suffix.
          -->
          <IslandMarkdown :source="source" />
        </UCard>
      </div>
    </div>

    <!-- Approach #2, for contrast -->
    <UCard class="mt-8">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-code" class="size-4 text-(--ui-primary)" />
          <span class="font-semibold">Approach #2 — explicit &lt;NuxtIsland&gt;</span>
        </div>
      </template>
      <p class="mb-4 text-sm text-(--ui-text-muted)">
        The same output rendered by a component in <code>~/components/islands/</code>,
        invoked explicitly. Here the call-site chooses the island strategy — the
        component itself is unaware. Identical zero-JS result.
      </p>
      <!-- NuxtIsland resolves `name` to ~/components/islands/MarkdownIsland.vue. -->
      <NuxtIsland name="MarkdownIsland" :props="{ source }" />
    </UCard>
  </div>
</template>
