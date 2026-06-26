<!--
  ExplainerPanel.vue — the small "what am I looking at" panel shown on every
  page. Purely presentational. Strongly typed props, default slot for the body.
-->
<script setup lang="ts">
interface Props {
  /** Short panel heading. */
  title: string
  /** Optional Lucide icon name, e.g. "i-lucide-info". */
  icon?: string
  /** Visual tone — maps to a Nuxt UI color. */
  tone?: 'primary' | 'info' | 'warning' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-info',
  tone: 'info',
})

// Map tone to a FULL, static class string. Tailwind's scanner only sees literal
// class names, so we must not build them dynamically (e.g. `text-(--ui-${x})`).
const TONE_ICON_CLASS: Record<NonNullable<Props['tone']>, string> = {
  primary: 'text-(--ui-primary)',
  info: 'text-(--ui-info)',
  warning: 'text-(--ui-warning)',
  neutral: 'text-(--ui-text-muted)',
}
const iconColorClass = computed(() => TONE_ICON_CLASS[props.tone])
</script>

<template>
  <UCard
    variant="subtle"
    :ui="{ root: 'ring-(--ui-border)' }"
    class="mb-8"
  >
    <div class="flex items-start gap-3">
      <UIcon :name="icon" class="size-5 shrink-0 mt-0.5" :class="iconColorClass" />
      <div class="space-y-1">
        <h2 class="font-semibold leading-tight">{{ title }}</h2>
        <div class="text-sm text-(--ui-text-muted) leading-relaxed">
          <slot />
        </div>
      </div>
    </div>
  </UCard>
</template>
