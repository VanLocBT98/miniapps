import { Suspense, lazy, useSyncExternalStore, type ComponentType } from 'react'
import type { ThreeConfig } from '@/shared/types/portfolio'

type SceneProps = {
  config: ThreeConfig
}

const ThreeScene = lazy(() =>
  import('./ThreeScene').then((mod) => ({ default: mod.ThreeScene })),
)

function useIsClient() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  )
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      media.addEventListener('change', onStoreChange)
      return () => media.removeEventListener('change', onStoreChange)
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
}

/**
 * Client-only Three.js background with a readability veil
 * so bright gradient does not wash out typography.
 */
export function ThreeBackground({ config }: { config: ThreeConfig }) {
  const ready = useIsClient()
  const reducedMotion = usePrefersReducedMotion()

  if (!config.enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 h-dvh w-full" aria-hidden>
      <div className="absolute inset-0" style={{ backgroundImage: config.gradient }} />
      {ready && !reducedMotion ? (
        <Suspense fallback={null}>
          <div className="absolute inset-0 opacity-90">
            <LazyScene config={config} />
          </div>
        </Suspense>
      ) : null}
      {/* Soft dark veil keeps text readable over pink/blue gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,28,0.55)_0%,rgba(8,12,28,0.42)_45%,rgba(8,12,28,0.72)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
    </div>
  )
}

function LazyScene({ config }: SceneProps) {
  const Scene = ThreeScene as ComponentType<SceneProps>
  return <Scene config={config} />
}
