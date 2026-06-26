<!--
  components/islands/InteractiveHost.vue — a STATIC island that hosts an
  interactive client component via the `nuxt-client` attribute.

  WHAT IT DEMONSTRATES (the island BOUNDARY)
  Everything in this template is static server HTML EXCEPT the <InteractiveCounter>
  marked `nuxt-client`. Nuxt renders the island on the server, then selectively
  hydrates just that one component in the browser — an interactive pocket inside
  an otherwise zero-JS island. This is what `experimental.componentIslands.
  selectiveClient` unlocks; without it, `nuxt-client` is ignored.

  Rendered with: <NuxtIsland name="InteractiveHost" :props="{ start, note }" />
-->
<script setup lang="ts">
interface Props {
  /** Forwarded to the hydrated counter. */
  start?: number
  /** A bit of static server-rendered copy, to contrast with the live counter. */
  note?: string
}
const props = withDefaults(defineProps<Props>(), {
  start: 0,
  note: 'This sentence is static server HTML — it never hydrates.',
})
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm text-(--ui-text-muted)">{{ note }}</p>

    <!--
      `nuxt-client` = "hydrate ONLY this child on the client". The island itself
      stays static; this counter becomes interactive. Requires selectiveClient.
    -->
    <InteractiveCounter
      nuxt-client
      :start="start"
      label="nuxt-client counter (inside the island)"
    />
  </div>
</template>
