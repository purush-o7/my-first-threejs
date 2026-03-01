"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";
import type { useGhostLightDebug } from "./useGhostDebug";

export function Ghost({
  color,
  speed,
  radius,
  height,
  debug,
}: {
  color: string;
  speed: number;
  radius: number;
  height: number;
  debug?: ReturnType<typeof useGhostLightDebug>;
}) {
  const lightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const s = speed * (debug?.speed ?? 1);
      const r = radius * (debug?.radius ?? 1);
      const h = height * (debug?.height ?? 1);
      const bob = debug?.bobAmount ?? 0.5;

      const t = state.clock.elapsedTime * s;
      lightRef.current.position.x = Math.sin(t) * r;
      lightRef.current.position.z = Math.cos(t) * r;
      lightRef.current.position.y = h + Math.sin(t * 2) * bob;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color={color}
      intensity={debug?.intensity ?? 4}
      distance={debug?.distance ?? 7}
      decay={1.5}
    />
  );
}
