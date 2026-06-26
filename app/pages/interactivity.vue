<!--
  pages/interactivity.vue — the island BOUNDARY.

  Shows the two ways interactivity coexists with an otherwise zero-JS island:
    1. `nuxt-client` — selectively hydrate ONE component inside the island.
    2. Slots — content passed from the parent stays interactive because the
       parent (not the island) owns and renders it.
-->
<script setup lang="ts">
useHead({ title: 'Interactivity' })
</script>

<template>
  <div>
    <ExplainerPanel title="Interactivity at the island boundary" icon="i-lucide-mouse-pointer-click">
      An island is static by default. You can still get interactivity in two ways:
      mark a child <code>nuxt-client</code> to hydrate just that pocket, or pass an
      interactive component through a <strong>slot</strong>. Open the console — each
      <code>&lt;InteractiveCounter&gt;</code> logs when it hydrates.
    </ExplainerPanel>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- (1) nuxt-client inside an island -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-component" class="size-4 text-(--ui-primary)" />
            <span class="font-semibold">1 · <code>nuxt-client</code> inside an island</span>
          </div>
        </template>
        <p class="mb-4 text-sm text-(--ui-text-muted)">
          <code>InteractiveHost</code> is a server island. Everything in it is static
          HTML except the counter, which carries <code>nuxt-client</code> and is the
          only thing hydrated. This requires
          <code>selectiveClient</code> in <code>nuxt.config.ts</code>.
        </p>
        <NuxtIsland name="InteractiveHost" :props="{ start: 3 }" />
      </UCard>

      <!-- (2) interactive component through an island slot -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-between-vertical-start" class="size-4 text-(--ui-primary)" />
            <span class="font-semibold">2 · interactive component via a slot</span>
          </div>
        </template>
        <p class="mb-4 text-sm text-(--ui-text-muted)">
          <code>SlotIsland</code> renders a static frame on the server, but the counter
          below is passed into its slot from this page — so the parent owns it and it
          stays interactive without <code>nuxt-client</code>.
        </p>
        <!--
          The slot content is created HERE (the page), not inside the island.
          That is why it is interactive: the island's own template becomes static
          server HTML, but slot vnodes are rendered and hydrated by the parent app
          (Nuxt wraps them in a `display: contents` element). Interactive client
          components in island slots need selectiveClient: 'deep'.
        -->
        <SlotIsland>
          <InteractiveCounter :start="10" label="slotted counter (owned by the page)" />
        </SlotIsland>
      </UCard>
    </div>

    <ExplainerPanel
      title="Why slots are interactive but island internals are not"
      icon="i-lucide-lightbulb"
      tone="primary"
      class="mt-8"
    >
      The difference is <strong>ownership</strong>. An island's own template is
      serialized to HTML on the server — there is no client instance to attach
      handlers to, so its internals can't be interactive (unless a child explicitly
      opts in with <code>nuxt-client</code>). Slot content, by contrast, is rendered by
      the <em>parent</em> client app and teleported into the island's markup, so it
      keeps its reactivity and event handlers like any normal component.
    </ExplainerPanel>
  </div>
</template>
