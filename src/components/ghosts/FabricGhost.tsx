"use client";

import { useFrame } from "@react-three/fiber";
import { SphereGeometry, MeshStandardMaterial, Color, DoubleSide } from "three";
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

  const geometry = useMemo(() => {
    const segments = isMobile ? 12 : 24;
    return new SphereGeometry(GHOST_RADIUS, segments, segments);
  }, []);

  // Create material with custom vertex shader for cloth deformation
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      transparent: true,
      opacity: 0.35,
      side: DoubleSide,
      emissive: new Color(glowColor),
      emissiveIntensity: 1.5,
      color: new Color("#000000"),
      depthWrite: false,
      roughness: 1,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uRadius = { value: GHOST_RADIUS };

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
        #include <common>
        uniform float uTime;
        uniform float uRadius;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>

        float diameter = uRadius * 2.0;
        float normalizedY = (uRadius - position.y) / diameter;
        float wave = max(0.0, normalizedY);

        // Stretch downward
        float stretch = wave * wave * 0.25;

        // Ripple effect
        float ripple = wave * 0.06 * (
          sin(uTime * 3.0 + position.x * 8.0 + position.z * 8.0) +
          sin(uTime * 2.3 + position.x * 5.0 - position.z * 6.0) * 0.7 +
          sin(uTime * 4.1 + position.z * 10.0) * 0.4
        );

        // Flare outward at bottom
        float flare = wave * wave * 0.08;
        float dist = max(length(position.xz), 0.001);
        vec2 dir = position.xz / dist;

        transformed.x += dir.x * flare + ripple;
        transformed.y -= stretch;
        transformed.z += dir.y * flare + ripple * 0.8;
        `
      );

      // Store shader ref for uniform updates
      mat.userData.shader = shader;
    };

    return mat;
  }, [glowColor]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + orbitOffset;

    // Organic orbit
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

    // Update shader time uniform (GPU handles all vertex work)
    if (material.userData.shader) {
      material.userData.shader.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // Flicker light
    if (lightRef.current) {
      const flicker =
        Math.sin(state.clock.elapsedTime * 6) * 0.3 +
        Math.sin(state.clock.elapsedTime * 9.3) * 0.2;
      lightRef.current.intensity = 2 + flicker;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow geometry={geometry} material={material} />
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
