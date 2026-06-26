<!--
  HydrationReadout.vue — the live instrumentation panel sitting above each
  column on /compare. Reads the shared probe registry and renders a tiny truth
  table: was component JS shipped? did it hydrate (onMounted fire)?

  Presentational only; the actual measurement happens in useHydrationProbe.ts.
-->
<script setup lang="ts">
interface Props {
  /** Which probe row to display (e.g. 'client' or 'island'). */
  probeKey: string
}
const props = defineProps<Props>()

const registry = useHydrationRegistry()
const record = computed(() => registry.value[props.probeKey])
</script>

<template>
  <div
    class="rounded-lg border border-(--ui-border) bg-(--ui-bg-elevated)/50 p-3 text-sm"
  >
    <template v-if="record">
      <p class="mb-2 font-medium">{{ record.label }}</p>
      <dl class="space-y-1.5">
        <!-- Annotated: do we ship this component's JS to the browser? -->
        <div class="flex items-center justify-between gap-2">
          <dt class="text-(--ui-text-muted)">Component JS shipped?</dt>
          <dd>
            <UBadge
              :color="record.shipsClientJs ? 'warning' : 'success'"
              variant="subtle"
              size="sm"
            >
              <UIcon
                :name="record.shipsClientJs ? 'i-lucide-package' : 'i-lucide-package-x'"
                class="size-3.5"
              />
              {{ record.shipsClientJs ? 'Yes — in client bundle' : 'No — zero bytes' }}
            </UBadge>
          </dd>
        </div>

        <!-- Measured live: did onMounted fire in the browser? -->
        <div class="flex items-center justify-between gap-2">
          <dt class="text-(--ui-text-muted)">Hydrated (onMounted fired)?</dt>
          <dd>
            <UBadge
              :color="record.hydrated ? 'warning' : 'success'"
              variant="subtle"
              size="sm"
            >
              <UIcon
                :name="record.hydrated ? 'i-lucide-zap' : 'i-lucide-zap-off'"
                class="size-3.5"
              />
              {{ record.hydrated ? 'Yes' : 'No' }}
            </UBadge>
          </dd>
        </div>

        <!-- When hydration was observed, if at all. -->
        <div class="flex items-center justify-between gap-2">
          <dt class="text-(--ui-text-muted)">Hydration cost</dt>
          <dd class="font-mono text-xs">
            {{ record.hydrated ? 'paid (JS parsed + mounted)' : 'none' }}
          </dd>
        </div>
      </dl>
    </template>
    <p v-else class="text-(--ui-text-muted)">No probe registered.</p>
  </div>
</template>
