"use client";

import { useFrame } from "@react-three/fiber";
import { SphereGeometry, MeshStandardMaterial, Color, DoubleSide } from "three";
import { useRef, useMemo, useEffect } from "react";
import type { PointLight, Group, Mesh } from "three";
import { isMobile } from "@/lib/device";
import type { useFabricGhostDebug } from "./useGhostDebug";

const GHOST_RADIUS = 0.3;

export function FabricGhost({
  radius,
  speed,
  height,
  orbitOffset,
  glowColor,
  debug,
}: {
  radius: number;
  speed: number;
  height: number;
  orbitOffset: number;
  glowColor: string;
  debug?: ReturnType<typeof useFabricGhostDebug>;
}) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);

  const geometry = useMemo(() => {
    const segments = isMobile ? 12 : 24;
    return new SphereGeometry(GHOST_RADIUS, segments, segments);
  }, []);

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

        float stretch = wave * wave * 0.25;
        float ripple = wave * 0.06 * (
          sin(uTime * 3.0 + position.x * 8.0 + position.z * 8.0) +
          sin(uTime * 2.3 + position.x * 5.0 - position.z * 6.0) * 0.7 +
          sin(uTime * 4.1 + position.z * 10.0) * 0.4
        );

        float flare = wave * wave * 0.08;
        float dist = max(length(position.xz), 0.001);
        vec2 dir = position.xz / dist;

        transformed.x += dir.x * flare + ripple;
        transformed.y -= stretch;
        transformed.z += dir.y * flare + ripple * 0.8;
        `
      );

      mat.userData.shader = shader;
    };

    return mat;
  }, [glowColor]);

  // Apply debug overrides to material
  useEffect(() => {
    if (debug) {
      material.opacity = debug.opacity;
      material.emissiveIntensity = debug.emissiveIntensity;
    }
  }, [debug?.opacity, debug?.emissiveIntensity, material]);

  useFrame((state) => {
    const s = speed * (debug?.speed ?? 1);
    const r = radius * (debug?.radius ?? 1);
    const h = height * (debug?.height ?? 1);
    const wobX = debug?.wobbleX ?? 0.8;
    const wobZ = debug?.wobbleZ ?? 0.8;
    const bob = debug?.bobAmount ?? 0.2;
    const swayAmount = debug?.sway ?? 0.12;

    const t = state.clock.elapsedTime * s + orbitOffset;

    if (groupRef.current) {
      groupRef.current.position.x =
        Math.sin(t) * r +
        Math.cos(t * 2.3) * wobX +
        Math.sin(t * 0.7) * 0.5;
      groupRef.current.position.z =
        Math.cos(t) * r +
        Math.sin(t * 1.7) * wobZ +
        Math.cos(t * 0.5) * 0.5;
      groupRef.current.position.y =
        h +
        Math.sin(t * 2) * bob +
        Math.cos(t * 3.3) * 0.1 +
        Math.sin(t * 5.1) * 0.05;

      const nextX =
        Math.sin(t + 0.01) * r + Math.cos((t + 0.01) * 2.3) * wobX;
      const nextZ =
        Math.cos(t + 0.01) * r + Math.sin((t + 0.01) * 1.7) * wobZ;
      groupRef.current.rotation.y = Math.atan2(
        nextX - groupRef.current.position.x,
        nextZ - groupRef.current.position.z,
      );
      groupRef.current.rotation.z = Math.sin(t * 1.5) * swayAmount;
      groupRef.current.rotation.x = Math.cos(t * 1.8) * (swayAmount * 0.5);
    }

    if (material.userData.shader) {
      material.userData.shader.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (lightRef.current) {
      const flicker =
        Math.sin(state.clock.elapsedTime * 6) * 0.3 +
        Math.sin(state.clock.elapsedTime * 9.3) * 0.2;
      lightRef.current.intensity = (debug?.lightIntensity ?? 6) * 0.33 + flicker;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} castShadow geometry={geometry} material={material} />
      <pointLight
        ref={lightRef}
        position={[0, 0.05, 0]}
        color={glowColor}
        intensity={debug?.lightIntensity ?? 6}
        distance={debug?.lightDistance ?? 7}
        decay={1.5}
      />
    </group>
  );
}
