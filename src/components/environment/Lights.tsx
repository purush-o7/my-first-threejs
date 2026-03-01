"use client";

import { useControls } from "leva";
import { useThree, useFrame } from "@react-three/fiber";
import { Color } from "three";
import { useRef } from "react";

// Time presets: midnight (0) -> dawn (0.5) -> sunrise (1)
// Midnight: dark blue, low intensity
// Dawn: warm purple-orange, medium intensity
// Sunrise: bright orange-yellow, high intensity

function lerpColor(a: string, b: string, t: number): string {
  const ca = new Color(a);
  const cb = new Color(b);
  ca.lerp(cb, t);
  return "#" + ca.getHexString();
}

export function Lights() {
  const { timeOfDay } = useControls(
    "Time of Day",
    {
      timeOfDay: { value: 0, min: 0, max: 1, step: 0.01, label: "midnight → dawn" },
    },
    { collapsed: true },
  );

  const { moonPosition } = useControls(
    "Lighting",
    {
      moonPosition: { value: [0, 8, 10], step: 0.5 },
    },
    { collapsed: true },
  );

  // Interpolate everything based on time
  const ambientIntensity = 0.08 + timeOfDay * 0.4;
  const moonIntensity = 0.3 + timeOfDay * 1.2;

  // Color shifts: midnight blue -> dawn purple -> sunrise orange
  const ambientColor = timeOfDay < 0.5
    ? lerpColor("#4466aa", "#8855aa", timeOfDay * 2)
    : lerpColor("#8855aa", "#ffaa44", (timeOfDay - 0.5) * 2);

  const moonColor = timeOfDay < 0.5
    ? lerpColor("#b9d5ff", "#cc99ff", timeOfDay * 2)
    : lerpColor("#cc99ff", "#ffe0b2", (timeOfDay - 0.5) * 2);

  // Update scene background color based on time
  const { scene } = useThree();
  const bgRef = useRef(new Color());

  useFrame(() => {
    if (timeOfDay < 0.5) {
      bgRef.current.set("#0a0a1a").lerp(new Color("#1a0a2a"), timeOfDay * 2);
    } else {
      bgRef.current.set("#1a0a2a").lerp(new Color("#2a1510"), (timeOfDay - 0.5) * 2);
    }
    scene.background = bgRef.current;
  });

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={ambientColor} />
      <directionalLight
        position={moonPosition as unknown as [number, number, number]}
        target-position={[0, 1, 1.5]}
        intensity={moonIntensity}
        color={moonColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
    </>
  );
}
