"use client";

import { useControls } from "leva";

const LIGHT_COLOR = "#b9d5ff";

export function Lights() {
  const { ambientIntensity, moonIntensity, moonPosition } = useControls(
    "Lighting",
    {
      ambientIntensity: { value: 0.12, min: 0, max: 1, step: 0.01 },
      moonIntensity: { value: 0.5, min: 0, max: 2, step: 0.05 },
      moonPosition: { value: [0, 8, 10], step: 0.5 },
    },
    { collapsed: true },
  );

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={LIGHT_COLOR} />
      <directionalLight
        position={moonPosition as unknown as [number, number, number]}
        target-position={[0, 1, 1.5]}
        intensity={moonIntensity}
        color={LIGHT_COLOR}
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
