import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { StarField } from './StarField'
import type { ThreeConfig } from '@/shared/types/portfolio'

/** Loaded only on the client via lazy() from ThreeBackground. */
export function ThreeScene({ config }: { config: ThreeConfig }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{
        position: config.camera.position,
        fov: config.camera.fov,
      }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%' }}
    >
      <StarField
        pointCount={config.pointCount}
        radius={config.radius}
        pointSize={config.pointSize}
      />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
