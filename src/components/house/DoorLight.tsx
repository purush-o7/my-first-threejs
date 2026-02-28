"use client";

import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import type { PointLight } from "three";

const DOOR_LIGHT_POSITION: [number, number, number] = [0, 1.85, 1.6];

export function DoorLight() {
  const lightRef = useRef<PointLight>(null);
  const { color, intensity, distance } = useControls(
    "Door Light",
    {
      color: "#ff7b00",
      intensity: { value: 3, min: 0, max: 10, step: 0.1 },
      distance: { value: 5, min: 1, max: 15, step: 0.5 },
    },
    { collapsed: true },
  );

  useFrame((state) => {
    if (lightRef.current) {
      const t = state.clock.elapsedTime;
      const flicker =
        Math.sin(t * 8) * 0.5 +
        Math.sin(t * 3.7) * 0.3 +
        Math.sin(t * 12.1) * 0.2;
      lightRef.current.intensity = intensity + flicker;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={DOOR_LIGHT_POSITION}
      color={color}
      intensity={intensity}
      distance={distance}
      decay={2}
    />
  );
}
