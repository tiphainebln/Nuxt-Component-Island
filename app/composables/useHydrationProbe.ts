// =============================================================================
// app/composables/useHydrationProbe.ts
// -----------------------------------------------------------------------------
// In-app instrumentation for the /compare page. It answers, live and visibly:
// "did this thing hydrate in the browser?"
//
// THE TRICK: `onMounted` runs ONLY in the browser, and ONLY for components that
// actually have a client-side instance. A server island has no client instance
// at all, so its `onMounted` never registers and its probe stays `hydrated:false`
// forever. That absence — shown next to a client component whose probe flips to
// `true` — is the proof the audience can see without opening dev tools.
//
// State lives in `useState` so it is created during SSR and survives hydration
// (no flash, no mismatch). All types are explicit; no `any`.
// =============================================================================

export interface ProbeRecord {
  /** Human-readable label shown in the readout. */
  label: string
  /** Did this component's client `onMounted` fire? true === it hydrated. */
  hydrated: boolean
  /** We KNOW, by construction, whether each strategy ships component JS. This is
   *  an annotation (not measured) used to explain the network tab. */
  shipsClientJs: boolean
  /** Browser-clock ms when hydration was observed (null until/unless it fires). */
  hydratedAt: number | null
}

export type ProbeKey = string

const STATE_KEY = 'island-demo:hydration-probes'

/** Shared, SSR-safe registry of all probes on the current page. */
export function useHydrationRegistry() {
  return useState<Record<ProbeKey, ProbeRecord>>(STATE_KEY, () => ({}))
}

/**
 * Seed a probe row so the readout can display it during SSR (before any
 * hydration happens). Call this from the page for rows that have no client
 * component to seed themselves — most importantly the ISLAND row, because an
 * island runs in an isolated Vue app and cannot write to this page's state.
 */
export function seedProbe(
  key: ProbeKey,
  init: Pick<ProbeRecord, 'label' | 'shipsClientJs'>,
): void {
  const registry = useHydrationRegistry()
  if (!registry.value[key]) {
    registry.value[key] = {
      label: init.label,
      shipsClientJs: init.shipsClientJs,
      hydrated: false,
      hydratedAt: null,
    }
  }
}

/**
 * Register a probe AND flip it to hydrated when this component mounts in the
 * browser. Call from a component that genuinely hydrates (the client column).
 * Returns a readonly computed of the live record for convenience.
 */
export function useHydrationProbe(
  key: ProbeKey,
  init: Pick<ProbeRecord, 'label' | 'shipsClientJs'>,
) {
  seedProbe(key, init)
  const registry = useHydrationRegistry()

  // Runs in the browser only. For an island this code path is never shipped,
  // so it can never run — which is the whole point.
  onMounted(() => {
    const current = registry.value[key]
    if (current) {
      current.hydrated = true
      current.hydratedAt = Date.now()
    }
  })

  return computed<ProbeRecord | undefined>(() => registry.value[key])
}
