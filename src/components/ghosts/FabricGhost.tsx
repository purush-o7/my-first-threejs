"use client";

import { useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader, SphereGeometry } from "three";
import { useRef, useMemo } from "react";
import type { PointLight, Group, Mesh } from "three";
import { isMobile } from "@/lib/device";

const GHOST_RADIUS = 0.3;

export function FabricGhost({
  radius,
  speed,
  height,
  orbitOffset,
  glowColor,
}: {
  radius: number;
  speed: number;
  height: number;
  orbitOffset: number;
  glowColor: string;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  const [diffMap, norMap, armMap] = useLoader(TextureLoader, [
    "/textures/ghost/diff.jpg",
    "/textures/ghost/nor.jpg",
    "/textures/ghost/arm.jpg",
  ]);

  const { geometry, originalPositions } = useMemo(() => {
    const segments = isMobile ? 12 : 24;
    const geo = new SphereGeometry(GHOST_RADIUS, segments, segments);
    const positions = geo.attributes.position.array as Float32Array;
    const original = new Float32Array(positions.length);
    original.set(positions);
    return { geometry: geo, originalPositions: original };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + orbitOffset;

    // Organic orbit using layered sin/cos at different frequencies
    if (groupRef.current) {
      groupRef.current.position.x =
        Math.sin(t) * radius +
        Math.cos(t * 2.3) * 0.8 +
        Math.sin(t * 0.7) * 0.5;
      groupRef.current.position.z =
        Math.cos(t) * radius +
        Math.sin(t * 1.7) * 0.8 +
        Math.cos(t * 0.5) * 0.5;
      groupRef.current.position.y =
        height +
        Math.sin(t * 2) * 0.2 +
        Math.cos(t * 3.3) * 0.1 +
        Math.sin(t * 5.1) * 0.05;

      // Face movement direction
      const nextX =
        Math.sin(t + 0.01) * radius + Math.cos((t + 0.01) * 2.3) * 0.8;
      const nextZ =
        Math.cos(t + 0.01) * radius + Math.sin((t + 0.01) * 1.7) * 0.8;
      groupRef.current.rotation.y = Math.atan2(
        nextX - groupRef.current.position.x,
        nextZ - groupRef.current.position.z,
      );
      groupRef.current.rotation.z = Math.sin(t * 1.5) * 0.12;
      groupRef.current.rotation.x = Math.cos(t * 1.8) * 0.06;
    }

    // Animate vertices for cloth-like deformation
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position;
      const arr = positions.array as Float32Array;
      const time = state.clock.elapsedTime;
      const diameter = GHOST_RADIUS * 2;

      for (let i = 0; i < arr.length; i += 3) {
        const ox = originalPositions[i];
        const oy = originalPositions[i + 1];
        const oz = originalPositions[i + 2];

        // How far down from the top (0 at top, 1 at bottom)
        const normalizedY = (GHOST_RADIUS - oy) / diameter;
        const wave = Math.max(0, normalizedY);

        const stretch = wave * wave * 0.25;
        const ripple =
          wave *
          0.06 *
          (Math.sin(time * 3 + ox * 8 + oz * 8) +
            Math.sin(time * 2.3 + ox * 5 - oz * 6) * 0.7 +
            Math.sin(time * 4.1 + oz * 10) * 0.4);

        const flare = wave * wave * 0.08;
        const dist = Math.sqrt(ox * ox + oz * oz) || 0.001;
        const dirX = ox / dist;
        const dirZ = oz / dist;

        arr[i] = ox + dirX * flare + ripple;
        arr[i + 1] = oy - stretch;
        arr[i + 2] = oz + dirZ * flare + ripple * 0.8;
      }

      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }

    if (lightRef.current) {
      const flicker =
        Math.sin(state.clock.elapsedTime * 6) * 0.3 +
        Math.sin(state.clock.elapsedTime * 9.3) * 0.2;
      lightRef.current.intensity = 2 + flicker;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow geometry={geometry}>
        <meshStandardMaterial
          transparent
          opacity={0.35}
          side={2}
          emissive={glowColor}
          emissiveIntensity={1.5}
          color="#000000"
          depthWrite={false}
          roughness={1}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.05, 0]}
        color={glowColor}
        intensity={5}
        distance={5}
        decay={2}
      />
    </group>
  );
}
