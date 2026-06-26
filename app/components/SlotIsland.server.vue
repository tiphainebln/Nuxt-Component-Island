<!--
  SlotIsland.server.vue — a server island that exposes a SLOT.

  WHAT IT DEMONSTRATES (slots vs internals)
  The island's own template (the heading, the dashed frame) renders to static
  server HTML. But whatever the PARENT passes into the slot is created and owned
  by the parent's client app — so slot content stays fully interactive even
  though it sits visually "inside" the island.

  WHY: an island's internals are serialized to HTML on the server; there is no
  client component to attach handlers to. Slot vnodes, by contrast, are rendered
  by the parent and teleported into place (Nuxt wraps them in a
  `display: contents` element). Different ownership → different interactivity.

  Note: interactive *client components* in island slots require
  `selectiveClient: 'deep'` (which we set in nuxt.config.ts).

  Used as a `.server.vue` component directly so we can pass real slot content:
    <SlotIsland><InteractiveCounter :start="10" /></SlotIsland>
-->
<script setup lang="ts">
interface Props {
  heading?: string
}
withDefaults(defineProps<Props>(), {
  heading: 'Static island frame (server HTML)',
})
</script>

<template>
  <!-- Single root element. -->
  <div class="space-y-3">
    <p class="flex items-center gap-2 text-sm text-(--ui-text-muted)">
      <UIcon name="i-lucide-server" class="size-4" />
      {{ heading }}
    </p>

    <div class="rounded-lg border border-dashed border-(--ui-primary)/60 p-4">
      <p class="mb-3 text-xs uppercase tracking-wide text-(--ui-text-muted)">
        ↓ slot content (owned by the parent — interactive) ↓
      </p>
      <slot />
    </div>
  </div>
</template>
