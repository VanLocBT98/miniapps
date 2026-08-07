import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import type { Points as ThreePoints } from 'three'

/** Deterministic [0,1) — keeps render pure (no Math.random). */
function unit(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function inSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    let x = 0
    let y = 0
    let z = 0
    let d = 0
    let attempt = 0
    do {
      const base = i * 17 + attempt * 3
      x = unit(base) * 2 - 1
      y = unit(base + 1) * 2 - 1
      z = unit(base + 2) * 2 - 1
      d = x * x + y * y + z * z
      attempt += 1
    } while ((d > 1 || d === 0) && attempt < 32)
    const scale = (radius * Math.cbrt(unit(i * 31 + 7))) / Math.sqrt(Math.max(d, 1e-6))
    const offset = i * 3
    positions[offset] = x * scale
    positions[offset + 1] = y * scale
    positions[offset + 2] = z * scale
  }
  return positions
}

export type StarFieldProps = {
  pointCount?: number
  radius?: number
  pointSize?: number
}

export function StarField({
  pointCount = 2500,
  radius = 1.5,
  pointSize = 0.012,
}: StarFieldProps) {
  const ref = useRef<ThreePoints | null>(null)

  const { positions, colors } = useMemo(() => {
    const positions = inSphere(pointCount, radius)
    const colors = new Float32Array(pointCount * 3)
    for (let i = 0; i < pointCount; i += 1) {
      const offset = i * 3
      // Bias toward indigo/pink palette matching original gradient
      colors[offset] = 0.55 + unit(i * 3) * 0.45
      colors[offset + 1] = 0.35 + unit(i * 3 + 1) * 0.45
      colors[offset + 2] = 0.75 + unit(i * 3 + 2) * 0.25
    }
    return { positions, colors }
  }, [pointCount, radius])

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
  })

  return (
    <Suspense fallback={null}>
      <group rotation={[0, 0, Math.PI / 4]}>
        <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled>
          <PointMaterial
            transparent
            vertexColors
            size={pointSize}
            sizeAttenuation
            depthWrite={false}
          />
        </Points>
      </group>
    </Suspense>
  )
}
