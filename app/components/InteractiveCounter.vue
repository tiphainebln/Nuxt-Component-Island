<!--
  InteractiveCounter.vue — a small, genuinely interactive client component.

  WHAT IT DEMONSTRATES
  This is an ordinary Vue component with reactive state and event handlers. It is
  the "pocket of interactivity" used two ways on /interactivity:
    1. INSIDE an island via the `nuxt-client` attribute (selective hydration).
    2. THROUGH an island's slot (slot content is owned by the parent app, so it
       is interactive without any special attribute).
  Its `onMounted` log lets you confirm in the console exactly when/whether it
  hydrates in each scenario.
-->
<script setup lang="ts">
interface Props {
  /** Starting value for the counter. */
  start?: number
  /** Label shown next to the controls. */
  label?: string
}
const props = withDefaults(defineProps<Props>(), {
  start: 0,
  label: 'Counter',
})

const count = ref(props.start)

onMounted(() => {
  // If you see this in the console, THIS component hydrated on the client.
  // eslint-disable-next-line no-console
  console.info(`[InteractiveCounter "${props.label}"] hydrated on the client`)
})
</script>

<template>
  <div class="flex items-center gap-3 rounded-lg border border-(--ui-border) p-3">
    <UIcon name="i-lucide-mouse-pointer-click" class="size-4 text-(--ui-primary)" />
    <span class="text-sm font-medium">{{ label }}:</span>
    <UButton
      icon="i-lucide-minus"
      size="xs"
      color="neutral"
      variant="soft"
      :aria-label="`decrement ${label}`"
      @click="count--"
    />
    <span class="w-8 text-center font-mono tabular-nums">{{ count }}</span>
    <UButton
      icon="i-lucide-plus"
      size="xs"
      color="primary"
      variant="soft"
      :aria-label="`increment ${label}`"
      @click="count++"
    />
  </div>
</template>
