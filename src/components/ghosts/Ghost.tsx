"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { PointLight } from "three";

export function Ghost({
  color,
  speed,
  radius,
  height,
}: {
  color: string;
  speed: number;
  radius: number;
  height: number;
}) {
  const lightRef = useRef<PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime * speed;
      lightRef.current.position.x = Math.sin(t) * radius;
      lightRef.current.position.z = Math.cos(t) * radius;
      lightRef.current.position.y = height + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color={color}
      intensity={4}
      distance={7}
      decay={1.5}
    />
  );
}
